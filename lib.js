const core = require('@actions/core');
const { exec } = require('child_process');
const axios = require('axios');

const maxAttempts = 3; // Maximum number of attempts for retries
const waitingTime = 1000; // Initial waiting time in milliseconds


module.exports = async function () {
    try {
        const inputVersion = core.getInput('version');
        let latestVersion;
        let selectedVersion;

        core.debug(`🔍 Looking for the latest DuckDB version...`);
        const headers = {'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'}
        // Retry logic for axios.get (up to 3 attempts)
        let res;
        let attempt = 1;
        let success = false;
        core.info(`🔁 Attempting to get the latest DuckDB version (max attempts: ${maxAttempts})`);
        while (attempt < maxAttempts && !success) {
            core.info(`🔁 Attempt ${attempt}/${maxAttempts} to get the latest DuckDB version...`);
            try {
                core.info(`🔍 Attempting to fetch latest DuckDB version from GitHub API...`);
                res = await axios.get('https://api.github.com/repos/duckdb/duckdb/releases/latest', {headers: headers});
                if (res.status === 200) {
                    success = true;
                    core.info(`ℹ️ Latest DuckDB version found is ${res.data.tag_name}.`);
                    latestVersion = res.data.tag_name;
                } else {
                    if (attempt < maxAttempts) {
                        core.warning(`⚠️ Failed to get latest DuckDB version (status ${res.status}), attempt ${attempt} of ${maxAttempts}`);
                    } else {
                        core.error(`❌ Failed to get latest DuckDB version (status ${res.status}), last attempt (${attempt})`);
                    }
                    attempt++;
                    if (attempt < maxAttempts) {
                        core.info(`🔁 Retry attempt ${attempt}...`);
                        await new Promise(r => setTimeout(r, waitingTime * attempt));
                    }
                }
            } catch (err) {
                if (attempt < maxAttempts) {
                    core.warning(`⚠️ Attempt ${attempt} failed: ${err.message}`);
                } else {
                    core.error(`❌ Attempt ${attempt} failed: ${err.message}`);
                }
                attempt++;
                if (attempt < maxAttempts) {
                    core.info(`🔁 Retry attempt ${attempt}...`);
                    await new Promise(r => setTimeout(r, waitingTime * attempt));
                }
            }
        }
        if (!success) {
            core.setFailed(`❌ Failed to get latest DuckDB version after ${maxAttempts} attempts.`);
            return;
        }

        if (inputVersion === 'latest') {
            core.info(`ℹ️ DuckDb latest version requested : ${latestVersion} will be installed.`);
            selectedVersion = latestVersion;
        }
        else {
            selectedVersion = inputVersion;
            core.info(`📦 DuckDb ${inputVersion} requested.`);
            if (inputVersion != latestVersion)
                core.warning(`🆕 DuckDb ${latestVersion} is available.`);
        }

        const regex = '^v[0-9]*.[0-9]*.[0-9]*$';
        if(!selectedVersion.match(regex)) {
            core.error("Version not valid.");
            throw "Version not valid.";
        }

        core.info(`📥 Installing DuckDB version : ${selectedVersion}`);
        const url = `https://github.com/duckdb/duckdb/releases/download/${selectedVersion}/duckdb_cli-linux-amd64.zip`
        const wgetCmd = `wget ${url}`
        const unzipCmd = `unzip duckdb_cli-linux-amd64.zip`
        const installCmd = 'mkdir /opt/duckdb && mv duckdb /opt/duckdb && chmod +x /opt/duckdb/duckdb && sudo ln -s /opt/duckdb/duckdb /usr/bin/duckdb'
        const checkVersionCmd = 'duckdb --version'
        const cleanupCmd = 'rm duckdb_cli-linux-amd64.zip'

        exec(`${wgetCmd} && ${unzipCmd} && ${installCmd} && ${cleanupCmd} && ${checkVersionCmd}`, (error, stdout, stderr) => {
            if (error) {
                core.error(`❌ ${error.message}`);
                core.setFailed(error.message);
                return;
            }
            if (stderr) {
                core.debug(stderr);
            }
            core.info(`✔️ DuckDB ${selectedVersion} successfully installed.`);
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}