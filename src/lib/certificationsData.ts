import { useEffect, useRef, useState } from "react";
import { parseCSV } from "@/lib/achievementsData";

export const SHEET_ID = "1i7jspawGA1TLwVcAp7Klc8_RqtwyVhYayFyvcJvup3Y";
export const SHEET_TAB = "Sheet1";
export const DEFAULT_CERTS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_TAB}&headers=0`;

export const CERT_CACHE_KEY = "cert_sheet_cache_v1";
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const FOCUS_THROTTLE_MS = 60 * 1000; // at most once per 60s
const FETCH_TIMEOUT_MS = 15 * 1000; // 15 seconds
const MAX_RETRIES = 2;

export interface CertificateItem {
  id: string;
  markerNumber: number;
  name: string;
  issuer: string;
  link: string;
  fileId?: string;
  thumbnailUrl?: string;
  linkUnavailable: boolean;
  dateStr?: string;
  timestamp?: number;
  isFresh?: boolean;
}

export interface CertRoomGroup {
  roomId: string;
  roomNumber: number;
  roomCode: string;
  issuer: string;
  markers: CertificateItem[];
  rotationDeg: number;
}

interface CachePayload {
  timestamp: number;
  items: CertificateItem[];
}

// Deterministic string hash to generate a stable angle between -0.6° and 0.6°
export function getDeterministicAngle(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  // Map hash to range [-0.6, 0.6]
  const normalized = (Math.abs(hash) % 1201) / 1000 - 0.6;
  return Number(normalized.toFixed(2));
}

// Extract Google Drive File ID if present
export function extractDriveFileId(rawUrl: string): string | undefined {
  if (!rawUrl) return undefined;
  // Match /file/d/{FILE_ID}/ or id={FILE_ID}
  const matchFileD = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  const matchIdParam = rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  return undefined;
}

// Generate optional Google Drive thumbnail URL
export function getDriveThumbnailUrl(fileId?: string): string | undefined {
  if (!fileId) return undefined;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
}

// Check if URL is valid
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return /^https?:\/\/.+/i.test(trimmed);
}

// Parse CSV text and extract certificates according to requirements
export function parseCertificatesCSV(csvText: string): CertificateItem[] {
  if (!csvText || !csvText.trim()) return [];

  const rawRows = parseCSV(csvText);
  if (!rawRows || rawRows.length === 0) return [];

  // Filter out completely empty rows
  const nonEmptyRows = rawRows.filter((r) =>
    r.some((cell) => cell && cell.trim().length > 0)
  );

  if (nonEmptyRows.length === 0) return [];

  // Dynamically detect header row: first row that contains cells matching name, issuer, link
  let headerIndex = -1;
  let nameColIdx = -1;
  let issuerColIdx = -1;
  let linkColIdx = -1;
  let dateColIdx = -1;

  for (let r = 0; r < nonEmptyRows.length; r++) {
    const row = nonEmptyRows[r];
    const cleanedCells = row.map((cell) => (cell || "").trim().toLowerCase());

    let foundName = -1;
    let foundIssuer = -1;
    let foundLink = -1;
    let foundDate = -1;

    for (let c = 0; c < cleanedCells.length; c++) {
      const cell = cleanedCells[c];
      if (!cell) continue;

      // name column: "certificate name" (also accept "name", "certificate", "title")
      if (
        foundName === -1 &&
        (cell === "certificate name" ||
          cell === "name" ||
          cell === "certificate" ||
          cell === "title" ||
          cell.includes("certificate name"))
      ) {
        foundName = c;
      }
      // issuer column: "issued by" (also accept "issuer", "issued_by", "organisation", "organization")
      else if (
        foundIssuer === -1 &&
        (cell === "issued by" ||
          cell === "issuer" ||
          cell === "issued_by" ||
          cell === "organisation" ||
          cell === "organization" ||
          cell.includes("issued by"))
      ) {
        foundIssuer = c;
      }
      // link column: "certificate link" (also accept "link", "url", "certificate url")
      else if (
        foundLink === -1 &&
        (cell === "certificate link" ||
          cell === "link" ||
          cell === "url" ||
          cell === "certificate url" ||
          cell.includes("certificate link"))
      ) {
        foundLink = c;
      }
      // optional date column: "date" (also accept "issued on", "issue date", "added on")
      else if (
        foundDate === -1 &&
        (cell === "date" ||
          cell === "issued on" ||
          cell === "issue date" ||
          cell === "added on" ||
          cell.includes("date"))
      ) {
        foundDate = c;
      }
    }

    if (foundName !== -1 && foundIssuer !== -1 && foundLink !== -1) {
      headerIndex = r;
      nameColIdx = foundName;
      issuerColIdx = foundIssuer;
      linkColIdx = foundLink;
      dateColIdx = foundDate;
      break;
    }
  }

  // If header row cannot be found, treat as invalid
  if (
    headerIndex === -1 ||
    nameColIdx === -1 ||
    issuerColIdx === -1 ||
    linkColIdx === -1
  ) {
    return [];
  }

  // Parse rows below header
  interface IntermediateCert {
    rawOrder: number;
    name: string;
    issuer: string;
    rawIssuer: string;
    link: string;
    fileId?: string;
    thumbnailUrl?: string;
    linkUnavailable: boolean;
    dateStr?: string;
    timestamp?: number;
    isFresh?: boolean;
  }

  const parsedList: IntermediateCert[] = [];
  const seenKeys = new Set<string>();
  const nowMs = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  for (let r = headerIndex + 1; r < nonEmptyRows.length; r++) {
    const row = nonEmptyRows[r];
    const name = (row[nameColIdx] || "").trim();
    if (!name) continue; // Skip if name is empty

    const rawIssuer = (row[issuerColIdx] || "").trim();
    const issuerDisplay = rawIssuer || "Other";
    const dedupKey = `${name.toLowerCase()}::${issuerDisplay.toLowerCase()}`;

    // Deduplicate: same name and issuer (case-insensitive, trimmed) -> show only one
    if (seenKeys.has(dedupKey)) {
      continue;
    }
    seenKeys.add(dedupKey);

    const rawLink = (row[linkColIdx] || "").trim();
    const linkValid = isValidUrl(rawLink);
    const fileId = linkValid ? extractDriveFileId(rawLink) : undefined;
    const thumbnailUrl = getDriveThumbnailUrl(fileId);

    let dateStr: string | undefined = undefined;
    let timestamp: number | undefined = undefined;
    let isFresh = false;

    if (dateColIdx !== -1 && row[dateColIdx]) {
      const candidateDate = (row[dateColIdx] || "").trim();
      if (candidateDate) {
        dateStr = candidateDate;
        const parsed = Date.parse(candidateDate);
        if (!isNaN(parsed)) {
          timestamp = parsed;
          if (nowMs - parsed <= thirtyDaysMs && parsed <= nowMs + 86400000) {
            isFresh = true;
          }
        }
      }
    }

    parsedList.push({
      rawOrder: r,
      name,
      issuer: issuerDisplay,
      rawIssuer,
      link: rawLink,
      fileId,
      thumbnailUrl,
      linkUnavailable: !linkValid,
      dateStr,
      timestamp,
      isFresh,
    });
  }

  if (parsedList.length === 0) return [];

  // Ordering:
  // "the sheet is appended at the bottom, so the NEWEST certificate is the LAST row.
  // Number the evidence markers newest first (marker 1 is the last row of the sheet).
  // If a date column exists, sort by it instead, newest first."
  let sorted: IntermediateCert[];
  const hasValidDates = parsedList.some((p) => p.timestamp !== undefined);

  if (hasValidDates) {
    sorted = [...parsedList].sort((a, b) => {
      const timeA = a.timestamp ?? 0;
      const timeB = b.timestamp ?? 0;
      if (timeB !== timeA) return timeB - timeA;
      return b.rawOrder - a.rawOrder;
    });
  } else {
    // Reverse so the last row in the sheet becomes marker 1
    sorted = [...parsedList].reverse();
  }

  // Assign global marker numbers (1 to count)
  return sorted.map((item, idx) => ({
    id: `cert-${idx + 1}-${item.fileId || idx}`,
    markerNumber: idx + 1,
    name: item.name,
    issuer: item.issuer,
    link: item.link,
    fileId: item.fileId,
    thumbnailUrl: item.thumbnailUrl,
    linkUnavailable: item.linkUnavailable,
    dateStr: item.dateStr,
    timestamp: item.timestamp,
    isFresh: item.isFresh,
  }));
}

// Group certificates by issuer into rooms
// "Group issuers case-insensitively, ignoring extra spaces. Display the first spelling found. Empty issuer goes under 'Other'."
// "Rooms are numbered by size (largest first), then alphabetically."
export function groupCertificatesIntoRooms(items: CertificateItem[]): CertRoomGroup[] {
  if (!items || items.length === 0) return [];

  const issuerMap = new Map<
    string,
    {
      displayIssuer: string;
      markers: CertificateItem[];
    }
  >();

  for (const item of items) {
    const normKey = item.issuer.trim().toLowerCase().replace(/\s+/g, " ");
    const existing = issuerMap.get(normKey);
    if (existing) {
      existing.markers.push(item);
    } else {
      issuerMap.set(normKey, {
        displayIssuer: item.issuer,
        markers: [item],
      });
    }
  }

  // Sort rooms by size (descending), then alphabetically by display name
  const sortedGroups = Array.from(issuerMap.values()).sort((a, b) => {
    if (b.markers.length !== a.markers.length) {
      return b.markers.length - a.markers.length;
    }
    return a.displayIssuer.localeCompare(b.displayIssuer);
  });

  return sortedGroups.map((group, idx) => {
    const roomNum = idx + 1;
    const roomCode = `ROOM ${roomNum.toString().padStart(2, "0")}`;
    return {
      roomId: `room-${roomNum}-${group.displayIssuer.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      roomNumber: roomNum,
      roomCode,
      issuer: group.displayIssuer,
      markers: group.markers,
      rotationDeg: getDeterministicAngle(group.displayIssuer),
    };
  });
}

