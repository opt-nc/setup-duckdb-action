# ❔ About

The aim of [`opt-nc/setup-duckdb-action`](https://github.com/opt-nc/setup-duckdb-action) is to be accessible to a wide audience, making it **as simple as possible to spread data quality practices**.

This short how-to provides a practical tutorial on how the action can be used.

# 📜 Recipe

We’ll use the pattern from [`opt-nc/odata-acronyms/`](https://github.com/opt-nc/odata-acronyms/), which means:

1. **Prepare a collection of clean `csv` files** inside a `data` directory located at the root of your repository.
2. **Create a `duck.sql` file at the root of the repository**, which loads the CSVs, applies integrity constraints, or executes `SELECT` statements.
3. **Add a `.github/workflows/check_data.yml` workflow** to automatically validate your data on every push and pull request.

Here’s a minimal workflow you can copy and adapt:

```yml
# This workflow checks out the code, installs DuckDB, then runs data quality tests.
# For more information see: https://dev.to/optnc/effortless-data-quality-wduckdb-on-github-2mkb
name: 🧪 Check data

on: [pull_request, push]

jobs:
  test:
    name: 🧪 Verify data
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: ⚙️ Install DuckDB
        uses: opt-nc/setup-duckdb-action@v1.1.4

      - name: 🕵️‍♂️ Check data integrity
        run: |
          duckdb < duck.sql
```
