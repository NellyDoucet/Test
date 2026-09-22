/* Controleur principal de l'application. Charge le contenu du module,
   gere la navigation entre les pages et relie les activites au moteur
   SCORM pour le suivi de la progression. */

(function (global) {
  "use strict";

  var state = {
    pages: [],
    completedPages: {},
    currentPageId: null,
    startTime: Date.now()
  };

  var els = {};

  function byId(id) {
    return document.getElementById(id);
  }

  function loadContent() {
    return fetch("db/content.json").then(function (response) {
      return response.json();
    });
  }

  function restoreProgress() {
    var suspend = global.ScormAPI.getSuspendData();
    if (suspend && suspend.completedPages) {
      state.completedPages = suspend.completedPages;
    }
    return suspend;
  }

  function persistProgress() {
    global.ScormAPI.setSuspendData({
      completedPages: state.completedPages,
      currentPageId: state.currentPageId
    });
    global.ScormAPI.commit();
  }

  function updateOverallProgress() {
    var total = state.pages.length;
    var done = Object.keys(state.completedPages).length;
    var percent = total > 0 ? Math.round((done / total) * 100) : 0;

    if (els.progressBar) {
      els.progressBar.style.width = percent + "%";
    }
    if (els.progressLabel) {
      els.progressLabel.textContent = done + " / " + total + " sections completees";
    }

    if (done >= total && total > 0) {
      global.ScormAPI.setStatus("completed");
    } else if (done > 0) {
      global.ScormAPI.setStatus("incomplete");
    }
  }

  function markPageCompleted(pageId, scorePercent) {
    state.completedPages[pageId] = {
      completedAt: new Date().toISOString(),
      score: scorePercent != null ? scorePercent : null
    };
    global.AppNav.setCompleted(els.sidebar, pageId);
    updateOverallProgress();
    persistProgress();
  }

  function findPage(pageId) {
    return state.pages.filter(function (page) {
      return page.id === pageId;
    })[0];
  }

  function loadPage(pageId) {
    var page = findPage(pageId) || state.pages[0];
    if (!page) {
      return;
    }

    state.currentPageId = page.id;

    fetch(page.file)
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        els.main.innerHTML = html;
        global.AppIcons.render();

        var quizRoots = els.main.querySelectorAll("[data-quiz-src]");
        quizRoots.forEach(function (root) {
          global.AppQuiz.init(root);
        });

        if (page.type === "lecture" && !state.completedPages[page.id]) {
          markPageCompleted(page.id, null);
        }

        global.AppNav.setActive(els.sidebar, page.id);
        els.main.closest(".main").scrollTop = 0;
        persistProgress();
      });
  }

  function handleQuizCompleted(event) {
    var detail = event.detail;
    var page = findPage(state.currentPageId);
    if (!page) {
      return;
    }
    markPageCompleted(page.id, detail.scorePercent);

    var allScores = Object.keys(state.completedPages)
      .map(function (id) {
        return state.completedPages[id].score;
      })
      .filter(function (score) {
        return score != null;
      });

    if (allScores.length > 0) {
      var average = Math.round(
        allScores.reduce(function (sum, s) {
          return sum + s;
        }, 0) / allScores.length
      );
      global.ScormAPI.setScore(average, 0, 100);
    }
  }

  function bindLifecycleEvents() {
    global.addEventListener("beforeunload", function () {
      var elapsedSeconds = Math.round((Date.now() - state.startTime) / 1000);
      global.ScormAPI.setSessionTime(elapsedSeconds);
      persistProgress();
      global.ScormAPI.finish();
    });
  }

  function init() {
    els.sidebar = byId("sidebar-nav");
    els.main = byId("main-content");
    els.progressBar = byId("progress-bar");
    els.progressLabel = byId("progress-label");
    els.moduleTitle = byId("module-title");

    global.ScormAPI.initialize();
    if (global.ScormAPI.getStatus() === "not attempted") {
      global.ScormAPI.setStatus("incomplete");
    }

    loadContent().then(function (content) {
      state.pages = content.pages;
      if (els.moduleTitle) {
        els.moduleTitle.textContent = content.moduleTitle;
      }

      var suspend = restoreProgress();
      global.AppNav.render(els.sidebar, state.pages, loadPage);

      Object.keys(state.completedPages).forEach(function (pageId) {
        global.AppNav.setCompleted(els.sidebar, pageId);
      });

      updateOverallProgress();

      var startPageId = (suspend && suspend.currentPageId) || state.pages[0].id;
      loadPage(startPageId);
    });

    document.addEventListener("quiz:completed", handleQuizCompleted);
    els.main.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-goto]");
      if (trigger) {
        event.preventDefault();
        loadPage(trigger.getAttribute("data-goto"));
      }
    });
    bindLifecycleEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window);
