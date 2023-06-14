import { redesignStatuses } from "./tickets.js";
import { createJiraAidButtonsBar } from "./jiraAidButtonsBar.js";

const main = () => {
  redesignStatuses();
  createJiraAidButtonsBar();
};
main();
