import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import App from "./App.vue";

export async function render(path) {
  const app = createSSRApp(App, { initialPath: path });
  return renderToString(app);
}
