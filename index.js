const core = require('@actions/core');
const github = require('@actions/github');
const { spawn } = require('node:child_process')


try {
    const version = core.getInput('version');
    const url = `https://github.com/duckdb/duckdb/releases/download/${version}/duckdb_cli-linux-amd64.zip`
    const wget = `wget ${url}`
    const unzip = `unzip duckdb_cli-linux-amd64.zip`
    const install = 'mkdir /opt/duckdb && mv duckdb /opt/duckdb && chmod +x /opt/duckdb/duckdb && ln -s /opt/duckdb/duckdb /usr/bin/duckdb'
    const check_version = 'duckdb --version'
    const cleanup = 'rm duckdb_cli-linux-amd64.zip'

    console.log(`📦 Install DuckDB version : ${version}` );
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