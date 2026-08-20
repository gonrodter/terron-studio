import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import contactHandler from "./api/contact.js";

function contactApiPlugin() {
  return {
    name: "terron-contact-api",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (request, response) => {
        try {
          const chunks = [];
          let size = 0;

          for await (const chunk of request) {
            size += chunk.length;
            if (size > 32_000) {
              response.statusCode = 413;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify({ error: "Payload too large" }));
              return;
            }
            chunks.push(chunk);
          }

          request.body = chunks.length
            ? JSON.parse(Buffer.concat(chunks).toString("utf8"))
            : {};
          response.status = (statusCode) => {
            response.statusCode = statusCode;
            return response;
          };
          response.json = (payload) => {
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify(payload));
            return response;
          };

          await contactHandler(request, response);
        } catch (error) {
          console.error("Local contact endpoint failed", error);
          if (!response.headersSent) {
            response.statusCode = 400;
            response.setHeader("Content-Type", "application/json");
          }
          if (!response.writableEnded) {
            response.end(JSON.stringify({ error: "Invalid request" }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"].forEach((key) => {
    if (env[key]) process.env[key] = env[key];
  });

  return {
    plugins: [vue(), contactApiPlugin()],
  };
});
