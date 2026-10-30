export type Opening = {
  slug: string;
  title: string;
  discipline: string;
  locations: string[];
  engagement: "Full-time" | "Contract" | "Part-time";
  seniority: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  publishedOn: string;
  closesOn: string | null;
};

/**
 * Published vacancies. Septa has not supplied any openings, so this list is empty and
 * the Careers page shows the "no published openings" state with an expression-of-interest
 * route. Add entries here (or copy the shape from the README) when roles are approved.
 *
 * Do not invent active vacancies — the page renders whatever is in this array.
 */
export const openings: Opening[] = [];

export const openingsNote =
  "Roles appear here as soon as they are approved for publication. Until then, speculative applications are read by the same people who would interview you.";

export const applicationChecklist = [
  "The area of work you want, and one or two sentences on why.",
  "Something you have built, fixed, migrated or improved. Internal tools count.",
  "How you got unstuck in a piece of work that did not go to plan.",
  "Your availability and the kind of engagement you are after.",
];

export const whatHappensNext = [
  {
    title: "A person reads it",
    detail:
      "Applications land in our own submission store. Nobody is screened out by a keyword matcher.",
  },
  {
    title: "We reply either way",
    detail:
      "If there is no matching opening right now, you will still hear back, and we keep your note for the next relevant role.",
  },
  {
    title: "A practical conversation",
    detail:
      "A walkthrough of something you have done, then a technical session with the people you would work with.",
  },
  {
    title: "Clear decision",
    detail: "Feedback on the outcome, including what we would have liked to see more of.",
  },
];
