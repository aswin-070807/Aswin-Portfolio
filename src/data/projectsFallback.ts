export interface ProjectItem {
  id: string;
  exhibitLetter: string; // e.g. "EXHIBIT A"
  exhibitNumber: number; // 1, 2, 3...
  title: string;
  category: string;
  description: string;
  descriptionMain: string;
  descriptionNote?: string;
  techStack: string[];
  githubLink: string;
  isConfidential: boolean;
  confidentialMessage?: string;
  status: string;
  screenshots: string[];
  liveUrl?: string;
  linkLabel?: string;
  year?: string;
  problem?: string;
  role?: string;
  result?: string;
  featured: boolean;
  hide: boolean;
}

// Live Google Sheet sync link for Projects (automatically converted to live CSV endpoint)
export const DEFAULT_PROJECTS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1WoOKuAQZ4Iea-fLBhnhfKA1DHI0fMxQu4273H0t14hM/edit?usp=sharing";

// Helper to compute exhibit letter: 0 -> A, 1 -> B, 25 -> Z, 26 -> AA...
export function getExhibitLetter(index: number): string {
  if (index < 26) {
    return `EXHIBIT ${String.fromCharCode(65 + index)}`;
  }
  const first = String.fromCharCode(65 + Math.floor(index / 26) - 1);
  const second = String.fromCharCode(65 + (index % 26));
  return `EXHIBIT ${first}${second}`;
}

// Helper to split bracketed notes: "[Note: ...]"
export function splitDescriptionNote(desc: string): {
  mainText: string;
  note?: string;
} {
  if (!desc) return { mainText: "" };
  const match = desc.match(/\[(Note:[\s\S]*?)\]/i);
  if (match && match.index !== undefined) {
    const mainText = desc.slice(0, match.index).trim() + " " + desc.slice(match.index + match[0].length).trim();
    return {
      mainText: mainText.trim(),
      note: `[${match[1]}]`,
    };
  }
  return { mainText: desc.trim() };
}

// 5 Bundled fallback rows used if the CSV URL is empty, fetch fails, or offline
export const FALLBACK_PROJECTS_RAW = [
  {
    title: "Road Side Aid Pro",
    category: "Road safety",
    description:
      "A mission-critical, mobile-first emergency web application providing one-tap emergency response, live GPS geolocation, real-time nearest responder mapping, and automated alerts across all 38 districts of Tamil Nadu.",
    techStack: [
      "React",
      "Tanstack",
      "Tailwind CSS",
      "Supabase",
      "Typescript",
      "Javascript",
    ],
    role: "Alex Chen",
    githubLink: "https://github.com/aswin-070807/roadside-aid-pro",
    status: "In Progress",
  },
  {
    title: "Hostel Buddy",
    category: "Smart Campus",
    description:
      "Hostel Buddy explores how modern web technologies can replace physical paper slips, manual record ledgers, and office queues in college hostels. The system delivers an automated, instantaneous leave request and approval workflow with a tailored Navy Blue & White design language.",
    techStack: ["Typescript", "Javascript", "Tailwind CSS", "Supabase"],
    role: "Sarah Jenkins",
    githubLink: "https://github.com/aswin-070807/hostel-buddy",
    status: "In Progress",
  },
  {
    title: "Suzharchi - Fabric of Transformation",
    category: "Sustainability",
    description:
      "Our thesis is transformation: a discarded item should not merely be recycled into down-graded fibers — it can become something superior, handled, and mended. From post-consumer denim tailored into rugged totes to discarded railway teak turned into heirloom furniture, Suzharchi connects verified artisans with buyers who value material provenance.",
    techStack: [
      "React",
      "Tanstack",
      "Tailwind CSS",
      "Supabase",
      "Typescript",
      "Javascript",
      "Motion+GSAP",
    ],
    role: "Devon Vance",
    githubLink: "https://github.com/aswin-070807/fabric-of-transformation",
    status: "In Progress",
  },
  {
    title: "Corner Crafted Web",
    category: "Commercial Project",
    description:
      "A commercial project for a cafe named Cafe Corner. Cafe Corner is Trichy's cozy destination for freshly brewed South Indian filter coffee, artisanal espresso, gourmet snacks, and decadent desserts. Designed with a warm, inviting aesthetic, the cafe provides a relaxing atmosphere for students, remote professionals, families, and coffee connoisseurs.",
    techStack: ["TensorFlow.js", "OpenCV", "WebRTC", "React Native"],
    role: "Maya Patel",
    githubLink: "https://github.com/aswin-070807/corner-crafted-web",
    status: "Completed",
  },
  {
    title: "Caliper AI",
    category: "Smart Education",
    description:
      "AI-enabled skill intelligence and personalized learning platform for India's Official Statistical System (OSS), integrated with the iGOT Karmayogi ecosystem. [Note: This is a part of SIH and not a official Government Project]",
    techStack: [
      "React.js/Node.js",
      "Tailwind CSS",
      "Rest API",
      "NLP",
      "LLM Models",
      "Javascript",
      "Python",
      "Typescript",
    ],
    role: "Liam Torres",
    githubLink:
      "*Sorry for the inconvinience, this project link will not be displayed due to confidential files",
    status: "Completed",
  },
];

export function createBundledProjects(): ProjectItem[] {
  return FALLBACK_PROJECTS_RAW.map((row, idx) => {
    const isConfidential = row.githubLink.startsWith("*");
    const confidentialMessage = isConfidential
      ? row.githubLink.slice(1).trim()
      : undefined;
    const { mainText, note } = splitDescriptionNote(row.description);

    return {
      id: `fallback-project-${idx + 1}`,
      exhibitLetter: getExhibitLetter(idx),
      exhibitNumber: idx + 1,
      title: row.title,
      category: row.category,
      description: row.description,
      descriptionMain: mainText,
      descriptionNote: note,
      techStack: row.techStack,
      githubLink: isConfidential ? "" : row.githubLink,
      isConfidential,
      confidentialMessage,
      status: row.status,
      role: (row as any).role,
      screenshots: [],
      featured: false,
      hide: false,
    };
  });
}
