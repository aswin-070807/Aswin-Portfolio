import { useQuery } from "@tanstack/react-query";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  points: string[];
  link?: string | undefined;
  linkLabel?: string | undefined;
}

export const EXPERIENCE_SHEET_ID = "1Ss8UmyUWg04gKZqQZntCYKxJPwdXHzDFgACQifnKQkQ";

export const fallbackExperience: ExperienceItem[] = [
  {
    id: "exp-mentor-unstop",
    role: "Mentor",
    company: "Unstop",
    period: "October 2026 - Present",
    description:
      "As a mentor on Unstop, I am passionate about guiding students and young professionals in their career journey. I provide insights on skill development, career planning, industry trends, and personal growth to help mentees achieve their goals with confidence and clarity.",
    points: [
      "Guiding students and young professionals in their career journey, skill development, and industry trends.",
      "Providing actionable career planning and personal growth insights to help mentees achieve their goals with confidence.",
    ],
    link: "https://unstop.com/mentor/aswin07?ref=kpbIAVR0",
    linkLabel: "View Mentor Profile",
  },
  {
    id: "exp-campus-rep-gfg",
    role: "Campus Representative",
    company: "GeeksforGeeks",
    period: "June 2026 - Present",
    description:
      "Promoted AI learning initiatives across campus. Organized workshops for students. Strengthened peer engagement in the tech community.",
    points: [
      "Promoted AI learning initiatives across campus",
      "Organized workshops for students",
      "Strengthened peer engagement in the tech community",
    ],
  },
  {
    id: "exp-trainee-axonmet",
    role: "Email & Chat Process Trainee",
    company: "Axonmet Technologies",
    period: "March 2026 - April 2026",
    description:
      "Managed customer queries with clarity, empathy and professionalism. Hands-on experience with CRM tools.",
    points: [
      "Managed customer queries with clarity, empathy and professionalism",
      "Hands-on experience with CRM tools",
    ],
  },
];

// RFC-compliant CSV parser capable of handling multiline and quotes
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let curr = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        curr += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(curr.trim());
      curr = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(curr.trim());
      if (row.some((cell) => cell.length > 0)) lines.push(row);
      row = [];
      curr = "";
    } else {
      curr += char;
    }
  }

  if (curr.length > 0 || row.length > 0) {
    row.push(curr.trim());
    if (row.some((cell) => cell.length > 0)) lines.push(row);
  }

  return lines;
}

