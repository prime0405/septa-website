/**
 * Every string in this file is Septa's own wording, transcribed from the document
 * "SEPTA Website Revamp". Nothing here is written by us. Where the document had a spacing or
 * punctuation slip we corrected the slip, never the sentence.
 */

import { contactServices } from "../shared/schemas";

/* ---------------------------------- landing page ---------------------------------- */

export const hero = {
  headline: "Technology That Moves Your Business Forward.",
  subheadline:
    "We help businesses turn ideas into digital products through AI-assisted and traditional product development, streamline operations with workflow automation, access skilled technology talent, improve system reliability, and drive digital transformation.",
  ctaPrimary: "Explore Our Services",
  ctaSecondary: "Let’s Work Together",
};

/** The three offering blocks that sit directly under the hero, in the document's order. */
export type LandingBlock = {
  key: string;
  label: string;
  headline: string;
  subheading: string;
  cta: string;
  to: string;
  /** Everyday-workplace artwork for this offering, matched to what the block is about. */
  image: string;
  /** What the picture shows, for the text that describes it when the picture cannot. */
  alt: string;
};

export const landingBlocks: LandingBlock[] = [
  {
    key: "ai",
    label: "AI Product Development",
    headline: "Bring Your Product Ideas to Market Faster with AI-Assisted Development",
    subheading:
      "We use AI to accelerate product development, helping you turn your ideas into market-ready products in 4–6 weeks. From concept to launch, we combine AI, product strategy, and engineering that solve user problems and support your business growth.",
    cta: "Explore AI Product Development",
    to: "/services/ai-product-development",
    image: "/img/work/ai-model-build.webp",
    alt: "Two monitors in an engineering room, one showing a model pipeline as a branching node graph and the other a training curve falling above a grid of evaluation panels, with a hand at the keyboard in the foreground",
  },
  {
    key: "traditional",
    label: "Traditional Product Development",
    headline: "Great Products Start With Great Partnerships",
    subheading:
      "We turn ideas into intelligent products that solve real problems, delight users, and drive growth, powered by smart strategy, and thoughtful design.",
    cta: "Build with us",
    to: "/case-studies",
    image: "/img/work/product-delivery.webp",
    alt: "Two colleagues standing at a wall of printed screen flows and coloured notes, one pointing at a step, while a monitor beside them shows a build pipeline with four stages checked and the fifth running",
  },
  {
    key: "talent",
    label: "Talent Solution",
    headline: "Hiring designed to fuel your vision",
    subheading:
      "Connecting you with top tech talents to fuel innovation and accelerate growth.",
    cta: "Hire Top Tech Talents Now",
    to: "/services/talent-solution",
    image: "/img/work/talent-matching.webp",
    alt: "A monitor showing a grid of candidate profiles as abstract avatars with skill bars, two of them joined by a curve, beside a laptop running a video interview",
  },
];

export const advantageIntro =
  "Septa combines modern engineering, product innovation, and AI-powered insights to help organizations scale faster, simplify complexity, and capture opportunities with confidence.";

export const advantagePillars = [
  {
    title: "Intelligent by Design",
    detail: "AI-driven solutions tailored to your goals, never one-size-fits-all.",
  },
  {
    title: "Built to Scale",
    detail: "Flexible products and systems designed to grow with your business.",
  },
  {
    title: "Human-Centered Technology",
    detail: "Smart automation powered by human insight for better decisions.",
  },
  {
    title: "Delivery You Can Trust",
    detail: "Agile execution with transparency, reliability, and measurable results.",
  },
  {
    title: "Proactive, End-to-End Support",
    detail: "Septa AI handles requests, resolves issues, and keeps your product running smoothly.",
  },
];

export const serviceOverview =
  "From startups to enterprises, we craft custom software solutions, provide top-tier tech talent, and upskill professionals for the future of work.";

export const servicesIntro =
  "We help businesses and individuals thrive through product development and tech talent solutions.";

