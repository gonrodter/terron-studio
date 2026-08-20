const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;
const enabled = Boolean(projectToken && apiHost);

let clientPromise = null;

function loadClient() {
  if (!enabled || typeof window === "undefined") return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import("posthog-js").then(({ default: posthog }) => {
      posthog.init(projectToken, {
        api_host: apiHost,
        defaults: "2026-01-30",
        disable_session_recording: true,
        disable_surveys: true,
        advanced_disable_flags: true,
        disable_external_dependency_loading: true,
      });
      return posthog;
    });
  }
  return clientPromise;
}

export function initAnalytics() {
  if (!enabled) {
    if (import.meta.env.DEV) {
      [!projectToken && "VITE_POSTHOG_PROJECT_TOKEN", !apiHost && "VITE_POSTHOG_HOST"]
        .filter(Boolean)
        .forEach((variable) =>
          console.error(
            `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
          )
        );
    }
    return;
  }

  const activationEvents = ["pointerdown", "keydown", "scroll", "touchstart"];
  let fallbackTimer;
  const start = () => {
    activationEvents.forEach((eventName) =>
      window.removeEventListener(eventName, start)
    );
    if (fallbackTimer) window.clearTimeout(fallbackTimer);
    void loadClient();
  };

  activationEvents.forEach((eventName) =>
    window.addEventListener(eventName, start, { once: true, passive: true })
  );
  fallbackTimer = window.setTimeout(start, 10_000);
}

export function captureEvent(eventName, properties) {
  if (!enabled) return;
  void loadClient().then((client) => client?.capture(eventName, properties));
}

export function captureException(error) {
  if (!enabled) return;
  void loadClient().then((client) => client?.captureException(error));
}
