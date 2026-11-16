import { useQuery } from "@tanstack/react-query";

export interface HackathonItem {
  id: string;
  eventName: string;
  position: string;
  host: string;
  level: string;
  certificateLink: string;
  previewUrl: string;
  isHighlight: boolean;
}

export const GOOGLE_SHEET_ID = "1q9M3-5dd5HV9bD2x7QrCfiegaDlY04f0lFeBlpukvz4";

export function formatUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

// Helper to convert Google Drive sharing link to embeddable preview URL
export function getDrivePreviewUrl(rawUrl: string): string {
  const url = formatUrl(rawUrl);
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

// Fallback seed data matching the Google Sheet so SSR and offline never flash blank
export const fallbackHackathons: HackathonItem[] = [
  {
    id: "silver-malaysia-expo",
    eventName: "Internation Innovation Expo and System Design",
    position: "Silver Medal",
    host: "University Malaysia, Perlis",
    level: "Global",
    certificateLink:
      "https://drive.google.com/file/d/1-_yQE57EmKOvMrpnJ-fQNDmfNiu1G0xI/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/1-_yQE57EmKOvMrpnJ-fQNDmfNiu1G0xI/preview",
    isHighlight: true,
  },
  {
    id: "neurohack-iitm",
    eventName: "Neurohack 2025: IITM",
    position: "Top 25 Finalist",
    host: "IIT Madras",
    level: "National Final",
    certificateLink:
      "https://drive.google.com/file/d/1zU6a8kMVFBRUBC4PaO40uFIRf4SMqV8n/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/1zU6a8kMVFBRUBC4PaO40uFIRf4SMqV8n/preview",
    isHighlight: true,
  },
  {
    id: "technova-cit",
    eventName: "Technova 26, CIT National Hackathon",
    position: "Top 30 Finalist",
    host: "Coimbatore Institute of Technology",
    level: "National Final",
    certificateLink:
      "https://drive.google.com/file/d/13_XYkVth6Z56uO89eMt9OUCvhLllS5C1/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/13_XYkVth6Z56uO89eMt9OUCvhLllS5C1/preview",
    isHighlight: true,
  },
  {
    id: "odoo-sns",
    eventName: "SNS v ODOO National Hackathon",
    position: "National Finalist",
    host: "ODOO x SNS College of Engineering and Technology",
    level: "National Final",
    certificateLink:
      "https://drive.google.com/file/d/1TaEpq5GolLnuqXItIUkdb4bO68M70K6y/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/1TaEpq5GolLnuqXItIUkdb4bO68M70K6y/preview",
    isHighlight: true,
  },
  {
    id: "icsc-qualifier",
    eventName: "ICSC Qualifier",
    position: "Qualifier",
    host: "International Computer Science and Competition",
    level: "Qualifier",
    certificateLink:
      "https://drive.google.com/file/d/1oZKVSbwn1MFgJLljCQ8AeqaG7ZswphSw/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/1oZKVSbwn1MFgJLljCQ8AeqaG7ZswphSw/preview",
    isHighlight: false,
  },
  {
    id: "adobe-university",
    eventName: "Adobe University Hackathon",
    position: "Top 26,000 / 3 Lakh+ Teams",
    host: "Adobe University",
    level: "Global",
    certificateLink:
      "https://drive.google.com/file/d/1p1nJwogSijmQVFBIUmJlvmXisV_1UbWD/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/1p1nJwogSijmQVFBIUmJlvmXisV_1UbWD/preview",
    isHighlight: false,
  },
  {
    id: "studai-foundry",
    eventName: "StudAI Foundry Hackathon",
    position: "Participant",
    host: "StudAI one",
    level: "National",
    certificateLink:
      "https://drive.google.com/file/d/1Em6J-FO3FJC77S9iJnyPGe2nXET_PHAK/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/1Em6J-FO3FJC77S9iJnyPGe2nXET_PHAK/preview",
    isHighlight: false,
  },
  {
    id: "immersive-xr",
    eventName: "Immersive XR Hackathon",
    position: "Participant",
    host: "Sri Ramakrishna Engineering College",
    level: "Inter College",
    certificateLink:
      "https://drive.google.com/file/d/1Q8zs2K7VRQd21CzAh0MgvOLaoeqNviFU/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/1Q8zs2K7VRQd21CzAh0MgvOLaoeqNviFU/preview",
    isHighlight: false,
  },
  {
    id: "nit-vortex",
    eventName: "NIT x Vortex Hackathon",
    position: "Participant",
    host: "National Institute of Trichy",
    level: "National",
    certificateLink:
      "https://drive.google.com/file/d/14NECNM_avjj7rtJEEaKDu9ApNRLxuFA7/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/14NECNM_avjj7rtJEEaKDu9ApNRLxuFA7/preview",
    isHighlight: false,
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

export function parseGoogleSheetCSV(csvText: string): HackathonItem[] {
  const rows = parseCSV(csvText);
  if (!rows || rows.length === 0) return fallbackHackathons;

  // Search for the header row dynamically
  let headerIndex = -1;
  const colMap: {
    position?: number;
    eventName?: number;
    host?: number;
    level?: number;
    certificate?: number;
  } = {};

  for (let r = 0; r < rows.length; r++) {
    const currentRow = rows[r];
    if (!currentRow) continue;
    const row = currentRow.map((c) => c.toLowerCase());
    const eventIdx = row.findIndex((c) => c.includes("event"));
    const posIdx = row.findIndex((c) => c.includes("position"));

    if (eventIdx !== -1 || posIdx !== -1) {
      headerIndex = r;
      row.forEach((col, idx) => {
        if (col.includes("position")) colMap.position = idx;
        else if (col.includes("event")) colMap.eventName = idx;
        else if (col.includes("host")) colMap.host = idx;
        else if (col.includes("level")) colMap.level = idx;
        else if (col.includes("cert")) colMap.certificate = idx;
      });
      break;
    }
  }

  if (headerIndex === -1) {
    return fallbackHackathons;
  }

  const items: HackathonItem[] = [];

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const rawEventName = (colMap.eventName !== undefined ? row[colMap.eventName] : "") || "";
    if (!rawEventName || rawEventName.trim().length === 0) continue;

    let position = (colMap.position !== undefined ? row[colMap.position] : "") || "";
    const host = (colMap.host !== undefined ? row[colMap.host] : "") || "";
    const level = (colMap.level !== undefined ? row[colMap.level] : "") || "National";
    const rawCertificate = (colMap.certificate !== undefined ? row[colMap.certificate] : "") || "";

    const eventName = rawEventName.trim();
    const certificateLink = formatUrl(rawCertificate);

    // Standardize position display if empty or generic
    if (!position || position.trim() === "") {
      position = level.toLowerCase().includes("qualifier") ? "Qualifier" : "Participant";
    }

    const posLower = position.toLowerCase();
    const isHighlight =
      posLower.includes("silver") ||
      posLower.includes("gold") ||
      posLower.includes("winner") ||
      posLower.includes("top 25") ||
      posLower.includes("top 30") ||
      posLower.includes("finalist");

    const id = `hackathon-${i}-${eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    items.push({
      id,
      eventName,
      position: position.trim(),
      host: host.trim(),
      level: level.trim(),
      certificateLink,
      previewUrl: getDrivePreviewUrl(certificateLink),
      isHighlight,
    });
  }

  return items.length > 0 ? items : fallbackHackathons;
}

const LOCAL_STORAGE_KEY = "aswin_portfolio_hackathons_cache";

export async function fetchHackathons(): Promise<HackathonItem[]> {
  // URLs with cache-busting timestamp parameter to bypass browser and CDN caches
  const timestamp = Date.now();
  const urls = [
    `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&t=${timestamp}`,
    `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&t=${timestamp}`,
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
        const parsed = parseGoogleSheetCSV(csvText);

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

  // If live fetch fails (e.g. user offline), read from localStorage cache
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

  return fallbackHackathons;
}

export function useHackathons() {
  return useQuery({
    queryKey: ["hackathons-live-sync"],
    queryFn: fetchHackathons,
    placeholderData: fallbackHackathons,
    staleTime: 0, // Always consider stale so client immediately fetches fresh data!
    refetchOnMount: true, // Always refetch on page load
    refetchOnWindowFocus: true, // Refetch whenever visitor switches back to the tab
    refetchInterval: 30000, // Poll every 30 seconds for live updates
  });
}
