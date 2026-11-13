/**
 * Encodes the raw image-generator output in `vibe_images/` into the WebP set the site ships in
 * `public/img/work/`. Run it after regenerating any photograph.
 *
 *   node scripts/encode-photos.mjs
 *
 * Each job centre-crops the source to the delivery aspect at the size the slot actually renders
 * at, which is the same framing `object-cover` applies in the browser, so what is encoded is what
 * is seen. WebP quality 82 is where the set lands at roughly a quarter of the JPEG weight for the
 * same measured difference.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIBE = path.join(ROOT, "vibe_images");
const OUT = path.join(ROOT, "public", "img", "work");
const QUALITY = Number(process.env.QUALITY || 82);

/**
 * [source prefix, shipped name, width, height]
 *
 * One ratio for every subject photograph: 3:2, which is the ratio the section slots are cut to.
 * It is wider than the 4:3 the set shipped in before, and a wider frame is what lets a picture run
 * to an edge and be cropped on a diagonal instead of sitting in a box.
 */
const JOBS = [
  ["ai-model-build", "ai-model-build.webp", 1200, 800],
  ["product-delivery", "product-delivery.webp", 1200, 800],
  ["talent-matching", "talent-matching.webp", 1200, 800],
  ["automation-flows", "automation-flows.webp", 1200, 800],
  ["observability-noc", "observability-noc.webp", 1200, 800],
  ["transformation-floor", "transformation-floor.webp", 1200, 800],
  ["product-in-use", "product-in-use.webp", 1200, 800],
  ["hiring-review", "hiring-review.webp", 1200, 800],
  ["engineering-floor", "engineering-floor.webp", 1600, 900],
];

const sources = fs.readdirSync(VIBE);
let failed = 0;

for (const [prefix, name, width, height] of JOBS) {
  const src = sources.filter((f) => f.startsWith(prefix + "_") && f.endsWith(".png")).pop();
  if (!src) {
    console.error("no source png for", prefix);
    failed += 1;
    continue;
  }
  const target = path.join(OUT, name);
  await sharp(path.join(VIBE, src))
    .resize({ width, height, fit: "cover", position: "centre" })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(target);
  const kb = Math.round(fs.statSync(target).size / 1024);
  console.log(name, width + "x" + height, kb + "KB");
}

process.exit(failed ? 1 : 0);
