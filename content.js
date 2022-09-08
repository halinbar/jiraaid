const waitForElm = (selector) => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

const TODO = ["to do", "planning completed", "reopened", "stuck"];
const IN_PLANNING = ["to plan", "in planning"];
const IN_PROGRESS = ["in ol", "in progress"];
const IN_REVIEW = [
  "in review",
  "pending qa",
  "qa completed",
  "qa in progress",
  "validation needed",
];
const DEV_COMPLETED = [
  "pending stg deployment",
  "in stg",
  "pending prod deployment",
];
const DONE = ["can't reproduce", "done", "in production", "won't do"];

////////////////////////////////////////////////////////////////////////

const colorStatuses = () => {
  waitForElm(".ghx-extra-field").then(() => {
    const spans = document.getElementsByClassName("ghx-extra-field");
    setFrames(spans);
    const texts = document.getElementsByClassName("ghx-extra-field-content");
    setTexts(texts);
  });
};

const setFrames = (spans) => {
  for (let span of spans) {
    span.style.padding = "0px 8px 0px 8px";
    span.style.border = "1px solid black";
    span.style.borderRadius = "6px";
    if (TODO.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#101010";
    } else if (IN_PLANNING.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#FDDA0D";
    } else if (IN_PROGRESS.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#6495ED";
    } else if (IN_REVIEW.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#ADD8E6";
    } else if (DEV_COMPLETED.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#E4D00A";
    } else if (DONE.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#4CBB17	";
    }
  }
};

const setTexts = (texts) => {
  for (let text of texts) {
    if (TODO.includes(text.textContent.toLowerCase())) {
      text.style.color = "#ffffff";
    } else if (IN_PLANNING.includes(text.textContent.toLowerCase())) {
    } else if (IN_PROGRESS.includes(text.textContent.toLowerCase())) {
      text.style.color = "#ffffff";
    } else if (IN_REVIEW.includes(text.textContent.toLowerCase())) {
    } else if (DEV_COMPLETED.includes(text.textContent.toLowerCase())) {
    } else if (DONE.includes(text.textContent.toLowerCase())) {
    }
  }
};

const observer = new MutationObserver(colorStatuses);

observer.observe(document.getElementById("gh"), {
  childList: true,
  subtree: true,
});

colorStatuses();
