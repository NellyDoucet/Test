/* Initialisation des icones lucide. A appeler apres chaque insertion
   de contenu dynamique dans le DOM. */

(function (global) {
  "use strict";

  function renderIcons() {
    if (global.lucide && typeof global.lucide.createIcons === "function") {
      global.lucide.createIcons();
    }
  }

  global.AppIcons = {
    render: renderIcons
  };
})(window);
