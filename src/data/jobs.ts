/**
 * The single source of open roles. Add, edit or remove entries here; the careers page and the
 * application-form dropdown both read from this array, and an empty array shows the
 * "No Open Roles at the Moment" message instead of the role cards.
 *
 * The document states no location, salary or closing date for either role, so none is claimed.
 */
export type RequirementGroup = { heading: string; items: string[] };

export type Opening = {
  slug: string;
  title: string;
  groups: RequirementGroup[];
};

export const openings: Opening[] = [
  {
    slug: "sales-manager",
    title: "Sales Manager",
    groups: [
      {
        heading: "Education & Experience",
        items: [
          "Bachelor's degree in Business, Marketing, or a related field.",
          "Proven experience in sales, with 2-3+ years in a managerial or supervisory role.",
        ],
      },
      {
        heading: "Skills",
        items: [
          "Strong leadership and team management abilities.",
          "Excellent communication and interpersonal skills.",
          "Ability to develop and implement sales strategies.",
          "Proficient in CRM tools and sales analytics.",
        ],
      },
      {
        heading: "Knowledge",
        items: [
          "Deep understanding of the sales process and customer lifecycle.",
          "Market knowledge in the relevant industry.",
          "Familiarity with target setting, forecasting, and performance tracking.",
        ],
      },
      {
        heading: "Traits",
        items: [
          "Results-driven and highly motivated.",
          "Strategic thinker with problem-solving skills.",
          "Adaptable and able to thrive in a fast-paced environment.",
        ],
      },
    ],
  },
  {
    slug: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    groups: [
      {
        heading: "Education & Experience",
        items: [
          "Bachelor's degree in Marketing, Communications, Business, or a related field.",
          "2-3 years of hands-on experience in digital marketing.",
          "Proven success in managing digital campaigns and improving online visibility.",
        ],
      },
      {
        heading: "Technical Skills",
        items: [
          "Proficient in Google Ads, Facebook/Meta Ads Manager, and SEO/SEM techniques.",
          "Experience with email marketing tools (e.g., Mailchimp, HubSpot).",
          "Comfortable using Google Analytics, Search Console, and reporting dashboards.",
          "Familiarity with CMS platforms like WordPress.",
          "Basic understanding of HTML/CSS is a plus.",
        ],
      },
      {
        heading: "Core Skills",
        items: [
          "Strong writing and content creation abilities.",
          "Analytical mindset with a focus on performance and ROI.",
          "Ability to manage multiple campaigns and meet deadlines.",
          "Good communication and collaboration skills.",
        ],
      },
    ],
  },
];