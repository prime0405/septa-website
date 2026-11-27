/**
 * Service page content. Every string is Septa's own wording, transcribed from the document
 * "SEPTA Website Revamp". Where the document had a spacing or punctuation slip we corrected the
 * slip, never the sentence. Sections a page is expected to have but the document supplies no copy
 * for are listed in `pending` and rendered as a visible gap rather than filled in.
 */
export type Capability = { title: string; detail?: string };
export type ProcessSub = { title: string; detail?: string };

export type ProcessStepData = {
  title: string;
  detail?: string;
  /** The sub-items the document nests under a step, e.g. "A. UI Design". */
  sub?: { heading?: string; lead?: string; items: ProcessSub[] };
};

export type ServiceContent = {
  slug: string;
  name: string;
  /** Icon registry key, resolved in components/blocks/ServiceIcon.tsx */
  icon: "ai" | "automation" | "transformation" | "observability" | "talent" | "product";
  /** The line the document gives this service in the homepage "OUR SERVICES" list. */
  navBlurb: string;
  heroTitle: string;
  intro: string;
  /** Workplace artwork shown above the first body section, matched to what this service is. */
  image?: { src: string; alt: string };
  coreServicesHeading: string;
  coreServicesLead?: string;
  coreServices: Capability[];
  whyChooseHeading: string;
  whyChoose: Capability[];
  processHeading?: string;
  processLead?: string;
  process?: ProcessStepData[];
  whoWeServeHeading?: string;
  whoWeServe?: Capability[];
  extra?: { heading: string; paragraphs: string[] };
  /** The page's own ask. `label` and `to` drive the button at the top of the page; the document
   *  also supplies a headline and a line of copy for a closing panel, which is kept here as the
   *  source wording but no longer rendered — the footer's banner is now the one close on every
   *  page, and a second panel above it said the same thing. */
  cta?: { headline: string; copy: string; label: string; to: string };
  /** Sections expected on this page for which the source document gives no copy; not rendered. */
  pending?: string[];
};

