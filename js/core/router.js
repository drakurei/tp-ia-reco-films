/**
 * Routeur par hash (#/chemin).
 *
 * Pas de dépendance ni de configuration serveur : chaque vue est une fonction
 * qui reçoit ses paramètres et retourne (ou injecte) son contenu.
 */

const routes = new Map();
let notFoundView = () => "<p>Page introuvable.</p>";
let outlet = null;

/**
 * Déclare une route.
 *
 * Le chemin accepte des paramètres nommés : "/film/:id".
 *
 * @param {string} path
 * @param {(params: Object) => void|Promise<void>} view
 */
export function addRoute(path, view) {
  routes.set(path, view);
}

/**
 * Vue affichée quand aucune route ne correspond.
 *
 * @param {Function} view
 */
export function setNotFound(view) {
  notFoundView = view;
}

/**
 * Compare un motif de route à un chemin réel et extrait les paramètres.
 *
 * @param {string} pattern - Ex. "/film/:id"
 * @param {string} path - Ex. "/film/550"
 * @returns {Object|null} Les paramètres, ou null si ça ne correspond pas
 */
function matchRoute(pattern, path) {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }

  return params;
}

/** Chemin courant, sans le "#". */
function currentPath() {
  return window.location.hash.slice(1) || "/";
}

/** Met en évidence le lien de navigation actif. */
function updateActiveLinks(path) {
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    const isActive = link.dataset.routeLink === path;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/** Résout la route courante et affiche la vue correspondante. */
async function resolve() {
  const path = currentPath();
  updateActiveLinks(path);

  for (const [pattern, view] of routes) {
    const params = matchRoute(pattern, path);
    if (params) {
      await view(params);
      window.scrollTo({ top: 0 });
      return;
    }
  }

  await notFoundView();
}

/**
 * Démarre le routeur.
 *
 * @param {HTMLElement} element - Conteneur dans lequel les vues s'affichent
 */
export function startRouter(element) {
  outlet = element;
  window.addEventListener("hashchange", resolve);
  resolve();
}

/**
 * Conteneur des vues, utilisé par celles-ci pour s'injecter.
 *
 * @returns {HTMLElement}
 */
export function getOutlet() {
  return outlet;
}

/**
 * Navigation programmatique.
 *
 * @param {string} path - Ex. "/film/550"
 */
export function navigate(path) {
  window.location.hash = path;
}
