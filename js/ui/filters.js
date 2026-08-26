/**
 * Panneau de filtres multi-critères (genre, année minimum, note minimum,
 * langue originale) affiché au-dessus de la grille de films.
 *
 * Comme pour js/ui/movieCard.js, le rendu est une fonction pure qui ne
 * connaît que les données. `initFiltersPanel` est la seule fonction qui
 * touche au DOM, une fois le HTML injecté par la vue.
 */

import { escapeHtml } from "./feedback.js";

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Langues d'origine proposées au filtrage.
 *
 * TMDB référence des dizaines de langues ; on ne propose ici que celles les
 * plus représentées dans le catalogue pour garder un menu utilisable.
 */
const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "Anglais" },
  { code: "es", label: "Espagnol" },
  { code: "de", label: "Allemand" },
  { code: "it", label: "Italien" },
  { code: "ja", label: "Japonais" },
  { code: "ko", label: "Coréen" },
  { code: "hi", label: "Hindi" },
  { code: "zh", label: "Chinois" },
];

/**
 * Construit les options d'un `<select>`, avec la valeur active sélectionnée.
 *
 * @param {Array<{value: string, label: string}>} options
 * @param {string} selected
 * @returns {string}
 */
function selectOptions(options, selected) {
  return options
    .map(
      ({ value, label }) => `
        <option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>
          ${escapeHtml(label)}
        </option>
      `
    )
    .join("");
}

/**
 * Génère le HTML du panneau de filtres.
 *
 * @param {Object} params
 * @param {Array<{id: number, name: string}>} [params.genres] - Genres TMDB disponibles
 * @param {Object} [params.filters] - Filtres actifs (state.filters)
 * @returns {string}
 */
export function filtersPanel({ genres = [], filters = {} }) {
  const genreOptions = selectOptions(
    [
      { value: "", label: "Tous les genres" },
      ...genres.map((genre) => ({ value: String(genre.id), label: genre.name })),
    ],
    filters.genre ?? ""
  );

  const languageOptions = selectOptions(
    [
      { value: "", label: "Toutes les langues" },
      ...LANGUAGES.map((language) => ({ value: language.code, label: language.label })),
    ],
    filters.language ?? ""
  );

  return `
    <form class="filters" data-filters novalidate>
      <div class="filters__field">
        <label for="filter-genre">Genre</label>
        <select id="filter-genre" name="genre">${genreOptions}</select>
      </div>

      <div class="filters__field">
        <label for="filter-min-year">Année minimum</label>
        <input
          type="number"
          id="filter-min-year"
          name="minYear"
          placeholder="Ex. 2000"
          min="1900"
          max="${CURRENT_YEAR}"
          value="${escapeHtml(filters.minYear ?? "")}"
        />
      </div>

      <div class="filters__field">
        <label for="filter-min-rating">Note minimum</label>
        <input
          type="number"
          id="filter-min-rating"
          name="minRating"
          placeholder="Ex. 7"
          min="0"
          max="10"
          step="0.1"
          value="${escapeHtml(filters.minRating ?? "")}"
        />
      </div>

      <div class="filters__field">
        <label for="filter-language">Langue originale</label>
        <select id="filter-language" name="language">${languageOptions}</select>
      </div>

      <button type="button" class="filters__reset" data-filters-reset>
        Réinitialiser
      </button>
    </form>
  `;
}

/**
 * Lit les valeurs actuelles du formulaire de filtres.
 *
 * @param {HTMLFormElement} form
 * @returns {{genre: string, minYear: string, minRating: string, language: string}}
 */
function readFilters(form) {
  const data = new FormData(form);
  return {
    genre: data.get("genre") ?? "",
    minYear: data.get("minYear") ?? "",
    minRating: data.get("minRating") ?? "",
    language: data.get("language") ?? "",
  };
}

/**
 * Câble les événements du panneau de filtres une fois son HTML injecté.
 *
 * Les filtres réagissent à l'événement "change" (sélection ou perte de
 * focus d'un champ numérique) : c'est suffisant pour un rafraîchissement
 * immédiat sans déclencher une requête à chaque frappe au clavier.
 *
 * @param {HTMLElement} container - Élément parent contenant le formulaire
 * @param {Object} [handlers]
 * @param {(filters: Object) => void} [handlers.onChange] - Appelé à chaque changement de filtre
 * @param {() => void} [handlers.onReset] - Appelé au clic sur "Réinitialiser"
 */
export function initFiltersPanel(container, { onChange, onReset } = {}) {
  const form = container.querySelector("[data-filters]");
  if (!form) return;

  form.addEventListener("change", () => onChange?.(readFilters(form)));

  form
    .querySelector("[data-filters-reset]")
    ?.addEventListener("click", () => {
      form.reset();
      onReset?.();
    });
}
