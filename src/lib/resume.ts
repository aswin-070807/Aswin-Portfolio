import { useEffect, useRef, useState } from "react";

export const RESUME_CONFIG = {
  FOLDER_ID: "1-51aXLTIuKgyTeFSe95_c89SLSWE7eMs",
  FILE_ID: "1i5iDu_dZCw1L9EwnZ5j4Ts3X9MELZkDi",
  FILENAME: "Aswin_A_Resume.pdf",
  LOCAL_PATH: "/Aswin_A_Resume.pdf",
  DRIVE_VIEW_URL: "https://drive.google.com/file/d/1i5iDu_dZCw1L9EwnZ5j4Ts3X9MELZkDi/view?usp=sharing",
  DRIVE_DOWNLOAD_URL: "https://drive.google.com/uc?export=download&id=1i5iDu_dZCw1L9EwnZ5j4Ts3X9MELZkDi",
  CACHE_TTL_MS: 10 * 60 * 1000, // 10 minutes in-memory cache
  REQUEST_TIMEOUT_MS: 10000, // 10-second request timeout
} as const;

export interface DriveFile {
  id: string;
  name: string;
  modifiedTime?: string;
}

// In-memory module-level caches (never in localStorage)
let cachedResumeFile: DriveFile | null = null;
let fileCacheTimestamp = 0;
let inflightFileLookup: Promise<DriveFile | null> | null = null;

let cachedResumeBlob: Blob | null = null;
let blobCacheTimestamp = 0;
let inflightBlobFetch: Promise<Blob | null> | null = null;

export function resetResumeCacheForTesting(): void {
  cachedResumeFile = null;
  fileCacheTimestamp = 0;
  inflightFileLookup = null;
  cachedResumeBlob = null;
  blobCacheTimestamp = 0;
  inflightBlobFetch = null;
}

function getApiKey(): string | undefined {
  const env = (import.meta as unknown as { env?: { VITE_DRIVE_API_KEY?: string } }).env;
  return env?.VITE_DRIVE_API_KEY?.trim();
}

/**
 * 0. Fetch the bundled resume blob from same-origin public asset.
 */
export async function fetchLocalResumeBlob(): Promise<Blob | null> {
  if (typeof window === "undefined") return null;

  const now = Date.now();
  if (cachedResumeBlob && now - blobCacheTimestamp < RESUME_CONFIG.CACHE_TTL_MS) {
    return cachedResumeBlob;
  }

  try {
    const res = await fetch(RESUME_CONFIG.LOCAL_PATH);
    if (res.ok) {
      const blob = await res.blob();
      cachedResumeBlob = blob;
      blobCacheTimestamp = Date.now();
      return blob;
    }
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn("[Resume Download] Failed to fetch local resume blob:", err);
    }
  }
  return null;
}

/**
 * 1. Fetch newest PDF in the Drive folder using Google Drive API v3.
 * Picks the newest modified PDF whose name contains "resume" (case-insensitive),
 * otherwise the newest PDF.
 */
export async function fetchLatestResumeMetadata(): Promise<DriveFile | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    if (import.meta.env?.DEV) {
      console.warn(
        "[Resume Download] VITE_DRIVE_API_KEY is missing or empty. Please set it in .env to enable direct Drive API downloads."
      );
    }
    return null;
  }

  const now = Date.now();
  if (cachedResumeFile && now - fileCacheTimestamp < RESUME_CONFIG.CACHE_TTL_MS) {
    return cachedResumeFile;
  }

  if (inflightFileLookup) {
    return inflightFileLookup;
  }

  inflightFileLookup = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RESUME_CONFIG.REQUEST_TIMEOUT_MS);

    try {
      const q = `'${RESUME_CONFIG.FOLDER_ID}' in parents and trashed=false and mimeType='application/pdf'`;
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        q
      )}&orderBy=${encodeURIComponent("modifiedTime desc")}&pageSize=10&fields=${encodeURIComponent(
        "files(id,name,modifiedTime)"
      )}&key=${encodeURIComponent(apiKey)}`;

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        if (import.meta.env?.DEV) {
          console.warn(
            `[Resume Download] Drive metadata lookup failed with HTTP ${res.status} (${res.statusText})`
          );
        }
        return null;
      }

      const data = await res.json().catch(() => null);
      const files: DriveFile[] = Array.isArray(data?.files) ? data.files : [];
      if (!files.length) {
        if (import.meta.env?.DEV) {
          console.warn("[Resume Download] Drive metadata returned 0 PDF files in the target folder.");
        }
        return null;
      }

      // Pick newest modified PDF with "resume" in name; else first PDF returned
      const chosen = files.find((f) => /resume/i.test(f.name)) || files[0];
      if (chosen) {
        cachedResumeFile = chosen;
        fileCacheTimestamp = Date.now();
      }
      return chosen || null;
    } catch (err) {
      clearTimeout(timeoutId);
      if (import.meta.env?.DEV) {
        console.warn("[Resume Download] Drive metadata lookup network error:", err);
      }
      return null;
    } finally {
      inflightFileLookup = null;
    }
  })();

  return inflightFileLookup;
}

/**
 * 2. Fetch the file blob directly from Google Drive API v3 (alt=media).
 */
export async function fetchResumeBlob(fileId: string): Promise<Blob | null> {
  const apiKey = getApiKey();
  if (!apiKey || !fileId) return null;

  const now = Date.now();
  if (cachedResumeBlob && now - blobCacheTimestamp < RESUME_CONFIG.CACHE_TTL_MS) {
    return cachedResumeBlob;
  }

  if (inflightBlobFetch) {
    return inflightBlobFetch;
  }

  inflightBlobFetch = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RESUME_CONFIG.REQUEST_TIMEOUT_MS);

    try {
      const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
        fileId
      )}?alt=media&key=${encodeURIComponent(apiKey)}`;

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        if (import.meta.env?.DEV) {
          console.warn(
            `[Resume Download] Drive blob fetch failed with HTTP ${res.status} (${res.statusText})`
          );
        }
        return null;
      }

      const blob = await res.blob();
      cachedResumeBlob = blob;
      blobCacheTimestamp = Date.now();
      return blob;
    } catch (err) {
      clearTimeout(timeoutId);
      if (import.meta.env?.DEV) {
        console.warn("[Resume Download] Drive blob fetch network error:", err);
      }
      return null;
    } finally {
      inflightBlobFetch = null;
    }
  })();

  return inflightBlobFetch;
}

