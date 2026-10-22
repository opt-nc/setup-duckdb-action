import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { getInstallPlan } from '../install-plan';

const BASE = 'https://github.com/duckdb/duckdb/releases/download';

test('2.x versions use the linux-amd64 tar.gz archive', () => {
    for (const v of ['v2.0.0']) {
        const plan = getInstallPlan(v);
        assert.equal(plan.url, `${BASE}/${v}/duckdb-cli-linux-amd64.tar.gz`);
        assert.equal(plan.extractCommand, 'tar');
        assert.deepEqual(plan.extractArgs, ['-xzf', 'duckdb-cli-linux-amd64.tar.gz']);
    }
});

test('non-2.x versions keep the amd64 zip archive', () => {
    for (const v of ['v1.5.6', 'v1.4.5', 'v1.3.2']) {
        const plan = getInstallPlan(v);
        assert.equal(plan.url, `${BASE}/${v}/duckdb_cli-linux-amd64.zip`);
        assert.equal(plan.extractCommand, 'unzip');
        assert.deepEqual(plan.extractArgs, ['duckdb_cli-linux-amd64.zip']);
    }
});

const execFileAsync = promisify(execFile);

for (const version of ['v2.0.0', 'v1.4.0']) {
    test(`downloads and extracts DuckDB ${version}`, { timeout: 180_000 }, async () => {
        const dir = await mkdtemp(join(tmpdir(), 'duckdb-test-'));
        try {
            const plan = getInstallPlan(version);
            await execFileAsync('wget', ['-q', plan.url], { cwd: dir });
            await execFileAsync(plan.extractCommand, plan.extractArgs, { cwd: dir });

            const info = await stat(join(dir, 'duckdb'));
            assert.ok(info.isFile());
            assert.ok(info.size > 1_000_000);

            const { stdout } = await execFileAsync(join(dir, 'duckdb'), ['--version']);
            assert.ok(stdout.includes(version), `unexpected output: ${stdout}`);
        } finally {
            await rm(dir, { recursive: true, force: true });
        }
    });
}
