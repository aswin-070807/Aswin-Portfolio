export interface RawEducationItem {
  qualification: string;
  institution: string;
  period?: string;
  score?: string;
  statusText?: string;
}

export interface EducationRecordItem {
  id: string;
  sectionNumber: string; // "SECTION 01", etc.
  qualification: string;
  institution: string;
  period?: string;
  scoreValue?: string;
  scoreLabel?: "CGPA" | "PERCENTAGE" | "SCORE";
  numericScore?: number;
  status: "IN PROGRESS" | "COMPLETED";
  stampRotation: number;
}

export const DISPLAY_ORDER: "reverse" | "normal" = "reverse";

// 3 Education records structured for static use (and future CSV sync capability)
export const RAW_EDUCATION_DATA: RawEducationItem[] = [
  {
    qualification: "B.E. Computer Science and Engineering",
    institution: "Sri Ramakrishna Institute of Technology, Coimbatore",
    score: "CGPA 8.11",
    statusText: "Pursuing",
  },
  {
    qualification: "HSC",
    institution: "Chelammal Matriculation Higher Secondary School",
    period: "June 2024 – March 2025",
    score: "93.8%",
  },
  {
    qualification: "SSLC",
    institution: "Chelammal Matriculation Higher Secondary School",
    period: "June 2022 – April 2023",
    score: "94.8%",
  },
];

// Helper to derive score label without inventing data
export function getScoreLabel(scoreText?: string): "CGPA" | "PERCENTAGE" | "SCORE" {
  if (!scoreText) return "SCORE";
  const trimmed = scoreText.trim();
  if (/^cgpa/i.test(trimmed)) return "CGPA";
  if (trimmed.includes("%")) return "PERCENTAGE";
  return "SCORE";
}

// Helper to derive status: text containing pursuing/ongoing/progress => IN PROGRESS;
// period with an end date or other status text => COMPLETED; otherwise COMPLETED if period has date
export function getStatus(raw: RawEducationItem): "IN PROGRESS" | "COMPLETED" {
  const statusStr = (raw.statusText || "").toLowerCase();
  if (/pursuing|ongoing|progress/i.test(statusStr)) {
    return "IN PROGRESS";
  }
  return "COMPLETED";
}

// Extract numeric score for count-up animation (e.g. "CGPA 8.11" => 8.11, "94.8%" => 94.8)
export function getNumericScore(scoreText?: string): number | undefined {
  if (!scoreText) return undefined;
  const match = scoreText.match(/(\d+(?:\.\d+)?)/);
  return match && match[1] ? parseFloat(match[1]) : undefined;
}

export function getEducationRecords(): EducationRecordItem[] {
  // If DISPLAY_ORDER === 'reverse', oldest to newest: SSLC, HSC, B.E.
  const source =
    DISPLAY_ORDER === "reverse"
      ? [...RAW_EDUCATION_DATA].reverse()
      : [...RAW_EDUCATION_DATA];

  const rotations = [-8.5, -6.5, -9.5];

  return source.map((item, idx) => {
    const status = getStatus(item);
    const scoreLabel = getScoreLabel(item.score);
    const numericScore = getNumericScore(item.score);

    return {
      id: `edu-record-${idx + 1}`,
      sectionNumber: `SECTION ${String(idx + 1).padStart(2, "0")}`,
      qualification: item.qualification,
      institution: item.institution,
      period: item.period,
      scoreValue: item.score,
      scoreLabel,
      numericScore,
      status,
      stampRotation: rotations[idx % rotations.length] || -8,
    };
  });
}
