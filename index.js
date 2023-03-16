const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');
const axios = require('axios');

module.exports = async function () {
    try {
        const version = core.getInput('version');
        const url = `https://github.com/duckdb/duckdb/releases/download/${version}/duckdb_cli-linux-amd64.zip`
        const wget = `wget ${url}`
        const unzip = `unzip duckdb_cli-linux-amd64.zip`
        const install = 'mkdir /opt/duckdb && mv duckdb /opt/duckdb && chmod +x /opt/duckdb/duckdb && sudo ln -s /opt/duckdb/duckdb /usr/bin/duckdb'
        const check_version = 'duckdb --version'
        const cleanup = 'rm duckdb_cli-linux-amd64.zip'

        //let version_final = version;
        const headers = {'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'}
        const res = await axios({url: 'https://api.github.com/repos/duckdb/duckdb/releases/latest', headers});
        if (res.data.status === 'failed' || res.data.status === 'cancelled') {
            core.error(`❌ Failed to get latest DuckDB version`);
            core.setFailed(res.data);
        } else if (res.data.status === 'successful') {
            core.info(res.data);
            var result = JSON.parse(res.data);
            core.info("-----------");
            core.info(result);
        }

        core.info(`📦 Install DuckDB version : ${version}`);
        exec(`${wget} && ${unzip} && ${install} && ${cleanup} && ${check_version}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                core.setFailed(error.message);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log("🚀 DuckDB successfully installed.");
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}