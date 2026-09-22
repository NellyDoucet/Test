/* Moteur d'activites (quiz a choix multiple) charge depuis un fichier
   JSON du dossier db/. Rend les questions, corrige les reponses et
   signale l'achevement via un evenement personnalise "quiz:completed". */

(function (global) {
  "use strict";

  function fetchQuiz(src) {
    return fetch(src).then(function (response) {
      if (!response.ok) {
        throw new Error("Impossible de charger l'activite : " + src);
      }
      return response.json();
    });
  }

  function buildQuestionMarkup(question, index) {
    var wrapper = document.createElement("div");
    wrapper.className = "quiz-question";
    wrapper.setAttribute("data-question-id", question.id);

    var prompt = document.createElement("div");
    prompt.className = "quiz-question__prompt";
    prompt.innerHTML =
      '<span class="quiz-question__number">' + (index + 1) + "</span>" +
      "<span>" + question.prompt + "</span>";
    wrapper.appendChild(prompt);

    var options = document.createElement("div");
    options.className = "quiz-options";

    question.options.forEach(function (optionText, optionIndex) {
      var option = document.createElement("button");
      option.type = "button";
      option.className = "quiz-option";
      option.setAttribute("data-option-index", optionIndex);
      option.innerHTML =
        '<span class="quiz-option__marker"></span><span>' + optionText + "</span>";
      options.appendChild(option);
    });

    wrapper.appendChild(options);

    var feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    feedback.setAttribute("data-role", "feedback");
    wrapper.appendChild(feedback);

    return wrapper;
  }

  function initQuiz(root) {
    var src = root.getAttribute("data-quiz-src");
    if (!src) {
      return;
    }

    fetchQuiz(src).then(function (quiz) {
      renderQuiz(root, quiz);
    }).catch(function (error) {
      root.innerHTML = '<p class="text-muted">' + error.message + "</p>";
    });
  }

  function renderQuiz(root, quiz) {
    var answers = {};

    root.innerHTML = "";

    var instructions = document.createElement("p");
    instructions.className = "text-muted";
    instructions.textContent = quiz.instructions;
    root.appendChild(instructions);

    var list = document.createElement("div");
    list.setAttribute("data-role", "question-list");
    quiz.questions.forEach(function (question, index) {
      list.appendChild(buildQuestionMarkup(question, index));
    });
    root.appendChild(list);

    var actions = document.createElement("div");
    actions.className = "btn-row";

    var submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.className = "btn btn-primary";
    submitBtn.innerHTML = '<i data-lucide="check-check" class="icon"></i><span>Verifier mes reponses</span>';
    submitBtn.disabled = true;

    var retryBtn = document.createElement("button");
    retryBtn.type = "button";
    retryBtn.className = "btn btn-secondary";
    retryBtn.style.display = "none";
    retryBtn.innerHTML = '<i data-lucide="rotate-ccw" class="icon"></i><span>Recommencer</span>';

    actions.appendChild(retryBtn);
    actions.appendChild(submitBtn);
    root.appendChild(actions);

    var resultBox = document.createElement("div");
    resultBox.className = "quiz-result";
    resultBox.style.display = "none";
    root.appendChild(resultBox);

    function updateSubmitState() {
      submitBtn.disabled = Object.keys(answers).length < quiz.questions.length;
    }

    list.addEventListener("click", function (event) {
      var optionEl = event.target.closest(".quiz-option");
      if (!optionEl || optionEl.classList.contains("is-locked")) {
        return;
      }

      var questionEl = optionEl.closest(".quiz-question");
      var questionOptions = questionEl.querySelectorAll(".quiz-option");
      questionOptions.forEach(function (el) {
        el.classList.remove("is-selected");
      });
      optionEl.classList.add("is-selected");

      answers[questionEl.getAttribute("data-question-id")] = Number(
        optionEl.getAttribute("data-option-index")
      );

      updateSubmitState();
    });

    submitBtn.addEventListener("click", function () {
      var correctCount = 0;

      quiz.questions.forEach(function (question) {
        var questionEl = list.querySelector('[data-question-id="' + question.id + '"]');
        var options = questionEl.querySelectorAll(".quiz-option");
        var selectedIndex = answers[question.id];
        var isCorrect = selectedIndex === question.correctIndex;

        if (isCorrect) {
          correctCount += 1;
        }

        options.forEach(function (optionEl) {
          optionEl.classList.add("is-locked");
          var optionIndex = Number(optionEl.getAttribute("data-option-index"));
          if (optionIndex === question.correctIndex) {
            optionEl.classList.add("is-correct");
          } else if (optionIndex === selectedIndex) {
            optionEl.classList.add("is-incorrect");
          }
        });

        var feedback = questionEl.querySelector('[data-role="feedback"]');
        feedback.classList.add("is-visible", isCorrect ? "is-correct" : "is-incorrect");
        feedback.innerHTML =
          '<i data-lucide="' + (isCorrect ? "check-circle-2" : "x-circle") + '" class="icon"></i>' +
          "<span>" + question.explanation + "</span>";
      });

      var scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
      var passed = scorePercent >= (quiz.passScore || 70);

      resultBox.style.display = "block";
      resultBox.innerHTML =
        '<i data-lucide="' + (passed ? "trophy" : "refresh-ccw") + '" class="icon"></i>' +
        '<div class="quiz-result__score">' + scorePercent + " %</div>" +
        "<p>" + correctCount + " bonnes reponses sur " + quiz.questions.length + ". " +
        (passed ? "Activite reussie." : "Score insuffisant, tu peux recommencer.") + "</p>";

      submitBtn.style.display = "none";
      retryBtn.style.display = "inline-flex";

      if (global.AppIcons) {
        global.AppIcons.render();
      }

      root.dispatchEvent(
        new CustomEvent("quiz:completed", {
          bubbles: true,
          detail: { quizId: quiz.id, scorePercent: scorePercent, passed: passed }
        })
      );
    });

    retryBtn.addEventListener("click", function () {
      answers = {};
      renderQuiz(root, quiz);
    });

    if (global.AppIcons) {
      global.AppIcons.render();
    }
  }

  global.AppQuiz = {
    init: initQuiz
  };
})(window);
