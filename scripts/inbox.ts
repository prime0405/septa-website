import { existsSync } from "node:fs";
import { config, storageLabel } from "../server/config.ts";
import {
  closeStore,
  countByStream,
  listInbox,
  streams,
  summarize,
  type Stream,
  type StoredSubmission,
} from "../server/store.ts";

/**
 * `npm run api:inbox` — reads the submission store and prints recent rows.
 *
 *   npm run api:inbox                       last 20 across all streams
 *   npm run api:inbox -- --stream contact   one stream only
 *   npm run api:inbox -- --limit 50         more rows
 *   npm run api:inbox -- --json             machine-readable output
 *   npm run api:inbox -- --full             show every stored payload field
 *
 * The deployed store is Postgres on Vercel, so reading production rows needs its
 * environment variables: `vercel env run -- npm run api:inbox`.
 */

interface Options {
  stream: Stream | null;
  limit: number;
  json: boolean;
  full: boolean;
  help: boolean;
  error: string | null;
}

function parseArgs(argv: string[]): Options {
  const options: Options = { stream: null, limit: 20, json: false, full: false, help: false, error: null };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--json") options.json = true;
    else if (arg === "--full") options.full = true;
    else if (arg === "--stream" || arg === "-s") {
      const value = argv[index + 1];
      index += 1;
      if (!value || !(streams as readonly string[]).includes(value)) {
        options.error = `--stream expects one of: ${streams.join(", ")}`;
      } else {
        options.stream = value as Stream;
      }
    } else if (arg.startsWith("--stream=")) {
      const value = arg.slice("--stream=".length);
      if (!(streams as readonly string[]).includes(value)) {
        options.error = `--stream expects one of: ${streams.join(", ")}`;
      } else {
        options.stream = value as Stream;
      }
    } else if (arg === "--limit" || arg === "-n") {
      const value = Number.parseInt(argv[index + 1] ?? "", 10);
      index += 1;
      if (!Number.isFinite(value) || value <= 0) options.error = "--limit expects a positive integer";
      else options.limit = Math.min(500, value);
    } else if (arg.startsWith("--limit=")) {
      const value = Number.parseInt(arg.slice("--limit=".length), 10);
      if (!Number.isFinite(value) || value <= 0) options.error = "--limit expects a positive integer";
      else options.limit = Math.min(500, value);
    } else {
      options.error = `Unrecognised argument: ${arg}`;
    }
  }

  return options;
}

function formatCreated(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function forwardedLabel(submission: StoredSubmission): string {
  return submission.forwarded ? "emailed" : "stored only";
}

function printHelp(): void {
  console.log(`
Septa submission inbox (reads ${storageLabel()})

  npm run api:inbox
  npm run api:inbox -- --stream contact|requests|applications|newsletter
  npm run api:inbox -- --limit 50
  npm run api:inbox -- --json
  npm run api:inbox -- --full

Columns: created, stream, id, key fields, delivery status, CV location.
Rows are read from the database — nothing is sent to any mailbox by this command.
`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }
  if (options.error) {
    console.error(`inbox: ${options.error}\nRun "npm run api:inbox -- --help".`);
    process.exit(1);
  }
  if (config.databaseUrl === null && !existsSync(config.dbPath)) {
    console.log(`No submissions yet — ${config.dbPathDisplay} does not exist.`);
    console.log("Start the API (npm run start:api) and submit a form, then run this again.");
    return;
  }

  const rows = await listInbox(options.stream ?? undefined, options.limit);

  if (options.json) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  if (rows.length === 0) {
    console.log(`No ${options.stream ?? ""} submissions stored yet.`.replace("  ", " "));
    return;
  }

  const counts = await countByStream();
  const column = (value: string, width: number) => value.slice(0, width).padEnd(width);

  console.log(`\nSepta inbox — showing ${rows.length} most recent submission(s)\n`);
  console.log(
    `${column("CREATED", 16)}  ${column("STREAM", 13)}  ${column("ID", 9)}  ${column("DELIVERY", 13)}  ${column("CV", 26)}  DETAILS`,
  );
  for (const row of rows) {
    const cvName = row.cvPath ? String(row.cvPath.split(/[\\/]/).pop()) : "—";
    console.log(
      `${column(formatCreated(row.createdAt), 16)}  ${column(row.stream, 13)}  ${column(row.id.slice(0, 8), 9)}  ${column(forwardedLabel(row), 13)}  ${column(cvName, 26)}  ${summarize(row)}`,
    );
    if (row.forwardNote) console.log(`${" ".repeat(19)}> ${row.forwardNote}`);
    if (options.full) {
      for (const [key, value] of Object.entries(row.payload)) {
        console.log(`      ${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`);
      }
    }
  }
  console.log("");
  console.log(
    `Totals — ${counts.map((entry) => `${entry.stream}: ${entry.total} (${entry.forwarded} emailed)`).join(" · ")}`
  );
  console.log(`Store: ${storageLabel()}`);
  console.log(
    config.emailDeliveryEnabled
      ? `Email delivery: configured (inbox ${config.inboxEmail}).`
      : "Email delivery: NOT configured — submissions are stored only (record-only mode). See README.",
  );
  console.log("");
}

main()
  .catch((error: unknown) => {
    console.error("inbox: the submissions could not be read:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void closeStore();
  });
