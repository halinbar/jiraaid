import { MULTISELECT_BUTTONS_CONTAINER_ID, COLORS } from "./consts.js";
import { addContainerStyle } from "./jiraAidButtonsBar.js";
import { bulkSetTicketVisibility } from "./tickets.js";

export const createMultiselectButtonsDiv = () => {
  const multiselectButtonsDiv = document.createElement("div");
  addContainerStyle(multiselectButtonsDiv, MULTISELECT_BUTTONS_CONTAINER_ID);

  const selectAllButton = createMultiselectButton({
    buttonTitle: "Select All",
    buttonID: "select-all-button",
    onClick: () => {
      selectAllStatuses();
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
  return multiselectButtonsDiv;
};

const createMultiselectButton = ({ buttonTitle, buttonID, onClick }) => {
  const multiselectButton = document.createElement("p");
  multiselectButton.id = buttonID;
  multiselectButton.innerHTML = buttonTitle;

  multiselectButton.style.margin = "5px";
  multiselectButton.style.textDecoration = "underline";
  multiselectButton.style.alignSelf = "flex-end";
  multiselectButton.style.cursor = "pointer";
  multiselectButton.style.color = COLORS.MULTISELECT_BUTTON_TEXT;

  multiselectButton.onmouseover = () => {
    multiselectButton.style.color = COLORS.MULTISELECT_BUTTON_TEXT_HOVER;
  };
  multiselectButton.onmouseout = () => {
    multiselectButton.style.color = COLORS.MULTISELECT_BUTTON_TEXT;
  };
  multiselectButton.onclick = onClick;
  return multiselectButton;
};

const selectAllStatuses = () => {
  const unselectedStatuses = document.querySelectorAll(
    "[jaid-show-status='false']"
  );
  for (const statusFilter of unselectedStatuses) {
    statusFilter.click();
  }
};

const clearAllStatusSelection = () => {
  const selectedStatuses = document.querySelectorAll(
    "[jaid-show-status='true']"
  );
  for (const statusFilter of selectedStatuses) {
    statusFilter.click();
  }
};

// const ShowCompletedTasks = () => {
//   // const completed = [...DEV_COMPLETED, ...DONE];
//   const completedTasksButtons = [
//     document.querySelector("[data-tooltip='Status: Done']"),
//     // document.querySelector("[data-tooltip='Status: CAN&#39;T REPRODUCE']"),
//   ];
//   bulkSelectStatuses(completedTasksButtons, "true");
// };

// const bulkToggleVisibility = (selector) => {
//   const statuesesContainer = document.getElementById(STATUSES_CONTAINER_ID);
//   const selectedStatusArray = statuesesContainer.querySelectorAll(selector);
//   for (const status of selectedStatusArray) toggleStatusVisibility(status);
// };

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
