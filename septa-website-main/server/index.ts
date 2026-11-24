import { config, describeConfig } from "./config.ts";
import { createApp } from "./app.ts";
import { closeStore, initStore } from "./store.ts";

/**
 * Local / persistent-host entry point: open the store, then listen.
 *
 * The same Express app is also run inside a Vercel Function by `api/[...all].ts`; this
 * file is only the long-lived process wrapper.
 */

const app = createApp();

try {
  await initStore();
} catch (error) {
  console.error(`[api] the store (${config.databaseUrl === null ? config.dbPath : "Postgres"}) could not be opened:`, error);
  console.error(
    "[api] fix DATA_DIR / DB_PATH / DATABASE_URL (or its permissions) and start the API again.",
  );
  process.exit(1);
}

const server = app.listen(config.port, config.host, () => {
  console.log(`[api] septa-api listening on http://${config.host}:${config.port}`);
  console.log(`[api] ${describeConfig()}`);
  console.log(
    config.emailDeliveryEnabled
      ? "[api] mode=live — every stored submission is also emailed to the inbox address."
      : "[api] mode=record-only — submissions are stored but never emailed until SMTP is configured.",
  );
});

function shutdown(signal: string): void {
  console.log(`[api] ${signal} received — closing.`);
  server.close(() => {
    void closeStore().finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