export const services: ServiceContent[] = [
  {
    slug: "ai-product-development",
    name: "AI Product Development",
    icon: "ai",
    navBlurb:
      "We build intelligent, user-focused products from idea to market-ready launch. We go beyond development; we design and engineer AI-powered solutions that solve real-world problems, adapt to user needs, and scale with your business.",
    heroTitle: "Web, Mobile & AI Product Development",
    intro:
      "We use AI-assisted product development to turn ideas into market-ready digital products within 4 to 6 weeks. Whether you’re building a mobile app, developing an enterprise solution, or enhancing an existing product with intelligent features, we combine artificial intelligence, product strategy, and engineering to accelerate development and bring your vision to life.",
    image: {
      src: "/img/work/ai-model-build.webp",
      alt: "Two monitors in an engineering room, one showing a model pipeline as a branching node graph and the other a training curve falling above a grid of evaluation panels, with a hand at the keyboard in the foreground",
    },
    coreServicesHeading: "Core Services",
    coreServicesLead:
      "We use AI to accelerate product development, helping you turn your ideas into market-ready digital products within 4 to 6 weeks. From concept to launch, we combine AI-assisted development, product strategy, and engineering to build products that solve real problems and meet your business needs.",
    coreServices: [
      {
        title: "UI/UX Design",
        detail:
          "We design user experiences that simplify complex systems and make them intuitive to use. From user research to prototyping and testing.",
      },
      {
        title: "Web Development",
        detail:
          "We build scalable web/app platforms that support AI-driven functionality, and our systems are designed for performance, security, and seamless integration with APIs, data pipelines, and third-party services.",
      },
      {
        title: "Mobile App Development",
        detail:
          "We develop mobile applications that bring AI capabilities directly to users. Our apps are built for performance, usability, and long-term scalability across iOS, Android, and cross-platform environments.",
      },
      {
        title: "AI and Machine Learning Integration",
        detail:
          "We embed intelligence into your product through machine learning models and AI-driven features. We create systems that enable automation, prediction, and smarter decision-making.",
      },
      {
        title: "End-to-End Delivery",
        detail:
          "From ideation to deployment and continuous optimization, we manage the entire product lifecycle. Every solution is built to evolve, adapt to new data, user behavior, and business needs over time.",
      },
    ],
    whyChooseHeading: "Why Choose Septa",
    whyChoose: [
      {
        title: "MVP in 4 to 6 Weeks",
        detail:
          "We help you quickly launch MVPs within 4 to 6 weeks, allowing you to validate ideas, test, and gather data and feedback early.",
      },
      {
        title: "Faster Design & Iteration",
        detail:
          "AI products require continuous refinement. Our rapid design and iteration cycles ensure your product improves quickly based on user interaction and feedback.",
      },
      {
        title: "Solid Security Infrastructure",
        detail:
          "We build secure systems that protect sensitive data, ensure compliance, and support reliable AI operations at scale.",
      },
      {
        title: "Product Research",
        detail:
          "We combine market research with data-driven insights to define the right product strategy, ensuring your solution solves meaningful problems.",
      },
      {
        title: "User-Centered Approach",
        detail:
          "We design AI products around human behavior. Complex technologies are translated into simple, intuitive experiences that users can easily understand and trust.",
      },
      
    ],
    processHeading: "Our Product Development Process",
    processLead:
      "At the core of our approach is an iterative process that aligns user needs, technical feasibility, and business goals. Each phase ensures your AI product is built with clarity, efficiency, and long-term success in mind.",
    process: [
      {
        title: "1. First Contact Call",
        detail:
          "We begin with an alignment session to understand your vision, use case, and how AI can create value within your product. This step helps define clear goals and ensures we’re solving the right problem from the start.",
      },
      {
        title: "2. Workshop: Business & Technical Alignment",
        detail:
          "We collaborate with stakeholders to define business objectives, technical requirements, data availability, timelines, and operational workflows.",
        sub: {
          heading: "Workshop Outputs",
          lead: "At the end of this phase, we deliver:",
          items: [
            { title: "Product Requirements Document (PRD)" },
            { title: "Technical Requirements Document (TRD)" },
            { title: "Milestone Document" },
          ],
        },
      },
      {
        title: "3. Service Legal Agreement (SLA)",
        detail:
          "We formalize expectations through a Service Level Agreement covering delivery standards, system performance, data handling, and support. This ensures transparency, accountability, and alignment before development begins.",
      },
      {
        title: "4. Design Framework",
        detail:
          "We define the product structure and user experience, focusing on how users interact with AI features. Wireframes and user flows are created to simplify complex processes and ensure usability.",
      },
      {
        title: "5. Design & Development Setup",
        sub: {
          items: [
            {
              title: "A. UI Design",
              detail:
                "We design high-fidelity interfaces that clearly present outputs, insights, and interactions in a user-friendly way.",
            },
            {
              title: "B. Infrastructure Setup",
              detail:
                "We set up scalable infrastructure, including servers, databases, APIs, and data pipelines, to support AI model integration and performance.",
            },
          ],
        },
      },
      {
        title: "6. Execution",
        sub: {
          items: [
            {
              title: "A. Frontend Implementation",
              detail:
                "We build responsive interfaces that allow users to interact seamlessly with AI features and data outputs.",
            },
            {
              title: "B. Backend Endpoint Development",
              detail:
                "We develop APIs, integrate machine learning models, and connect services to power intelligent functionality.",
            },
            {
              title: "C. QA (Quality Assurance)",
              detail:
                "Testing includes validating outputs, system behavior, API performance, and overall stability to ensure reliability in real-world use.",
            },
            {
              title: "D. Deployment",
              detail:
                "We deploy the product in stages, first to staging for validation, then to production, ensuring stability, performance, and minimal downtime.",
            },
          ],
        },
      },
      {
        title: "7. Support",
        detail: "After launch, we ensure your product continues to perform and improve.",
        sub: {
          items: [
            {
              title: "A. Monitoring & Fixes",
              detail:
                "We monitor system performance, model accuracy, and errors, resolving issues quickly.",
            },
            {
              title: "B. User Feedback",
              detail:
                "We collect feedback to refine user experience and improve AI-driven features.",
            },
            {
              title: "C. Continuous Optimization & Handover",
              detail:
                "We update models, improve performance, and provide full documentation for long-term sustainability.",
            },
          ],
        },
      },
    ],
    whoWeServeHeading: "Who We Serve",
    whoWeServe: [
      {
        title: "Startups and Founders",
        detail: "Teams turning an idea into a web, mobile, or AI-enabled product.",
      },
      {
        title: "Businesses Building Digital Products",
        detail: "Organizations developing customer-facing platforms or enterprise solutions.",
      },
      {
        title: "Product and Engineering Teams",
        detail: "Teams seeking product strategy, design, and engineering support from concept through delivery.",
      },
      {
        title: "Businesses Adding AI Capabilities",
        detail: "Organizations integrating intelligent features into an existing product or service.",
      },
    ],
    extra: {
      heading: "Why Work With Us?",
      paragraphs: [
        "Working with us isn’t just about hiring AI experts; it's about teaming up with people who get your vision. We understand the drive to go global and the unique opportunities in Africa. We move fast, but never at the expense of quality, building AI solutions that grow with you and make a real difference, not just a good impression.",
      ],
    },
    cta: {
      headline: "Let’s Get Started",
      copy: "The right AI can transform your business. We’ll help you build it and get it in the hands of the right market.",
      label: "Grow my business with AI",
      to: "/request",
    },
  },
  {
    slug: "workflow-automation",
    name: "Workflow Automation",
    icon: "automation",
    navBlurb:
      "Repetitive tasks drain productivity and distract from strategic priorities. Describe your organizational needs. Septa partners with you to identify bottlenecks, map critical workflows, and deliver automation solutions that free your teams from routine tasks, enabling sharper focus, faster execution, and sustainable growth.",
    heroTitle: "Workflow & Process Automation",
    intro:
      "Manual processes slow you down. Septa designs automation that cuts costs, saves time, and reduces errors, without disrupting your current operations.",
    image: {
      src: "/img/work/automation-flows.webp",
      alt: "An ultrawide screen showing an automation canvas with a trigger, a branch and a timer node joined into a running path, above an untouched keyboard",
    },
    coreServicesHeading: "Core Services",
    coreServices: [
      {
        title: "Business Process Automation",
        detail:
          "Streamlined internal and customer-facing workflows tailored to your operations.",
      },
      {
        title: "Custom Automation Tools",
        detail: "Scripts and systems designed for your specific needs and data flows.",
      },
      {
        title: "System Integration",
        detail: "Connecting your apps, databases, and tools for seamless information exchange.",
      },
      {
        title: "Repetitive Task Elimination",
        detail:
          "Automating low-value manual work so your team can focus on strategy and service.",
      },
    ],
    whyChooseHeading: "Why Choose Septa",
    whyChoose: [
      {
        title: "Tailored to Your Operations",
        detail: "We build around your processes instead of forcing new ones.",
      },
      {
        title: "Cost and Time Savings",
        detail: "Automations that pay for themselves through efficiency gains.",
      },
      {
        title: "Low Disruption Delivery",
        detail: "We implement in phases to keep your operations running smoothly.",
      },
      
    ],
    cta: {
      headline: "Work Smarter, Not Harder",
      copy: "Describe your organizational needs.",
      label: "Partner with Septa",
      to: "/contact",
    },
    processHeading: "Our Process",
    processLead: "A practical sequence based on your existing operations, with changes introduced in manageable stages.",
    process: [
      { title: "Map Current Processes" },
      { title: "Identify Bottlenecks" },
      { title: "Design and Build Automation" },
      { title: "Integrate and Test" },
      { title: "Launch and Optimize" },
    ],
    whoWeServeHeading: "Who We Serve",
    whoWeServe: [
      { title: "Businesses with Manual Processes", detail: "Organizations looking to reduce repetitive work across everyday operations." },
      { title: "Teams Managing Repetitive Tasks", detail: "Teams spending time on routine steps that can be streamlined." },
      { title: "Organizations Using Multiple Systems", detail: "Businesses that need their apps, databases, and tools to exchange information more smoothly." },
      { title: "Growing Operations", detail: "Teams seeking more consistent workflows as their workload increases." },
    ],
  },
  {
    slug: "digital-transformation",
    name: "Digital Transformation",
    icon: "transformation",
    navBlurb:
      "At Septa, we transform the way businesses operate. By replacing outdated systems with powerful digital solutions, we unlock efficiency, cut costs, and deliver customer experiences that fuel growth. Discover how we can help your business thrive in the digital age.",
    heroTitle: "Transform How Your Business Works and Grows",
    intro:
      "At Septa, we help businesses modernize the way they operate and grow. Outdated systems are replaced with powerful digital solutions that increase efficiency, cut costs, and elevate customer experiences.",
    image: {
      src: "/img/work/transformation-floor.webp",
      alt: "An operations counter with an ageing green-screen terminal and stacks of paper forms on one side, and a tablet showing a clean dashboard on the other, a worker's hands setting one form down",
    },
    coreServicesHeading: "Core Services",
    coreServices: [
      {
        title: "Process Modernization",
        detail:
          "Eliminate manual, outdated workflows and replace them with scalable, tech-driven systems that save time and improve consistency.",
      },
      {
        title: "Cloud Migration",
        detail:
          "Move your operations to secure, flexible cloud environments that lower costs, increase access, and keep your business future-ready.",
      },
      {
        title: "Data Intelligence",
        detail:
          "We gather, organize, and analyze your data so it becomes a true business asset. By turning raw information into clear insights, we empower you to make informed, strategic decisions that improve operations, guide growth, and deliver measurable results.",
      },
      {
        title: "Customer Experience Upgrades",
        detail:
          "Enhance every digital touchpoint; from websites and mobile apps to service portals delivering smoother, faster, and more engaging customer interactions.",
      },
      {
        title: "Change Management Support",
        detail:
          "Ensure your teams adopt new systems with ease through training, process alignment, and ongoing support.",
      },
    ],
    whyChooseHeading: "Why Choose Septa",
    whyChoose: [
      {
        title: "Business & Technology Expertise",
        detail:
          "We combine strategic insight with technical excellence to deliver solutions that work.",
      },
      {
        title: "Industry-Specific Strategies",
        detail:
          "Tailored digital transformation approaches designed for your sector’s unique challenges.",
      },
      {
        title: "Measurable Impact",
        detail:
          "Every solution is tracked and optimized to show clear improvements in efficiency, cost savings, and customer satisfaction.",
      },
      
    ],
    processHeading: "Our Process",
    processLead: "A structured approach to modernizing the way your business operates, with each step aligned to your goals.",
    process: [
      { title: "Assess Current Operations" },
      { title: "Define a Digital Roadmap" },
      { title: "Modernize and Integrate Systems" },
      { title: "Support Team Adoption" },
      { title: "Measure and Optimize Results" },
    ],
    whoWeServeHeading: "Who We Serve",
    whoWeServe: [
      { title: "Businesses Using Outdated Systems", detail: "Organizations ready to replace legacy tools and manual workflows with digital solutions." },
      { title: "Organizations Modernizing Infrastructure", detail: "Businesses exploring cloud migration and more flexible technology environments." },
      { title: "Businesses Seeking Better Data Insights", detail: "Teams that want to organize business data and use it to support decisions." },
      { title: "Customer-Facing Businesses", detail: "Organizations improving websites, apps, portals, and other digital customer touchpoints." },
    ],
    cta: {
      headline: "Experience growth without limits.",
      copy: "Discover how we can help your business thrive in the digital age.",
      label: "Partner with Septa",
      to: "/contact",
    },
  },
  {
    slug: "observability-monitoring",
    name: "Observability & Monitoring",
    icon: "observability",
    navBlurb:
      "Data-driven insights keep your systems reliable. Every minute of downtime drains revenue, damages reputation, and stalls growth. Our advanced observability and monitoring services give you real-time visibility into your entire system, proactively detecting threats and pinpointing root causes before they escalate.",
    heroTitle: "Fix Issues Before They Impact Customers.",
    intro:
      "Downtime and performance issues cost money and trust. We provide real-time visibility into your systems so you can detect, respond, and fix problems before they impact customers.",
    image: {
      src: "/img/work/observability-noc.webp",
      alt: "Three screens in a dim room: a latency graph with one spike marked, a grid of service health tiles with two of them amber, and a log stream with a single row highlighted",
    },
    coreServicesHeading: "Core Services",
    coreServices: [
      {
        title: "Real-Time Monitoring",
        detail: "Continuous tracking of system performance, uptime, and security.",
      },
      {
        title: "Log Management",
        detail: "Centralized collection and analysis of system logs for faster troubleshooting.",
      },
      {
        title: "Performance Optimization",
        detail: "Identify and resolve performance bottlenecks before they escalate.",
      },
      {
        title: "Dashboards & Reporting",
        detail: "Clear, actionable insights for both technical and business teams.",
      },
    ],
    whyChooseHeading: "Why Choose Septa",
    whyChoose: [
      {
        title: "Proactive Detection",
        detail: "Catch and resolve issues before they affect customers.",
      },
      {
        title: "Custom Monitoring Setups",
        detail: "Solutions tailored to your infrastructure and workflows.",
      },
      {
        title: "Actionable Insights",
        detail: "Reporting and analytics that drive better decisions and performance improvements.",
      },
      
    ],
    processHeading: "Our Process",
    process: [
      {
        title: "Assess Your Environment",
        detail:
          "We review your applications, infrastructure, and monitoring requirements to identify what needs visibility and why.",
      },
      {
        title: "Configure Monitoring",
        detail:
          "We set up relevant metrics, logs, dashboards, and alerts based on your systems and operational priorities.",
      },
      {
        title: "Investigate and Diagnose",
        detail:
          "When issues arise, we use available monitoring data to help identify root causes and support troubleshooting.",
      },
      {
        title: "Refine and Optimize",
        detail:
          "We use performance trends and system insights to recommend improvements and adapt monitoring as your environment evolves.",
      },
    ],
    whoWeServeHeading: "Who We Serve",
    whoWeServe: [
      {
        title: "Businesses Running Critical Applications",
        detail:
          "Organizations that depend on reliable digital services to support customers and daily operations.",
      },
      {
        title: "Growing Technology Companies",
        detail:
          "Businesses scaling their applications and infrastructure that need better visibility into system performance.",
      },
      {
        title: "Engineering and IT Teams",
        detail:
          "Technical teams looking to simplify troubleshooting, investigate system issues, and understand application health.",
      },
      {
        title: "Businesses Modernizing Their Infrastructure",
        detail:
          "Organizations adopting cloud services, APIs, and interconnected systems that need visibility across their technology environments.",
      },
    ],
    cta: {
      headline: "Let's Improve Your System Visibility",
      copy: "Get clearer insights into your applications and infrastructure, identify performance issues, and make better-informed decisions about system reliability.",
      label: "Talk to Our Team",
      to: "/contact",
    },
  },
  {
    slug: "talent-solution",
    name: "Talent Solutions",
    icon: "talent",
    navBlurb:
      "The right experts at the right time to support your growth and innovation journey. Need skilled professionals to drive your projects forward? Our talent solutions connect you with experienced tech experts who fit your needs.",
    heroTitle: "Septa Talent Solutions",
    intro:
      "At Septa Talent Solutions, we take the hassle out of hiring, payroll, and employee benefits management, allowing businesses and organizations to focus on what truly matters: growth and innovation. We specialize in providing highly skilled professionals across various industries while managing everything from payroll processing, tax compliance, pension, HMO, and other employee benefits. Whether you’re a startup, SME, or large enterprise, we ensure seamless workforce management so you can scale without stress.",
    image: {
      src: "/img/work/talent-matching.webp",
      alt: "A monitor showing a grid of candidate profiles as abstract avatars with skill bars, two of them joined by a curve, beside a laptop running a video interview",
    },
    coreServicesHeading: "Core Services",
    coreServices: [
      {
        title: "Access to a pool of pre-scanned talent solutions",
        detail:
          "We have a vast network of professionals across various tech disciplines. Our recruitment process ensures that only highly qualified candidates with the right skill set and expertise make it to your interview stage.",
      },
      {
        title: "Tailored Recruitment process",
        detail:
          "We understand every business is unique, so we tailor our recruitment strategies to your specific hiring needs. Whether you need a full-time employee, contract worker, or a team to work with on short-term projects, we help you find the perfect fit.",
      },
      {
        title: "Payroll management",
        detail:
          "Hassle free salary processing, tax deduction, and compliance. Septa’s payroll management services provide seamless solutions to help businesses streamline their salary processing and maintain compliance with tax laws and labor regulations.",
      },
      {
        title: "Employee benefits administration",
        detail:
          "We handle employee benefits administration seamlessly, covering HMO, pensions, insurance, and other welfare benefits. Our goal is to provide a hassle-free experience for both employers and employees.",
      },
    ],
    whyChooseHeading: "Why Businesses Trust Septa Talent Solutions",
    whyChoose: [
      { title: "Efficiency", detail: "Faster hiring timelines and zero payroll errors." },
      { title: "Compliance", detail: "Stay fully aligned with labor laws and tax regulations." },
      {
        title: "Employee Experience",
        detail: "Benefits, welfare, and support that keep employees engaged and retained.",
      },
      {
        title: "Partnership Approach",
        detail: "We don’t just hire; we become your long-term workforce partner.",
      },
      
    ],
    processHeading: "Our Process",
    processLead: "We keep things simple, structured, and transparent:",
    process: [
      {
        title: "Discovery & Needs Assessment",
        detail: "We start by understanding your business, culture, and specific hiring needs.",
      },
      {
        title: "Talent Sourcing & Screening",
        detail:
          "Using our pre-vetted talent pool and recruitment networks, we source candidates, conduct screening, technical assessments, and background checks.",
      },
      {
        title: "Client Interviews & Selection",
        detail:
          "Only the top matches are presented to you for interviews. We facilitate and support the process, ensuring efficiency.",
      },
      {
        title: "Onboarding & Integration",
        detail:
          "Once you select the right talent, we handle contracts, payroll setup, and employee benefits so they integrate seamlessly into your team.",
      },
      {
        title: "Ongoing Management & Support",
        detail:
          "We don’t stop at placement. We continuously manage payroll, compliance, benefits, and employee welfare, while giving you visibility and reports.",
      },
    ],
    whoWeServeHeading: "Who We Serve",
    whoWeServe: [
      { title: "Startups", detail: "Build lean, agile teams without the overhead." },
      { title: "SMEs", detail: "Access affordable, scalable hiring and payroll solutions." },
      {
        title: "Large Enterprises",
        detail: "Streamline workforce management with compliance and efficiency.",
      },
      {
        title: "International Businesses",
        detail:
          "Hire local professionals in Nigeria & Africa with confidence, while we handle the complexities of payroll, tax, and benefits.",
      },
    ],
    cta: {
      headline: "Let’s Build What’s Next, Together!",
      copy: "Find the right technology professionals for your team, with recruitment, payroll, and employee benefits support that helps your workforce grow.",
      label: "Partner with Septa",
      to: "/contact",
    },
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
