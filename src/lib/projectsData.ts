import { useEffect, useState } from "react";
import {
  type ProjectItem,
  createBundledProjects,
  DEFAULT_PROJECTS_CSV_URL,
  getExhibitLetter,
  splitDescriptionNote,
} from "@/data/projectsFallback";
import { normalizeGoogleSheetCsvUrl, parseCSV } from "@/lib/achievementsData";

const CACHE_KEY = "aswin_projects_cache_v1";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function parseProjectsCSV(csvText: string): ProjectItem[] {
  const rows = parseCSV(csvText);
  if (!rows || rows.length === 0) return createBundledProjects();

  // Scan the first 25 rows to find the header row containing "Project Name" or "Title"
  let headerIndex = -1;
  const colMap: {
    title?: number;
    category?: number;
    description?: number;
    techStack?: number;
    githubLink?: number;
    status?: number;
    screenshot?: number;
    liveUrl?: number;
    linkLabel?: number;
    year?: number;
    problem?: number;
    role?: number;
    result?: number;
    featured?: number;
    hide?: number;
  } = {};

  const scanLimit = Math.min(25, rows.length);
  for (let r = 0; r < scanLimit; r++) {
    const currentRow = rows[r];
    if (!currentRow) continue;
    const lowerRow = currentRow.map((c) => c.toLowerCase().trim());
    const hasTitle = lowerRow.some(
      (c) => c === "project name" || c === "title" || c.includes("project name")
    );

    if (hasTitle) {
      headerIndex = r;
      lowerRow.forEach((col, idx) => {
        if (col === "project name" || col === "title" || col.includes("project name")) {
          colMap.title = idx;
        } else if (col.includes("category") || col.includes("track")) {
          colMap.category = idx;
        } else if (col.includes("description") || col.includes("desc")) {
          colMap.description = idx;
        } else if (col.includes("tech") || col.includes("stack")) {
          colMap.techStack = idx;
        } else if (col.includes("github") || col.includes("repo")) {
          colMap.githubLink = idx;
        } else if (col.includes("status")) {
          colMap.status = idx;
        } else if (col.includes("screenshot") || col.includes("image")) {
          colMap.screenshot = idx;
        } else if (col.includes("live") || col.includes("demo")) {
          colMap.liveUrl = idx;
        } else if (col.includes("label")) {
          colMap.linkLabel = idx;
        } else if (col.includes("year")) {
          colMap.year = idx;
        } else if (col.includes("problem") || col.includes("challenge")) {
          colMap.problem = idx;
        } else if (col.includes("role") || col.includes("lead") || col.includes("author")) {
          colMap.role = idx;
        } else if (col.includes("result") || col.includes("verdict") || col.includes("outcome")) {
          colMap.result = idx;
        } else if (col.includes("feature")) {
          colMap.featured = idx;
        } else if (col.includes("hide")) {
          colMap.hide = idx;
        }
      });
      break;
    }
  }

  if (headerIndex === -1 || colMap.title === undefined) {
    return createBundledProjects();
  }

  interface RawProjectRow {
    title: string;
    category: string;
    description: string;
    techStack: string[];
    rawGithub: string;
    status: string;
    screenshots: string[];
    liveUrl?: string;
    linkLabel?: string;
    year?: string;
    problem?: string;
    role?: string;
    result?: string;
    featured: boolean;
  }

  const rawItems: RawProjectRow[] = [];

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    // Check Hide column
    const rawHide = (colMap.hide !== undefined ? row[colMap.hide] : "") || "";
    if (/^(true|yes|1)$/i.test(rawHide.trim())) continue;

    const title = ((colMap.title !== undefined ? row[colMap.title] : "") || "").trim();
    if (!title) continue; // Required

    const category = ((colMap.category !== undefined ? row[colMap.category] : "") || "Web").trim();
    const description = ((colMap.description !== undefined ? row[colMap.description] : "") || "").trim();

    // Parse Tech Stack (comma-separated, trimmed, drop empty items)
    const rawTech = (colMap.techStack !== undefined ? row[colMap.techStack] : "") || "";
    const techStack = rawTech
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const rawGithub = ((colMap.githubLink !== undefined ? row[colMap.githubLink] : "") || "").trim();
    const status = ((colMap.status !== undefined ? row[colMap.status] : "") || "In Progress").trim();

    // Screenshots separated by " | "
    const rawScreenshots = (colMap.screenshot !== undefined ? row[colMap.screenshot] : "") || "";
    const screenshots = rawScreenshots
      .split("|")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const rawLive = (colMap.liveUrl !== undefined ? row[colMap.liveUrl] : "") || "";
    const liveUrl = rawLive.trim().startsWith("http") ? rawLive.trim() : undefined;
    const linkLabel = colMap.linkLabel !== undefined ? row[colMap.linkLabel]?.trim() || undefined : undefined;

    const year = colMap.year !== undefined ? row[colMap.year]?.trim() || undefined : undefined;
    const problem = colMap.problem !== undefined ? row[colMap.problem]?.trim() || undefined : undefined;
    const role = colMap.role !== undefined ? row[colMap.role]?.trim() || undefined : undefined;
    const result = colMap.result !== undefined ? row[colMap.result]?.trim() || undefined : undefined;

    const rawFeatured = colMap.featured !== undefined ? row[colMap.featured]?.trim() || "" : "";
    const featured = /^(true|yes|1)$/i.test(rawFeatured);

    rawItems.push({
      title,
      category,
      description,
      techStack,
      rawGithub,
      status,
      screenshots,
      liveUrl,
      linkLabel,
      year,
      problem,
      role,
      result,
      featured,
    });
  }

  if (rawItems.length === 0) {
    return createBundledProjects();
  }

  // Sort Featured = TRUE first, preserving relative sheet order
  const sorted = [...rawItems].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return sorted.map((item, idx) => {
    const isConfidential = item.rawGithub.startsWith("*");
    const confidentialMessage = isConfidential
      ? item.rawGithub.slice(1).trim()
      : undefined;
    const githubLink =
      !isConfidential && item.rawGithub.startsWith("https://")
        ? item.rawGithub
        : "";

    const { mainText, note } = splitDescriptionNote(item.description);

    return {
      id: `project-${idx + 1}-${item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16)}`,
      exhibitLetter: getExhibitLetter(idx),
      exhibitNumber: idx + 1,
      title: item.title,
      category: item.category,
      description: item.description,
      descriptionMain: mainText,
      descriptionNote: note,
      techStack: item.techStack,
      githubLink,
      isConfidential,
      confidentialMessage,
      status: item.status,
      screenshots: item.screenshots,
      liveUrl: item.liveUrl,
      linkLabel: item.linkLabel,
      year: item.year,
      problem: item.problem,
      role: item.role,
      result: item.result,
      featured: item.featured,
      hide: false,
    };
  });
}

