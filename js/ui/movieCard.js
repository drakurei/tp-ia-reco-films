/**
 * Carte de film : le composant d'affichage central de l'application.
 */

import { getImageUrl } from "../api/tmdb.js";
import { escapeHtml } from "./feedback.js";

/**
 * Année de sortie d'un film, ou "—" si la date est absente.
 *
 * @param {Object} movie
 * @returns {string}
 */
export function releaseYear(movie) {
  return movie.release_date ? movie.release_date.slice(0, 4) : "—";
}

/**
 * Génère le HTML d'une carte de film.
 *
 * Les fonctionnalités de la phase 2 peuvent enrichir la carte via `extra`
 * (badge de score, bouton favori, case de comparaison…) sans modifier ce
 * composant.
 *
 * @param {Object} movie - Film TMDB
 * @param {Object} [options]
 * @param {string} [options.extra] - HTML injecté en bas de la carte
 * @returns {string}
 */
export function movieCard(movie, { extra = "" } = {}) {
  const poster = getImageUrl(movie.poster_path);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";

  return `
    <article class="movie-card" data-movie-id="${movie.id}">
      <a class="movie-card__link" href="#/film/${movie.id}">
        <div class="movie-card__poster">
          ${
            poster
              ? `<img src="${poster}" alt="Affiche du film ${escapeHtml(movie.title)}" loading="lazy" />`
              : `<div class="movie-card__poster-fallback" aria-hidden="true">🎬</div>`
          }
          <span class="movie-card__rating" title="Note moyenne TMDB">${rating}</span>
        </div>
        <div class="movie-card__body">
          <h3 class="movie-card__title">${escapeHtml(movie.title)}</h3>
          <p class="movie-card__meta">
            <span>${releaseYear(movie)}</span>
            <span aria-hidden="true">•</span>
            <span>${movie.vote_count ?? 0} votes</span>
          </p>
        </div>
      </a>
      ${extra ? `<div class="movie-card__extra">${extra}</div>` : ""}
    </article>
  `;
}

/**
 * Grille de cartes de films.
 *
 * @param {Array<Object>} movies
 * @param {Object} [options] - Options passées à chaque carte
 * @returns {string}
 */
export function movieGrid(movies, options = {}) {
  return `
    <div class="movie-grid">
      ${movies.map((movie) => movieCard(movie, options)).join("")}
    </div>
  `;
}
