import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  RESUME_CONFIG,
  fetchLocalResumeBlob,
  prefetchResume,
  resetResumeCacheForTesting,
} from "@/lib/resume";

describe("Resume Download System", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetResumeCacheForTesting();
  });

  it("exports valid folder, file, and local path configurations", () => {
    expect(RESUME_CONFIG.FOLDER_ID).toBe("1-51aXLTIuKgyTeFSe95_c89SLSWE7eMs");
    expect(RESUME_CONFIG.FILE_ID).toBe("1i5iDu_dZCw1L9EwnZ5j4Ts3X9MELZkDi");
    expect(RESUME_CONFIG.FILENAME).toBe("Aswin_A_Resume.pdf");
    expect(RESUME_CONFIG.LOCAL_PATH).toBe("/Aswin_A_Resume.pdf");
    expect(RESUME_CONFIG.DRIVE_VIEW_URL).toContain("drive.google.com");
  });

  it("fetches local resume blob successfully when local endpoint returns ok", async () => {
    const mockBlob = new Blob(["mock pdf content"], { type: "application/pdf" });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    } as unknown as Response);

    const blob = await fetchLocalResumeBlob();
    expect(blob).toBeTruthy();
    expect(globalThis.fetch).toHaveBeenCalledWith(RESUME_CONFIG.LOCAL_PATH);
  });

  it("prefetchResume successfully loads the local blob into memory", async () => {
    const mockBlob = new Blob(["mock pdf content"], { type: "application/pdf" });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    } as unknown as Response);

    await prefetchResume();
    expect(globalThis.fetch).toHaveBeenCalledWith(RESUME_CONFIG.LOCAL_PATH);
  });
});
