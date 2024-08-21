# 🚀 Marche à suivre pour maintenir la repo

Dès que possible, lors de l'apparition des PRs de Dependabot, nous devons mettre à jour la GitHub Action des deux dépôts  
`setup-duckdb-action` et `setup-duckdb-action-tester`, en accordant une attention particulière à `setup-duckdb-action`.
Le second dépôt sert uniquement à tester le premier. La GitHub Action permet d'installer facilement une version donnée  
de DuckDB et de basculer vers une nouvelle version en toute simplicité.
DuckDB est un SGBDR rarement mis à jour, mais les mises à jour incluent généralement des fonctionnalités importantes.

## 📚 Documentation - Gestion des PRs et Automatisation

### 🔄 PR Dependabot

Dependabot est un outil qui aide à automatiser la mise à jour des dépendances. Voici comment gérer les PRs créées par Dependabot :

1. **Vérification de la branche cible :**
    - Assurez-vous que la PR cible la branche `develop` et non `main`.

2. **Gestion des mises à jour :**
    - Si la branche **n'a pas besoin d'être mise à jour**, vous pouvez procéder au merge en utilisant `rebase and merge`
    - Si la branche **requiert une mise à jour sans conflit**, suivez ces étapes : 
      - Commentez la PR avec la commande : `@dependabot rebase`
      - Dependabot ajoutera un 👍 à votre commentaire.
      - Attendez que Dependabot réponde en mettant à la jour la Pull Request, puis mergez la PR avec `rebase and merge`
    - Si **une mise à jour est nécessaire et présente des conflits**, recréez la PR en suivant ces étapes :
      - Commentez la Pull Request avec la commande `@dependabot recreate`
      - Attendez que dependabot réponde
      - Si Dependabot ne répond pas après l'appel via commentaire, commentez de nouveau avec `@dependabot recreate`
        pour forcer la création d'une nouvelle PR.
      - Une fois la PR recréée, mergez-la avec `rebase and merge`

### 🔐 CodeQL

CodeQL est un outil de sécurité qui analyse le code pour identifier des vulnérabilités. Voici ce qu'il faut savoir :

- Si l'action GitHub associée à CodeQL passe, cela signifie que l'analyse de sécurité est validée.

### 🏷️ Release Process

Une fois toutes les PRs fusionnées dans `develop`, suivez ces étapes pour créer une release :

1. Créez une PR de `develop` vers `main`.
2. Poussez cette PR sans mettre à jour la branche. L'objectif est de faire un merge and commit directement.

### ⚙️ GitHub Actions

Lors de l'utilisation des GitHub Actions, des erreurs peuvent parfois survenir. Voici comment les gérer :

1. **Relancer les jobs en erreur :**
    - Dans la plupart des cas, relancer simplement le job suffit à résoudre le problème.

2. **Gestion des erreurs persistantes :**
    - Si l'erreur persiste, consultez le repo [`setup-duckdb-action`](https://github.com/opt-nc/setup-duckdb-action).
    - L'erreur peut être liée à la version du plugin `conventional-changelog`.
    - Demandez l'autorisation de changer de version si nécessaire.

### 📂 Repos Associés à maintenir aussi

- [`setup-duckdb-action-tester`](https://github.com/opt-nc/setup-duckdb-action-tester) : Un dépôt dédié aux tests pour le setup de `duckdb`.

