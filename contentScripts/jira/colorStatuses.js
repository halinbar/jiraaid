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

const STATUSES_CONTAINER_ID = "jaid-statuses-container";
const CLICKED_STATUS_ATTRIBUTE = "jaid-clicked-status";
////////////////////////////////////////////////////////////////////////

export const colorStatuses = async () => {
  waitForElm(".ghx-extra-field").then(() => {
    const spans = document.getElementsByClassName("ghx-extra-field");
    setFrames(spans);
  });
};

const setFrames = (spans) => {
  for (let span of spans) {
    span.style.padding = "2px 8px 2px 8px";
    span.style.borderRadius = "3px";
    span.style.cursor = "pointer";

    if (TODO.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#B2B2B2";
    } else if (IN_PLANNING.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#f6b26b";
    } else if (IN_PROGRESS.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#9ADCFF";
    } else if (DEV_COMPLETED.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#ffe77d";
    } else if (DONE.includes(span.textContent.toLowerCase())) {
      span.style.backgroundColor = "#A0D995";
    }
  }
};

const addContainerStyle = (el) => {
  el.id = STATUSES_CONTAINER_ID;
  el.style.display = "flex";
  el.style.flexFlow = "wrap";
  el.style.width = "100%";
};

const addStatusButtonStyle = (el) => {
  el.style.margin = "5px";
  el.style.boxShadow = "2px 5px 5px #e6e6e6";

  el.onmouseover = () => {
    el.style.opacity = 0.5;
  };
  el.onmouseout = () => {
    if (!el.getAttribute(CLICKED_STATUS_ATTRIBUTE)) {
      el.style.opacity = 1;
    }
  };
};

const resetButton = (parent) => {
  const reset = document.createElement("p");
  reset.id = "reset-button";
  reset.innerHTML = "reset";

  reset.style.margin = "5px";
  reset.style.textDecoration = "underline";
  reset.style.alignSelf = "flex-end";
  reset.style.cursor = "pointer";
  reset.style.color = "#42526E";

  reset.onmouseover = () => {
    reset.style.color = "#B2B2B2";
  };
  reset.onmouseout = () => {
    reset.style.color = "#42526E";
  };
  reset.onclick = resetClickedStatuses;
  parent.appendChild(reset);
};

const resetClickedStatuses = () => {
  const statuesesContainer = document.getElementById(STATUSES_CONTAINER_ID);
  const filteredOutStatuses = statuesesContainer.querySelectorAll(
    `[${CLICKED_STATUS_ATTRIBUTE}="true"]`
  );
  for (const status of filteredOutStatuses) toggleStatusVisibility(status);
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
    const statusesContainer = document.createElement("div");
    addContainerStyle(statusesContainer);
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
      addStatusButtonStyle(child);
      child.onclick = () => {
        toggleStatusVisibility(child);
      };
      statusesContainer.appendChild(child);
    }
    resetButton(statusesContainer);
    backlogHeader.appendChild(statusesContainer);
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

  let clicked = selectedStatusSpan.getAttribute(CLICKED_STATUS_ATTRIBUTE);
  if (!clicked) {
    selectedStatusSpan.style.opacity = 0.5;
    selectedStatusSpan.setAttribute(CLICKED_STATUS_ATTRIBUTE, true);
  } else {
    selectedStatusSpan.style.opacity = 1;
    selectedStatusSpan.removeAttribute(CLICKED_STATUS_ATTRIBUTE);
  }
};
