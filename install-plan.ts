export function getInstallPlan(version: string) {
    const isV2 = /^v2\./.test(version);
    const archive = isV2 ? 'duckdb-cli-linux-amd64.tar.gz' : 'duckdb_cli-linux-amd64.zip';
    return {
        archive,
        url: `https://github.com/duckdb/duckdb/releases/download/${version}/${archive}`,
        extractCommand: isV2 ? 'tar' : 'unzip',
        extractArgs: isV2 ? ['-xzf', archive] : [archive],
    };
}
