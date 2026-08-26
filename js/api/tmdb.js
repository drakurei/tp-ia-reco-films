/**
 * Couche d'accès à l'API TMDB.
 *
 * Toutes les requêtes réseau du projet passent par ce module : les vues et la
 * logique métier ne connaissent jamais les URLs ni la clé API.
 */

import {
  TMDB_BASE_URL,
  TMDB_IMAGE_URL,
  TMDB_LANGUAGE,
} from "../constants.js";

/** Erreur levée quand l'API répond autre chose qu'un succès. */
export class TmdbError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

const MISSING_KEY_MESSAGE =
  "Clé API TMDB introuvable. Copiez js/config.example.js en js/config.js " +
  "et renseignez votre clé (https://www.themoviedb.org/settings/api).";

let configPromise = null;

/**
 * Charge la clé API depuis `js/config.js`.
 *
 * L'import est dynamique et tolérant à l'échec : si le fichier n'existe pas
 * encore (clone fraîchement récupéré), l'application affiche un message
 * d'installation au lieu de rester bloquée sur une page blanche.
 *
 * @returns {Promise<string|null>}
 */
async function getApiKey() {
  if (!configPromise) {
    configPromise = import("../config.js")
      .then((module) => module.TMDB_API_KEY ?? null)
      .catch(() => null);
  }

  const key = await configPromise;
  return key && key !== "VOTRE_CLE_API_ICI" ? key : null;
}

/**
 * Construit l'URL complète d'un endpoint TMDB avec la clé et la langue.
 *
 * @param {string} endpoint - Ex. "/movie/popular"
 * @param {string} apiKey
 * @param {Object} [params] - Paramètres de requête supplémentaires
 * @returns {string}
 */
function buildUrl(endpoint, apiKey, params = {}) {
  const url = new URL(TMDB_BASE_URL + endpoint);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", TMDB_LANGUAGE);

  for (const [key, value] of Object.entries(params)) {
    // On ignore les filtres vides pour ne pas polluer la requête.
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, value);
  }

  return url.toString();
}

/**
 * Effectue un appel GET sur l'API et retourne le JSON.
 *
 * @param {string} endpoint
 * @param {Object} [params]
 * @returns {Promise<Object>}
 * @throws {TmdbError}
 */
async function request(endpoint, params = {}) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new TmdbError(MISSING_KEY_MESSAGE, 401);
  }

  let response;
  try {
    response = await fetch(buildUrl(endpoint, apiKey, params));
  } catch {
    throw new TmdbError(
      "Impossible de joindre l'API TMDB. Vérifiez votre connexion.",
      0
    );
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new TmdbError(
      detail.status_message || `L'API TMDB a répondu ${response.status}.`,
      response.status
    );
  }

  return response.json();
}

/**
 * Films populaires du moment.
 *
 * @param {number} [page]
 * @returns {Promise<Array<Object>>}
 */
export async function getPopularMovies(page = 1) {
  const data = await request("/movie/popular", { page });
  return data.results;
}

/**
 * Découverte de films avec filtres optionnels.
 *
 * Les clés attendues sont celles de TMDB (with_genres, primary_release_date.gte,
 * vote_average.gte, with_original_language, sort_by...). C'est le point d'entrée
 * utilisé par la fonctionnalité de filtrage multi-critères.
 *
 * @param {Object} [filters]
 * @param {number} [page]
 * @returns {Promise<Array<Object>>}
 */
export async function discoverMovies(filters = {}, page = 1) {
  const data = await request("/discover/movie", { ...filters, page });
  return data.results;
}

/**
 * Détail complet d'un film.
 *
 * @param {number|string} movieId
 * @returns {Promise<Object>}
 */
export async function getMovieDetails(movieId) {
  return request(`/movie/${movieId}`);
}

/**
 * Films similaires à un film donné.
 *
 * @param {number|string} movieId
 * @returns {Promise<Array<Object>>}
 */
export async function getSimilarMovies(movieId) {
  const data = await request(`/movie/${movieId}/similar`);
  return data.results;
}

/**
 * Liste des genres de films (id + nom).
 *
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export async function getGenres() {
  const data = await request("/genre/movie/list");
  return data.genres;
}

/**
 * Recherche de films par titre.
 *
 * @param {string} query
 * @returns {Promise<Array<Object>>}
 */
export async function searchMovies(query) {
  if (!query.trim()) return [];
  const data = await request("/search/movie", { query });
  return data.results;
}

/**
 * URL d'une image TMDB, ou null si le film n'en a pas.
 *
 * @param {string|null} path - Ex. "/abc123.jpg"
 * @param {string} [size] - w200, w342, w500, original...
 * @returns {string|null}
 */
export function getImageUrl(path, size = "w342") {
  return path ? `${TMDB_IMAGE_URL}/${size}${path}` : null;
}
