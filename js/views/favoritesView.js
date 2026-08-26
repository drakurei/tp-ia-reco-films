/**
 * Vue « Mes recommandations » : les films mis en favori.
 *
 * Les favoris viennent du localStorage via js/core/favorites.js : aucune
 * requête à l'API TMDB, la page fonctionne donc aussi hors ligne.
 */

import { getFavorites, removeFavorite } from "../core/favorites.js";
import { getOutlet } from "../core/router.js";
import { movieGrid } from "../ui/movieCard.js";
import { emptyMessage } from "../ui/feedback.js";

/**
 * Génère le contenu de la vue à partir de la liste des favoris.
 *
 * Si la liste est vide, retourne emptyMessage("Aucun favori pour le moment",
 * ...) avec une phrase invitant à explorer la page Découvrir. Sinon retourne
 * movieGrid(favorites, ...) avec, pour chaque carte, un bouton
 * "Retirer des favoris" portant la classe "favorites-remove" et l'attribut
 * data-movie-id (en utilisant l'option extra sous forme de fonction).
 *
 * @param {Array<Object>} favorites - Films favoris stockés
 * @returns {string} HTML du contenu
 */
function favoritesContent(favorites) {}

/**
 * Attache les écouteurs de clic sur les boutons "Retirer des favoris".
 *
 * Au clic sur un bouton .favorites-remove : retire le film correspondant via
 * removeFavorite(id), puis redessine la vue pour refléter la liste à jour.
 *
 * @param {HTMLElement} container - Élément contenant la grille
 */
function bindRemoveButtons(container) {}

/**
 * Affiche la vue « Mes recommandations ».
 *
 * Structure attendue : une section .view avec un en-tête (titre
 * "Mes recommandations" et sous-titre indiquant le nombre de films favoris),
 * puis le contenu généré par favoritesContent(), et enfin l'activation des
 * boutons de retrait via bindRemoveButtons().
 */
export function favoritesView() {}