/** The five entries of the document's "OUR SERVICES" list, with the CTA labels it gives each. */
export const serviceListings = [
  {
    slug: "ai-product-development",
    name: "AI Product Development",
    detail:
      "We build intelligent, user-focused products from idea to market-ready launch. We go beyond development; we design and engineer AI-powered solutions that solve real-world problems, adapt to user needs, and scale with your business.",
    cta: "Work with us",
  },
  {
    slug: "talent-solution",
    name: "Talent Solutions",
    detail:
      "The right experts at the right time to support your growth and innovation journey. Need skilled professionals to drive your projects forward? Our talent solutions connect you with experienced tech experts who fit your needs.",
    cta: "The right talent, right when you need it",
  },
  {
    slug: "workflow-automation",
    name: "Workflow Automation",
    detail:
      "Repetitive tasks drain productivity and distract from strategic priorities. Describe your organizational needs. Septa partners with you to identify bottlenecks, map critical workflows, and deliver automation solutions that free your teams from routine tasks, enabling sharper focus, faster execution, and sustainable growth.",
    cta: "Work Smarter, Not Harder",
  },
  {
    slug: "observability-monitoring",
    name: "Observability & Monitoring",
    detail:
      "Data-driven insights keep your systems reliable. Every minute of downtime drains revenue, damages reputation, and stalls growth. Our advanced observability and monitoring services give you real-time visibility into your entire system, proactively detecting threats and pinpointing root causes before they escalate.",
    cta: "Protect my business now",
  },
  {
    slug: "digital-transformation",
    name: "Digital Transformation",
    detail:
      "At Septa, we transform the way businesses operate. By replacing outdated systems with powerful digital solutions, we unlock efficiency, cut costs, and deliver customer experiences that fuel growth. Discover how we can help your business thrive in the digital age.",
    cta: "Experience growth without limits.",
  },
];

/* ------------------------------------ testimonials ------------------------------------ */

/**
 * The four quotes the document supplies for the client testimonial section, attributed exactly as
 * the document attributes them.
 *
 * The document gives no individual authors, no job titles and no photographs, so the section is built
 * on what does exist: the organisation the quote is credited to and the use case it came out of.
 * `org`, `caseSlug` and `kind` are the client name, route and work label already recorded in
 * `src/data/useCases.ts`, and `logo` is the supplied mark for that client where Septa has one on file.
 * EHCC has no supplied artwork, so its entry has no logo and the section shows its name in type
 * rather than inventing one.
 *
 * `knockout` records which ground the supplied artwork was drawn for. Halogen's mark is gold and
 * Preppod's wordmark is white, so both need the Pearl plate; Toviri's lockup is a single dark blue,
 * so it needs the light one. It is a property of the file, not of the client, and it is the only
 * reason the lit plate changes colour as the selection moves.
 */
export const testimonials = [
  {
    quote:
      "Partnering with this team to transform our website has elevated Halogen’s digital presence beyond what we imagined. They didn’t just design a platform, they built a modern, secure, and user-friendly hub that showcases our services and enables seamless client engagement through features like the extranet. Their attention to detail and brand consistency has strengthened client trust and opened new opportunities for engagement. This collaboration set a new benchmark for how we want to be represented online and they delivered it flawlessly.",
    attribution: "Halogen Group",
    org: "Halogen Group",
    caseSlug: "halogen-group",
    kind: "Website and extranet",
    logo: "/partners/halogen-group.svg",
    knockout: true,
  },
  {
    quote:
      "Partnering with this team to build the EHCC Clock-In App was a turning point for us. They went beyond creating an attendance tool; they delivered a powerful platform that gives us real-time insights into punctuality, participation, and departmental growth. The geofencing and role-based access features ensure accountability, while the intuitive dashboards give our leaders the clarity they need. What truly sets them apart is how they turned a simple need into a game-changing solution that has transformed engagement across our entire community.",
    attribution: "EHCC Leadership",
    org: "EHCC",
    caseSlug: "ehcc-clock-in-app",
    kind: "Web and mobile platform",
    knockout: false,
  },
  {
    quote:
      "Partnering with this team brought our vision for Preppod to life in a way that exceeded expectations. They didn’t just build a platform, they created an adaptive learning system that makes music education engaging, measurable, and scalable. From the seamless website to the powerful LMS with secure payments, progress tracking, and role-based dashboards, every detail was thoughtfully designed. Their expertise transformed our idea into a world-class solution and positioned Preppod as a leader in digital education. We couldn’t have asked for a better partner.",
    attribution: "Preppod Team",
    org: "Preppod",
    caseSlug: "preppod",
    kind: "Website and LMS",
    logo: "/partners/preppod.svg",
    knockout: true,
  },
  {
    quote:
      "Partnering with this team has been an exceptional experience. They didn’t just deliver designs, they crafted a seamless, thoughtfully structured experience where every detail, from visuals to overall flow, feels intentional and professional. Their expertise turned our ideas into a polished solution that exceeded expectations, and their collaborative approach made the entire process smooth and inspiring. Working with such dedicated partners has truly been a pleasure, and the results speak for themselves.",
    attribution: "Toviri Team",
    org: "Toviri",
    caseSlug: "toviri",
    kind: "Mobile platform",
    logo: "/partners/toviri-uk.svg",
    knockout: false,
  },
];

