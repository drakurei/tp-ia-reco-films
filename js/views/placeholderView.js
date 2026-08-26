/**
 * Vue générique pour les pages dont la fonctionnalité sera développée en
 * phase 2. Elle garde la navigation cohérente en attendant.
 */

import { getOutlet } from "../core/router.js";
import { escapeHtml } from "../ui/feedback.js";

/**
 * Construit une vue « à venir ».
 *
 * @param {string} title
 * @param {string} description
 * @returns {() => void}
 */
export function placeholderView(title, description) {
  return () => {
    getOutlet().innerHTML = `
      <section class="view">
        <div class="view__header">
          <h1 class="view__title">${escapeHtml(title)}</h1>
          <p class="view__subtitle">${escapeHtml(description)}</p>
        </div>
        <div class="feedback">
          <p class="feedback__title">Fonctionnalité à venir</p>
          <p class="feedback__text">Cette page sera développée pendant la phase 2.</p>
        </div>
      </section>
    `;
  };
}
