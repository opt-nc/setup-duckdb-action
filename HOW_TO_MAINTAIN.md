# 🚀 Marche à suivre pour maintenir la repo

Dès que possible, lors de l'apparition des PRs de Dependabot, nous devons mettre à jour la GitHub Action des deux dépôts  
`setup-duckdb-action` et `setup-duckdb-action-tester`, en accordant une attention particulière à `setup-duckdb-action`.
Le second dépôt sert uniquement à tester le premier. La GitHub Action permet d'installer facilement une version donnée  
de DuckDB et de basculer vers une nouvelle version en toute simplicité.
DuckDB est un SGBDR rarement mis à jour, mais les mises à jour incluent généralement des fonctionnalités importantes.

## 📚 Gestion des PRs et vérification

### 🔄 PR Dependabot

Dependabot est un outil qui aide à automatiser la mise à jour des dépendances. la documentation suivante nous explique comment gérer les PRs créées par Dependabot. Dans le 3/4 des cas, les PR sont créées d'une branche features pour être mergée dans develop.
Celles créées d'une branche features vers main sont plus compliquées à gérer, nous préconisons d'importer la branche en local dans son IDE, puis d'appliquer les changements proposés par Dependanbot et faire un commit vers develop.

1. **Vérification de la branche cible :** 
    - Assurez-vous que la PR cible la branche `develop` et non `main`.  

2. **Gestion des mises à jour (Branche features vers develop):** 
    - Si la branche **n'a pas besoin d'être mise à jour**, vous pouvez procéder au merge en utilisant `rebase and merge`
    - Si la branche **requiert une mise à jour sans conflit**, suivez ces étapes : 
      - Commentez la PR avec la commande : `@dependabot rebase`.
      - Dependabot ajoutera un 👍 à votre commentaire.
      - Attendez que Dependabot réponde en mettant à la jour la Pull Request, puis mergez la avec `rebase and merge`
    - Si **une mise à jour est nécessaire et présente des conflits**, recréez la PR en suivant ces étapes :
      - Commentez la Pull Request avec la commande `@dependabot recreate`.
      - Attendez que dependabot réponde.
      - Si Dependabot ne répond pas après l'appel via commentaire, commentez de nouveau avec `@dependabot recreate`
        pour forcer la création d'une nouvelle PR.
      - Une fois la PR recréée, mergez-la avec `rebase and merge`.
    - Si **Dependabot remarque qu'une dépendance a été upgradée par un mainteneur**, il refuse la montée de version et clôture la PR :
      - Si, en discutant avec un membre de l'équipe (Michele Barre ou Adrien Sales), la version ne doit pas être montée, ne rien faire.
      - Sinon, relancez la PR avec un `@Dependabot recreate` et mergez la en respectant les consignes vues précédemment.  

:warning: Il se peut que deux PR de Dependabot coexistent pour monter de version la même dépendance : 
- Ocuppez-vous de la PR avec la proposition de version la plus récente
- Commentez la PR non voulue avec `@dependabot recreate` pour que le bot la clôture de lui même.

3. **Gestion des mises à jour (Branche features vers main):**  

:memo: A REDIGER

### 🔐 CodeQL

CodeQL est un outil de sécurité qui analyse le code pour identifier des vulnérabilités. Voici ce qu'il faut savoir :

- Si l'action GitHub associée à CodeQL passe, cela signifie que l'analyse de sécurité est validée.

### 🏷️ Release Process

Une fois toutes les PRs fusionnées dans `develop`, merger `develop` dans `main`.  
Le process de création de release se lance automatiquement. Il est possible de le suivre en allant dans l'onglet Action et  
cliquer sur le run en cours. Si le run se termine en erreur, vérifier les logs. En fonction, une simple relance peut rêgler le souci.

### ⚙️ GitHub Actions

Lors de l'utilisation des GitHub Actions, des erreurs peuvent parfois survenir. Voici comment les gérer :

1. **Relancer les jobs en erreur :**
    - Dans la plupart des cas, relancer simplement le job suffit à résoudre le problème.

2. **Gestion des erreurs persistantes :**
    - Une erreur peu fréquente peut être liée à la version du plugin `conventional-changelog` dans ce cas, demandez l'autorisation de changer de version si nécessaire. Consultez l'issue https://github.com/opt-nc/GLIA/issues/1572 pour avoir la marche à suivre.

### 📂 Repos à maintenir avec le même protocole

- [`setup-duckdb-action-tester`](https://github.com/opt-nc/setup-duckdb-action-tester) : Un dépôt dédié aux tests pour le setup de `duckdb`.
- [`tower-deploy-action`](https://github.com/opt-nc/tower-deploy-action) : un GH Action qui intéragit avec les serveurs Tower