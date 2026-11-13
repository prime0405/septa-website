/**
 * Everyday-workplace photographs, used as card covers.
 *
 * These are generic illustrative frames — a meeting, a monitoring desk, a phone in hand, a
 * recruiter's desk — not documentation. No client, product or team photography exists for this
 * site yet, so nothing here is captioned as Septa work. The mapping is by hash so a card keeps the
 * same picture between renders and between pages without anyone having to maintain a list.
 */
const PHOTOS = [
  "/img/work/delivery-meeting.webp",
  "/img/work/support-monitoring.webp",
  "/img/work/mobile-in-use.webp",
  "/img/work/hiring-desk.webp",
];

export function photoFor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return PHOTOS[h % PHOTOS.length];
}