/**
 * Trigger browser file download via temporary object URL
 */
function triggerBlobDownload(blob: Blob, filename = RESUME_CONFIG.FILENAME) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/**
 * Fallback: Check if same-origin /Aswin_A_Resume.pdf exists in public/
 */
async function tryDownloadSameOriginFallback(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const headRes = await fetch("/Aswin_A_Resume.pdf", { method: "HEAD" });
    if (headRes.ok) {
      const a = document.createElement("a");
      a.href = "/Aswin_A_Resume.pdf";
      a.download = RESUME_CONFIG.FILENAME;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    }
  } catch {}
  return false;
}

/**
 * Background prefetch helper: fetches metadata and blob into memory on page load.
 */
export async function prefetchResume(): Promise<void> {
  if (typeof window === "undefined") return;
  // 1. Prefetch local resume asset into cache
  const localBlob = await fetchLocalResumeBlob();
  if (localBlob) return;

  // 2. Otherwise query Drive API if key is available
  const file = await fetchLatestResumeMetadata();
  if (file?.id) {
    await fetchResumeBlob(file.id);
  }
}

export type ResumeDownloadStatus = "idle" | "preparing" | "downloaded" | "error";

export function useLatestResume() {
  const [status, setStatus] = useState<ResumeDownloadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prefetch metadata & blob in background on mount
  useEffect(() => {
    void prefetchResume();
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const downloadResume = async () => {
    if (typeof window === "undefined" || status === "preparing") return;

    setStatus("preparing");
    setErrorMessage(null);

    try {
      // 1. Check if blob is already cached in memory
      let blob = cachedResumeBlob;
      const now = Date.now();
      if (!blob || now - blobCacheTimestamp >= RESUME_CONFIG.CACHE_TTL_MS) {
        blob = await fetchLocalResumeBlob();
        if (!blob) {
          const file = await fetchLatestResumeMetadata();
          if (file?.id) {
            blob = await fetchResumeBlob(file.id);
          }
        }
      }

      // 2. If blob is ready, download it directly via ObjectURL
      if (blob) {
        triggerBlobDownload(blob);
        setStatus("downloaded");
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
          setStatus("idle");
        }, 2000);
        return;
      }

      // 3. Fallback: check same-origin /Aswin_A_Resume.pdf in public folder
      const localSucceeded = await tryDownloadSameOriginFallback();
      if (localSucceeded) {
        setStatus("downloaded");
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
          setStatus("idle");
        }, 2000);
        return;
      }

      // 4. Fallback: open Google Drive link directly so user always gets the file
      if (typeof window !== "undefined" && RESUME_CONFIG.DRIVE_VIEW_URL) {
        window.open(RESUME_CONFIG.DRIVE_VIEW_URL, "_blank", "noopener,noreferrer");
        setStatus("downloaded");
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
          setStatus("idle");
        }, 2000);
        return;
      }

      // 5. If everything failed, show inline message
      setStatus("error");
      setErrorMessage("Couldn't download right now, please try again");
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setStatus("idle");
        setErrorMessage(null);
      }, 4000);
    } catch {
      // Safety net: open Google Drive link
      try {
        if (typeof window !== "undefined" && RESUME_CONFIG.DRIVE_VIEW_URL) {
          window.open(RESUME_CONFIG.DRIVE_VIEW_URL, "_blank", "noopener,noreferrer");
          setStatus("downloaded");
          if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
          resetTimerRef.current = setTimeout(() => {
            setStatus("idle");
          }, 2000);
          return;
        }
      } catch {}

      setStatus("error");
      setErrorMessage("Couldn't download right now, please try again");
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setStatus("idle");
        setErrorMessage(null);
      }, 4000);
    }
  };

  return {
    status,
    errorMessage,
    downloadResume,
  };
}
