import { createApp, createSSRApp } from "vue";
import "@fontsource-variable/inter";
import "@fontsource/caveat/latin-700.css";
import "@fontsource/phudu/latin-500.css";
import "@fontsource/phudu/latin-600.css";
import "@fontsource/phudu/latin-700.css";
import "@fontsource/phudu/latin-800.css";
import App from "./App.vue";
import { captureException, initAnalytics } from "./analytics.js";
import "../styles.css";

const mountElement = document.querySelector("#app");
const app = mountElement?.hasChildNodes() ? createSSRApp(App) : createApp(App);

app.config.errorHandler = (err) => {
  captureException(err);
  console.error(err);
};

app.mount(mountElement);
initAnalytics();
