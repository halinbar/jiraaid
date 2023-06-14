import { waitForElm } from "./domInteraction.js";
import {
  ALL_STATUSES,
  STATUSES_CONTAINER_ID,
  JIRA_AID_SHOW_STATUS,
} from "./consts.js";
import { toggleStatusVisibility } from "./tickets.js";
import { createMultiselectButtonsDiv } from "./multiSelectButtons.js";

export const createJiraAidButtonsBar = async () => {
  waitForElm(".ghx-assigned-work-stats").then(() => {
    const statusesContainer = createStatusesContainer();
    const multiselectButtonsDiv = createMultiselectButtonsDiv();
    const jiraAidButtonsContainer = createJiraAidButtonsContainer();
    jiraAidButtonsContainer.appendChild(statusesContainer);
    jiraAidButtonsContainer.appendChild(multiselectButtonsDiv);
    const backlogHeader = document.querySelector("#ghx-header");
    backlogHeader.appendChild(jiraAidButtonsContainer);
  });
};

const createJiraAidButtonsContainer = () => {
  const jiraAidButtonsContainer = document.createElement("div");
  jiraAidButtonsContainer.style.display = "block";
  return jiraAidButtonsContainer;
};

const createStatusesContainer = () => {
  const statusesContainer = document.createElement("div");
  addContainerStyle(statusesContainer, STATUSES_CONTAINER_ID);

  const uniqueStatusSpans = getUniqueStatusesSpans();
  for (const statusText of ALL_STATUSES) {
    if (Object.keys(uniqueStatusSpans).includes(statusText)) {
      const statusButton = createStatusButton(
        uniqueStatusSpans[statusText],
        statusText
      );
      statusesContainer.appendChild(statusButton);
    }
  }
  return statusesContainer;
};

const createStatusButton = (statusSpan, statusText) => {
  const statusButton = statusSpan.cloneNode(true);
  statusButton.setAttribute("jaid-status-display-button", statusText);
  statusButton.setAttribute(JIRA_AID_SHOW_STATUS, "true");
  addStatusButtonStyle(statusButton);
  statusButton.onclick = () => {
    setButtonState(statusButton);
    toggleStatusVisibility(statusButton);
  };
  return statusButton;
};

const setButtonState = (statusButton) => {
  const showStatus = statusButton.getAttribute(JIRA_AID_SHOW_STATUS);
  if (showStatus === "true") {
    statusButton.style.opacity = 0.5;
    statusButton.setAttribute(JIRA_AID_SHOW_STATUS, "false");
  } else {
    statusButton.style.opacity = 1;
    statusButton.setAttribute(JIRA_AID_SHOW_STATUS, "true");
  }
};

const getUniqueStatusesSpans = () => {
  const allStatusSpans = new Set(
    document.querySelectorAll("[jaid-element='colored-status']")
  );
  const uniqueStatusSpans = {};
  for (const statusSpan of allStatusSpans) {
    const statusText = statusSpan.childNodes[0].textContent.toLowerCase();
    if (!Object.keys(uniqueStatusSpans).includes(statusText)) {
      uniqueStatusSpans[statusText] = statusSpan;
    }
  }
  return uniqueStatusSpans;
};

export const addContainerStyle = (el, id) => {
  el.id = id;
  el.style.display = "flex";
  el.style.flexFlow = "wrap";
  el.style.width = "100%";
};

const addStatusButtonStyle = (el) => {
  el.style.margin = "5px";
  el.style.boxShadow = "2px 5px 5px #e6e6e6";

  el.onmouseover = () => {
    el.style.opacity = 0.4;
  };
  el.onmouseout = () => {
    el.style.opacity =
      el.getAttribute(JIRA_AID_SHOW_STATUS) === "true" ? 1 : 0.6;
  };
};