/** Section title the document offers for this block, with the alternates it lists. */
export const testimonialTitle = "What Our Clients Say";

/* ------------------------------------ call to action ------------------------------------ */

/** The one closing ask. It is rendered by the footer, so it sits at the end of every page rather
 *  than being repeated as a panel in the middle of a few of them. */
export const ctaBanner = {
  headline: "Let’s Build What’s Next, Together!",
  subheadline:
    "Whether you need an AI-powered product, smarter workflows, or complete product development, Septa is your partner for building the future.",
  cta: "Partner with Septa",
};

/* ---------------------------------------- about page ---------------------------------------- */

export const about = {
  whoWeAreTagline: "Septa, Your partner for trusted, future-ready technology.",
  whoWeAre:
    "At Septa, we are more than a technology partner. We help organizations reimagine how they work, compete, and grow through AI-assisted product development, software engineering, and workflow automation. From turning ideas into market-ready products in 4–6 weeks to streamlining business operations, we deliver technology solutions designed around real business needs.",
  story: [
    "At Septa, we are more than a tech company; we are a team of builders, innovators, and problem-solvers committed to shaping the future of work and technology.",
    "Our strength lies in the diversity of what we do: from AI-powered systems and SaaS platforms to talent solutions that connect organizations with the right people, we design and deliver products that create lasting impact.",
    "We don’t just follow trends, we stay ahead of them. By combining creativity, technical expertise, and business insight, we provide solutions that drive growth, efficiency, and transformation for our clients.",
    "Septa is where technology, talent, and innovation converge to move organizations forward.",
  ],
  strengths: [
    {
      n: "0.1",
      title: "Expertise",
      detail:
        "Our strength lies in the diversity and depth of our team. From AI engineers, product managers, and designers to HR and talent specialists, we bring together cross-functional expertise to deliver end-to-end solutions. Whether it’s building innovative software, providing top-tier talent, or designing scalable learning platforms, we combine technical knowledge with industry best practices to deliver results that matter.",
    },
    {
      n: "0.2",
      title: "Customer-Centric Approach",
      detail:
        "At Septa, we believe your success is our success. We go beyond being service providers; we are partners in your journey. By taking time to understand your unique challenges, we craft tailored solutions that align with your goals, whether in product development, talent acquisition, or business transformation. And because we value long-term partnerships, we provide continuous support to help you adapt, grow, and thrive.",
    },
    {
      n: "0.3",
      title: "Innovation",
      detail:
        "We stay ahead by constantly embracing emerging technologies and industry trends. From AI-driven platforms to cutting-edge digital products, our commitment to innovation allows us to create solutions that bring measurable value, efficiency, and growth to our clients. Innovation isn’t just what we do, it's how we drive lasting impact for businesses and individuals alike.",
    },
  ],
  vision: "To enhance and simplify human interaction with technology.",
  mission:
    "Our mission is to put people at the heart of technology, creating intelligent solutions that simplify work, inspire growth, and unlock opportunities. By combining expertise, innovation, and AI, we partner with our clients to shape solutions that make everyday life and business better.",
  valuesHeading: "OUR VALUES- SCRIBE",
  values: [
    { letter: "S", word: "Simplicity" },
    { letter: "C", word: "Customer collaboration" },
    { letter: "R", word: "Relevance" },
    { letter: "I", word: "Intelligent systems" },
    { letter: "B", word: "Bold" },
    { letter: "E", word: "Excellence" },
  ],
  // Kept as Septa's own wording, and no longer rendered: the closing ask on every page is now the
  // one banner in the footer, so this panel would have said the same thing twice in a row.
  cta: {
    headline: "Ready to Build with AI?",
    copy: "Whether you are scaling with AI across your enterprise or just starting your journey, Septa is your partner for intelligent solutions that work.",
    button: "Let’s Build Together!",
  },
};

/* --------------------------------------- careers page --------------------------------------- */

