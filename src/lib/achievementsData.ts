import { useEffect, useState } from "react";
import {
  type CaseFileItem,
  createBundledCaseFiles,
  DEFAULT_ACHIEVEMENTS_CSV_URL,
} from "@/data/achievementsFallback";

const CACHE_KEY = "aswin_case_files_cache_v2";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function formatUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function getDrivePreviewUrl(rawUrl: string): string {
  const url = formatUrl(rawUrl);
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

// Convert any standard Google Sheet sharing/edit URL into an immediate live CSV endpoint
export function normalizeGoogleSheetCsvUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  // If already a published CSV or export endpoint, keep it
  if (
    trimmed.includes("pub?output=csv") ||
    trimmed.includes("gviz/tq?tqx=out:csv") ||
    trimmed.includes("export?format=csv")
  ) {
    return trimmed;
  }

  // Automatically convert sharing / edit link into live gviz CSV endpoint
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  }

  return trimmed;
}

// RFC-compliant CSV parser handling quoted commas, multiline cells, and Windows line endings
export function parseCSV(text: string): string[][] {
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

export function parseAchievementsCSV(csvText: string): CaseFileItem[] {
  const rows = parseCSV(csvText);
  if (!rows || rows.length === 0) return createBundledCaseFiles();

  // Find header row dynamically with tolerant, case-insensitive matching
  let headerIndex = -1;
  const colMap: {
    position?: number;
    eventName?: number;
    hostedBy?: number;
    level?: number;
    certificateLink?: number;
    year?: number;
    featured?: number;
    description?: number;
    hide?: number;
  } = {};

  for (let r = 0; r < rows.length; r++) {
    const currentRow = rows[r];
    if (!currentRow) continue;
    const lowerRow = currentRow.map((c) => c.toLowerCase().trim());
    const hasEvent = lowerRow.some((c) => c.includes("event"));
    const hasPos = lowerRow.some((c) => c.includes("position"));

    if (hasEvent || hasPos) {
      headerIndex = r;
      lowerRow.forEach((col, idx) => {
        if (col.includes("position")) colMap.position = idx;
        else if (col.includes("event")) colMap.eventName = idx;
        else if (col.includes("host") || col.includes("org")) colMap.hostedBy = idx;
        else if (col.includes("level")) colMap.level = idx;
        else if (col.includes("cert") || col.includes("link")) colMap.certificateLink = idx;
        else if (col.includes("year")) colMap.year = idx;
        else if (col.includes("feature")) colMap.featured = idx;
        else if (col.includes("desc")) colMap.description = idx;
        else if (col.includes("hide")) colMap.hide = idx;
      });
      break;
    }
  }

  if (headerIndex === -1) {
    return createBundledCaseFiles();
  }

  interface RawRowItem {
    position: string;
    eventName: string;
    hostedBy: string;
    level: string;
    certificateLink: string;
    year?: string;
    featured: boolean;
    description?: string;
  }

  const rawItems: RawRowItem[] = [];

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const rawHide = (colMap.hide !== undefined ? row[colMap.hide] : "") || "";
    if (/^(true|yes|1)$/i.test(rawHide.trim())) continue;

    const eventName = ((colMap.eventName !== undefined ? row[colMap.eventName] : "") || "").trim();
    const position = ((colMap.position !== undefined ? row[colMap.position] : "") || "").trim();

    // Skip rows where BOTH Event Name AND Position are empty
    if (!eventName && !position) continue;

    const hostedBy = ((colMap.hostedBy !== undefined ? row[colMap.hostedBy] : "") || "").trim();
    const level = ((colMap.level !== undefined ? row[colMap.level] : "") || "National").trim();
    const rawCert = ((colMap.certificateLink !== undefined ? row[colMap.certificateLink] : "") || "").trim();
    // Only allow certificate links that start with https://
    const certificateLink = rawCert.startsWith("https://") ? rawCert : "";

    const year = colMap.year !== undefined ? row[colMap.year]?.trim() : undefined;
    const description = colMap.description !== undefined ? row[colMap.description]?.trim() : undefined;
    const rawFeatured = colMap.featured !== undefined ? row[colMap.featured]?.trim() : "";
    const featured = /^(true|yes|1)$/i.test(rawFeatured || "");

    rawItems.push({
      position,
      eventName,
      hostedBy,
      level,
      certificateLink,
      year: year || undefined,
      featured,
      description: description || undefined,
    });
  }

  if (rawItems.length === 0) {
    return createBundledCaseFiles();
  }

  // If a Featured column exists, show Featured = TRUE rows first, preserving relative order
  const sorted = [...rawItems].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return sorted.map((item, idx) => ({
    id: `case-${idx + 1}-${item.eventName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16)}`,
    caseNumber: `CASE ${(idx + 1).toString().padStart(3, "0")}`,
    position: item.position,
    eventName: item.eventName,
    hostedBy: item.hostedBy,
    level: item.level,
    certificateLink: item.certificateLink,
    year: item.year,
    featured: item.featured,
    description: item.description,
  }));
}

export function getCachedCaseFiles(): CaseFileItem[] {
  if (typeof window === "undefined") return createBundledCaseFiles();
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return createBundledCaseFiles();
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data;
    }
  } catch {
    // Ignore storage parse errors
  }
  return createBundledCaseFiles();
}

export function saveCachedCaseFiles(data: CaseFileItem[]) {
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

export function computeCaseStats(items: CaseFileItem[]) {
  const total = items.length;
  const finals = items.filter((i) => /final/i.test(i.level)).length;
  const globalOrInternational = items.filter((i) =>
    /global|international/i.test(i.level)
  ).length;

  return { total, finals, globalOrInternational };
}

export function useAchievementsCaseFiles() {
  const [items, setItems] = useState<CaseFileItem[]>(() => getCachedCaseFiles());
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const rawCsvUrl =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_ACHIEVEMENTS_CSV_URL) ||
    DEFAULT_ACHIEVEMENTS_CSV_URL;
  const csvUrl = normalizeGoogleSheetCsvUrl(rawCsvUrl);

  const fetchFresh = async () => {
    if (!csvUrl) return;

    try {
      setIsLoading(true);
      // Cache-busting query parameter
      const separator = csvUrl.includes("?") ? "&" : "?";
      const fullUrl = `${csvUrl}${separator}_t=${Date.now()}`;

      const res = await fetch(fullUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text || text.trim().length === 0) return;

      const parsed = parseAchievementsCSV(text);
      if (parsed && parsed.length > 0) {
        setItems(parsed);
        saveCachedCaseFiles(parsed);
        setLastFetchTime(Date.now());
      }
    } catch (err) {
      // Graceful fallback to bundled or cached data; zero console crash
      console.warn("Could not fetch live achievements sheet, using cached/bundled data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial background revalidation
    fetchFresh();

    // Refetch when tab becomes visible after 5 minutes
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
