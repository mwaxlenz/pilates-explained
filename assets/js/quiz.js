(() => {
  const root = document.querySelector("[data-quiz]");
  if (!root) return;

  const order = ["classical", "contemporary", "lagree", "onlineMat"];
  const labels = {
    classical: "Classical Pilates",
    contemporary: "Contemporary Pilates",
    lagree: "Lagree",
    onlineMat: "Online / Mat at Home",
  };
  const profiles = {
    classical: {
      headline: "Classical Pilates - go to the source",
      copy: "You're drawn to the original method as Joseph and Clara Pilates taught it - precise, apparatus-based, and lineage-driven. Look for instructors trained directly in classical lineages (often through schools like Romana's Pilates or The Pilates Center), and expect a slower, more deliberate introduction than a typical gym class.",
      links: [
        ["What Is Contrology?", "../articles/what-is-contrology.html"],
        ["Classical vs Modern Pilates", "../articles/classical-vs-modern-pilates-explained.html"],
        ["History of the Reformer", "../articles/history-of-the-reformer.html"],
      ],
      cta: '<a class="button primary" href="../assets/downloads/pilates-starter-decision-guide.pdf" download>Download the starter guide</a>',
    },
    contemporary: {
      headline: "Contemporary Pilates - the adaptable middle path",
      copy: "You'd benefit from a contemporary approach - same roots, but adapted with modern movement science to your body, goals, and any injuries. This is the most widely available style, found at most studios and many gyms.",
      links: [
        ["Classical vs Modern Pilates", "../articles/classical-vs-modern-pilates-explained.html"],
        ["History of the Reformer", "../articles/history-of-the-reformer.html"],
        ["Mat vs Reformer vs Online cost guide", "../guides/mat-vs-reformer-vs-online-pilates-cost.html"],
      ],
      cta: '<a class="button primary" href="#affiliate-link-pending" data-aff="classpass" data-affiliate-link target="_blank" rel="sponsored noopener">Find a class near you</a>',
    },
    lagree: {
      headline: "Lagree - a serious workout, not Pilates (and that's OK)",
      copy: "Based on your answers, you're after intensity more than the Pilates method itself - and Lagree, a separate proprietary system performed on Megaformer-style machines, is likely a better fit than classical or contemporary Pilates. Worth knowing going in: Lagree is historically and pedagogically distinct from Pilates, even though the machines look similar.",
      links: [
        ["What Is Lagree? Not Pilates", "../articles/what-is-lagree-not-pilates.html"],
        ["Classical/Modern/Lagree: How to Choose", "../articles/classical-modern-lagree-how-to-choose.html"],
      ],
      cta: '<a class="button primary" href="../assets/downloads/pilates-starter-decision-guide.pdf" download>Download the starter guide</a>',
    },
    onlineMat: {
      headline: "Start at home - mat Pilates and online classes",
      copy: "You want flexibility, low cost, and the ability to start today. Mat Pilates - many of it drawn from Joseph Pilates' original 34 exercises - is a great low-barrier entry point, and online platforms can guide you through it.",
      links: [
        ["Pilates Starter Decision Guide", "../assets/downloads/pilates-starter-decision-guide.pdf"],
        ["Mat Buying Guide", "../guides/pilates-mat-buying-guide.html"],
        ["Mat vs Reformer vs Online cost guide", "../guides/mat-vs-reformer-vs-online-pilates-cost.html"],
      ],
      cta: '<a class="button primary" href="../assets/downloads/pilates-starter-decision-guide.pdf" download>Download the starter guide</a><a class="button secondary" href="#affiliate-link-pending" data-aff="pilatesanytime" data-affiliate-link target="_blank" rel="sponsored noopener">Explore Pilates Anytime</a>',
    },
  };

  const questions = [
    {
      text: "What's pulling you toward Pilates right now?",
      options: [
        ["A", "I want to get stronger and move better generally", { contemporary: 2, classical: 1 }],
        ["B", "I'm recovering from an injury, surgery, or a health setback", { contemporary: 2, rehabAdjacent: 2 }],
        ["C", "I want a serious, sweaty workout", { lagree: 3 }],
        ["D", "I'm curious about the original method and its history", { classical: 3 }],
      ],
    },
    {
      text: "How much time and money do you want to commit per week, realistically?",
      options: [
        ["A", "A few minutes a day, on my own, free", { onlineMat: 3 }],
        ["B", "1-2 classes a week at a studio", { contemporary: 2, classical: 1 }],
        ["C", "I want to invest seriously - private sessions, real progression", { classical: 3 }],
        ["D", "High-intensity group classes, a few times a week", { lagree: 2, contemporary: 1 }],
      ],
    },
    {
      text: "How do you feel about equipment?",
      options: [
        ["A", "Never used a reformer - a bit intimidated", { contemporary: 1, onlineMat: 2 }],
        ["B", "I'd love to learn the full apparatus system properly", { classical: 3 }],
        ["C", "I just want a great workout, equipment doesn't matter", { lagree: 2, contemporary: 1 }],
        ["D", "I prefer working out at home", { onlineMat: 3 }],
      ],
    },
    {
      text: "What matters most to you in an instructor?",
      options: [
        ["A", "Deep knowledge of the method and its history/lineage", { classical: 3 }],
        ["B", "Someone who can adapt the work to my body and goals", { contemporary: 3 }],
        ["C", "High energy, motivating, pushes me", { lagree: 3 }],
        ["D", "Doesn't matter much - I'm mostly doing this on my own", { onlineMat: 2 }],
      ],
    },
    {
      text: "Which sounds most appealing for a first session?",
      options: [
        ["A", "A calm, precise, one-on-one introduction to the original exercises", { classical: 3 }],
        ["B", "A welcoming small-group class that adapts to all levels", { contemporary: 3 }],
        ["C", "An intense, fast-paced studio class with a machine", { lagree: 3 }],
        ["D", "A free video I can try at home tonight", { onlineMat: 3 }],
      ],
    },
  ];

  let index = 0;
  let answers = [];
  let started = false;

  const track = (name, params = {}) => {
    if (window.PEAnalytics?.track) {
      window.PEAnalytics.track(name, params);
      return;
    }
    document.dispatchEvent(new CustomEvent("pe:track", { detail: { eventName: name, params } }));
  };
  const scoreAnswers = () => {
    const scores = { classical: 0, contemporary: 0, lagree: 0, onlineMat: 0, rehabAdjacent: 0 };
    answers.forEach((answer) => {
      Object.entries(answer.scores).forEach(([key, value]) => {
        scores[key] = (scores[key] || 0) + value;
      });
    });
    const result = order.reduce((best, key) => (scores[key] > scores[best] ? key : best), order[0]);
    return { scores, result };
  };

  const renderQuestion = () => {
    const question = questions[index];
    root.innerHTML = `
      <div class="quiz-progress" aria-label="Question ${index + 1} of ${questions.length}">
        <span>Question ${index + 1} of ${questions.length}</span>
        <div><i style="width: ${((index + 1) / questions.length) * 100}%"></i></div>
      </div>
      <fieldset class="quiz-card">
        <legend>${question.text}</legend>
        <div class="quiz-options">
          ${question.options.map((option) => `<button type="button" data-answer="${option[0]}"><strong>${option[0]}.</strong> ${option[1]}</button>`).join("")}
        </div>
      </fieldset>
    `;

    root.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!started) {
          started = true;
          track("quiz_start", { page_path: location.pathname });
        }
        const selected = question.options.find((option) => option[0] === button.dataset.answer);
        answers[index] = { label: selected[0], scores: selected[2] };
        track(`quiz_question_${index + 1}_answer`, { answer: selected[0] });
        if (index === questions.length - 1) {
          renderResult();
        } else {
          index += 1;
          renderQuestion();
        }
      });
    });
  };

  const renderResult = () => {
    const { scores, result } = scoreAnswers();
    const profile = profiles[result];
    const normalizedResult = result === "onlineMat" ? "online-mat" : result;
    track("quiz_complete", { result: normalizedResult, result_label: labels[result] });
    root.innerHTML = `
      <section class="quiz-result" aria-live="polite">
        <p class="eyebrow">Your path</p>
        <h2>${profile.headline}</h2>
        <p>${profile.copy}</p>
        <ul>${profile.links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul>
        <div class="button-row">${profile.cta}<button class="button ghost" type="button" data-retake>Retake quiz</button></div>
        <p class="form-note">Scores: ${order.map((key) => `${labels[key]} ${scores[key]}`).join(" · ")}</p>
      </section>
    `;
    root.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", () => {
        track("quiz_result_click", {
          result: normalizedResult,
          result_label: labels[result],
          link_url: new URL(link.getAttribute("href"), location.href).href,
          link_text: link.textContent.trim(),
          cta_location: "quiz_result",
        });
      });
    });

    root.querySelector("[data-retake]").addEventListener("click", () => {
      index = 0;
      answers = [];
      started = false;
      renderQuestion();
    });
  };

  renderQuestion();
})();