export const careers = {
  intro:
    "At Septa, we believe that talented individuals are the driving force behind our success. We are a dynamic and innovative company that values creativity, collaboration, and continuous learning. Join our team and be part of a diverse community of professionals who are passionate about making a difference in the world",
  rolesCta: "See open roles",
  cultureLead:
    "At Septa, we don’t just build solutions we create an environment where people and ideas thrive.",
  culture: [
    {
      title: "Collaboration & Curiosity",
      detail:
        "We believe the best ideas come from working together. Every perspective matters, and curiosity drives us to keep asking “what’s possible?”",
    },
    {
      title: "Creativity in Action",
      detail:
        "Challenges inspire us. Whether it’s AI-powered platforms, digital products, or talent solutions, we solve problems with creativity and practical innovation.",
    },
    {
      title: "Growth Mindset",
      detail:
        "Learning, experimentation, and ownership are part of who we are. We empower our team to push boundaries and innovate with purpose.",
    },
    {
      title: "Integrity & Transparency",
      detail:
        "We work with honesty and openness, ensuring trust at every step with clients, colleagues, and partners.",
    },
  ],
  hiringLead:
    "At Septa, we believe in a transparent and engaging hiring journey. Here's what to expect when you apply:",
  hiring: [
    {
      title: "1. Application Review",
      detail:
        "Our team carefully reviews your resume and portfolio to understand your skills, experience, and alignment with Septa’s mission of building intelligent, practical solutions.",
    },
    {
      title: "2. Introductory Conversation",
      detail:
        "A friendly chat to discuss your background, career goals, and interest in Septa. Learn about our culture, exciting projects, and how you can grow with us.",
    },
    {
      title: "3. Assessment & Technical Interview",
      detail:
        "For technical and specialized roles, you’ll take on a challenge that reflects real project scenarios, allowing us to see your problem-solving skills and expertise in action. Afterwards, you’ll engage in a detailed conversation with our technical team to dive deeper into your experience, approach, and how you can contribute to impactful projects at Septa.",
    },
    {
      title: "4. Final Interview",
      detail:
        "A conversation with senior leadership to align your vision, goals, and career aspirations with Septa’s mission. It's also a chance for you to ask any remaining questions.",
    },
    {
      title: "5. Offer & Onboarding",
      detail:
        "If selected, you'll receive an offer and a guided onboarding experience to help you integrate seamlessly into the team and start making an impact from day one.",
    },
  ],
};

/* --------------------------------------- contact page --------------------------------------- */

export const contactCopy = {
  headline: "Ready to Discover Your Ideal Tech Solution?",
  lead: "At Septa, we are on a mission to build solutions that drive innovation and growth. Whether you are automating your business conversations, launching a new product, scaling your team, We are here to make the journey seamless.",
  close: "Let’s turn ideas into impact so you can love what you build.",
  formTitle: "Share your Idea with SEPTA",
};

/**
 * The six services the document lists for the contact form's dropdown. Read from the shared schema
 * so the option a reader sees is always one the server will accept.
 */
export const contactServiceOptions = [...contactServices];

/* ----------------------------------------- page meta ----------------------------------------- */

/**
 * Named by Septa. Chinat Group has no asset, so it renders as its name instead.
 *
 * `mark` is the colour lockup, served from this origin under public/partners/color and derived from
 * the same vector geometry as the mono file by scripts/partner-marks.mjs. The strip shows one image
 * per partner and takes the colour out of it with a filter at rest, so the two states are the same
 * paths in the same box — the reveal is a colour change, not a swap. The supplied raster artwork
 * could not do that: it came on 4320x3240 canvases that were 87% white margin, one file was the icon
 * without the wordmark, and one was the mark on a navy plate.
 *
 * `height` is the optical size, not the box size. The lockups run from a 5.29:1 wordmark to a square
 * badge, so fitting them all to one box makes the wide ones tiny and the square one enormous. These
 * heights are the measured pass where every mark carries about the same weight in the row.
 * Nothing is claimed about the scope of each relationship.
 */
export type Partner = { name: string; mark?: string; height?: number };

export const partners: Partner[] = [
  { name: "Enyata", mark: "/partners/color/enyata.svg", height: 28 },
  { name: "Chinat Group" },
  { name: "Halogen Group", mark: "/partners/color/halogen-group.svg", height: 54 },
  { name: "MTN", mark: "/partners/color/mtn.svg", height: 40 },
  { name: "Preppod", mark: "/partners/color/preppod.svg", height: 32 },
  { name: "Atos", mark: "/partners/color/atos.svg", height: 34 },
  { name: "Blusalt", mark: "/partners/color/blusalt.svg", height: 32 },
  { name: "Toviri UK", mark: "/partners/color/toviri-uk.svg", height: 36 },
];
