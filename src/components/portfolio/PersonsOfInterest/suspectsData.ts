export interface SuspectData {
  id: string;
  number: number;
  code: string;
  alias: string;
  heightCm: number;
  heightFtIn: string;
  prop: string;
  knownFor: string;
  lastSeenAt: string;
  evidenceId: string;
  evidenceLabel: string;
  danger: string;
  dangerLevel: 1 | 2 | 3;
}

export const SUSPECTS_DATA: SuspectData[] = [
  {
    id: "builder",
    number: 1,
    code: "ASW-0001",
    alias: "THE BUILDER",
    heightCm: 178,
    heightFtIn: "5'10\"",
    prop: "laptop",
    knownFor: "Building AI tools that stay simple.",
    lastSeenAt: "React, Node.js and Python projects.",
    evidenceId: "projects",
    evidenceLabel: "Projects section",
    danger: "HIGH",
    dangerLevel: 3,
  },
  {
    id: "competitor",
    number: 2,
    code: "ASW-0002",
    alias: "THE COMPETITOR",
    heightCm: 172,
    heightFtIn: "5'8\"",
    prop: "trophy",
    knownFor: "Performing under pressure.",
    lastSeenAt: "National finals and expos.",
    evidenceId: "achievements",
    evidenceLabel: "Achievements section",
    danger: "HIGH",
    dangerLevel: 3,
  },
  {
    id: "leader",
    number: 3,
    code: "ASW-0003",
    alias: "THE LEADER",
    heightCm: 181,
    heightFtIn: "5'11\"",
    prop: "megaphone",
    knownFor: "Running teams and clubs.",
    lastSeenAt: "Campus clubs, E-Cell and student communities.",
    evidenceId: "experience",
    evidenceLabel: "Experience section",
    danger: "MEDIUM",
    dangerLevel: 2,
  },
  {
    id: "mentor",
    number: 4,
    code: "ASW-0004",
    alias: "THE MENTOR",
    heightCm: 169,
    heightFtIn: "5'6.5\"",
    prop: "notebook",
    knownFor: "Helping other students get unstuck.",
    lastSeenAt: "Mentoring and campus programmes.",
    evidenceId: "experience",
    evidenceLabel: "Experience section",
    danger: "MEDIUM",
    dangerLevel: 2,
  },
  {
    id: "poet",
    number: 5,
    code: "ASW-0005",
    alias: "THE POET",
    heightCm: 175,
    heightFtIn: "5'9\"",
    prop: "pen and page",
    knownFor: "Cutting every sentence that does not land.",
    lastSeenAt: "Published anthologies.",
    evidenceId: "projects",
    evidenceLabel: "Projects section",
    danger: "LOW (dangerous to clichés)",
    dangerLevel: 1,
  },
];
