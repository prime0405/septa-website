/*
 * Derives the partner strip's colour lockups from the mono SVGs Septa supplied.
 *
 * The strip used to cross-fade a tight-viewBox silhouette into a raster photograph of a logo. Those
 * rasters were 4320x3240 canvases that were 87% white margin, one of them was the icon without the
 * wordmark, and one was a logo on a navy plate — so hovering changed the mark's size, its shape and
 * its background all at once. Recolouring the supplied geometry instead keeps both states on the
 * same paths, which is what makes the reveal a colour change and nothing else.
 *
 * Colours are sampled from the supplied colour artwork in public/partners/color, not chosen:
 *   Atos    #0596FF  (10.6% of atos.png)
 *   Enyata  #7557D3 icon / #000000 wordmark (enyata.png)
 *   MTN     #FFDD00  (mtn.webp)
 * Blusalt and Halogen already ship in colour in their mono file, and Toviri is a single #1E3A8A.
 *
 * Run: node scripts/partner-marks.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
const ROOT = new URL("../public/partners/", import.meta.url);
const read = (f) => readFileSync(new URL(f, ROOT), "utf8");
const write = (f, s) => writeFileSync(new URL(f, ROOT), s);

/** Give the root real pixel dimensions: an SVG with only a viewBox has no intrinsic size, and a
 *  `height: n; width: auto` box collapses to 0x0 without them. */
function sizeRoot(svg) {
  const vb = svg.match(/viewBox="([\d.\-\s]+)"/);
  const wh = svg.match(/<svg\b[^>]*\swidth="([\d.]+)"[^>]*\sheight="([\d.]+)"/);
  const box = vb ? vb[1].trim().split(/[\s,]+/).map(Number).slice(2) : wh && [wh[1], wh[2]];
  if (!box) return svg;
  const [w, h] = box.map(Number);
  return svg.replace(/<svg\b([^>]*)>/, (m, attrs) => {
    const clean = attrs.replace(/\s(width|height|class)="[^"]*"/g, "");
    return `<svg${clean} width="${+w.toFixed(2)}" height="${+h.toFixed(2)}">`;
  });
}

const out = {};

/* Atos: one evenodd path, no fill of its own. */
out.atos = sizeRoot(
  read("atos.svg").replace(".st0 {", ".st0 {\n        fill: #0596FF;"),
);

/* Enyata: paths 0-5 are the four-quadrant icon, 6-11 are the wordmark. */
{
  let i = 0;
  out.enyata = sizeRoot(
    read("enyata.svg").replace(/fill="white"/g, () => `fill="${i++ < 6 ? "#7557D3" : "#000000"}"`),
  );
}

/* MTN: the single path is the oval ring plus the letters. The yellow field goes behind it. */
out.mtn = sizeRoot(
  read("mtn.svg").replace(
    /<path class="cls-1"/,
    '<ellipse cx="283.465" cy="141.73" rx="283.465" ry="141.73" fill="#FFDD00"/><path class="cls-1"',
  ),
);

/* Preppod: the first path is the seven-letter wordmark, white because the supplied lockup is drawn
   for a dark ground. On the strip's light band it needs the dark counterpart; the two white paths
   inside the blue icon stay white. */
out.preppod = sizeRoot(read("preppod.svg").replace('fill="#fff"', 'fill="#0A1626"'));

/* Already coloured in the supplied file. */
out.blusalt = sizeRoot(read("blusalt.svg"));
out["halogen-group"] = sizeRoot(read("halogen-group.svg"));
out["toviri-uk"] = sizeRoot(read("toviri-uk.svg"));

for (const [name, svg] of Object.entries(out)) {
  write(`color/${name}.svg`, svg);
  const vb = svg.match(/viewBox="([^"]+)"/);
  const box = vb
    ? vb[1].split(/\s+/).map(Number).slice(2)
    : [svg.match(/width="([\d.]+)"/)[1], svg.match(/height="([\d.]+)"/)[1]].map(Number);
  console.log(
    `${name}.svg  ${(svg.length / 1024).toFixed(1)}KB  ratio ${(box[0] / box[1]).toFixed(2)}`,
  );
}