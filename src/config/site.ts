export interface Project {
  slug: string;
  index: string;
  year: string;
  type: string;
  name: string;
  tagline: string;
  lede: string;
  award: string | null;
  chips: string[];
  live?: string | null;
  repo?: string | null;
  metrics?: string[];
  screenshots?: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  dates: string;
  location: string;
  oneLiner: string;
  bullets: string[];
  chips: string[];
  logo?: string;
  website?: string;
  linkedin?: string;
}

export interface EducationItem {
  degree: string;
  school: string;
  meta: string;
}

/**
 * Centralized Name Configuration
 * Switch between full and short name with ONE setting:
 * - 'full'  => "Muhammad Umer Farooq" (Default)
 * - 'short' => "Muhammad Umer"
 */
export type NameVariant = 'full' | 'short';

// Change this single constant to switch between full and short name:
export const ACTIVE_NAME_VARIANT: NameVariant = 'full';

export interface NameConfig {
  name: string;
  shortName: string;
  monogram: string;
  nameLines: string[];
  resumeFilename: string;
}

export const NAME_VARIANTS: Record<NameVariant, NameConfig> = {
  full: {
    name: 'Muhammad Umer Farooq',
    shortName: 'Muhammad Umer',
    monogram: 'MUF',
    nameLines: ['MUHAMMAD', 'UMER', 'FAROOQ'],
    resumeFilename: 'Muhammad-Umer-Farooq-Resume.pdf',
  },
  short: {
    name: 'Muhammad Umer',
    shortName: 'Muhammad Umer',
    monogram: 'MU',
    nameLines: ['MUHAMMAD', 'UMER'],
    resumeFilename: 'Muhammad-Umer-Resume.pdf',
  },
};

const activeName = NAME_VARIANTS[ACTIVE_NAME_VARIANT];

