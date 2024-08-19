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
uses: opt-nc/setup-duckdb-action@v1.0.8
with:
  version: v1.0.0
```

```yaml
uses: opt-nc/setup-duckdb-action@v1.0.8
```

## 📑 Related resources

- [🦆 Effortless Data Quality w/duckdb on GitHub ♾️ ](https://dev.to/optnc/effortless-data-quality-wduckdb-on-github-2mkb)
- [📖 DuckDB in Action (MEAP)](https://www.manning.com/books/duckdb-in-action)
- [😎 Awesome DuckDB](https://github.com/davidgasquez/awesome-duckdb)
- [🛡️ Maintain version at github organization level](https://www.youtube.com/watch?v=cXzkAHPipNw)
- [🪄 DuckDB sql hack : get things SORTED w/ constraint CHECK](https://dev.to/adriens/duckdb-sql-hack-get-things-sorted-w-constraint-check-46c)

# Marche à suivre pour maintenir la repo

## Documentation - Gestion des PRs et Automatisation

`DuckDB` est rarement mis à jour, mais les mises à jour incluent généralement des fonctionnalités importantes. 
Il est crucial de maintenir `DuckDB` à jour dans ces cas-là et surveiller aussi les PR des dependabots.


### PR Dependabot

Dependabot est un outil qui aide à automatiser la mise à jour des dépendances. Voici comment gérer les PRs créées par Dependabot :

1. **Vérification de la branche cible :**
    - Assurez-vous que la PR cible la branche `develop` et non `main`.

2. **Gestion des mises à jour :**
    - Si la branche n'a pas besoin d'être mise à jour, vous pouvez procéder au merge.
    - Si une mise à jour est nécessaire pour éviter les conflits, recréez la pull request en suivant ces étapes :
        - Commentez la PR avec la commande : `@dependabot rebase`
        - Dependabot ajoutera un "thumbs up" à votre commentaire.
        - Attendez que Dependabot réponde en créant une nouvelle pull request.

3. **Problèmes avec Dependabot :**
    - Parfois, Dependabot ne répond pas après un `rebase`. Si cela se produit, cliquez sur "Create" pour forcer la création de la nouvelle PR.

### CodeQL

CodeQL est un outil de sécurité qui analyse le code pour identifier des vulnérabilités. Voici ce qu'il faut savoir :

- Si l'action GitHub associée à CodeQL passe, cela signifie que l'analyse de sécurité est validée.

### Release Process

Une fois toutes les PRs fusionnées dans `develop`, suivez ces étapes pour créer une release :

1. Créez une PR de `develop` vers `main`.
2. Poussez cette PR sans mettre à jour la branche. L'objectif est de faire un merge and commit directement.

### GitHub Actions

Lors de l'utilisation des GitHub Actions, des erreurs peuvent parfois survenir. Voici comment les gérer :

1. **Relancer les jobs en erreur :**
    - Dans la plupart des cas, relancer simplement le job suffit à résoudre le problème.

2. **Gestion des erreurs persistantes :**
    - Si l'erreur persiste, consultez le repo [`setup-duckdb-action`](https://github.com/opt-nc/setup-duckdb-action).
    - L'erreur peut être liée à la version du plugin `conventional-changelog`.
    - Demandez l'autorisation de changer de version si nécessaire.

### Repos Associés à maintenir aussi

- [`setup-duckdb-action-tester`](https://github.com/opt-nc/setup-duckdb-action-tester) Un dépôt dédié aux tests pour le setup de `duckdb`.
