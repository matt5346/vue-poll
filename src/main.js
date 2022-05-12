import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { VaInput, VaButton, VaSelect, VaCardActions, VaAlert, VaCardTitle, VaChip, VaCard, VaForm } from "vuestic-ui";

import "vuestic-ui/dist/vuestic-ui.css";

createApp(App)
  .use(store)
  .use(router)
  .component("va-input", VaInput)
  .component("va-button", VaButton)
  .component("va-select", VaSelect)
  .component("va-alert", VaAlert)
  .component("va-form", VaForm)
  .component("va-card", VaCard)
  .component("va-card-actions", VaCardActions)
  .component("va-card-title", VaCardTitle)
  .component("va-chip", VaChip)
  .mount("#app");
