import { waitForElm } from "./domInteraction.js";
import {
  TODO,
  IN_PLANNING,
  IN_PROGRESS,
  DEV_COMPLETED,
  DONE,
  COLORS,
  JIRA_AID_SHOW_STATUS,
} from "./consts.js";

export const redesignStatuses = async () => {
  waitForElm(".ghx-extra-field").then(() => {
    const statusSpans = document.getElementsByClassName("ghx-extra-field");
    for (let statusSpan of statusSpans) {
      setStatusSpanDesign(statusSpan);
    }
  });
};

const setStatusSpanDesign = (statusSpan) => {
  statusSpan.style.padding = "2px 8px 2px 8px";
  statusSpan.style.borderRadius = "3px";
  statusSpan.style.cursor = "pointer";
  statusSpan.setAttribute("jaid-element", "colored-status");
  getStatusSpanContainingDiv(statusSpan).setAttribute(
    "jaid-element",
    "status-span-container"
  );
  if (statusSpan.textContent === "WON'T DO") {
    console.log(statusSpan);
  }
  getStatusSpanContainingDiv(statusSpan).setAttribute(
    "jaid-status",
    statusSpan.textContent.toLowerCase()
  );

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

const observer = new MutationObserver(redesignStatuses);

observer.observe(document.getElementById("gh"), {
  childList: true,
  subtree: true,
});

const setTicketVisibility = (ticketDiv, newVisibility) => {
  if (newVisibility === "false") {
    ticketDiv.style.visibility = "hidden";
    ticketDiv.style.height = "0px";
  } else {
    ticketDiv.style.visibility = "visible";
    ticketDiv.style.height = "auto";
  }
};

export const bulkSetTicketVisibility = async (selector, visibiility) => {
  const AllAffectedTickets = document.querySelectorAll(selector);
  for (const affectedTickets of AllAffectedTickets) {
    setTicketVisibility(affectedTickets, visibiility);
  }
};

export const toggleStatusVisibility = async (selectedStatusSpan) => {
  const AllAffectedTickets = document.querySelectorAll(
    `[jaid-status="${selectedStatusSpan.textContent.toLowerCase()}"]`
  );
  for (const affectedTickets of AllAffectedTickets) {
    setTicketVisibility(
      affectedTickets,
      selectedStatusSpan.getAttribute(JIRA_AID_SHOW_STATUS)
    );
  }

  // get the status text and the new JIRA_AID_SHOW_STATUS
  // querySelectorAll for all those statuses and set their css accordingli

  // const allStatusSpans = document.getElementsByClassName("ghx-extra-field");
  // const allStatusSpansArr = Array.prototype.slice.call(allStatusSpans);

  // for (const statusSpan of allStatusSpansArr) {
  //   if (
  //     areStringsEqual(statusSpan.textContent, selectedStatusSpan.textContent)
  //   ) {
  //     const ticketDiv = getStatusSpanContainingDiv(statusSpan);
  //     if (ticketDiv.className.includes("js-issue-extra-fields-supported")) {
  //       const visibility = ticketDiv.style.visibility;
  //       if (!visibility || visibility === "visible") {
  //         ticketDiv.style.visibility = "hidden";
  //         ticketDiv.style.height = "0px";
  //       } else if (visibility === "hidden") {
  //         ticketDiv.style.visibility = "visible";
  //         ticketDiv.style.height = "auto";
  //       }
  //     }
  //   }
  // }
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
