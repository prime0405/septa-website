/**
 * Decorative brand plates.
 *
 * These are generated abstract artwork in the Septa palette, not documentation: no client,
 * product or team photography exists for this site yet, so nothing here pretends to depict real
 * work. The mapping is by hash so a card keeps the same plate between renders and between pages
 * without anyone having to maintain a list.
 */
const PLATES = [
  "/img/plate-network.jpg",
  "/img/plate-layers.jpg",
  "/img/plate-flow.jpg",
  "/img/plate-traces.jpg",
];

export function plateFor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return PLATES[h % PLATES.length];
}
