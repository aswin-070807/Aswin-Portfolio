export interface CaseFileItem {
  id: string;
  caseNumber: string; // e.g. "CASE 001"
  position: string;
  eventName: string;
  hostedBy: string;
  level: string;
  certificateLink: string;
  year?: string;
  featured?: boolean;
  description?: string;
  hide?: boolean;
}

// Live Google Sheet sync link
export const DEFAULT_ACHIEVEMENTS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1q9M3-5dd5HV9bD2x7QrCfiegaDlY04f0lFeBlpukvz4/edit?usp=sharing";

// 9 Bundled fallback rows used if the CSV URL is empty, fetch fails, or offline
export const FALLBACK_CASE_FILES_RAW = [
  {
    position: "Silver",
    eventName: "International Innovation Expo and System Design",
    hostedBy: "University Malaysia, Perlis",
    level: "Global",
    certificateLink:
      "https://drive.google.com/file/d/1-_yQE57EmKOvMrpnJ-fQNDmfNiu1G0xI/view?usp=sharing",
  },
  {
    position: "Top 25",
    eventName: "Neurohack 2025: IITM",
    hostedBy: "IIT Madras",
    level: "National Final",
    certificateLink:
      "https://drive.google.com/file/d/1zU6a8kMVFBRUBC4PaO40uFIRf4SMqV8n/view?usp=sharing",
  },
  {
    position: "Top 30",
    eventName: "Technova 26, CIT National Hackathon",
    hostedBy: "Coimbatore Institute of Technology",
    level: "National Final",
    certificateLink:
      "https://drive.google.com/file/d/13_XYkVth6Z56uO89eMt9OUCvhLllS5C1/view?usp=sharing",
  },
  {
    position: "Participated",
    eventName: "SNS x ODOO National Hackathon",
    hostedBy: "ODOO x SNS College of Engineering and Technology",
    level: "National Final",
    certificateLink:
      "https://drive.google.com/file/d/1TaEpq5GolLnuqXItIUkdb4bO68M70K6y/view?usp=sharing",
  },
  {
    position: "Qualifier",
    eventName: "ICSC Qualifier",
    hostedBy: "International Computer Science and Competition",
    level: "Qualifier",
    certificateLink:
      "https://drive.google.com/file/d/1oZKVSbwn1MFgJLljCQ8AeqaG7ZswphSw/view?usp=sharing",
  },
  {
    position: "Top 26000 teams out of 3 Lakh + teams",
    eventName: "Adobe University Hackathon",
    hostedBy: "Adobe University",
    level: "Global",
    certificateLink:
      "https://drive.google.com/file/d/1p1nJwogSijmQVFBIUmJlvmXisV_1UbWD/view?usp=sharing",
  },
  {
    position: "Participated",
    eventName: "StudAI Foundry Hackathon",
    hostedBy: "StudAI one",
    level: "National",
    certificateLink:
      "https://drive.google.com/file/d/1Em6J-FO3FJC77S9iJnyPGe2nXET_PHAK/view?usp=sharing",
  },
  {
    position: "Participated",
    eventName: "Immersive XR Hackathon",
    hostedBy: "Sri Ramakrishna Engineering College",
    level: "Inter College",
    certificateLink:
      "https://drive.google.com/file/d/1Q8zs2K7VRQd21CzAh0MgvOLaoeqNviFU/view?usp=sharing",
  },
  {
    position: "Participated",
    eventName: "NIT x Vortex Hackathon",
    hostedBy: "National Institute of Trichy",
    level: "National",
    certificateLink:
      "https://drive.google.com/file/d/14NECNM_avjj7rtJEEaKDu9ApNRLxuFA7/view?usp=sharing",
  },
];

export function createBundledCaseFiles(): CaseFileItem[] {
  return FALLBACK_CASE_FILES_RAW.map((row, idx) => ({
    id: `fallback-case-${idx + 1}`,
    caseNumber: `CASE ${(idx + 1).toString().padStart(3, "0")}`,
    position: row.position,
    eventName: row.eventName,
    hostedBy: row.hostedBy,
    level: row.level,
    certificateLink: row.certificateLink,
  }));
}
