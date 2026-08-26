/**
 * Vue d'accueil : liste des films découverts.
 *
 * C'est la vue sur laquelle viendront se greffer la plupart des
 * fonctionnalités de la phase 2 (filtres, scoring, sliders, Surprise Me).
 */

import { discoverMovies, TmdbError } from "../api/tmdb.js";
import { getOutlet } from "../core/router.js";
import { getState, setState, subscribe } from "../core/state.js";
import { computeScore, sortByScore } from "../core/scoring.js";
import { explainScore } from "../core/explanation.js";
import { buildDiscoverParams, EMPTY_FILTERS, hasActiveFilters } from "../core/filters.js";
import { movieGrid } from "../ui/movieCard.js";
import { scoreExplanation } from "../ui/scoreExplanation.js";
import { filtersPanel, initFiltersPanel } from "../ui/filters.js";
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

/**
 * Interroge TMDB avec les filtres actifs, trie par score et affiche le
 * résultat dans la grille.
 */
async function loadMovies() {
  const content = document.getElementById("home-content");
  content.innerHTML = loader();

  const { filters, weights } = getState();
  setState({ loading: true, error: null });

  try {
    const movies = await discoverMovies(buildDiscoverParams(filters));

    // On stocke la liste déjà triée : les autres fonctionnalités qui liront
    // state.movies verront le même ordre que celui affiché.
    const sortedMovies = sortByScore(movies, weights);
    setState({ movies: sortedMovies, loading: false });

    content.innerHTML = sortedMovies.length
      ? movieGrid(sortedMovies, {
          extra: (movie) =>
            scoreBadge(computeScore(movie, weights)) +
            scoreExplanation(explainScore(movie, weights, filters.genre)),
        })
      : emptyMessage(
          "Aucun film trouvé",
          hasActiveFilters(filters)
            ? "Aucun film ne correspond à ces critères. Essayez d'élargir votre sélection."
            : "Essayez d'élargir vos critères de recherche."
        );
  } catch (error) {
    const message =
      error instanceof TmdbError
        ? error.message
        : "Erreur inattendue lors du chargement des films.";

    setState({ loading: false, error: message });
    content.innerHTML = errorMessage(message);
  }
}

/**
 * Affiche (ou régénère) le panneau de filtres et câble ses événements.
 *
 * Régénérer tout le panneau à chaque changement est plus simple que de
 * mettre à jour un `<select>` existant, et son coût est négligeable vu le
 * nombre de champs.
 */
function renderFilters() {
  const controls = document.getElementById("home-controls");
  const { genres, filters } = getState();

  controls.innerHTML = filtersPanel({ genres, filters });
  initFiltersPanel(controls, {
    onChange: (nextFilters) => {
      setState({ filters: nextFilters });
      loadMovies();
    },
    onReset: () => {
      setState({ filters: { ...EMPTY_FILTERS } });
      loadMovies();
    },
  });
}

/** Abonnement courant aux genres, pour régénérer le panneau à leur arrivée. */
let unsubscribeGenres = null;

/** Affiche la vue d'accueil et charge les films. */
export async function homeView() {
  const outlet = getOutlet();
  outlet.innerHTML = layout(loader());

  renderFilters();

  // Les genres se chargent en parallèle du reste de l'application
  // (js/main.js) : si le panneau de filtres s'affiche avant leur arrivée,
  // on le régénère dès qu'ils sont prêts, sans perdre les filtres déjà
  // saisis par ailleurs. Le désabonnement précédent évite d'empiler les
  // écouteurs si l'utilisateur revient plusieurs fois sur cette vue.
  unsubscribeGenres?.();
  let knownGenreCount = getState().genres.length;
  unsubscribeGenres = subscribe((state) => {
    if (state.genres.length !== knownGenreCount) {
      knownGenreCount = state.genres.length;
      renderFilters();
    }
  });

  await loadMovies();
}