// Hardcoded bundled fallback data representing the verified sheet data
export const BUNDLED_CERTIFICATES: CertificateItem[] = [
  {
    id: "cert-1-1T4ouDxsHHGcUeddWPvEjrUaC4FOb_9Qo",
    markerNumber: 1,
    name: "Python Training IIT Bombay Spoken Tutorial",
    issuer: "IIT Bombay",
    link: "https://drive.google.com/file/d/1T4ouDxsHHGcUeddWPvEjrUaC4FOb_9Qo/view?usp=drive_link",
    fileId: "1T4ouDxsHHGcUeddWPvEjrUaC4FOb_9Qo",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1T4ouDxsHHGcUeddWPvEjrUaC4FOb_9Qo&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-2-1vn7SovnbC3Eo7CuSClocMTUqBHI8Cmeh",
    markerNumber: 2,
    name: "C Training IIT Bombay Spoken Tutorial",
    issuer: "IIT Bombay",
    link: "https://drive.google.com/file/d/1vn7SovnbC3Eo7CuSClocMTUqBHI8Cmeh/view?usp=drive_link",
    fileId: "1vn7SovnbC3Eo7CuSClocMTUqBHI8Cmeh",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1vn7SovnbC3Eo7CuSClocMTUqBHI8Cmeh&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-3-13RXBIwQoYwuGXq6OMmtggwOrd_tDEUSe",
    markerNumber: 3,
    name: "Advanced Prompt Engineering",
    issuer: "LaunchEd Global",
    link: "https://drive.google.com/file/d/13RXBIwQoYwuGXq6OMmtggwOrd_tDEUSe/view?usp=drive_link",
    fileId: "13RXBIwQoYwuGXq6OMmtggwOrd_tDEUSe",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=13RXBIwQoYwuGXq6OMmtggwOrd_tDEUSe&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-4-1aBdoqbhK9Z4pKcUnFC_z2RoHaoJ8WRzu",
    markerNumber: 4,
    name: "Mastering IOT with Arduino",
    issuer: "Infosys Springboard",
    link: "https://drive.google.com/file/d/1aBdoqbhK9Z4pKcUnFC_z2RoHaoJ8WRzu/view?usp=drive_link",
    fileId: "1aBdoqbhK9Z4pKcUnFC_z2RoHaoJ8WRzu",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1aBdoqbhK9Z4pKcUnFC_z2RoHaoJ8WRzu&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-5-1jXUmGPsbwLPL3hPLeWg4RhJ_BT4R71bS",
    markerNumber: 5,
    name: "ITIL Awareness",
    issuer: "Infosys Springboard",
    link: "https://drive.google.com/file/d/1jXUmGPsbwLPL3hPLeWg4RhJ_BT4R71bS/view?usp=drive_link",
    fileId: "1jXUmGPsbwLPL3hPLeWg4RhJ_BT4R71bS",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1jXUmGPsbwLPL3hPLeWg4RhJ_BT4R71bS&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-6-1omH0ii9Bg_2uymVQBOWhDKR2DPskHTDy",
    markerNumber: 6,
    name: "Introduction to Cybersecurity",
    issuer: "Infosys Springboard",
    link: "https://drive.google.com/file/d/1omH0ii9Bg_2uymVQBOWhDKR2DPskHTDy/view?usp=drive_link",
    fileId: "1omH0ii9Bg_2uymVQBOWhDKR2DPskHTDy",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1omH0ii9Bg_2uymVQBOWhDKR2DPskHTDy&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-7-1ymELqmJsHwIkm8WoZad187SUpD7K8A0v",
    markerNumber: 7,
    name: "Fundamentals of Information Security",
    issuer: "Infosys Springboard",
    link: "https://drive.google.com/file/d/1ymELqmJsHwIkm8WoZad187SUpD7K8A0v/view?usp=drive_link",
    fileId: "1ymELqmJsHwIkm8WoZad187SUpD7K8A0v",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1ymELqmJsHwIkm8WoZad187SUpD7K8A0v&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-8-1r6mnqqZLyZFWTJuhM6GoFuCKwayWJjmB",
    markerNumber: 8,
    name: "Fundamentals of Cryptography",
    issuer: "Infosys Springboard",
    link: "https://drive.google.com/file/d/1r6mnqqZLyZFWTJuhM6GoFuCKwayWJjmB/view?usp=drive_link",
    fileId: "1r6mnqqZLyZFWTJuhM6GoFuCKwayWJjmB",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1r6mnqqZLyZFWTJuhM6GoFuCKwayWJjmB&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-9-13p5nWP4Clo4flLeC30cF9--eJ_DGFdGJ",
    markerNumber: 9,
    name: "CompTIA A+ Core 2 Operating System and Network Management",
    issuer: "Infosys Springboard",
    link: "https://drive.google.com/file/d/13p5nWP4Clo4flLeC30cF9--eJ_DGFdGJ/view?usp=drive_link",
    fileId: "13p5nWP4Clo4flLeC30cF9--eJ_DGFdGJ",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=13p5nWP4Clo4flLeC30cF9--eJ_DGFdGJ&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-10-19Z8yz7DF2wUeu_et61YtvEEEsDNV4wI_",
    markerNumber: 10,
    name: "Diploma in Administrative HR",
    issuer: "Udemy",
    link: "https://drive.google.com/file/d/19Z8yz7DF2wUeu_et61YtvEEEsDNV4wI_/view?usp=drive_link",
    fileId: "19Z8yz7DF2wUeu_et61YtvEEEsDNV4wI_",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=19Z8yz7DF2wUeu_et61YtvEEEsDNV4wI_&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-11-1GPRyIpqhQL6aXbljW2MlydAYGoSz9_bb",
    markerNumber: 11,
    name: "Canva for Work",
    issuer: "Canva",
    link: "https://drive.google.com/file/d/1GPRyIpqhQL6aXbljW2MlydAYGoSz9_bb/view?usp=drive_link",
    fileId: "1GPRyIpqhQL6aXbljW2MlydAYGoSz9_bb",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1GPRyIpqhQL6aXbljW2MlydAYGoSz9_bb&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-12-10vp3WalHaPiG56NJu8uMIS0Z_CBbpi3U",
    markerNumber: 12,
    name: "Canva - Graphic Design Essentials",
    issuer: "Canva",
    link: "https://drive.google.com/file/d/10vp3WalHaPiG56NJu8uMIS0Z_CBbpi3U/view?usp=drive_link",
    fileId: "10vp3WalHaPiG56NJu8uMIS0Z_CBbpi3U",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=10vp3WalHaPiG56NJu8uMIS0Z_CBbpi3U&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-13-1cO8loGZSxZZl-4VsdbphGXOlTrwxL0Jf",
    markerNumber: 13,
    name: "Google Analytics Certification",
    issuer: "Google Cloud",
    link: "https://drive.google.com/file/d/1cO8loGZSxZZl-4VsdbphGXOlTrwxL0Jf/view?usp=drive_link",
    fileId: "1cO8loGZSxZZl-4VsdbphGXOlTrwxL0Jf",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1cO8loGZSxZZl-4VsdbphGXOlTrwxL0Jf&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-14-1N--0Ls4fbyjTV6khnj3tPsZY8G63ZOwE",
    markerNumber: 14,
    name: "Professional Networking for Career Growth",
    issuer: "hp Foundation",
    link: "https://drive.google.com/file/d/1N--0Ls4fbyjTV6khnj3tPsZY8G63ZOwE/view?usp=drive_link",
    fileId: "1N--0Ls4fbyjTV6khnj3tPsZY8G63ZOwE",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1N--0Ls4fbyjTV6khnj3tPsZY8G63ZOwE&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-15-139NSxOBpikSBIdTZDEEs2UKZBtaGr5Td",
    markerNumber: 15,
    name: "Design Thinking - A Primer",
    issuer: "NPTEL",
    link: "https://drive.google.com/file/d/139NSxOBpikSBIdTZDEEs2UKZBtaGr5Td/view?usp=drive_link",
    fileId: "139NSxOBpikSBIdTZDEEs2UKZBtaGr5Td",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=139NSxOBpikSBIdTZDEEs2UKZBtaGr5Td&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-16-1oNbwqt_J1O_OcznszpPrctaRPRSYoBZH",
    markerNumber: 16,
    name: "DevOps, Agile and Design Thinking",
    issuer: "IBM",
    link: "https://drive.google.com/file/d/1oNbwqt_J1O_OcznszpPrctaRPRSYoBZH/view?usp=drive_link",
    fileId: "1oNbwqt_J1O_OcznszpPrctaRPRSYoBZH",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1oNbwqt_J1O_OcznszpPrctaRPRSYoBZH&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-17-1thNuQoBS5UXcilnYTMm_nEfzaAsUem3j",
    markerNumber: 17,
    name: "Clean Coding",
    issuer: "IBM",
    link: "https://drive.google.com/file/d/1thNuQoBS5UXcilnYTMm_nEfzaAsUem3j/view?usp=drive_link",
    fileId: "1thNuQoBS5UXcilnYTMm_nEfzaAsUem3j",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1thNuQoBS5UXcilnYTMm_nEfzaAsUem3j&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-18-1fbTYr2amCq593vSbHQOOQjY4v3lPMaUW",
    markerNumber: 18,
    name: "Machine Learning Onramp",
    issuer: "Mathworks",
    link: "https://drive.google.com/file/d/1fbTYr2amCq593vSbHQOOQjY4v3lPMaUW/view?usp=sharing",
    fileId: "1fbTYr2amCq593vSbHQOOQjY4v3lPMaUW",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1fbTYr2amCq593vSbHQOOQjY4v3lPMaUW&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-19-12kd2ptTMXtWzEVQlnG1YuU9bgMT4h8oX",
    markerNumber: 19,
    name: "Calculations on Grouped Data",
    issuer: "Mathworks",
    link: "https://drive.google.com/file/d/12kd2ptTMXtWzEVQlnG1YuU9bgMT4h8oX/view?usp=sharing",
    fileId: "12kd2ptTMXtWzEVQlnG1YuU9bgMT4h8oX",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=12kd2ptTMXtWzEVQlnG1YuU9bgMT4h8oX&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-20-1AYwgsZuZklQkXX3CAqHHMBqXILaF27TR",
    markerNumber: 20,
    name: "Clean and Prepare Data for Analysis",
    issuer: "Mathworks",
    link: "https://drive.google.com/file/d/1AYwgsZuZklQkXX3CAqHHMBqXILaF27TR/view?usp=sharing",
    fileId: "1AYwgsZuZklQkXX3CAqHHMBqXILaF27TR",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1AYwgsZuZklQkXX3CAqHHMBqXILaF27TR&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-21-1KCvExUehDZOomWDgUIH6uJQ6nixGkZ9N",
    markerNumber: 21,
    name: "Linear Algebra with Matlab",
    issuer: "Mathworks",
    link: "https://drive.google.com/file/d/1KCvExUehDZOomWDgUIH6uJQ6nixGkZ9N/view?usp=sharing",
    fileId: "1KCvExUehDZOomWDgUIH6uJQ6nixGkZ9N",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1KCvExUehDZOomWDgUIH6uJQ6nixGkZ9N&sz=w400",
    linkUnavailable: false,
  },
  {
    id: "cert-22-1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J",
    markerNumber: 22,
    name: "Mtlab Common Data Analysis",
    issuer: "Mathworks",
    link: "https://drive.google.com/file/d/1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J/view?usp=sharing",
    fileId: "1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J",
    thumbnailUrl: "https://drive.google.com/thumbnail?id=1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J&sz=w400",
    linkUnavailable: false,
  },
];

