/* Construction et gestion du menu de navigation lateral. */

(function (global) {
  "use strict";

  function buildNavItem(page) {
    var item = document.createElement("a");
    item.href = "#" + page.id;
    item.className = "nav-item";
    item.setAttribute("data-page-id", page.id);
    item.innerHTML =
      '<i data-lucide="' + page.icon + '" class="icon"></i>' +
      "<span>" + page.title + "</span>" +
      '<i data-lucide="check" class="icon nav-item__status" data-role="status" style="display:none;"></i>';
    return item;
  }

  function render(container, pages, onSelect) {
    container.innerHTML = "";

    var list = document.createElement("div");
    list.className = "nav-list";

    pages.forEach(function (page) {
      var item = buildNavItem(page);
      list.appendChild(item);
    });

    container.appendChild(list);

    list.addEventListener("click", function (event) {
      var item = event.target.closest(".nav-item");
      if (!item) {
        return;
      }
      event.preventDefault();
      onSelect(item.getAttribute("data-page-id"));
    });

    if (global.AppIcons) {
      global.AppIcons.render();
    }
  }

  function setActive(container, pageId) {
    container.querySelectorAll(".nav-item").forEach(function (item) {
      item.classList.toggle("is-active", item.getAttribute("data-page-id") === pageId);
    });
  }

  function setCompleted(container, pageId) {
    var item = container.querySelector('.nav-item[data-page-id="' + pageId + '"]');
    if (!item) {
      return;
    }
    var status = item.querySelector('[data-role="status"]');
    if (status) {
      status.style.display = "inline-flex";
    }
  }

  global.AppNav = {
    render: render,
    setActive: setActive,
    setCompleted: setCompleted
  };
})(window);
