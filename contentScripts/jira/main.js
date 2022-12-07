import { colorStatuses, createStatusFilterButtons } from "./colorStatuses.js";

colorStatuses().then(() => {
  createStatusFilterButtons();
});
