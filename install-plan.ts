export type Platform = 'linux' | 'darwin' | 'win32';

export function getInstallPlan(version: string, platform: string = process.platform, arch: string = process.arch) {
    const isV2 = /^v2\./.test(version);

    let target: string;
    if (platform === 'linux') {
        if (arch === 'x64') target = 'linux-amd64';
        else if (arch === 'arm64') target = 'linux-arm64';
        else throw new Error(`Unsupported architecture for Linux: ${arch}`);
    } else if (platform === 'darwin') {
        if (arch === 'x64') target = 'osx-amd64';
        else if (arch === 'arm64') target = 'osx-arm64';
        else throw new Error(`Unsupported architecture for macOS: ${arch}`);
    } else if (platform === 'win32') {
        if (arch === 'x64') target = 'windows-amd64';
        else if (arch === 'arm64') target = 'windows-arm64';
        else throw new Error(`Unsupported architecture for Windows: ${arch}`);
    } else {
        throw new Error(`Unsupported platform: ${platform}`);
    }

    const archive = isV2 ? `duckdb-cli-${target}.tar.gz` : `duckdb_cli-${target}.zip`;
    const useTar = isV2 || platform === 'win32';
    return {
        archive,
        binary: platform === 'win32' ? 'duckdb.exe' : 'duckdb',
        url: `https://github.com/duckdb/duckdb/releases/download/${version}/${archive}`,
        extractCommand: useTar ? 'tar' : 'unzip',
        extractArgs: isV2 ? ['-xzf', archive] : useTar ? ['-xf', archive] : [archive],
    };
}
