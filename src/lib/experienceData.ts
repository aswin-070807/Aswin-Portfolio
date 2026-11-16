import { useEffect, useState } from "react";
import {
  type ServiceRecordItem,
  createBundledExperience,
  DEFAULT_EXPERIENCE_CSV_URL,
  extractDescriptionLinks,
  parsePeriod,
  splitLogEntries,
} from "@/data/experienceFallback";
import { normalizeGoogleSheetCsvUrl, parseCSV } from "@/lib/achievementsData";

const CACHE_KEY = "aswin_experience_cache_v1";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function parseExperienceCSV(csvText: string): ServiceRecordItem[] {
  const rows = parseCSV(csvText);
  if (!rows || rows.length === 0) return createBundledExperience();

  // Scan the first 25 rows to find the header row containing "Role"
  let headerIndex = -1;
  const colMap: {
    role?: number;
    organisation?: number;
    period?: number;
    description?: number;
    logo?: number;
    link?: number;
    linkLabel?: number;
    certificateLink?: number;
    hide?: number;
  } = {};

  const scanLimit = Math.min(25, rows.length);
  for (let r = 0; r < scanLimit; r++) {
    const currentRow = rows[r];
    if (!currentRow) continue;
    const lowerRow = currentRow.map((c) => c.toLowerCase().trim());
    const hasRole = lowerRow.some((c) => c === "role" || c.includes("role"));

    if (hasRole) {
      headerIndex = r;
      lowerRow.forEach((col, idx) => {
        if (col === "role" || col.includes("role")) {
          colMap.role = idx;
        } else if (
          col.includes("company") ||
          col.includes("organis") ||
          col.includes("organiz")
        ) {
          colMap.organisation = idx;
        } else if (
          col.includes("period") ||
          col.includes("date") ||
          col.includes("duration")
        ) {
          colMap.period = idx;
        } else if (col.includes("description") || col.includes("desc")) {
          colMap.description = idx;
        } else if (col.includes("logo") || col.includes("image")) {
          colMap.logo = idx;
        } else if (col === "link" || col.includes("url")) {
          colMap.link = idx;
        } else if (col.includes("label")) {
          colMap.linkLabel = idx;
        } else if (col.includes("cert")) {
          colMap.certificateLink = idx;
        } else if (col.includes("hide")) {
          colMap.hide = idx;
        }
      });
      break;
    }
  }

  if (headerIndex === -1 || colMap.role === undefined) {
    return createBundledExperience();
  }

  const items: ServiceRecordItem[] = [];
  let recordCounter = 1;

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    // Check if entire row is blank
    const isBlank = row.every((c) => !c || c.trim().length === 0);
    if (isBlank) continue;

    const rawHide =
      colMap.hide !== undefined && row[colMap.hide]
        ? row[colMap.hide]!.trim().toLowerCase()
        : "";
    if (rawHide === "true" || rawHide === "yes" || rawHide === "1") {
      continue;
    }

    const role =
      colMap.role !== undefined && row[colMap.role]
        ? row[colMap.role]!.trim()
        : "";
    if (!role) continue;

    const organisation =
      colMap.organisation !== undefined && row[colMap.organisation]
        ? row[colMap.organisation]!.trim()
        : "";

    const rawPeriod =
      colMap.period !== undefined && row[colMap.period]
        ? row[colMap.period]!.trim()
        : "";

    const rawDescription =
      colMap.description !== undefined && row[colMap.description]
        ? row[colMap.description]!.trim()
        : "";

    const rawLogo =
      colMap.logo !== undefined && row[colMap.logo]
        ? row[colMap.logo]!.trim()
        : undefined;

    const rawLink =
      colMap.link !== undefined && row[colMap.link]
        ? row[colMap.link]!.trim()
        : undefined;

    const rawLinkLabel =
      colMap.linkLabel !== undefined && row[colMap.linkLabel]
        ? row[colMap.linkLabel]!.trim()
        : undefined;

    const rawCert =
      colMap.certificateLink !== undefined && row[colMap.certificateLink]
        ? row[colMap.certificateLink]!.trim()
        : undefined;

    // Parsing rules:
    // 1. Description => extract links first, then split log entries
    const { cleanedText, links } = extractDescriptionLinks(rawDescription);
    const logEntries = splitLogEntries(cleanedText);

    // 2. Period => split and compute status
    const parsedP = parsePeriod(rawPeriod);
    const currentYear = new Date().getFullYear().toString();
    const year = parsedP.year || currentYear;
    const num = String(recordCounter).padStart(3, "0");
    const idNumber = `SR-${year}-${num}`;

    items.push({
      id: `exp-${i}-${recordCounter}`,
      recordNumber: recordCounter,
      idNumber,
      role,
      organisation,
      rawPeriod: parsedP.raw,
      validFrom: parsedP.from,
      validTo: parsedP.to,
      status: parsedP.status,
      logEntries,
      extractedLinks: links,
      logo: rawLogo,
      link: rawLink?.startsWith("https://") ? rawLink : undefined,
      linkLabel: rawLinkLabel,
      certificateLink: rawCert?.startsWith("https://") ? rawCert : undefined,
      hide: false,
    });

    recordCounter++;
  }

  return items.length > 0 ? items : createBundledExperience();
}

export function getCachedExperience(): ServiceRecordItem[] {
  if (typeof window === "undefined") return createBundledExperience();
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return createBundledExperience();
}

export function saveCachedExperience(data: ServiceRecordItem[]) {
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

export function useExperienceData() {
  const [items, setItems] = useState<ServiceRecordItem[]>(() =>
    getCachedExperience()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const rawCsvUrl =
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_EXPERIENCE_CSV_URL) ||
    DEFAULT_EXPERIENCE_CSV_URL;
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

      const parsed = parseExperienceCSV(text);
      if (parsed && parsed.length > 0) {
        setItems(parsed);
        saveCachedExperience(parsed);
        setLastFetchTime(Date.now());
      }
    } catch (err) {
      console.warn(
        "Could not fetch live experience sheet, using cached/bundled data:",
        err
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFresh();

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastFetchTime > CACHE_TTL_MS
      ) {
        fetchFresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { items, isLoading, refetch: fetchFresh };
}
