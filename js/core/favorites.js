/**
 * Gestion des films favoris, persistés dans le localStorage.
 *
 * Contrat de stockage retenu pour cette fonctionnalité :
 *
 * - On ne stocke pas seulement les identifiants, mais une version allégée de
 *   chaque film (id, titre, affiche, note, votes, popularité, date de sortie).
 *   La page « Mes recommandations » peut ainsi afficher les cartes sans
 *   redemander quoi que ce soit à l'API, et reste consultable hors ligne.
 * - Un même film ne doit jamais apparaître deux fois dans la liste.
 * - Le localStorage peut être indisponible (navigation privée) ou contenir des
 *   données corrompues : aucune de ces fonctions ne doit lever d'exception.
 *
 * Ce module ne touche pas au DOM : il expose uniquement de la donnée.
 */

/** Clé sous laquelle la liste des favoris est stockée. */
const STORAGE_KEY = "cinescore.favorites";

/**
 * Réduit un film TMDB aux seuls champs utiles au stockage.
 *
 * @param {Object} movie - Film brut provenant de TMDB
 * @returns {{id: number, title: string, poster_path: string|null, vote_average: number, vote_count: number, popularity: number, release_date: string}}
 */
export function toStoredMovie(movie) {}

/**
 * Retourne la liste des films favoris.
 *
 * Retourne un tableau vide si aucun favori n'a été enregistré, si le
 * localStorage est inaccessible, ou si son contenu n'est pas exploitable.
 *
 * @returns {Array<Object>}
 */
export function getFavorites() {}

/**
 * Indique si un film fait partie des favoris.
 *
 * @param {number|string} movieId
 * @returns {boolean}
 */
export function isFavorite(movieId) {}

/**
 * Ajoute un film aux favoris.
 *
 * Si le film y est déjà, la liste est retournée inchangée.
 *
 * @param {Object} movie - Film brut provenant de TMDB
 * @returns {Array<Object>} La liste des favoris après ajout
 */
export function addFavorite(movie) {}

/**
 * Retire un film des favoris.
 *
 * @param {number|string} movieId
 * @returns {Array<Object>} La liste des favoris après suppression
 */
export function removeFavorite(movieId) {}

/**
 * Ajoute le film aux favoris s'il n'y est pas, l'en retire sinon.
 *
 * @param {Object} movie - Film brut provenant de TMDB
 * @returns {{favorites: Array<Object>, isFavorite: boolean}} La liste mise à jour et le nouvel état du film
 */
export function toggleFavorite(movie) {}
