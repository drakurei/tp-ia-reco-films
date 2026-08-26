/**
 * Bouton favori : ajoute ou retire un film des favoris.
 *
 * Le bouton s'affiche sur la page de détail d'un film. Son libellé et son
 * état visuel reflètent la présence du film dans les favoris, et il bascule
 * à chaque clic via toggleFavorite().
 */

import { isFavorite, toggleFavorite } from "../core/favorites.js";
import { escapeHtml } from "./feedback.js";

/**
 * Génère le HTML du bouton favori pour un film.
 *
 * Le bouton porte la classe "favorite-button", plus la classe modificatrice
 * "is-active" quand le film est déjà en favori. Le libellé est
 * "★ Retirer des favoris" si le film est en favori, sinon "☆ Ajouter aux favoris".
 * L'id du film est porté par l'attribut data-movie-id.
 *
 * @param {Object} movie - Film brut provenant de TMDB
 * @returns {string} HTML du bouton
 */
export function favoriteButton(movie) {}

/**
 * Active le bouton favori présent dans un conteneur.
 *
 * Attache un écouteur de clic sur le bouton .favorite-button du conteneur :
 * chaque clic bascule le film via toggleFavorite(movie), puis met à jour le
 * libellé et la classe "is-active" pour refléter le nouvel état, sans
 * recharger la page.
 *
 * @param {HTMLElement} container - Élément contenant le bouton
 * @param {Object} movie - Film brut provenant de TMDB
 */
export function bindFavoriteButton(container, movie) {}