export const siteConfig = {
  name: activeName.name,
  shortName: activeName.shortName,
  monogram: activeName.monogram,
  nameLines: activeName.nameLines,
  resumeFilename: activeName.resumeFilename,
  location: "Pakistan",
  role: "AI-Assisted Full-Stack Developer",
  heroLine:
    "AI-assisted full-stack developer building <strong>modern web applications</strong>, <strong>responsive interfaces</strong>, and <strong>practical software solutions</strong> while collaborating with teams.",
  email: "umer.dev17@gmail.com",
  linkedin: "https://www.linkedin.com/in/umer-farooq-10b904391/",
  resume: "/umer-resume.pdf",
  availability:
    "Open for junior full-stack roles, freelance builds, and practical software problems.",

  skills: [
    {
      category: "Languages",
      tools: ["JavaScript", "TypeScript", "HTML5", "CSS3"],
    },
    {
      category: "Frameworks",
      tools: ["React", "Next.js", "Node.js", "Express.js"],
    },
    {
      category: "Databases",
      tools: ["MongoDB", "Mongoose", "Prisma", "PostgreSQL"],
    },
    {
      category: "Tools & Platforms",
      tools: ["Git", "Vercel", "Postman", "Vite", "Docker"],
    },
    {
      category: "AI & Tooling",
      tools: [
        "Cursor",
        "Antigravity",
        "AI-assisted dev",
        "LLM APIs",
        "Prompt engineering",
      ],
    },
    {
      category: "UI & Styling",
      tools: [
        "Tailwind CSS",
        "Modular CSS",
        "Responsive design",
        "Framer Motion",
      ],
    },
  ],

  experience: [
    {
      role: "Software Development Intern",
      company: "Digital Elliptical",
      dates: "2026–Present",
      location: "Pakistan",
      oneLiner:
        "Full-stack development and AI-assisted application building while collaborating with a team.",
      bullets: [
        "Contributed to full-stack application development and responsive user interfaces using React, Next.js, and Tailwind CSS.",
        "Utilized AI-assisted engineering workflows with Cursor and Antigravity to support feature building and code refactoring.",
        "Collaborated with the team across codebase maintenance, API integration, and version control with Git.",
      ],
      chips: [
        "React",
        "Next.js",
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Express",
        "MongoDB",
        "Tailwind CSS",
        "Git",
        "Antigravity",
        "Cursor",
      ],
      logo: "/images/digital-elliptical-logo.svg",
      website: "https://digitalelliptical.com/",
      linkedin: "https://www.linkedin.com/company/digital-elliptical-software-company-pvt-ltd/",
    },
    {
      role: "Call Center Agent",
      company: "Riuman International",
      dates: "Approx. 3 Months (2025)",
      location: "Pakistan",
      oneLiner:
        "Customer communications and call-center voice support operations.",
      bullets: [
        "Handled customer inquiries and voice communication workflows in a call-center environment.",
        "Assisted customers with day-to-day queries and communicated information clearly.",
      ],
      chips: ["Customer Support", "Client Communication"],
      logo: "/images/riuman-badge.png",
      website: "https://riuman.com/",
      linkedin: "https://www.linkedin.com/company/riuman-international/",
    },
  ] as ExperienceItem[],

  projects: [
    {
      slug: "vendora",
      index: "01",
      year: "2025",
      type: "Web Application",
      name: "Vendora",
      tagline: "Fast, modular product catalog browsing.",
      lede: "A modern, responsive e-commerce storefront prototype built with React 19, Vite, and React Router v7, featuring dynamic category filtering and detailed item views without heavy framework overhead.",
      award: null,
      chips: ["React 19", "Vite", "React Router v7", "Modular CSS", "Oxlint"],
      live: null,
      repo: null,
      metrics: [
        "Component-driven storefront layout separating category navigation, responsive product grids, and individual item cards.",
        "Client-side routing with React Router v7 handling catalog exploration, dynamic product detail routing (/products/:id), and 404 fallbacks.",
        "Dynamic product detail view utilizing useParams to display item imagery, vendor attribution, star ratings, customer review counts, and purchasing triggers.",
        "Zero-runtime-overhead styling powered by custom modular CSS files (CategoryBar.css, Navbar.css, ProductCard.css, ProductDetails.css, variables.css).",
        "Curated mock catalog data architecture with structured vendor metadata and realistic pricing structures.",
        "Current status: Frontend prototype fully implemented; backend database, authentication, and payment processing are planned next-phase additions.",
      ],
      screenshots: [
        "/work/vendora/shot1.png",
        "/work/vendora/shot2.png",
        "/work/vendora/shot3.png",
      ],
    },
    {
      slug: "mutiauction",
      index: "02",
      year: "2025",
      type: "Marketplace System",
      name: "MutiAuction",
      tagline: "Multi-category auction marketplace & physical verification ecosystem.",
      lede: "An ambitious multi-category auction platform concept uniting Vehicles, Real Estate, and General Goods with real-time bidding workflows, verified physical inspections, and transaction privacy.",
      award: null,
      chips: ["Next.js", "React", "Tailwind CSS", "JavaScript", "Lucide Icons"],
      live: null,
      repo: null,
      metrics: [
        "Full customer-facing website architecture encompassing 38 App Router pages across vehicles, property, and general marketplace verticals.",
        "Dedicated automotive (/cars) and real estate (/properties) discovery routes featuring multi-attribute faceted filters inspired by industry-standard portals.",
        "Comprehensive 7-step Sell Wizard (/sell/[slug]) capturing category taxonomies, technical specs, media uploads, and starting/reserve pricing.",
        "End-to-end customer physical inspection module (/inspection): 7-step booking wizard, sample inspection reports, and 5-stage inspection tracking timeline.",
        "Strict inspection scope invariant: Physical inspections apply strictly and exclusively to high-ticket Cars and Properties; zero inspection badges for general consumer goods.",
        "Privacy preservation: Public bid logs mask bidder identities (e.g., Bidder ••••84) to eliminate off-platform collusion during active auctions.",
        "Current status: Complete 38-route frontend implementation with realistic mock data state; Node.js backend, MongoDB database, and Socket.io engine are fully specified in Brain documentation.",
      ],
      screenshots: [
        "/work/mutiauction/shot1.png",
        "/work/mutiauction/shot2.png",
        "/work/mutiauction/shot3.png",
      ],
    },
    {
      slug: "cvtoweb",
      index: "03",
      year: "2025",
      type: "Developer Tool",
      name: "CVtoWeb",
      tagline: "Transform resumes into professional developer portfolio websites.",
      lede: "A specialized web application built with Next.js 16 and React 19 designed to convert flat CVs and resumes (PDF/DOCX) into customizable, responsive personal portfolio websites.",
      award: null,
      chips: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Lucide React"],
      live: null,
      repo: null,
      metrics: [
        "Accessible drag-and-drop file upload zone supporting PDF and DOCX formats with client-side extension validation, MIME type checks, and a 10MB file ceiling.",
        "Multi-step resume ingestion and processing pipeline (/build/processing) breaking down document structure, personal info, work history, skills, and education.",
        "Interactive multi-section review editor (/build/review) allowing candidates to inspect, adjust, and enrich parsed career data before portfolio generation.",
        "Categorized template selection gallery (/build/templates) offering Professional, Minimal, Developer, and Creative layout themes with real-time visual previews.",
        "Candidate dashboard (/dashboard) for tracking generated portfolio drafts, reviewing status, and managing website customization.",
        "Current status: Frontend creation workflow, review editor, and template engine fully implemented in Next.js 16; production AI parsing microservices and automated deployment remain planned features.",
      ],
      screenshots: [
        "/work/cvtoweb/shot1.png",
        "/work/cvtoweb/shot2.png",
        "/work/cvtoweb/shot3.png",
      ],
    },
  ] as Project[],

  education: [
    {
      degree: "First-year ICS (Computer Science)",
      school: "Government Boys Degree College Kohsar",
      meta: "Hyderabad, Sindh, Pakistan",
    },
  ] as EducationItem[],

  awards: [] as { title: string; meta: string }[],
  writing: [] as { title: string; meta: string; url: string }[],
};
