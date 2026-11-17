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
  chestPatchOffset: { x: number; y: number };
  placardOffset: { x: number; y: number };
  placardTilt: number;
}

export const SUSPECTS_DATA: SuspectData[] = [
  {
    // SOURCE: Prompt Specification & src/components/portfolio/AboutDossier.tsx (Passport of the Builder)
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
    chestPatchOffset: { x: 55.3, y: 28.0 },
    placardOffset: { x: 0, y: 0 },
    placardTilt: -1.2,

    // SOURCE: Built from real projects in src/data/projectsFallback.ts (Road Side Aid Pro across 38 TN districts & Hostel Buddy)
    charge: "Charged with: deploying responsive emergency GPS apps and smart campus systems across Tamil Nadu.",

    // SOURCE: src/components/portfolio/AboutDossier.tsx (Bio 1 "HOW I WORK" & Passport "B.E. Computer Science & Engineering")
    bio: "CSE student who learns by building. Give him a messy problem and his first move is to get something working, then break it, fix it, and keep improving it until it holds up. Across React, Node.js and Python, he builds tools that stay simple enough for anyone to use.",

    // SOURCE: src/data/projectsFallback.ts (Road Side Aid Pro & Hostel Buddy tech stacks)
    skills: ["React", "TypeScript", "Node.js", "Python", "Tailwind CSS", "Supabase"],

    // SOURCE: Real repositories in src/data/projectsFallback.ts
    projects: [
      {
        title: "Road Side Aid Pro",
        oneLiner: "Mobile-first emergency web application with live GPS geolocation and nearest responder mapping across 38 districts of Tamil Nadu.",
        link: "https://github.com/aswin-070807/roadside-aid-pro",
      },
      {
        title: "Hostel Buddy",
        oneLiner: "Automated digital leave request and approval workflow replacing physical paper slips and queue ledgers in college hostels.",
        link: "https://github.com/aswin-070807/hostel-buddy",
      },
    ],

    // SOURCE: Real profiles in src/components/portfolio/AboutDossier.tsx
    links: [
      { label: "GitHub Profile", url: "https://github.com/aswin-070807" },
      { label: "LeetCode Profile", url: "https://leetcode.com/u/Aswin787" },
    ],
  },
  {
    // SOURCE: Prompt Specification & src/data/achievementsFallback.ts
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
    chestPatchOffset: { x: 52.1, y: 27.4 },
    placardOffset: { x: 0, y: 8 },
    placardTilt: 1.5,

    // SOURCE: Real competitive wins in src/data/achievementsFallback.ts (Cases 001 & 002)
    charge: "Charged with: winning Silver at an International Innovation Expo and storming the IIT Madras Neurohack finals.",

    // SOURCE: src/components/portfolio/AboutDossier.tsx (Bio 2 "UNDER PRESSURE")
    bio: "Hackathons gave him time management and the ability to prove solutions under pressure. In a 72-hour build with the clock running down, you learn fast what actually matters in a demo. Regular practice on CodeChef and LeetCode built the habit of testing solutions harder than anyone else.",

    // SOURCE: Verified coding profiles in src/components/portfolio/AboutDossier.tsx (VERIFIED_PROFILES)
    skills: ["Algorithm Design", "CodeChef (aswina_srit)", "LeetCode (Aswin787)", "Rapid Prototyping", "Hackathon Strategy"],

    // SOURCE: Real achievement case files and verified Google Drive certificates in src/data/achievementsFallback.ts
    projects: [
      {
        title: "International Innovation Expo",
        oneLiner: "Silver Medal for System Design at University Malaysia, Perlis (Global Level Final).",
        link: "https://drive.google.com/file/d/1-_yQE57EmKOvMrpnJ-fQNDmfNiu1G0xI/view?usp=sharing",
      },
      {
        title: "Neurohack 2025: IITM",
        oneLiner: "Top 25 National Finalist at Indian Institute of Technology Madras (IITM).",
        link: "https://drive.google.com/file/d/1zU6a8kMVFBRUBC4PaO40uFIRf4SMqV8n/view?usp=sharing",
      },
      {
        title: "Technova 26 CIT National Hackathon",
        oneLiner: "Top 30 National Finalist hosted by Coimbatore Institute of Technology.",
        link: "https://drive.google.com/file/d/13_XYkVth6Z56uO89eMt9OUCvhLllS5C1/view?usp=sharing",
      },
    ],

    // SOURCE: Real profile tags in src/components/portfolio/AboutDossier.tsx
    links: [
      { label: "CodeChef Profile", url: "https://www.codechef.com/users/aswina_srit" },
      { label: "LeetCode Profile", url: "https://leetcode.com/u/Aswin787" },
    ],
  },
  {
    // SOURCE: Prompt Specification ("REAL CONTENT SO FAR") & src/components/portfolio/AboutDossier.tsx
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
    chestPatchOffset: { x: 55.4, y: 27.8 },
    placardOffset: { x: 0, y: 2 },
    placardTilt: -0.8,

    // SOURCE: User prompt specification ("REAL CONTENT SO FAR")
    charge: "Charged with: leading team 'Byte Blazers' through 15+ hackathons and clinching two internal SIH top-5 spots.",

    // SOURCE: User prompt specification ("REAL CONTENT SO FAR") + AboutDossier.tsx (Bio 3)
    bio: "Team lead of 'Byte Blazers'. Has steered the team through 15+ hackathons and two-time internal Smart India Hackathon (SIH) top 5 selections. Enjoys leading a team as much as building inside one.",

    // SOURCE: Team leadership context from prompt & portfolio
    skills: ["Team Leadership", "Hackathon Strategy", "Smart India Hackathon (SIH)", "Sprint Coordination", "Demo Presenting"],

    // SOURCE: Verified team records specified by user
    projects: [
      {
        title: "Byte Blazers Hackathon Sprints",
        oneLiner: "Led collegiate team across 15+ competitive national hackathons.",
        link: "#achievements",
      },
      {
        title: "Smart India Hackathon (SIH) Internal",
        oneLiner: "Two-time Top 5 internal selection representing collegiate engineering cohort.",
        link: "#achievements",
      },
    ],

    // SOURCE: Verified profile in src/components/portfolio/AboutDossier.tsx
    links: [
      { label: "LinkedIn Profile", url: "https://www.linkedin.com/in/aswin-a-709091293" },
    ],
  },
  {
    // SOURCE: Prompt Specification & src/data/experienceFallback.ts
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
    chestPatchOffset: { x: 54.2, y: 27.8 },
    placardOffset: { x: 0, y: 4 },
    placardTilt: 1.0,

    // SOURCE: src/data/experienceFallback.ts (Service Record 001 - Unstop Mentor & SR 002 - GeeksforGeeks Campus Representative)
    charge: "Charged with: guiding aspiring developers on Unstop and running AI learning workshops with GeeksforGeeks.",

    // SOURCE: src/data/experienceFallback.ts (Direct quote from Service Record descriptions)
    bio: "Active mentor on Unstop, guiding students and young professionals in skill development, career planning, and personal growth. Also serves as GeeksforGeeks Campus Representative, promoting AI learning initiatives and student workshops across campus.",

    // SOURCE: src/data/experienceFallback.ts
    skills: ["Career Planning", "Skill Development", "Workshop Facilitation", "Community Engagement", "Peer Guidance"],

    // SOURCE: Real service records in src/data/experienceFallback.ts
    projects: [
      {
        title: "Unstop Mentorship Track",
        oneLiner: "Providing guidance on skill development, career roadmaps, and personal growth for young professionals.",
        link: "https://unstop.com/mentor/aswin07?ref=kpbIAVR0",
      },
      {
        title: "GeeksforGeeks Campus Initiatives",
        oneLiner: "Promoted AI learning initiatives and organized student workshops to strengthen peer tech engagement.",
        link: "#experience",
      },
    ],

    // SOURCE: Verified mentor link from src/data/experienceFallback.ts
    links: [
      { label: "Unstop Mentor Profile", url: "https://unstop.com/mentor/aswin07?ref=kpbIAVR0" },
      { label: "LinkedIn Profile", url: "https://www.linkedin.com/in/aswin-a-709091293" },
    ],
  },
  {
    // SOURCE: Prompt Specification & src/components/portfolio/AboutDossier.tsx (Bio 3 & Visa Stamp 4)
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
    chestPatchOffset: { x: 55.5, y: 28.0 },
    placardOffset: { x: 0, y: 0 },
    placardTilt: -1.0,

    // SOURCE: src/components/portfolio/AboutDossier.tsx (Bio 3 "OFF THE KEYBOARD")
    charge: "Charged with: mercilessly cutting any sentence or line of code that fails to land.",

    // SOURCE: src/components/portfolio/AboutDossier.tsx (Bio 3 & Visa Stamp 4)
    bio: "Away from the keyboard, Aswin writes poetry. It keeps him honest about words: if a sentence doesn't land, it gets cut. That editorial discipline directly informs his habit of writing clean, uncluttered software and clear user copy.",

    // SOURCE: Linguistic and editorial skills referenced in portfolio
    skills: ["Creative Writing", "Poetry", "Linguistic Precision", "Concise Editing", "Reflective Prose"],

    // NOTE: In compliance with the rule "If a field has no real data, do NOT render that block at all",
    // we omit fake book/anthology claims because no published books exist in the portfolio.
    projects: [],

    // SOURCE: Verified profile in src/components/portfolio/AboutDossier.tsx
    links: [
      { label: "LinkedIn Profile", url: "https://www.linkedin.com/in/aswin-a-709091293" },
    ],
  },
];