// Helper to calculate relative time label
export function getRelativeTimeLabel(timestamp?: number): string {
  if (!timestamp) return "just now";
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 45) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin === 1) return "1 min ago";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

// React Hook for live certificates state with stale-while-revalidate,
// auto-refresh, timeout, retries, and visibility change handling
export function useLiveCertificates() {
  const [items, setItems] = useState<CertificateItem[]>(() => {
    if (typeof window === "undefined") return BUNDLED_CERTIFICATES;
    try {
      const cached = localStorage.getItem(CERT_CACHE_KEY);
      if (cached) {
        const parsed: CachePayload = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          return parsed.items;
        }
      }
    } catch {
      // ignore
    }
    return BUNDLED_CERTIFICATES;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const cached = localStorage.getItem(CERT_CACHE_KEY);
      return !cached;
    } catch {
      return false;
    }
  });

  const [lastSyncTime, setLastSyncTime] = useState<number>(() => {
    if (typeof window === "undefined") return Date.now();
    try {
      const cached = localStorage.getItem(CERT_CACHE_KEY);
      if (cached) {
        const parsed: CachePayload = JSON.parse(cached);
        if (parsed.timestamp) return parsed.timestamp;
      }
    } catch {
      // ignore
    }
    return Date.now();
  });

  const [isError, setIsError] = useState<boolean>(false);
  const lastFetchTimeRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);

  const fetchWithRetry = async (retryCount = 0): Promise<boolean> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(DEFAULT_CERTS_CSV_URL, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const csvText = await response.text();
      const parsedItems = parseCertificatesCSV(csvText);

      // Validate: if header row not found or 0 items, fail
      if (!parsedItems || parsedItems.length === 0) {
        throw new Error("Zero valid rows or header not found in CSV");
      }

      const now = Date.now();
      // Update state without interrupting user interactions
      setItems(parsedItems);
      setLastSyncTime(now);
      setIsError(false);
      setIsLoading(false);

      // Save to localStorage
      try {
        const payload: CachePayload = {
          timestamp: now,
          items: parsedItems,
        };
        localStorage.setItem(CERT_CACHE_KEY, JSON.stringify(payload));
      } catch {
        // localStorage quota or private mode
      }

      return true;
    } catch (err) {
      clearTimeout(timeoutId);
      if (retryCount < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, 1200));
        return fetchWithRetry(retryCount + 1);
      }

      // If all retries failed:
      // Show error state ONLY if there is no cached data
      setIsLoading(false);
      try {
        const cached = localStorage.getItem(CERT_CACHE_KEY);
        if (!cached && items.length === 0) {
          setIsError(true);
        }
      } catch {
        if (items.length === 0) setIsError(true);
      }
      return false;
    }
  };

  const syncData = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    lastFetchTimeRef.current = Date.now();
    try {
      await fetchWithRetry(0);
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    syncData();

    // Periodic refresh every 5 minutes while page is visible
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        syncData();
      }
    }, REFRESH_INTERVAL_MS);

    // Tab focus / visibility change refresh (at most once per 60s)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const timeSinceLast = Date.now() - lastFetchTimeRef.current;
        if (timeSinceLast >= FOCUS_THROTTLE_MS) {
          syncData();
        }
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, []);

  return {
    items,
    rooms: groupCertificatesIntoRooms(items),
    isLoading,
    isError,
    lastSyncTime,
    refetch: syncData,
  };
}
