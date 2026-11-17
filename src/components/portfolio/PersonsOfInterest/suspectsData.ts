export interface SuspectProject {
  title: string;
  oneLiner: string;
  link: string;
}

export interface SuspectLink {
  label: string;
  url: string;
}

export interface SuspectData {
  id: string;
  number: number;
  code: string;
  name: string;
  heightCm: number;
  heightFtIn: string;
  pose: string;
  accentColor: string;
  accentBorder: string;
  accentBg: string;
  accentGlow: string;
  charge: string;
  bio: string;
  skills: string[];
  projects: SuspectProject[];
  links: SuspectLink[];
  icon: "hammer" | "trophy" | "flag" | "compass" | "quill";
  imageSrc: string;
  /* Offsets relative to normalized 400x900 canvas: percentages */
  chestPatchOffset: { x: number; y: number };
  /* Offsets in px for placard alignment on chest */
  placardOffset: { x: number; y: number };
  /* Placard tilt in degrees */
  placardTilt: number;
}

export const SUSPECTS_DATA: SuspectData[] = [
  {
    /* [EDIT: Suspect 1 - Core Identifiers] */
    id: "builder",
    number: 1,
    code: "ASW-0001",
    name: "THE BUILDER",
    heightCm: 178,
    heightFtIn: "5'10\"",
    pose: "hands at sides",
    accentColor: "#3B82F6", // Accent Blue
    accentBorder: "border-blue-500",
    accentBg: "bg-blue-500/10",
    accentGlow: "rgba(59, 130, 246, 0.35)",
    icon: "hammer",
    imageSrc: "/lineup/suspect-1.png",
    chestPatchOffset: { x: 53.2, y: 27.7 },
    placardOffset: { x: 0, y: 0 },
    placardTilt: -1.2,

    /* [EDIT: Suspect 1 - Interrogation Report & Bio] */
    charge: "Caught deploying unprompted architecture refactors at 3:14 AM without a staging warning.",
    bio: "Obsessive systems craftsperson dedicated to zero-dependency utilities, sub-50ms render loops, and resilient full-stack workflows. Believes that if a component cannot be reasoned about in one breath, it must be rewritten.",
    skills: ["TypeScript", "React & TanStack", "Node.js & Python", "Tailwind CSS", "Systems Design"],

    /* [EDIT: Suspect 1 - Projects Dossier] */
    projects: [
      {
        title: "Aswin Creative Portfolio",
        oneLiner: "Detective-themed interactive portfolio built with 60fps frame loops and zero-lag layouts.",
        link: "#home",
      },
      {
        title: "Agentic Inference Engine",
        oneLiner: "Parallel workflow orchestrator streaming real-time LLM execution graphs.",
        link: "#projects",
      },
    ],

    /* [EDIT: Suspect 1 - Associated Records / Links] */
    links: [
      { label: "Inspect Projects", url: "#projects" },
      { label: "GitHub Profile", url: "https://github.com/aswin-070807" },
    ],
  },
  {
    /* [EDIT: Suspect 2 - Core Identifiers] */
    id: "competitor",
    number: 2,
    code: "ASW-0002",
    name: "THE COMPETITOR",
    heightCm: 172,
    heightFtIn: "5'8\"",
    pose: "arms crossed",
    accentColor: "#F59E0B", // Accent Gold
    accentBorder: "border-amber-500",
    accentBg: "bg-amber-500/10",
    accentGlow: "rgba(245, 158, 11, 0.35)",
    icon: "trophy",
    imageSrc: "/lineup/suspect-2.png",
    chestPatchOffset: { x: 51.7, y: 27.2 },
    placardOffset: { x: 0, y: 8 },
    placardTilt: 1.5,

    /* [EDIT: Suspect 2 - Interrogation Report & Bio] */
    charge: "Suspected of podium finishes in hackathons under extreme 36-hour caffeine conditions.",
    bio: "Engineered for high-stakes problem sprints and rapid MVP turnarounds. Holds a verified record of national hackathon qualifications, podium finishes, and speed-prototyping under intense time constraints.",
    skills: ["Rapid Prototyping", "Data Structures & Algos", "Hackathon Strategy", "Live Demo Pitching", "Cloud Deployments"],

    /* [EDIT: Suspect 2 - Projects Dossier] */
    projects: [
      {
        title: "International Innovation Expo",
        oneLiner: "Silver Medalist system design for edge device automation (Univ. Malaysia Perlis).",
        link: "#achievements",
      },
      {
        title: "IIT Madras Neurohack",
        oneLiner: "Top 25 National Finalist building real-time sensor processing pipelines.",
        link: "#achievements",
      },
    ],

    /* [EDIT: Suspect 2 - Associated Records / Links] */
    links: [
      { label: "Case Files / Honors", url: "#achievements" },
      { label: "Certificates Vault", url: "#certifications" },
    ],
  },
  {
    /* [EDIT: Suspect 3 - Core Identifiers] */
    id: "leader",
    number: 3,
    code: "ASW-0003",
    name: "THE LEADER",
    heightCm: 181,
    heightFtIn: "5'11\"",
    pose: "hands behind back",
    accentColor: "#EF4444", // Accent Red
    accentBorder: "border-red-500",
    accentBg: "bg-red-500/10",
    accentGlow: "rgba(239, 68, 68, 0.35)",
    icon: "flag",
    imageSrc: "/lineup/suspect-3.png",
    chestPatchOffset: { x: 53.8, y: 27.6 },
    placardOffset: { x: 0, y: 2 },
    placardTilt: -0.8,

    /* [EDIT: Suspect 3 - Interrogation Report & Bio] */
    charge: "Caught rallying 50+ engineers to deliver a massive semester launch two weeks ahead of schedule.",
    bio: "Strategic community operator and squad lead. Bridges deep technical execution with clear milestone roadmaps, cross-functional consensus, and transparent communication across university and developer collectives.",
    skills: ["Team Orchestration", "Agile Sprints", "Product Roadmapping", "Public Speaking", "Community Operations"],

    /* [EDIT: Suspect 3 - Projects Dossier] */
    projects: [
      {
        title: "Campus Developer Community",
        oneLiner: "Scaled collegiate developer guild from 20 to 180+ active peer contributors.",
        link: "#experience",
      },
      {
        title: "E-Cell Tech Summit Infrastructure",
        oneLiner: "Directed end-to-end technical infrastructure for 1,200 regional attendees.",
        link: "#experience",
      },
    ],

    /* [EDIT: Suspect 3 - Associated Records / Links] */
    links: [
      { label: "Service Records", url: "#experience" },
      { label: "Leadership Dossier", url: "#contact" },
    ],
  },
  {
    /* [EDIT: Suspect 4 - Core Identifiers] */
    id: "mentor",
    number: 4,
    code: "ASW-0004",
    name: "THE MENTOR",
    heightCm: 169,
    heightFtIn: "5'6.5\"",
    pose: "hands in pockets",
    accentColor: "#10B981", // Accent Green
    accentBorder: "border-emerald-500",
    accentBg: "bg-emerald-500/10",
    accentGlow: "rgba(16, 185, 129, 0.35)",
    icon: "compass",
    imageSrc: "/lineup/suspect-4.png",
    chestPatchOffset: { x: 54.0, y: 27.7 },
    placardOffset: { x: 0, y: 4 },
    placardTilt: 1.0,

    /* [EDIT: Suspect 4 - Interrogation Report & Bio] */
    charge: "Repeatedly caught providing unsolicited breakthrough debugging guidance to struggling junior peers.",
    bio: "Technical mentor and knowledge architect. Firm believer that true mastery of software engineering means explaining distributed systems in plain English. Dedicated to making complex ideas immediately accessible.",
    skills: ["1-on-1 Code Review", "Curriculum Design", "Pair Programming", "Technical Writing", "Knowledge Sharing"],

    /* [EDIT: Suspect 4 - Projects Dossier] */
    projects: [
      {
        title: "Peer Learning Circles",
        oneLiner: "Weekly problem-solving workshops demystifying algorithms, Git internals, and clean code.",
        link: "#education",
      },
      {
        title: "Open Source Onboarding Primer",
        oneLiner: "Step-by-step primer that helped 30+ beginners submit and land their first merged PR.",
        link: "#skills",
      },
    ],

    /* [EDIT: Suspect 4 - Associated Records / Links] */
    links: [
      { label: "Academic Records", url: "#education" },
      { label: "Skill Checkpoints", url: "#skills" },
    ],
  },
  {
    /* [EDIT: Suspect 5 - Core Identifiers] */
    id: "poet",
    number: 5,
    code: "ASW-0005",
    name: "THE POET",
    heightCm: 175,
    heightFtIn: "5'9\"",
    pose: "hands clasped",
    accentColor: "#A855F7", // Accent Purple
    accentBorder: "border-purple-500",
    accentBg: "bg-purple-500/10",
    accentGlow: "rgba(168, 85, 247, 0.35)",
    icon: "quill",
    imageSrc: "/lineup/suspect-5.png",
    chestPatchOffset: { x: 54.9, y: 27.9 },
    placardOffset: { x: 0, y: 0 },
    placardTilt: -1.0,

    /* [EDIT: Suspect 5 - Interrogation Report & Bio] */
    charge: "Refusing to leave any sentence unpolished and crafting technical copy with dangerous lyrical precision.",
    bio: "Wordsmith and creative writer with published poetry and anthologized essays. Treats linguistic clarity as the bedrock of clean APIs, intuitive UX micro-copy, and memorable digital experiences.",
    skills: ["Creative Writing", "Technical Copywriting", "Micro-copy & Tone", "Narrative Design", "Editorial Polish"],

    /* [EDIT: Suspect 5 - Projects Dossier] */
    projects: [
      {
        title: "Published Poetry Anthologies",
        oneLiner: "Printed collections exploring memory, craftsmanship, architecture, and time.",
        link: "#contact",
      },
      {
        title: "The Craftsmanship Essays",
        oneLiner: "Essays dissecting the aesthetic and engineering parallels between prose and software.",
        link: "#contact",
      },
    ],

    /* [EDIT: Suspect 5 - Associated Records / Links] */
    links: [
      { label: "Read Dossier", url: "#contact" },
      { label: "Download Resume", url: "/Aswin_A_Resume.pdf" },
    ],
  },
];
