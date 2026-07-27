import { createApp } from "vue";
import posthog from "posthog-js";
import "@fontsource-variable/inter";
import "@fontsource/caveat/latin-400.css";
import "@fontsource/caveat/latin-700.css";
import "@fontsource/phudu/latin-500.css";
import "@fontsource/phudu/latin-600.css";
import "@fontsource/phudu/latin-700.css";
import "@fontsource/phudu/latin-800.css";
import App from "./App.vue";
import "../styles.css";

const phToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const phHost = import.meta.env.VITE_POSTHOG_HOST;

if (phToken && phHost) {
  posthog.init(phToken, { api_host: phHost, defaults: "2026-01-30" });
} else if (import.meta.env.DEV) {
  [!phToken && "VITE_POSTHOG_PROJECT_TOKEN", !phHost && "VITE_POSTHOG_HOST"]
    .filter(Boolean)
    .forEach((v) =>
      console.error(
        `${v} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${v} is configured`
      )
    );
}

const app = createApp(App);

app.config.errorHandler = (err) => {
  if (phToken && phHost) posthog.captureException(err);
  console.error(err);
};

app.mount("#app");
