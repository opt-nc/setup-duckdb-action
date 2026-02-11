import * as core from '@actions/core';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import axios, { AxiosResponse } from 'axios';

const execFileAsync = promisify(execFile);

const MAX_ATTEMPTS = 3;
const WAITING_TIME_MS = 5000;
const VERSION_REGEX = '^v[0-9]*\\.[0-9]*\\.[0-9]*$';

interface GitHubRelease {
    tag_name: string;
}

async function fetchLatestVersion(): Promise<string> {
    const headers = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };

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
    
    const zipFile = 'duckdb_cli-linux-amd64.zip';
    const url = `https://github.com/duckdb/duckdb/releases/download/${version}/${zipFile}`;

    try {
        // Download DuckDB CLI zip file
        core.info('⬇️ Downloading DuckDB CLI...');
        await execFileAsync('wget', [url]);
        
        // Unzip the downloaded file
        core.info('📦 Extracting DuckDB CLI...');
        await execFileAsync('unzip', [zipFile]);
        
        // Create directory and move binary
        core.info('📂 Setting up DuckDB installation...');
        await execFileAsync('mkdir', ['-p', '/opt/duckdb']);
        await execFileAsync('mv', ['duckdb', '/opt/duckdb']);
        await execFileAsync('chmod', ['+x', '/opt/duckdb/duckdb']);
        
        // Create symlink (requires sudo)
        core.info('🔗 Creating symlink...');
        await execFileAsync('sudo', ['ln', '-s', '/opt/duckdb/duckdb', '/usr/bin/duckdb']);
        
        // Clean up zip file
        core.info('🧹 Cleaning up...');
        await execFileAsync('rm', [zipFile]);
        
        // Verify installation
        core.info('✅ Verifying installation...');
        const { stdout } = await execFileAsync('duckdb', ['--version']);
        
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

        const latestVersion = await fetchLatestVersion();
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
