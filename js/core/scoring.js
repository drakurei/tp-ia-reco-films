/**
 * Logique de scoring des films.
 *
 * Ce module transforme les données brutes de TMDB en un score unique sur 100.
 * Il ne touche jamais au DOM et n'importe rien de js/ui/ : la logique métier
 * reste séparée de l'affichage.
 */

/**
 * Calcule la valeur normalisée de la note moyenne.
 *
 * TMDB fournit une note comprise entre 0 et 10, donc une division
 * directe par 10 permet d'obtenir une valeur comprise entre 0 et 1.
 *
 * @param {number} rating - Note moyenne TMDB.
 * @returns {number} Note normalisée entre 0 et 1.
 */
function normalizeRating(rating) {
  const value = Number(rating);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value / 10, 0), 1);
}

/**
 * Normalise la popularité TMDB.
 *
 * La popularité est une grandeur non bornée et peut varier fortement
 * d'un film à l'autre. Une normalisation linéaire serait trop sensible
 * aux valeurs extrêmes. On utilise donc log1p() afin de réduire
 * progressivement l'influence des très grandes valeurs.
 *
 * La valeur est ensuite ramenée sur 0-1 avec une borne pratique.
 *
 * @param {number} popularity - Popularité TMDB.
 * @returns {number} Popularité normalisée entre 0 et 1.
 */
function normalizePopularity(popularity) {
  const value = Number(popularity);

  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  // 3000 correspond à une popularité déjà très élevée dans TMDB.
  const maxPopularity = Math.log1p(3000);

  return Math.min(Math.log1p(value) / maxPopularity, 1);
}

/**
 * Normalise le nombre de votes.
 *
 * Le nombre de votes est lui aussi non borné et présente généralement
 * une distribution très déséquilibrée : quelques films ont énormément
 * de votes alors que la majorité en a beaucoup moins.
 *
 * log1p() permet donc de limiter l'influence des valeurs extrêmes.
 * 100000 votes est utilisé comme référence haute : au-delà, la valeur
 * est plafonnée à 1.
 *
 * @param {number} voteCount - Nombre de votes TMDB.
 * @returns {number} Nombre de votes normalisé entre 0 et 1.
 */
function normalizeVotes(voteCount) {
  const value = Number(voteCount);

  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  const maxVotes = Math.log1p(100000);

  return Math.min(Math.log1p(value) / maxVotes, 1);
}

/**
 * Normalise la récence d'un film avec une décroissance exponentielle.
 *
 * Une demi-vie de 5 ans signifie qu'un film perd la moitié de sa valeur de
 * récence tous les 5 ans : 1.00 à la sortie, 0.50 à 5 ans, 0.25 à 10 ans,
 * 0.06 à 20 ans. Contrairement à une décroissance linéaire, cette méthode ne
 * met jamais brutalement la récence à zéro — un film de 11 ans et un film de
 * 30 ans ne sont plus traités de façon identique.
 *
 * Une absence de date est considérée comme une récence nulle.
 *
 * @param {string} releaseDate - Date de sortie au format YYYY-MM-DD.
 * @returns {number} Récence normalisée entre 0 et 1.
 */
function normalizeRecency(releaseDate) {
  if (!releaseDate) {
    return 0;
  }

  const releaseTimestamp = Date.parse(releaseDate);

  if (!Number.isFinite(releaseTimestamp)) {
    return 0;
  }

  const ageInDays = Math.max(
    0,
    (Date.now() - releaseTimestamp) / (1000 * 60 * 60 * 24)
  );

  const halfLifeInDays = 365.25 * 5;

  return Math.pow(0.5, ageInDays / halfLifeInDays);
}

/**
 * Calcule le score pondéré d'un film.
 *
 * Les quatre critères sont normalisés sur 0-1 avant l'application
 * des pondérations. Le résultat final est ramené sur une échelle
 * de 0 à 100.
 *
 * Les pondérations sont relatives : elles sont divisées par leur somme,
 * donc { rating: 1, popularity: 1, recency: 1, votes: 1 } donne le même
 * résultat que { rating: 0.25, popularity: 0.25, recency: 0.25, votes: 0.25 }.
 * C'est ce qui permettra aux curseurs de la pondération configurable
 * d'envoyer n'importe quelles valeurs sans casser l'échelle 0-100.
 *
 * Si aucune pondération n'est fournie, les valeurs par défaut sont :
 * rating = 0.4, popularity = 0.2, recency = 0.2 et votes = 0.2.
 *
 * @param {Object} movie - Film brut provenant de TMDB.
 * @param {Object} [weights] - Pondérations utilisées pour le calcul.
 * @param {number} [weights.rating=0.4] - Poids de la note.
 * @param {number} [weights.popularity=0.2] - Poids de la popularité.
 * @param {number} [weights.recency=0.2] - Poids de la récence.
 * @param {number} [weights.votes=0.2] - Poids du nombre de votes.
 * @returns {number} Score compris entre 0 et 100.
 */
export function computeScore(
  movie,
  weights = {
    rating: 0.4,
    popularity: 0.2,
    recency: 0.2,
    votes: 0.2,
  }
) {
  const normalizedWeights = {
    rating: Number(weights.rating ?? 0.4),
    popularity: Number(weights.popularity ?? 0.2),
    recency: Number(weights.recency ?? 0.2),
    votes: Number(weights.votes ?? 0.2),
  };

  const totalWeight =
    normalizedWeights.rating +
    normalizedWeights.popularity +
    normalizedWeights.recency +
    normalizedWeights.votes;

  if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
    return 0;
  }

  const rating = normalizeRating(movie?.vote_average);
  const popularity = normalizePopularity(movie?.popularity);
  const recency = normalizeRecency(movie?.release_date);
  const votes = normalizeVotes(movie?.vote_count);

  const weightedScore =
    rating * normalizedWeights.rating +
    popularity * normalizedWeights.popularity +
    recency * normalizedWeights.recency +
    votes * normalizedWeights.votes;

  return Math.min(Math.max((weightedScore / totalWeight) * 100, 0), 100);
}

/**
 * Trie les films par score décroissant.
 *
 * Le tableau fourni en paramètre n'est pas modifié.
 *
 * @param {Array<Object>} movies - Liste des films TMDB.
 * @param {Object} [weights] - Pondérations utilisées pour le score.
 * @returns {Array<Object>} Nouveau tableau trié par score décroissant.
 */
export function sortByScore(movies, weights) {
  return [...movies]
    .map((movie, index) => ({
      movie,
      score: computeScore(movie, weights),
      index,
    }))
    .sort((a, b) => {
      const scoreDifference = b.score - a.score;

      // Conserve l'ordre TMDB en cas d'égalité.
      return scoreDifference !== 0 ? scoreDifference : a.index - b.index;
    })
    .map(({ movie }) => movie);
}