export function parseDescription(rawDesc: string): {
  cleanDesc: string;
  points: string[];
  link?: string | undefined;
  linkLabel?: string | undefined;
} {
  if (!rawDesc) return { cleanDesc: "", points: [] };

  let desc = rawDesc.trim();
  let link: string | undefined;
  let linkLabel: string | undefined;

  // Extract URLs from description if present
  const linkLabelMatch = desc.match(
    /(?:([A-Za-z\s]+?)\s*(?:Link|Profile|URL)?:\s*)?(https?:\/\/[^\s"'<>]+)/i,
  );

  if (linkLabelMatch && linkLabelMatch[2]) {
    link = linkLabelMatch[2].trim();
    if (linkLabelMatch[1] && linkLabelMatch[1].trim().length > 0) {
      linkLabel = `${linkLabelMatch[1].trim()} Link`;
    } else if (link.includes("unstop.com")) {
      linkLabel = "Unstop Mentor Profile";
    } else if (link.includes("github.com")) {
      linkLabel = "GitHub Repository";
    } else if (link.includes("linkedin.com")) {
      linkLabel = "LinkedIn Profile";
    } else {
      linkLabel = "View Profile / Link";
    }
    // Remove the link sentence/fragment from description
    desc = desc.replace(linkLabelMatch[0], "").trim();
  }

  // Parse points by bullet indicators: ▹, ?, newlines, •, -, or sentences
  let points: string[] = [];

  if (
    desc.includes("▹") ||
    desc.includes("•") ||
    desc.includes("\n") ||
    (desc.includes("?") && !desc.includes("who?") && !desc.includes("what?"))
  ) {
    points = desc
      .split(/[▹•\n\r?|]/)
      .map((s) => s.replace(/^[•\-*▹\s]+/, "").trim())
      .filter((s) => s.length > 0);
  } else {
    // If it's multiple sentences, split by punctuation followed by capital letter
    const sentences = desc
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (sentences.length > 1 && sentences.every((s) => s.length < 180)) {
      points = sentences;
    } else {
      points = [desc];
    }
  }

  return { cleanDesc: desc, points, link, linkLabel };
}

export function parseGoogleSheetExperienceCSV(csvText: string): ExperienceItem[] {
  const rows = parseCSV(csvText);
  if (!rows || rows.length === 0) return fallbackExperience;

  // Dynamically find header row
  let headerIndex = -1;
  const colMap: {
    role?: number;
    company?: number;
    period?: number;
    description?: number;
  } = {};

  for (let r = 0; r < rows.length; r++) {
    const currentRow = rows[r];
    if (!currentRow) continue;
    const row = currentRow.map((c) => c.toLowerCase());
    const roleIdx = row.findIndex(
      (c) => c.includes("role") || c.includes("position") || c.includes("title"),
    );
    const compIdx = row.findIndex(
      (c) =>
        c.includes("company") ||
        c.includes("organis") ||
        c.includes("organiz") ||
        c.includes("org"),
    );

    if (roleIdx !== -1 || compIdx !== -1) {
      headerIndex = r;
      row.forEach((col, idx) => {
        if (col.includes("role") || col.includes("position") || col.includes("title")) {
          colMap.role = idx;
        } else if (
          col.includes("company") ||
          col.includes("organis") ||
          col.includes("organiz") ||
          col.includes("org")
        ) {
          colMap.company = idx;
        } else if (
          col.includes("period") ||
          col.includes("duration") ||
          col.includes("time") ||
          col.includes("date")
        ) {
          colMap.period = idx;
        } else if (col.includes("desc") || col.includes("point") || col.includes("detail")) {
          colMap.description = idx;
        }
      });
      break;
    }
  }

  if (headerIndex === -1) {
    return fallbackExperience;
  }

  const items: ExperienceItem[] = [];

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const rawRole = (colMap.role !== undefined ? row[colMap.role] : "") || "";
    const rawCompany = (colMap.company !== undefined ? row[colMap.company] : "") || "";
    if (!rawRole && !rawCompany) continue;

    const role = rawRole.trim() || "Role";
    const company = rawCompany.trim() || "";
    const period = (colMap.period !== undefined ? row[colMap.period] : "")?.trim() || "";
    const rawDesc = (colMap.description !== undefined ? row[colMap.description] : "") || "";

    const { cleanDesc, points, link, linkLabel } = parseDescription(rawDesc);
    const id = `exp-${i}-${role.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    items.push({
      id,
      role,
      company,
      period,
      description: cleanDesc,
      points,
      link,
      linkLabel,
    });
  }

  return items.length > 0 ? items : fallbackExperience;
}

const LOCAL_STORAGE_KEY = "aswin_portfolio_experience_cache";

export async function fetchExperience(): Promise<ExperienceItem[]> {
  const timestamp = Date.now();
  const urls = [
    `https://docs.google.com/spreadsheets/d/${EXPERIENCE_SHEET_ID}/export?format=csv&t=${timestamp}`,
    `https://docs.google.com/spreadsheets/d/${EXPERIENCE_SHEET_ID}/gviz/tq?tqx=out:csv&t=${timestamp}`,
  ];

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(url, {
        signal: controller.signal,
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const csvText = await res.text();
        const parsed = parseGoogleSheetExperienceCSV(csvText);

        if (parsed && parsed.length > 0) {
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
            } catch {
              // Ignore storage quotas
            }
          }
          return parsed;
        }
      }
    } catch {
      // Try next endpoint
    }
  }

  // If live fetch fails, read from cache
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        if (Array.isArray(parsedCache) && parsedCache.length > 0) {
          return parsedCache;
        }
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  return fallbackExperience;
}

export function useExperience() {
  return useQuery({
    queryKey: ["experience-live-sync"],
    queryFn: fetchExperience,
    placeholderData: fallbackExperience,
    staleTime: 0, // Always fetch latest updates from Google Sheets
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Background poll every 30 seconds
  });
}
