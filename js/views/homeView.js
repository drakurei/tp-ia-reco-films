/**
 * Vue d'accueil : liste des films découverts.
 *
 * C'est la vue sur laquelle viendront se greffer la plupart des
 * fonctionnalités de la phase 2 (filtres, scoring, sliders, Surprise Me).
 */

import { discoverMovies, TmdbError } from "../api/tmdb.js";
import { getOutlet } from "../core/router.js";
import { getState, setState } from "../core/state.js";
import { computeScore, sortByScore } from "../core/scoring.js";
import { movieGrid } from "../ui/movieCard.js";
import { emptyMessage, errorMessage, loader } from "../ui/feedback.js";

/** Structure de la vue, indépendante des données. */
function layout(content) {
  return `
    <section class="view view--home">
      <div class="view__header">
        <h1 class="view__title">Découvrir des films</h1>
        <p class="view__subtitle">
          Les films du moment, classés par score de recommandation. Affinez la
          sélection pour obtenir des recommandations à votre goût.
        </p>
      </div>

      <!-- Zone réservée aux filtres et aux réglages de pondération (phase 2) -->
      <div class="view__controls" id="home-controls"></div>

      <div class="view__content" id="home-content">${content}</div>
    </section>
  `;
}

/**
 * Badge de score affiché sous chaque carte.
 *
 * @param {number} score
 * @returns {string}
 */
function scoreBadge(score) {
  return `
    <span class="movie-card__score" title="Score de recommandation calculé à partir de vos pondérations">
      <span class="movie-card__score-label">Score</span>
      ${score.toFixed(1)}/100
    </span>
  `;
}

/** Affiche la vue d'accueil et charge les films. */
export async function homeView() {
  const outlet = getOutlet();
  outlet.innerHTML = layout(loader());

  setState({ loading: true, error: null });

  try {
    const movies = await discoverMovies({ sort_by: "popularity.desc" });
    const { weights } = getState();

    // On stocke la liste déjà triée : les autres fonctionnalités qui liront
    // state.movies verront le même ordre que celui affiché.
    const sortedMovies = sortByScore(movies, weights);
    setState({ movies: sortedMovies, loading: false });

    const content = document.getElementById("home-content");
    content.innerHTML = sortedMovies.length
      ? movieGrid(sortedMovies, {
          extra: (movie) => scoreBadge(computeScore(movie, weights)),
        })
      : emptyMessage(
          "Aucun film trouvé",
          "Essayez d'élargir vos critères de recherche."
        );
  } catch (error) {
    const message =
      error instanceof TmdbError
        ? error.message
        : "Erreur inattendue lors du chargement des films.";

    setState({ loading: false, error: message });
    document.getElementById("home-content").innerHTML = errorMessage(message);
  }
}
