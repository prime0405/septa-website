export type FaqItem = {
  id: string;
  q: string;
  a: string;
  link?: { label: string; to: string };
};

export const septaFaqs: FaqItem[] = [
  {
    id: "services",
    q: "What services does Septa offer?",
    a: "Septa provides end-to-end technology solutions across six key areas: AI Product Development, Traditional Product Development, Workflow Automation, Digital Transformation, Observability & Monitoring, and Tech Talent Solutions.",
    link: { label: "Explore all services", to: "/services" },
  },
  {
    id: "delivery-speed",
    q: "How quickly can Septa take a product from idea to launch?",
    a: "Through our AI-assisted product development workflow, we turn concepts into market-ready digital products within 4 to 6 weeks. Whether you are building a new application or modernizing an existing system, we accelerate development without compromising engineering quality.",
    link: { label: "Learn about AI Product Development", to: "/services/ai-product-development" },
  },
  {
    id: "talent-solution",
    q: "How does Septa's Talent Solution work?",
    a: "We connect businesses with top technology talent to fuel innovation and accelerate growth. Our vetted software engineers, architects, and technical specialists integrate seamlessly with your existing team to boost velocity and scale systems.",
    link: { label: "Explore Talent Solutions", to: "/services/talent-solution" },
  },
  {
    id: "ip-security",
    q: "How do you protect my intellectual property and sensitive project details?",
    a: "We treat your project with strict confidentiality. Mutual Non-Disclosure Agreements (NDAs) are in place before detailed discussions, and upon project completion, 100% of all code, architecture, and design assets belong exclusively to your business.",
    link: { label: "Read our Privacy Notice", to: "/privacy" },
  },
  {
    id: "workflow-automation",
    q: "Can Septa help automate our current business operations?",
    a: "Yes. Our Workflow Automation service replaces repetitive manual workflows and brittle spreadsheets with streamlined, intelligent automation that eliminates operational bottlenecks and reduces costs.",
    link: { label: "Explore Workflow Automation", to: "/services/workflow-automation" },
  },
  {
    id: "getting-started",
    q: "What is the best way to start working with Septa?",
    a: "You can start immediately by filling out the contact form below or using our 5-step Service Request wizard. An engineering lead will review your submission and reach out within 24 hours to schedule an initial scoping session.",
    link: { label: "Open Service Request Wizard", to: "/request" },
  },
];
