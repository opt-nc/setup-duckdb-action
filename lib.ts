import * as core from '@actions/core';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chmod, copyFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getInstallPlan } from './install-plan';
import axios, { AxiosResponse } from 'axios';

const execFileAsync = promisify(execFile);

const MAX_ATTEMPTS = 3;
const WAITING_TIME_MS = 5000;
const VERSION_REGEX = '^v[0-9]*\\.[0-9]*\\.[0-9]*$';

interface GitHubRelease {
    tag_name: string;
}

async function fetchLatestVersion(token: string): Promise<string> {
    const headers: Record<string, string> = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    core.info(`🔁 Attempting to get the latest DuckDB version (max attempts: ${MAX_ATTEMPTS})`);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        core.info(`🔁 Attempt ${attempt}/${MAX_ATTEMPTS} to get the latest DuckDB version...`);
        
        try {
            core.info(`🔍 Attempting to fetch latest DuckDB version from GitHub API...`);
            const response: AxiosResponse<GitHubRelease> = await axios.get(
                'https://api.github.com/repos/duckdb/duckdb/releases/latest',
                { headers }
            );

            if (response.status === 200) {
                const version = response.data.tag_name;
                core.info(`ℹ️ Latest DuckDB version found is ${version}.`);
                return version;
            }

            if (attempt < MAX_ATTEMPTS) {
                core.warning(`⚠️ Failed to get latest DuckDB version (status ${response.status}), attempt ${attempt} of ${MAX_ATTEMPTS}`);
            } else {
                core.error(`❌ Failed to get latest DuckDB version (status ${response.status}), last attempt (${attempt})`);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            
            if (attempt < MAX_ATTEMPTS) {
                core.warning(`⚠️ Attempt ${attempt} failed: ${errorMessage}`);
            } else {
                core.error(`❌ Attempt ${attempt} failed: ${errorMessage}`);
            }
        }

        if (attempt < MAX_ATTEMPTS) {
            core.info(`🔁 Retry attempt ${attempt + 1}...`);
            await new Promise(resolve => setTimeout(resolve, WAITING_TIME_MS * attempt));
        }
    }

    throw new Error(`Failed to get latest DuckDB version after ${MAX_ATTEMPTS} attempts.`);
}

function validateVersion(version: string): void {
    const regex = new RegExp(VERSION_REGEX);
    if (!regex.test(version)) {
        throw new Error(`Version not valid: ${version}`);
    }
}

async function installDuckDB(version: string): Promise<void> {
    core.info(`📥 Installing DuckDB version: ${version}`);
    core.info(`🖥️ os : ${process.platform}, arch : ${process.arch}`);

    const { archive: zipFile, binary, url, extractCommand, extractArgs } = getInstallPlan(version);

    try {
        core.info('⬇️ Downloading DuckDB CLI...');
        await execFileAsync('curl', ['-fsSL', '-o', zipFile, url]);

        core.info('📦 Extracting DuckDB CLI...');
        await execFileAsync(extractCommand, extractArgs);

        core.info('📂 Setting up DuckDB installation...');
        if (process.platform === 'linux') {
            await execFileAsync('mkdir', ['-p', '/opt/duckdb']);
            await execFileAsync('mv', [binary, '/opt/duckdb']);
            await execFileAsync('chmod', ['+x', `/opt/duckdb/${binary}`]);
            core.info('🔗 Creating symlink...');
            await execFileAsync('sudo', ['ln', '-sf', `/opt/duckdb/${binary}`, '/usr/bin/duckdb']);
        } else {
            const installDir = join(process.env.RUNNER_TOOL_CACHE || tmpdir(), 'duckdb', version);
            await mkdir(installDir, { recursive: true });
            await copyFile(binary, join(installDir, binary));
            await rm(binary, { force: true });
            await chmod(join(installDir, binary), 0o755);
            core.addPath(installDir);
        }

        core.info('🧹 Cleaning up...');
        await rm(zipFile, { force: true });

        // Verify installation
        core.info('✅ Verifying installation...');
        const { stdout } = await execFileAsync(binary === 'duckdb.exe' ? join(process.env.RUNNER_TOOL_CACHE || tmpdir(), 'duckdb', version, binary) : 'duckdb', ['--version']);
        
        core.info(`✔️ DuckDB ${version} successfully installed.`);
        core.info(stdout.trim());
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        core.error(`❌ ${errorMessage}`);
        throw new Error(`Installation failed: ${errorMessage}`);
    }
}

export default async function (): Promise<void> {
    try {
        const inputVersion = core.getInput('version');
        core.debug(`🔍 Looking for the latest DuckDB version...`);

        const latestVersion = await fetchLatestVersion(core.getInput('github-token'));
        let selectedVersion: string;

        if (inputVersion === 'latest') {
            core.info(`ℹ️ DuckDB latest version requested: ${latestVersion} will be installed.`);
            selectedVersion = latestVersion;
        } else {
            selectedVersion = inputVersion;
            core.info(`📦 DuckDB ${inputVersion} requested.`);
            
            if (inputVersion !== latestVersion) {
                core.warning(`🆕 DuckDB ${latestVersion} is available.`);
            }
        }

        validateVersion(selectedVersion);
        await installDuckDB(selectedVersion);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        core.setFailed(errorMessage);
    }
}
