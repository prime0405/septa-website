/**
 * The five product development use cases the document "SEPTA Website Revamp" supplies. Every
 * string is Septa's own wording, transcribed as given; where the document had a spacing or
 * punctuation slip we corrected the slip, never the sentence.
 */
export type UseCasePillar = { title: string; detail: string };
export type UseCaseProcessStep = { title: string; detail?: string };
export type UseCaseToolGroup = { heading?: string; items: string[] };

export type UseCase = {
  slug: string;
  client: string;
  title: string;
  /** The label the document uses for this body of work. */
  kind: string;
  overview: string;
  challenge: string;
  solutionLead: string;
  /** Bullet list under "Our Solution", for the studies written that way. */
  solution?: string[];
  /** Numbered pillars, for the study written that way. */
  pillars?: UseCasePillar[];
  products?: string[];
  process: UseCaseProcessStep[];
  toolsLead?: string;
  tools: UseCaseToolGroup[];
};

export const useCases: UseCase[] = [
  {
    slug: "halogen-group",
    client: "Halogen Group",
    title: "Halogen Group Use Case",
    kind: "Website and extranet",
    overview:
      "Halogen Group is a leading provider of comprehensive security solutions for individuals, businesses, and enterprises. The website project was designed to position Halogen as a digital leader in physical security, cybersecurity, identity management, and risk advisory. The platform serves as a central hub for showcasing services, industry expertise, and security insights while enabling secure client engagement.",
    challenge:
      "Halogen needed to enhance its digital presence with a well-structured, user-friendly website that effectively communicates its diverse service offerings. The goal was to create a responsive, intuitive, and brand-consistent platform that educates visitors, drives service inquiries, and supports secure client interactions through a dedicated extranet.",
    solutionLead:
      "We designed and developed a responsive website aligned with Halogen’s core offerings. The platform features:",
    solution: [
      "Modern, branded interface with intuitive navigation",
      "Clear service categories for easy discovery",
      "Resource sections including blogs, news, and whitepapers",
      "Secure extranet for advisories, alerts, and restricted client content",
      "Integrated live chat for customer support",
      "Optimized performance across mobile, tablet, and desktop devices",
    ],
    process: [
      {
        title: "Product Workshop",
        detail: "Gathered business objectives, functional requirements, and user needs",
      },
      { title: "Product Design", detail: "Created UI layouts for all major pages and sections" },
      {
        title: "Design Review & Alignment with Stakeholders",
        detail: "Iterated designs based on feedback",
      },
      {
        title: "Agile Product Development",
        detail: "Built website and extranet in sprints for faster delivery",
      },
      {
        title: "Product Demonstration",
        detail: "Presented working features for approval before final testing",
      },
      {
        title: "Testing & Deployment",
        detail: "Conducted backend and frontend tests, then launched optimized platform",
      },
    ],
    tools: [
      {
        items: [
          "Product Brainstorming (Tools): ClickUp, Slack, Miro – used for ideation, documentation, and team communication",
          "Task Management Tool: ClickUp – for sprint planning, task tracking, and milestone monitoring",
          "Design Tool: Figma – for wireframes, high-fidelity UI designs, and interactive prototypes",
          "Frontend Stack: HTML5, CSS3, JavaScript, responsive and cross-device interface development",
          "Backend Stack: PHP, MySQL, for content management, extranet functionality, and secure data handling",
          "Security Technology: SSL encryption, firewall protection, secure authentication, to safeguard user data and platform access",
          "Infrastructure: Cloud hosting with CDN support, for performance, uptime, and scalability",
          "Support Integration: Tawk.to or Zendesk Chat, for live customer support and ticketing",
        ],
      },
    ],
  },
  {
    slug: "ehcc-clock-in-app",
    client: "EHCC",
    title: "EHCC Clock-In App Use Case",
    kind: "Web and mobile platform",
    overview:
      "The EHCC Clock In App is a web and mobile platform that enables registered members of the congregation to clock in for services and meetings, ensuring accurate attendance tracking. The platform also gives church administrators and departmental leaders real-time visibility into attendance trends, punctuality, and member engagement.",
    challenge:
      "The church needed a system that not only recorded attendance but also provided richer insights into member participation. The existing setup lacked role-based access, punctuality tracking, departmental analytics, and engagement tools. Leadership wanted a solution that improved accuracy, reduced manual tracking, and strengthened member accountability.",
    solutionLead:
      "We designed and developed an enhanced attendance management platform with:",
    solution: [
      "Role-Based Access Control (RBAC) so departmental heads view only their team’s attendance data",
      "Geofencing to ensure clock-ins happen only on church premises",
      "Punctuality Tracking with automatic classification of on time, late, or absent",
      "Real-Time Dashboards for leaders to monitor attendance during services",
      "Reporting & Insights for trend analysis, comparisons, and growth tracking",
    ],
    products: [
      "Mobile app (iOS & Android) for member clock-ins and attendance history",
      "Web app for administrators and departmental leaders",
      "Admin dashboard with real-time clock-in feed and reporting tools",
      "Role-based access system for different leadership levels",
      "Geofencing-enabled attendance validation",
    ],
    process: [
      {
        title: "Product Workshop",
        detail: "Gathered objectives, identified key pain points, and defined target outcomes",
      },
      {
        title: "Product Design",
        detail: "Created wireframes and prototypes for mobile and web platforms",
      },
      {
        title: "Design Review & Alignment with Stakeholders",
        detail: "Incorporated feedback from church leadership and departmental heads",
      },
      {
        title: "Agile Product Development",
        detail: "Built mobile app, web app, and admin dashboard in sprints",
      },
      {
        title: "Product Demonstration",
        detail: "Presented working features for approval at milestone points",
      },
      {
        title: "Testing & Deployment",
        detail:
          "Performed functional, performance, and geofencing validation tests before launch",
      },
    ],
    toolsLead:
      "To deliver the EHCC Clock In App, we used collaborative planning tools, secure technologies, and a modern development stack.",
    tools: [
      {
        items: [
          "Design Tool: Figma – for UI design, prototyping, and design collaboration",
          "Frontend Stack: React (Web), React Native (Mobile) – for responsive, cross-platform UI",
          "Backend Stack: Node.js with Express – for API development and business logic",
          "Security Technology: OAuth2/Firebase Authentication, SSL encryption, firewall protection",
          "Infrastructure: AWS – for scalable hosting and database management (PostgreSQL)",
          "APIs: REST APIs for communication between frontend and backend.",
          "Notifications: Firebase Cloud Messaging (FCM), Twilio – for push and SMS notifications",
        ],
      },
    ],
  },
  {
    slug: "preppod",
    client: "Preppod",
    title: "Preppod Adaptive Learning Platform",
    kind: "Website and LMS",
    overview:
      "Preppod is a music learning platform for all ages from toddlers taking their first lessons to advanced learners refining their skills. The platform combines an adaptive Learning Management System (LMS) with a responsive website to make music education engaging, accessible, and trackable. Both the LMS and the public-facing website were designed and developed to deliver a seamless experience across devices.",
    challenge:
      "Preppod needed an engaging, multi-role learning system that supported music-focused course creation, enrollment, secure payments, and progress analytics. The solution had to serve a broad user base including learners, parents/guardians, instructors, and administrators while supporting structured learning paths, interactive assessments, and scalability for future subjects beyond music.",
    solutionLead: "We developed both the Preppod website and the LMS with:",
    solution: [
      "Public-facing website showcasing Preppod’s mission, courses, and enrollment options",
      "Structured LMS with modules, lessons, quizzes, assignments, and certification",
      "Role-specific dashboards for learners, supervisors, instructors, and admins",
      "Secure onboarding and authentication",
      "Progress tracking with visual indicators",
      "Stripe payment integration for subscriptions and course purchases",
      "Analytics dashboard with Google Analytics for usage tracking and insights",
      "Content management tools for instructors to build and manage interactive lessons",
      "Notification system for reminders and learner engagement",
    ],
    products: [
      "Responsive Preppod website",
      "Web-based LMS with adaptive learning capabilities",
      "Role-based dashboards for learners, supervisors, instructors, and admins",
      "Payment gateway integration (Stripe)",
      "Admin tools for analytics, course moderation, and user management",
      "Secure storage for course materials (AWS S3)",
    ],
    process: [
      {
        title: "Product Workshop",
        detail: "Defined requirements, learning flows, and website structure",
      },
      {
        title: "Product Design",
        detail: "Created high-fidelity UI in Figma for both website and LMS",
      },
      {
        title: "Design Review & Alignment with Stakeholders",
        detail: "Incorporated feedback from Preppod’s team",
      },
      {
        title: "Agile Product Development",
        detail: "Built website, backend, and LMS modules in sprints",
      },
      {
        title: "Product Demonstration",
        detail:
          "Presented functional learning modules, dashboards, and payment flow for review",
      },
      {
        title: "Testing & Deployment",
        detail: "Conducted unit, integration, and usability tests before launch on AWS",
      },
    ],
    tools: [
      {
        items: [
          "Product Brainstorming (Tools): ClickUp, Slack, Miro – for planning and communication",
          "Task Management Tool: ClickUp and Trello – for sprint tracking and milestone monitoring",
          "Design Tool: Figma – for UI mockups and interactive prototypes",
          "Frontend Stack: React.js, Next.js, Tailwind CSS – for responsive UI across LMS and website",
          "Backend Stack: NestJS (Node.js + TypeScript) – for APIs, authentication, and course logic",
          "Security Technology: OAuth2, JWT, HTTPS, AES encryption, PCI-DSS compliant payments via Stripe",
          "Infrastructure: AWS Lambda, AWS RDS (PostgreSQL), AWS S3 – for hosting, database, and storage",
          "Notifications: Firebase Cloud Messaging (FCM) – for reminders and updates",
        ],
      },
    ],
  },
  {
    slug: "septa-lms",
    client: "Septa",
    title: "Septa LMS",
    kind: "In-house learning platform",
    overview:
      "Septa LMS is an in-house Learning Management System developed to power Septa’s training programs in technology. It is used to train beginners breaking into tech, professionals upskilling, and individuals switching careers. The platform centralizes course delivery, project-based learning, and performance tracking, ensuring participants gain practical, industry-ready skills.",
    challenge:
      "Septa needed a platform tailored to its approach to tech education. Off-the-shelf LMS products were either too rigid, lacked flexibility for coding-focused courses, or didn’t provide the analytics needed to track learner performance effectively. The objective was to build a system that aligned with Septa’s teaching philosophy: simple, hands-on, and outcome-driven.",
    solutionLead:
      "We designed and developed a custom LMS that supports structured tech learning. The system combines interactive course delivery with assessment tools, collaboration features, and analytics. Key features include:",
    solution: [
      "Role-based access for learners, instructors, and administrators",
      "Course modules with lessons, tasks, quizzes, and assignments",
      "Hands-on project submission with instructor grading and feedback",
      "Learner dashboards showing progress and performance trends",
      "Analytics and reporting for monitoring cohort performance",
    ],
    products: [
      "Web-based LMS platform optimized for desktop and mobile browsers",
      "Instructor dashboard for creating courses, grading submissions, and managing cohorts",
      "Learner portal for accessing courses, submitting projects, and tracking progress",
      "Admin console for enrollment management, and issuing certificates",
      "Analytics dashboards for tracking learner outcomes and program performance",
    ],
    process: [
      {
        title: "Discovery & Planning",
        detail: "Defined training workflows, curriculum requirements, and learner needs",
      },
      {
        title: "Design",
        detail:
          "Built wireframes and high-fidelity UI in Figma, optimized for simplicity and usability",
      },
      {
        title: "Agile Development",
        detail:
          "Developed core LMS features in sprints, starting with course delivery and progressively adding collaboration and analytics tools",
      },
      {
        title: "Pilot Testing",
        detail: "Deployed to a small group of learners for feedback and refinement",
      },
      { title: "Launch & Deployment", detail: "Rolled out the final version with scalability in mind" },
    ],
    tools: [
      {
        items: [
          "Design Tool: Figma – for UI/UX design and prototyping",
          "Frontend Stack: Vue.js, Nuxt.js – for responsive, fast-loading user interfaces",
          "Backend Stack: Node.js with Express – for API development and course logic",
          "Database: PostgreSQL – for structured learner and course data storage",
          "Authentication & Security: OAuth2, JWT, SSL encryption",
          "Infrastructure: AWS (EC2, RDS, S3) – for hosting, data storage, and scalability",
        ],
      },
    ],
  },
  {
    slug: "toviri",
    client: "TOVIRI",
    title: "TOVIRI Travel Assistant Platform",
    kind: "Mobile platform",
    overview:
      "TOVIRI is a mobile travel assistant designed for travellers in Nigeria and the UK. It brings AI-driven itinerary planning, transport integrations, built-in safety tools, subscription access, and trip reminders together in one simple experience. The platform helps users plan trips, navigate confidently, and stay connected while on the move. TOVIRI was designed to offer smooth performance, intuitive workflows, and security that travellers can rely on throughout their journeys.",
    challenge:
      "TOVIRI needed a flexible travel platform that could combine itinerary automation, transport booking options, emergency safety features, real-time location sharing, and secure payments across multiple currencies. The solution had to feel simple enough for casual travellers, powerful enough for frequent travellers, and compliant with global security requirements. It also needed to support trip editing, itinerary sharing, and communication tools without overcomplicating the user experience.",
    solutionLead:
      "We built TOVIRI as a simple, user-focused travel companion with four core pillars:",
    pillars: [
      {
        title: "1. Smart Trip Planning",
        detail:
          "An AI itinerary builder that creates personalized travel plans based on destination, dates, budget, and interests.",
      },
      {
        title: "2. Built-In Safety Tools",
        detail:
          "Live location sharing with custom duration options and an SOS button that instantly alerts emergency contacts.",
      },
      {
        title: "3. Transport & Trip Support",
        detail:
          "Quick access to Uber for in-app transport booking and integrated support chat through Intercom for travel assistance.",
      },
      {
        title: "4. Payments & Subscription Access",
        detail:
          "Local and international payment options using Paystack, Stripe, and PayPal. Travellers can switch between free and premium plans, receive email receipts, and enjoy unlimited itinerary edits on premium.",
      },
    ],
    products: [
      "TOVIRI mobile travel assistant",
      "AI itinerary creation engine",
      "Live location and SOS safety features",
      "Transport booking integration (Uber)",
      "Notification and email service",
      "Traveller support chat integration",
    ],
    process: [
      {
        title: "Product Workshop",
        detail: "Defined objectives, user journeys, safety steps, trip logic, and subscription structure.",
      },
      {
        title: "Product Design",
        detail:
          "Designed high-fidelity interfaces in Figma for onboarding, itinerary creation, safety tools, payments, and notifications.",
      },
      {
        title: "Design Review & Alignment",
        detail:
          "Reviewed user flows and prototypes with stakeholders to refine the experience across all features.",
      },
      {
        title: "Agile Product Development",
        detail:
          "Implemented features in iterations covering onboarding, itinerary generation, safety tools, subscriptions, payments, notifications, and bookings.",
      },
      {
        title: "Product Demonstrations",
        detail:
          "Presented itinerary creation, editing rules, location-sharing flows, payment handling, and the in-app support system during scheduled review cycles.",
      },
      {
        title: "Testing & Deployment",
        detail:
          "Completed thorough testing across devices and network conditions ensuring compliance with GDPR and PCI DSS and optimized for fast load times and low crash rates.",
      },
    ],
    tools: [
      { heading: "Planning & Collaboration", items: ["ClickUp", "Slack", "Miro"] },
      { heading: "Task Management", items: ["ClickUp", "Trello"] },
      { heading: "Design", items: ["Figma"] },
      {
        heading: "Mobile Development",
        items: [
          "React Native",
          "Tailwind-style component architecture",
          "Mobile navigation and state libraries",
        ],
      },
      {
        heading: "Backend & APIs",
        items: ["Node.js / NestJS (TypeScript)", "OAuth2, JWT, AES encryption", "REST APIs"],
      },
      {
        heading: "AI & Maps",
        items: [
          "GPT/Gemini for itinerary generation",
          "Google Maps API for routing and location features",
        ],
      },
      {
        heading: "Payments",
        items: [
          "Paystack (₦)",
          "Stripe / PayPal (£)",
          "PCI-compliant payment handling",
        ],
      },
      {
        heading: "Notifications & Support",
        items: ["Firebase Cloud Messaging", "Email delivery service", "Intercom chat integration"],
      },
      { heading: "Infrastructure", items: ["AWS Lambda", "AWS RDS (PostgreSQL)", "AWS S3"] },
    ],
  },
];

export const useCaseBySlug = (slug: string) => useCases.find((u) => u.slug === slug);
