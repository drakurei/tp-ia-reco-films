# Mini Moteur de Recommandation de Films

TP "Découverte IA" — moteur de recommandation de films basé sur l'API TMDB.
Projet réalisé en binôme, avec comparaison de quatre outils IA de développement
(ChatGPT, GitHub Copilot, Cursor, Claude Code).

## Stack

- HTML5
- SASS (compilé vers CSS)
- JavaScript natif (ES modules)
- API TMDB

## Installation

1. Cloner le dépôt :

   ```bash
   git clone <url-du-repo>
   ```

2. Créer sa clé API TMDB sur https://www.themoviedb.org/settings/api

3. Copier le fichier de configuration d'exemple et y renseigner sa clé :

   ```bash
   cp js/config.example.js js/config.js
   ```

   `js/config.js` est ignoré par Git : la clé ne doit jamais être commitée.

> Note : en application front-end pure, la clé reste visible dans les requêtes
> réseau du navigateur. En production, il faudrait passer par un proxy back-end
> qui garde la clé côté serveur.

## Workflow Git (Gitflow)

- `main` — versions stables uniquement (fin de phase 1, rendu final)
- `develop` — branche d'intégration, cible de toutes les Pull Requests
- `feature/<nom>` — une branche par fonctionnalité, créée depuis `develop`

Cycle pour une fonctionnalité :

```bash
git switch develop
git pull
git switch -c feature/ma-fonctionnalite
# ... développement, commits ...
git push -u origin feature/ma-fonctionnalite
```

Puis ouvrir une Pull Request vers `develop` sur GitHub.

## Fonctionnalités

### Phase 1 — commune (pair programming)

- [ ] Setup du projet (HTML, SASS, JS)
- [ ] Connexion à l'API TMDB et gestion de la clé
- [ ] Récupération des films (endpoint `popular` ou `discover`)
- [ ] Routing / vues de base
- [ ] Mise en place de Gitflow

### Phase 2 — individuelles

Chaque développeur réalise 3 fonctionnalités, chacune avec un outil IA différent,
sur une branche dédiée et via une Pull Request.

| # | Fonctionnalité | Développeur | Outil IA | Branche |
|---|----------------|-------------|----------|---------|
| 1 | Filtrage multi-critères | | | |
| 2 | Système de scoring personnalisé | | | |
| 3 | Pondération configurable (sliders) | | | |
| 4 | Favoris persistants (localStorage) | | | |
| 5 | Explication du score | | | |
| 6 | Comparateur de films | | | |
| 7 | Recommandation par film similaire | | | |
| 8 | Mode "Surprise Me" | | | |
| 9 | Dashboard statistiques | | | |

## Auteurs

- Jonathan Davy ([@drakurei](https://github.com/drakurei))
- *(binôme à compléter)*
