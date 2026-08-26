/**
 * Point d'entrée de l'application.
 *
 * Charge les données de référence, déclare les routes et démarre le routeur.
 */

import { getGenres } from "./api/tmdb.js";
import { addRoute, getOutlet, setNotFound, startRouter } from "./core/router.js";
import { setState } from "./core/state.js";
import { homeView } from "./views/homeView.js";
import { movieView } from "./views/movieView.js";
import { placeholderView } from "./views/placeholderView.js";

/** Charge la liste des genres une fois pour toute l'application. */
async function loadGenres() {
  try {
    setState({ genres: await getGenres() });
  } catch {
    // Les genres ne sont pas bloquants : l'application reste utilisable sans.
    setState({ genres: [] });
  }
}

/** Déclare les routes de l'application. */
function registerRoutes() {
  addRoute("/", homeView);
  addRoute("/film/:id", movieView);
  addRoute(
    "/favoris",
    placeholderView("Mes recommandations", "Retrouvez ici les films mis en favori.")
  );
  addRoute(
    "/stats",
    placeholderView("Statistiques", "Analyse des films actuellement affichés.")
  );

  setNotFound(() => {
    getOutlet().innerHTML = `
      <section class="view">
        <div class="view__header">
          <h1 class="view__title">Page introuvable</h1>
          <p class="view__subtitle">Cette adresse ne correspond à aucune page.</p>
        </div>
        <a class="back-link" href="#/">← Retour à la découverte</a>
      </section>
    `;
  });
}

/** Démarrage. */
async function init() {
  registerRoutes();
  startRouter(document.getElementById("app"));
  await loadGenres();
}

init();
