/*
On page init:
1. color all statuses
2. give each ticket div a jaid attribute that will alow us find it easily
3. create buttons bar
*/

import { waitForElm } from "./domInteraction.js";
import {
  TODO,
  IN_PLANNING,
  IN_PROGRESS,
  DEV_COMPLETED,
  DONE,
  ALL_STATUSES,
  STATUSES_CONTAINER_ID,
  MULTISELECT_BUTTONS_CONTAINER_ID,
  JIRA_AID_SHOW_STATUS,
  COLORS,
} from "./consts.js";

export const redesignStatuses = async () => {
  waitForElm(".ghx-extra-field").then(() => {
    const statusSpans = document.getElementsByClassName("ghx-extra-field");
    for (let statusSpan of statusSpans) {
      setStatusSpanDesign(statusSpan);
    }
  });
};

// export const colorStatuses = async () => {
//   waitForElm(".ghx-extra-field").then(() => {
//     const spans = document.getElementsByClassName("ghx-extra-field");
//     setStatusSpanDesign(spans);
//   });
// };

const setStatusSpanDesign = (statusSpan) => {
  statusSpan.style.padding = "2px 8px 2px 8px";
  statusSpan.style.borderRadius = "3px";
  statusSpan.style.cursor = "pointer";
  statusSpan.setAttribute("jaid-element", "colored-status");
  getStatusSpanContainingDiv(statusSpan).setAttribute(
    "jaid-element",
    "status-span-container"
  );
  // getStatusSpanContainingDiv(statusSpan).setAttribute(
  //   "jaid-status",
  //   statusSpan.textContent.toLowerCase()
  // );

  if (TODO.includes(statusSpan.textContent.toLowerCase())) {
    statusSpan.style.backgroundColor = COLORS.TODO;
  } else if (IN_PLANNING.includes(statusSpan.textContent.toLowerCase())) {
    statusSpan.style.backgroundColor = COLORS.IN_PLANNING;
  } else if (IN_PROGRESS.includes(statusSpan.textContent.toLowerCase())) {
    statusSpan.style.backgroundColor = COLORS.IN_PROGRESS;
  } else if (DEV_COMPLETED.includes(statusSpan.textContent.toLowerCase())) {
    statusSpan.style.backgroundColor = COLORS.DEV_COMPLETED;
  } else if (DONE.includes(statusSpan.textContent.toLowerCase())) {
    statusSpan.style.backgroundColor = COLORS.DONE;
  }
};

const getStatusSpanContainingDiv = (statusSpan) => {
  return statusSpan.parentElement.parentElement.parentElement;
};

const addContainerStyle = (el, id) => {
  el.id = id;
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
    if (el.getAttribute(JIRA_AID_SHOW_STATUS) === "true") {
      el.style.opacity = 1;
    }
  };
};

const createMultiselectButton = ({
  parent,
  buttonTitle,
  buttonID,
  onClick,
}) => {
  const multiselectButton = document.createElement("p");
  multiselectButton.id = buttonID;
  multiselectButton.innerHTML = buttonTitle;

  multiselectButton.style.margin = "5px";
  multiselectButton.style.textDecoration = "underline";
  multiselectButton.style.alignSelf = "flex-end";
  multiselectButton.style.cursor = "pointer";
  multiselectButton.style.color = "#42526E";

  multiselectButton.onmouseover = () => {
    multiselectButton.style.color = "#B2B2B2";
  };
  multiselectButton.onmouseout = () => {
    multiselectButton.style.color = "#42526E";
  };
  multiselectButton.onclick = onClick;
  return multiselectButton;
};

const resetClickedStatuses = () => {
  bulkToggleVisibility(`[${JIRA_AID_SHOW_STATUS}="false"]`);
};

const clearAllStatusSelection = () => {
  bulkToggleVisibility(`[${JIRA_AID_SHOW_STATUS}="true"]`);
};

// const ShowCompletedTasks = () => {
//   // const completed = [...DEV_COMPLETED, ...DONE];
//   const completedTasksButtons = [
//     document.querySelector("[data-tooltip='Status: Done']"),
//     // document.querySelector("[data-tooltip='Status: CAN&#39;T REPRODUCE']"),
//   ];
//   bulkSelectStatuses(completedTasksButtons, "true");
// };

const bulkToggleVisibility = (selector) => {
  const statuesesContainer = document.getElementById(STATUSES_CONTAINER_ID);
  const selectedStatusArray = statuesesContainer.querySelectorAll(selector);
  for (const status of selectedStatusArray) toggleStatusVisibility(status);
};

