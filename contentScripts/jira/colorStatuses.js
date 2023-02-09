import { waitForElm } from "./domInteraction.js";

const TODO = ["to do", "planning completed", "reopened", "stuck"];
const IN_PLANNING = ["to plan", "in planning"];
const IN_PROGRESS = [
  "in progress",
  "in review",
  "validation needed",
  "in test env",
];
const DEV_COMPLETED = ["qa in progress", "qa done", "in production", "in ol"];
const DONE = ["can't reproduce", "done", "won't do"];
const ALL_STATUSES = [
  ...TODO,
  ...IN_PLANNING,
  ...IN_PROGRESS,
  ...DEV_COMPLETED,
  ...DONE,
];
////////////////////////////////////////////////////////////////////////

export const colorStatuses = async () => {
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

////////////////////////////////////////

export const createStatusFilterButtons = async () => {
  waitForElm(".ghx-assigned-work-stats").then(() => {
    const backlogHeader = document.querySelector("#ghx-header");
    const allStatusSpans = document.getElementsByClassName("ghx-extra-field");
    const allStatusSpansArr = Array.prototype.slice.call(allStatusSpans);

    let allUniqueStatusSpans = [];
    let allStatusesTexts = [...ALL_STATUSES];
    for (const statusSpan of allStatusSpansArr) {
      if (allStatusesTexts.includes(statusSpan.textContent.toLowerCase())) {
        allUniqueStatusSpans = [...allUniqueStatusSpans, statusSpan];
        allStatusesTexts = allStatusesTexts.filter(
          (val) => val !== statusSpan.textContent.toLowerCase()
        );
      }
    }

    for (let uniqueStatusSpan of allUniqueStatusSpans) {
      const child = uniqueStatusSpan.cloneNode(true);
      child.onclick = () => {
        toggleStatusVisibility(child);
      };
      backlogHeader.appendChild(child);
    }
  });
};

const toggleStatusVisibility = async (selectedStatusSpan) => {
  const allStatusSpans = document.getElementsByClassName("ghx-extra-field");
  const allStatusSpansArr = Array.prototype.slice.call(allStatusSpans);

  for (const statusSpan of allStatusSpansArr) {
    if (
      statusSpan.textContent.toLowerCase() ===
      selectedStatusSpan.textContent.toLowerCase()
    ) {
      const ticketDiv = statusSpan.parentElement.parentElement.parentElement;
      if (ticketDiv.className.includes("js-issue-extra-fields-supported")) {
        const visibility = ticketDiv.style.visibility;
        if (!visibility || visibility === "visible") {
          ticketDiv.style.visibility = "hidden";
          ticketDiv.style.height = "0px";
        } else if (visibility === "hidden") {
          ticketDiv.style.visibility = "visible";
          ticketDiv.style.height = "auto";
        }
      }
    }
  }

  let opacity = selectedStatusSpan.style.opacity;
  if (!opacity || opacity == 1) {
    selectedStatusSpan.style.opacity = 0.5;
  } else {
    selectedStatusSpan.style.opacity = 1;
  }
};
