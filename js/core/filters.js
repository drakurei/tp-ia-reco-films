/**
 * Logique du filtrage multi-critères.
 *
 * Les filtres (genre, année minimum, note minimum, langue originale) sont
 * envoyés directement à l'endpoint TMDB "/discover/movie" plutôt
 * qu'appliqués côté client : le catalogue TMDB est trop large pour filtrer
 * une simple page de résultats déjà chargée. Ce module ne fait que traduire
 * l'état des filtres (state.filters) en paramètres compris par TMDB.
 *
 * Il ne touche jamais au DOM : la logique métier reste séparée de
 * l'affichage, comme pour js/core/scoring.js.
 */

/**
 * Traduit les filtres actifs en paramètres de requête TMDB pour
 * `/discover/movie`.
 *
 * Les clés vides sont simplement absentes de l'objet retourné : c'est
 * `discoverMovies` (js/api/tmdb.js) qui se charge déjà d'ignorer les
 * paramètres vides, mais autant ne pas les construire ici.
 *
 * @param {Object} [filters] - Filtres actifs (state.filters)
 * @param {string} [filters.genre] - Id de genre TMDB
 * @param {string|number} [filters.minYear] - Année de sortie minimum
 * @param {string|number} [filters.minRating] - Note moyenne minimum (0-10)
 * @param {string} [filters.language] - Code langue originale (ISO 639-1)
 * @returns {Object} Paramètres de requête pour `discoverMovies`
 */
export function buildDiscoverParams(filters = {}) {
  const params = { sort_by: "popularity.desc" };

  if (filters.genre) {
    params.with_genres = filters.genre;
  }

  if (filters.minYear) {
    params["primary_release_date.gte"] = `${filters.minYear}-01-01`;
  }

  if (filters.minRating) {
    params["vote_average.gte"] = filters.minRating;
  }

  if (filters.language) {
    params.with_original_language = filters.language;
  }

  return params;
}

/**
 * Indique si au moins un filtre est actif.
 *
 * Utilisé pour distinguer, dans le message affiché quand la liste est
 * vide, "aucun film ne correspond à vos critères" de "aucun film à
 * afficher" (cas TMDB en erreur ou catalogue vide, indépendant des filtres).
 *
 * @param {Object} [filters] - Filtres actifs (state.filters)
 * @returns {boolean}
 */
export function hasActiveFilters(filters = {}) {
  return Boolean(
    filters.genre || filters.minYear || filters.minRating || filters.language
  );
}

/** Filtres vides, utilisés pour réinitialiser state.filters. */
export const EMPTY_FILTERS = {
  genre: "",
  minYear: "",
  minRating: "",
  language: "",
};
