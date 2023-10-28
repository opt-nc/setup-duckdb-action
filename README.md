[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![🛡️ CodeQL](https://github.com/opt-nc/setup-duckdb-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/opt-nc/setup-duckdb-action/actions/workflows/codeql-analysis.yml)
[![🚀 Release](https://github.com/opt-nc/setup-duckdb-action/actions/workflows/release.yml/badge.svg)](https://github.com/opt-nc/setup-duckdb-action/actions/workflows/release.yml)


# ℹ️ Setup Duckdb Action

This action installs [`duckdb`](https://github.com/duckdb/duckdb) with the version provided in input.

## 📜 Inputs

### `version`

**Not Required** The version you want to install. If no version defined, the latest version will be installed.

## 🚀 Example usage

```yaml
uses: opt-nc/setup-duckdb-action@v1.0.0
with:
  version: v0.8.1
```

```yaml
uses: opt-nc/setup-duckdb-action@v1.0.0
```

## 📑 Related resources

- [🦆 Effortless Data Quality w/duckdb on GitHub ♾️ ](https://dev.to/optnc/effortless-data-quality-wduckdb-on-github-2mkb)
- [📖 DuckDB in Action (MEAP)](https://www.manning.com/books/duckdb-in-action) 
