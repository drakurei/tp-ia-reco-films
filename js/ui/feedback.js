/**
 * Petits fragments d'interface réutilisés par toutes les vues :
 * chargement, message vide, erreur.
 */

/**
 * Indicateur de chargement.
 *
 * @param {string} [label]
 * @returns {string}
 */
export function loader(label = "Chargement des films…") {
  return `
    <div class="feedback" role="status">
      <span class="loader" aria-hidden="true"></span>
      <p class="feedback__text">${escapeHtml(label)}</p>
    </div>
  `;
}

/**
 * Message neutre (aucun résultat, section vide…).
 *
 * @param {string} title
 * @param {string} [description]
 * @returns {string}
 */
export function emptyMessage(title, description = "") {
  return `
    <div class="feedback">
      <p class="feedback__title">${escapeHtml(title)}</p>
      ${description ? `<p class="feedback__text">${escapeHtml(description)}</p>` : ""}
    </div>
  `;
}

/**
 * Message d'erreur.
 *
 * @param {string} message
 * @returns {string}
 */
export function errorMessage(message) {
  return `
    <div class="feedback feedback--error" role="alert">
      <p class="feedback__title">Une erreur est survenue</p>
      <p class="feedback__text">${escapeHtml(message)}</p>
    </div>
  `;
}

/**
 * Échappe les caractères HTML d'une chaîne venant de l'API.
 *
 * Les titres et synopsis TMDB sont du contenu externe : on ne les injecte
 * jamais bruts dans le DOM.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
