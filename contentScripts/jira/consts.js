export const TODO = [
  "to do",
  "planning completed",
  "reopened",
  "stuck",
  "to plan",
];
export const IN_PLANNING = ["in planning"];
export const IN_PROGRESS = [
  "in progress",
  "in review",
  "validation needed",
  "in test env",
];
export const DEV_COMPLETED = ["qa in progress", "in production", "in ol"];
export const DONE = ["can't reproduce", "qa done", "done", "won't do"];
export const ALL_STATUSES = [
  ...TODO,
  ...IN_PLANNING,
  ...IN_PROGRESS,
  ...DEV_COMPLETED,
  ...DONE,
];

export const STATUSES_CONTAINER_ID = "jaid-statuses-container";
export const MULTISELECT_BUTTONS_CONTAINER_ID =
  "jaid-multiselect-buttons-container";
export const JIRA_AID_SHOW_STATUS = "jaid-show-status";

export const COLORS = {
  TODO: "#B2B2B2",
  IN_PLANNING: "#f6b26b",
  IN_PROGRESS: "#9ADCFF",
  DEV_COMPLETED: "#ffe77d",
  DONE: "#A0D995",
  MULTISELECT_BUTTON_TEXT: "#42526E",
  MULTISELECT_BUTTON_TEXT_HOVER: "#B2B2B2",
};
