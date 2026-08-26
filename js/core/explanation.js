/**
 * Génération des raisons expliquant le score d'un film.
 *
 * Ce module reste indépendant du DOM. Il réutilise les fonctions de
 * normalisation de js/core/scoring.js (plutôt que de les recopier) pour ne
 * retenir que les critères réellement forts et pondérés, et pour rester
 * automatiquement cohérent si le calcul du score évolue.
 */

import {
  DEFAULT_WEIGHTS,
  normalizePopularity,
  normalizeRating,
  normalizeRecency,
  normalizeVotes,
} from "./scoring.js";

const STRONG_THRESHOLD = 0.7;
const SIGNIFICANT_WEIGHT = 0.1;

function normalizeWeights(weights = DEFAULT_WEIGHTS) {
  const normalizedWeights = {
    rating: Number(weights.rating ?? DEFAULT_WEIGHTS.rating),
    popularity: Number(weights.popularity ?? DEFAULT_WEIGHTS.popularity),
    recency: Number(weights.recency ?? DEFAULT_WEIGHTS.recency),
    votes: Number(weights.votes ?? DEFAULT_WEIGHTS.votes),
  };
  const totalWeight = Object.values(normalizedWeights).reduce(
    (total, weight) => total + weight,
    0
  );

  if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(normalizedWeights).map(([criterion, weight]) => [
      criterion,
      weight / totalWeight,
    ])
  );
}

/**
 * Explique les critères forts qui ont contribué à la recommandation.
 *
 * @param {Object} movie - Film brut provenant de TMDB.
 * @param {Object} [weights] - Pondérations utilisées pour le score.
 * @param {number} [weights.rating=0.4] - Poids de la note.
 * @param {number} [weights.popularity=0.2] - Poids de la popularité.
 * @param {number} [weights.recency=0.2] - Poids de la récence.
 * @param {number} [weights.votes=0.2] - Poids du nombre de votes.
 * @param {string|number} [activeGenreId] - Genre actuellement sélectionné.
 * @returns {Array<string>} Raisons courtes expliquant le score.
 */
export function explainScore(movie, weights, activeGenreId) {
  const normalizedWeights = normalizeWeights(weights);

  if (!normalizedWeights) {
    return activeGenreId && movie?.genre_ids?.map(String).includes(String(activeGenreId))
      ? ["Correspond au genre sélectionné"]
      : [];
  }

  const criteria = [
    ["rating", normalizeRating(movie?.vote_average), "Note élevée"],
    ["popularity", normalizePopularity(movie?.popularity), "Film populaire"],
    ["recency", normalizeRecency(movie?.release_date), "Film récent"],
    ["votes", normalizeVotes(movie?.vote_count), "Nombre de votes élevé"],
  ];
  const reasons = criteria
    .filter(
      ([criterion, value]) =>
        value >= STRONG_THRESHOLD &&
        normalizedWeights[criterion] >= SIGNIFICANT_WEIGHT
    )
    .map(([, , reason]) => reason);

  if (activeGenreId && movie?.genre_ids?.map(String).includes(String(activeGenreId))) {
    reasons.push("Correspond au genre sélectionné");
  }

  return reasons;
}