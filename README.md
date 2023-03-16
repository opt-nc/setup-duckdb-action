# Setup Duckdb Action


This action installs DuckDB with the version provided in input.

## Inputs

### `version`

**Not Required** The version you want to install. If no version defined, the latest version will be installed.

## Example usage

```yaml
uses: opt-nc/setup-duckdb-action@v1.0.0
with:
  version: v0.7.1
```

```yaml
uses: opt-nc/setup-duckdb-action@v1.0.0
```