// bug to fix: currently we handle only the selected statuses and make sure they are visible (and we do that poorly too).
// we need to also make the rest of the statuses not visible.
// const bulkSelectStatuses = (selectedStatusButtonsArray) => {
//   for (const status of selectedStatusButtonsArray) {
//     if (selectedStatusButtonsArray.includes(status)) {
//       setStatusVisibility(status, "true");
//     } else {
//       setStatusVisibility(status, "false");
//     }
//   }
// };

// const observer = new MutationObserver(colorStatuses);
const observer = new MutationObserver(redesignStatuses);

observer.observe(document.getElementById("gh"), {
  childList: true,
  subtree: true,
});

////////////////////////////////////////

export const createStatusFilterButtons = async () => {
  waitForElm(".ghx-assigned-work-stats").then(() => {
    const backlogHeader = document.querySelector("#ghx-header");
    const statusesContainer = document.createElement("div");
    addContainerStyle(statusesContainer, STATUSES_CONTAINER_ID);
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
      child.setAttribute(JIRA_AID_SHOW_STATUS, "true");
      addStatusButtonStyle(child);
      child.onclick = () => {
        toggleStatusVisibility(child);
      };
      statusesContainer.appendChild(child);
    }

    const jiraAidButtonsContainer = document.createElement("div");
    jiraAidButtonsContainer.style.display = "block";

    const multiselectButtonsDiv = document.createElement("div");
    addContainerStyle(multiselectButtonsDiv, MULTISELECT_BUTTONS_CONTAINER_ID);

    const selectAllButton = createMultiselectButton({
      buttonTitle: "Select All",
      buttonID: "select-all-button",
      onClick: () => {
        resetClickedStatuses();
      },
    });
    const clearSelectionButton = createMultiselectButton({
      buttonTitle: "Clear Selection",
      buttonID: "clear-selection-button",
      onClick: () => {
        clearAllStatusSelection();
      },
    });
    // const completedTasksButton = createMultiselectButton({
    //   buttonTitle: "Completed Tasks",
    //   buttonID: "ompleted-tasks-button",
    //   onClick: () => {
    //     ShowCompletedTasks();
    //   },
    // });
    multiselectButtonsDiv.appendChild(selectAllButton);
    multiselectButtonsDiv.appendChild(clearSelectionButton);
    // multiselectButtonsDiv.appendChild(completedTasksButton);
    jiraAidButtonsContainer.appendChild(statusesContainer);
    jiraAidButtonsContainer.appendChild(multiselectButtonsDiv);

    backlogHeader.appendChild(jiraAidButtonsContainer);
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
      const ticketDiv = getStatusSpanContainingDiv(statusSpan);
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

  const clicked = selectedStatusSpan.getAttribute(JIRA_AID_SHOW_STATUS);
  if (!clicked || clicked === "true") {
    selectedStatusSpan.style.opacity = 0.5;
    selectedStatusSpan.setAttribute(JIRA_AID_SHOW_STATUS, "false");
  } else {
    selectedStatusSpan.style.opacity = 1;
    selectedStatusSpan.setAttribute(JIRA_AID_SHOW_STATUS, "ture");
  }
};

// const setStatusVisibility = async (selectedStatusSpan, visibility) => {
//   const board = document.getElementById("ghx-content-main");
//   const allStatusSpans = board.getElementsByClassName("ghx-extra-field");
//   const allStatusSpansArr = Array.prototype.slice.call(allStatusSpans);

//   for (const statusSpan of allStatusSpansArr) {
//     const ticketDiv = getStatusSpanContainingDiv(statusSpan);
//     if (ticketDiv.className.includes("js-issue-extra-fields-supported")) {
//       if (
//         statusSpan.textContent.toLowerCase() ===
//         selectedStatusSpan.textContent.toLowerCase()
//       ) {
//         console.log(ticketDiv);
//         ticketDiv.style.visibility = "visible";
//         ticketDiv.style.height = "auto";
//       } else {
//         ticketDiv.style.visibility = "hidden";
//         ticketDiv.style.height = "0px";
//       }
//     }
//   }
//   if (visibility === "false") {
//     selectedStatusSpan.style.opacity = 0.5;
//     selectedStatusSpan.setAttribute(JIRA_AID_SHOW_STATUS, "true");
//   } else {
//     selectedStatusSpan.style.opacity = 1;
//     selectedStatusSpan.setAttribute(JIRA_AID_SHOW_STATUS, "false");
//   }
// };
