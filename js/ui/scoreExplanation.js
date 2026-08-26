import { escapeHtml } from "./feedback.js";

/**
 * Génère le bloc HTML expliquant le score d'un film.
 *
 * @param {Array<string>} reasons - Raisons produites par le module métier.
 * @returns {string} Bloc HTML, ou une chaîne vide sans raison.
 */
export function scoreExplanation(reasons) {
  if (!reasons?.length) {
    return "";
  }

  return `
    <div class="score-explanation">
      <p class="score-explanation__title">Recommandé car :</p>
      <ul class="score-explanation__list">
        ${reasons
          .map(
            (reason) =>
              `<li class="score-explanation__item"><span aria-hidden="true">✔</span>${escapeHtml(reason)}</li>`
          )
          .join("")}
      </ul>
    </div>
  `;
}