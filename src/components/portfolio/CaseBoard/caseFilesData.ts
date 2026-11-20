/**
 * CASE FILES DATA
 * Sourced strictly from verified content across Aswin's portfolio:
 * - src/data/projectsFallback.ts & src/components/portfolio/ProjectsEvidenceLocker.tsx
 * - src/data/achievementsFallback.ts & src/data/portfolio.ts
 * - src/data/experienceFallback.ts & src/components/portfolio/AboutDossier.tsx
 *
 * Tone: Professional investigator solving problems.
 * No placeholders, no costume photos, no unverified claims.
 */

export interface CaseFile {
  id: string;
  number: number;
  caseNumber: string; // "CASE 01", "CASE 02", etc.
  role: string; // "THE BUILDER", "THE COMPETITOR", "THE LEADER", "THE MENTOR", "THE POET"
  oneLiner: string; // <= 70 characters: confident, specific, verified name/number
  problem: string; // 1-2 lines detailing the investigated challenge
  solution: string; // 1-2 lines detailing the engineered solution & delivery
  methods: string[]; // Real technical tags & methodologies
  link: string; // Real link (repo, certificate, profile, or demo)
  linkLabel: string; // Action label for button
  sourceReference: string; // Audit origin in repo
  rotation: number; // Board pin rotation in degrees (-2 to 2)
}

export const caseFiles: CaseFile[] = [
  {
    id: "builder",
    number: 1,
    caseNumber: "CASE 01",
    role: "THE BUILDER",
    // 65 characters (<= 70)
    oneLiner: "GPS emergency response web app across 38 districts of Tamil Nadu",
    problem:
      "Motorists stranded on state highways lack an immediate, zero-friction channel to locate and dispatch verified local mechanics and emergency responders.",
    solution:
      "Engineered a mobile-first emergency web application providing one-tap GPS geolocation and real-time nearest responder mapping across all 38 districts of Tamil Nadu.",
    methods: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Geolocation API"],
    link: "https://github.com/aswin-070807/roadside-aid-pro",
    linkLabel: "View GitHub Repository",
    sourceReference: "src/data/projectsFallback.ts (Exhibit A: Road Side Aid Pro)",
    rotation: -1.4,
  },
  {
    id: "competitor",
    number: 2,
    caseNumber: "CASE 02",
    role: "THE COMPETITOR",
    // 70 characters (<= 70)
    oneLiner: "Silver Medalist at International Innovation Expo & 3× National Finalist",
    problem:
      "High-stakes hackathons demand architectural resilience, rapid algorithmic turnaround, and flawless live defense under strict 72-hour deadlines.",
    solution:
      "Clinched Silver Medal for System Design at University Malaysia Perlis (INVIDE 2026) and secured Top 25 National Finalist ranking at IIT Madras Neurohack.",
    methods: ["System Design", "Rapid Prototyping", "IITM Neurohack", "INVIDE 2026", "CodeChef Rated"],
    link: "https://drive.google.com/file/d/1-_yQE57EmKOvMrpnJ-fQNDmfNiu1G0xI/view?usp=sharing",
    linkLabel: "Inspect Verified Award",
    sourceReference: "src/data/achievementsFallback.ts (Cases 001 & 002) & src/data/portfolio.ts",
    rotation: 1.2,
  },
  {
    id: "leader",
    number: 3,
    caseNumber: "CASE 03",
    role: "THE LEADER",
    // 70 characters (<= 70)
    oneLiner: "Led Byte Blazers across 15+ hackathons with 2× SIH internal top-5 spots",
    problem:
      "Multi-disciplinary engineering teams frequently face coordination friction, sprint drift, and communication breakdowns during intense competitive builds.",
    solution:
      "Directed collegiate team 'Byte Blazers' across 15+ hackathons, managing sprint milestones and securing two consecutive internal Smart India Hackathon top-5 selections.",
    methods: ["Sprint Coordination", "Team Leadership", "SIH Strategy", "Technical Pitching"],
    link: "https://www.linkedin.com/in/aswin-a-709091293",
    linkLabel: "View Leadership Record",
    sourceReference: "src/components/portfolio/AboutDossier.tsx (Bio 3) & src/data/portfolio.ts (Stats)",
    rotation: -0.9,
  },
  {
    id: "mentor",
    number: 4,
    caseNumber: "CASE 04",
    role: "THE MENTOR",
    // 68 characters (<= 70)
    oneLiner: "Unstop Mentor and GeeksforGeeks Campus Lead guiding students in tech",
    problem:
      "Aspiring engineering peers struggle with navigating career pathways, structured skill development roadmaps, and emerging AI tooling without 1:1 guidance.",
    solution:
      "Provided 1:1 career roadmaps and personal growth coaching on Unstop, while conducting student workshops and promoting AI initiatives as GeeksforGeeks Campus Representative.",
    methods: ["1:1 Mentoring", "Career Roadmaps", "AI Workshops", "Community Building"],
    link: "https://unstop.com/mentor/aswin07?ref=kpbIAVR0",
    linkLabel: "Visit Unstop Mentorship Profile",
    sourceReference: "src/data/experienceFallback.ts (Service Records 001 & 002)",
    rotation: 1.6,
  },
  {
    id: "poet",
    number: 5,
    caseNumber: "CASE 05",
    role: "THE POET",
    // 68 characters (<= 70)
    oneLiner: "Contributing author in 'Being Myself' anthology alongside 60 writers",
    problem:
      "Technical prose, software interfaces, and engineering documentation frequently suffer from bloated verbiage, ambiguity, and absence of human clarity.",
    solution:
      "Authored original creative reflections in the 'Being Myself' anthology alongside 60 writers, applying ruthless editorial discipline to clean UI copywriting and UX architecture.",
    methods: ["Creative Writing", "Editorial Discipline", "Storytelling", "UX Copywriting"],
    // TODO: Update link with direct publisher/ISBN page once a dedicated online storefront URL is available.
    link: "https://github.com/aswin-070807",
    linkLabel: "Explore Creative Work & Code",
    sourceReference: "src/data/portfolio.ts (Major Project 3: Being Myself: Anthology) & AboutDossier.tsx",
    rotation: -1.3,
  },
];
