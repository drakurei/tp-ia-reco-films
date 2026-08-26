/**
 * Vue détail d'un film.
 *
 * Sert de point d'accroche aux fonctionnalités "explication du score",
 * "favoris" et "films similaires".
 */

import { getMovieDetails, getImageUrl, TmdbError } from "../api/tmdb.js";
import { getOutlet } from "../core/router.js";
import { escapeHtml, errorMessage, loader } from "../ui/feedback.js";
import { releaseYear } from "../ui/movieCard.js";

/** Détail d'un film mis en forme. */
function detail(movie) {
  const backdrop = getImageUrl(movie.backdrop_path, "w780");
  const poster = getImageUrl(movie.poster_path, "w342");

  return `
    <section class="view view--movie">
      <a class="back-link" href="#/">← Retour à la découverte</a>

      <article class="movie-detail">
        ${
          backdrop
            ? `<div class="movie-detail__backdrop" style="background-image: url(&quot;${backdrop}&quot;)"></div>`
            : ""
        }

        <div class="movie-detail__main">
          <div class="movie-detail__poster">
            ${
              poster
                ? `<img src="${poster}" alt="Affiche du film ${escapeHtml(movie.title)}" />`
                : `<div class="movie-card__poster-fallback" aria-hidden="true">🎬</div>`
            }
          </div>

          <div class="movie-detail__info">
            <h1 class="movie-detail__title">${escapeHtml(movie.title)}</h1>
            ${
              movie.tagline
                ? `<p class="movie-detail__tagline">${escapeHtml(movie.tagline)}</p>`
                : ""
            }

            <ul class="movie-detail__stats">
              <li><strong>${movie.vote_average?.toFixed(1) ?? "—"}</strong><span>Note moyenne</span></li>
              <li><strong>${movie.vote_count ?? 0}</strong><span>Votes</span></li>
              <li><strong>${releaseYear(movie)}</strong><span>Sortie</span></li>
              <li><strong>${Math.round(movie.popularity ?? 0)}</strong><span>Popularité</span></li>
            </ul>

            <ul class="genre-list">
              ${(movie.genres ?? [])
                .map((genre) => `<li class="genre-list__item">${escapeHtml(genre.name)}</li>`)
                .join("")}
            </ul>

            <h2 class="movie-detail__section-title">Synopsis</h2>
            <p class="movie-detail__overview">
              ${escapeHtml(movie.overview || "Aucun synopsis disponible pour ce film.")}
            </p>

            <!-- Zone réservée : bouton favori, explication du score (phase 2) -->
            <div class="movie-detail__actions" id="movie-actions"></div>
          </div>
        </div>
      </article>

      <!-- Zone réservée : films similaires (phase 2) -->
      <div id="movie-similar"></div>
    </section>
  `;
}

/**
 * Affiche le détail d'un film.
 *
 * @param {{id: string}} params - Paramètres de route
 */
export async function movieView({ id }) {
  const outlet = getOutlet();
  outlet.innerHTML = loader("Chargement du film…");

  try {
    const movie = await getMovieDetails(id);
    outlet.innerHTML = detail(movie);
  } catch (error) {
    const message =
      error instanceof TmdbError
        ? error.message
        : "Erreur inattendue lors du chargement du film.";
    outlet.innerHTML = errorMessage(message);
  }
}