export function getCachedProjects(): ProjectItem[] {
  if (typeof window === "undefined") return createBundledProjects();
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return createBundledProjects();
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data;
    }
  } catch {
    // Ignore storage parse errors
  }
  return createBundledProjects();
}

export function saveCachedProjects(data: ProjectItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // Ignore storage quota errors
  }
}

export function useProjectsData() {
  const [items, setItems] = useState<ProjectItem[]>(() => getCachedProjects());
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const rawCsvUrl =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_PROJECTS_CSV_URL) ||
    DEFAULT_PROJECTS_CSV_URL;
  const csvUrl = normalizeGoogleSheetCsvUrl(rawCsvUrl);

  const fetchFresh = async () => {
    if (!csvUrl || csvUrl.includes("placeholder")) return;

    try {
      setIsLoading(true);
      const separator = csvUrl.includes("?") ? "&" : "?";
      const fullUrl = `${csvUrl}${separator}_t=${Date.now()}`;

      const res = await fetch(fullUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text || text.trim().length === 0) return;

      const parsed = parseProjectsCSV(text);
      if (parsed && parsed.length > 0) {
        setItems(parsed);
        saveCachedProjects(parsed);
        setLastFetchTime(Date.now());
      }
    } catch (err) {
      console.warn("Could not fetch live projects sheet, using cached/bundled data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFresh();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - lastFetchTime;
        if (elapsed > CACHE_TTL_MS) {
          fetchFresh();
        }
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [lastFetchTime, csvUrl]);

  return { items, isLoading, refetch: fetchFresh };
}
