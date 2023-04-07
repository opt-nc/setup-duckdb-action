const core = require('@actions/core');
const { exec } = require('child_process');
const axios = require('axios');
const github = require('@actions/github');

module.exports = async function () {
    try {
        let latestVersion;
        let selectedVersion;

        const token = core.getInput('token');

        core.debug(`🔍 looking for the latest DuckDB version.`);
        const headers = {'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'}
        const res = await axios.get('https://api.github.com/repos/duckdb/duckdb/releases/latest', {headers: headers});
        if (res.status != 200) {
            core.error(`❌ Failed to get latest DuckDB version`);
            core.setFailed(res.statusText);
        } else {
            core.debug(`✔️ Latest DuckDB version found is ${res.data.tag_name}.`);
            latestVersion = res.data.tag_name;
        }

        const response = await axios.get(`https://api.github.com/repos/opt-nc/setup-duckdb-action/actions/variables/DUCKDB_VERSION`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        const variable = response.data;
        core.info(`environnement ${variable}`);



        let inputVersion = core.getInput('version');
        let varVersion;
        const context = github.context;
        core.info(`context = ${context}`)
        if (!inputVersion){
            if(varVersion) {
                core.debug(`ℹ️ Version has been set at repository or organization level : ${varVersion}`);
                inputVersion = varVersion;
            } else {
                inputVersion = 'latest';
            }
        }
        else {
            inputVersion = core.getInput('version');
        }

        if (inputVersion === 'latest') {
            core.info(`📦 DuckDb latest version requested : ${latestVersion} will be installed.`);
            selectedVersion = latestVersion;
        }
        else {
            selectedVersion = inputVersion;
            core.info(`📦 DuckDb ${inputVersion} requested.`);
            if (inputVersion != latestVersion)
                core.warning(`🆕 DuckDb ${latestVersion} is available.`);
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
            core.info(`🚀 DuckDB ${selectedVersion} successfully installed.`);
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}