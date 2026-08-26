/**
 * État global de l'application.
 *
 * Petit store observable : les vues s'abonnent aux changements et se
 * redessinent toutes seules. Cela évite que chaque fonctionnalité ajoutée
 * en phase 2 aille manipuler le DOM des autres.
 */

const state = {
  /** Films actuellement chargés depuis l'API. */
  movies: [],
  /** Liste des genres TMDB (id + nom), chargée une seule fois. */
  genres: [],
  /** Filtres actifs — alimentés par la fonctionnalité de filtrage. */
  filters: {
    genre: "",
    minYear: "",
    minRating: "",
    language: "",
  },
  /** Pondérations du score — alimentées par la fonctionnalité de sliders. */
  weights: {
    rating: 1,
    popularity: 1,
    recency: 1,
    votes: 1,
  },
  /** Ids des films mis en favori — alimentés par la fonctionnalité favoris. */
  favorites: [],
  /** Chargement en cours. */
  loading: false,
  /** Message d'erreur courant, ou null. */
  error: null,
};

const listeners = new Set();

/**
 * Lecture de l'état. On retourne une copie superficielle pour éviter les
 * mutations accidentelles depuis les vues.
 *
 * @returns {Object}
 */
export function getState() {
  return { ...state };
}

/**
 * Met à jour l'état et notifie les abonnés.
 *
 * @param {Object} patch - Champs à modifier
 */
export function setState(patch) {
  Object.assign(state, patch);
  for (const listener of listeners) {
    listener(getState());
  }
}

/**
 * Abonne une fonction aux changements d'état.
 *
 * @param {(state: Object) => void} listener
 * @returns {() => void} Fonction de désabonnement
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
