export interface ExtractedLink {
  label: string;
  url: string;
}

export interface ServiceRecordItem {
  id: string;
  recordNumber: number; // 1, 2, 3...
  idNumber: string; // e.g. "SR-2026-001"
  role: string;
  organisation: string;
  rawPeriod: string;
  validFrom?: string;
  validTo?: string;
  status?: "ON DUTY" | "ASSIGNMENT COMPLETE";
  logEntries: string[];
  extractedLinks: ExtractedLink[];
  logo?: string;
  link?: string;
  linkLabel?: string;
  certificateLink?: string;
  hide?: boolean;
}

// TODO: Paste your published Google Sheet CSV link for Experience (Sheet1 tab) here or set VITE_EXPERIENCE_CSV_URL in your .env
export const DEFAULT_EXPERIENCE_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_experience_placeholder/pub?gid=0&single=true&output=csv";

// Helper to extract links from description (e.g. "Mentor Link: https://...")
export function extractDescriptionLinks(text: string): {
  cleanedText: string;
  links: ExtractedLink[];
} {
  if (!text) return { cleanedText: "", links: [] };

  const links: ExtractedLink[] = [];
  // Match "Label: https://..." pattern
  const linkRegex = /(?:^|\s+)([A-Za-z0-9\s]+?):\s*(https:\/\/[^\s]+)/g;

  let cleaned = text;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    const rawLabel = match[1]?.trim() || "Link";
    const rawUrl = match[2]?.trim() || "";
    if (rawUrl.startsWith("https://")) {
      links.push({
        label: rawLabel,
        url: rawUrl,
      });
      cleaned = cleaned.replace(match[0], "");
    }
  }

  // Clean trailing spaces, commas, semicolons, dashes, periods
  const trimmedCleaned = cleaned.trim().replace(/[\s,;.-]+$/, "");

  return {
    cleanedText: trimmedCleaned,
    links,
  };
}

// Helper to split log entries by "▹", "▸", newline, "|", or leading "•"
export function splitLogEntries(desc: string): string[] {
  if (!desc) return [];

  // Check if delimiter exists
  if (/[▹▸\n|•]/.test(desc)) {
    return desc
      .split(/[▹▸\n|•]/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  // Single paragraph
  const single = desc.trim();
  return single ? [single] : [];
}

// Helper to parse period: "October 2026-Present"
export function parsePeriod(period: string): {
  raw: string;
  from?: string;
  to?: string;
  status?: "ON DUTY" | "ASSIGNMENT COMPLETE";
  year?: string;
} {
  if (!period) return { raw: "" };

  const trimmed = period.trim();
  const parts = trimmed.split(/\s*[-–—]\s*/);

  // Extract year from from/to
  const yearMatch = trimmed.match(/\b(20\d\d|19\d\d)\b/);
  const detectedYear = yearMatch ? yearMatch[1] : undefined;

  if (parts.length >= 2 && parts[0]) {
    const from = parts[0].trim();
    const toRaw = parts.slice(1).join("-").trim();
    const isOngoing = /present|ongoing|current|now/i.test(toRaw);

    return {
      raw: trimmed,
      from,
      to: isOngoing ? "PRESENT" : toRaw,
      status: isOngoing ? "ON DUTY" : "ASSIGNMENT COMPLETE",
      year: detectedYear,
    };
  }

  return {
    raw: trimmed,
    year: detectedYear,
  };
}

// Generate smart agency insignia monogram from organization name
export function getOrgMonogram(org: string): string {
  if (!org) return "SR";
  const words = org.trim().split(/\s+/);
  if (words.length >= 2 && words[0] && words[1]) {
    return (words[0][0]! + words[1][0]!).toUpperCase();
  }
  const capitals = org.match(/[A-Z]/g);
  if (capitals && capitals.length >= 2) {
    return (capitals[0]! + capitals[1]!).toUpperCase();
  }
  return org.slice(0, 2).toUpperCase();
}

// 3 Bundled Fallback Rows used if CSV URL is unset, fetch fails, or offline
export const FALLBACK_EXPERIENCE_RAW = [
  {
    role: "Mentor",
    organisation: "Unstop",
    period: "October 2026-Present",
    description:
      "As a mentor on Unstop, I am passionate about guiding students and young professionals in their career journey. I provide insights on skill development, career planning, industry trends, and personal growth to help mentees achieve their goals with confidence and clarity. Mentor Link: https://unstop.com/mentor/aswin07?ref=kpbIAVR0",
  },
  {
    role: "Campus Representative",
    organisation: "GeeksforGeeks",
    period: "June 2026-Present",
    description:
      "Promoted AI learning initiatives across campus ▹Organized workshops for students ▹Strengthened peer engagement in the tech community",
  },
  {
    role: "Email & Chat Process Trainee",
    organisation: "Axonmet Technologies",
    period: "March 2026-April 2026",
    description:
      "Managed customer queries with clarity, empathy and professionalism ▹Hands-on experience with CRM tools",
  },
];

// Factory to create parsed fallback ServiceRecordItems
export function createBundledExperience(): ServiceRecordItem[] {
  return FALLBACK_EXPERIENCE_RAW.map((row, idx) => {
    const { cleanedText, links } = extractDescriptionLinks(row.description);
    const logEntries = splitLogEntries(cleanedText);
    const parsedP = parsePeriod(row.period);
    const currentYear = new Date().getFullYear().toString();
    const year = parsedP.year || currentYear;
    const num = String(idx + 1).padStart(3, "0");
    const idNumber = `SR-${year}-${num}`;

    return {
      id: `fallback-exp-${idx + 1}`,
      recordNumber: idx + 1,
      idNumber,
      role: row.role,
      organisation: row.organisation,
      rawPeriod: parsedP.raw,
      validFrom: parsedP.from,
      validTo: parsedP.to,
      status: parsedP.status,
      logEntries,
      extractedLinks: links,
      hide: false,
    };
  });
}
