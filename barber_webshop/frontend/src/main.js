import { createApp } from "vue";
import "./style.css";

import App from "./App.vue";
import Login from "./Login.vue";
import Management from "./Management.vue";

if (document.getElementById("app")) {
  createApp(App).mount("#app");
}

if (document.getElementById("login")) {
  createApp(Login).mount("#login");
}

if (document.getElementById("management")) {
  createApp(Management).mount("#management");
}
