export interface Skill {
  name: string;
  level: number;
  badge?: string;
}

export interface CheckpointData {
  id: number;
  checkpointNumber: number;
  category: string;
  title: string;
  subtitle: string;
  skills: Skill[];
}

export const CHECKPOINTS_DATA: CheckpointData[] = [
  {
    id: 1,
    checkpointNumber: 1,
    category: "PROGRAMMING",
    title: "Checkpoint 1 · PROGRAMMING",
    subtitle: "Police Roadblock // Barrier Breach",
    skills: [
      { name: "C", level: 85 },
      { name: "C++", level: 85 },
      { name: "Python", level: 88 },
      { name: "JavaScript", level: 80 },
    ],
  },
  {
    id: 2,
    checkpointNumber: 2,
    category: "DEVELOPMENT",
    title: "Checkpoint 2 · DEVELOPMENT",
    subtitle: "Crash Site // Incident Zone",
    skills: [
      { name: "Software Development", level: 85 },
      { name: "Data Structures", level: 82 },
      { name: "Git & GitHub", level: 85 },
      { name: "AI-Assisted Development", level: 90, badge: "SIGNAL STRONG" },
      { name: "UI/UX Design", level: 78 },
      { name: "Basic SEO", level: 70 },
    ],
  },
  {
    id: 3,
    checkpointNumber: 3,
    category: "AI",
    title: "Checkpoint 3 · AI",
    subtitle: "Traffic Camera // Biometric Recon",
    skills: [
      { name: "Generative AI Prompting", level: 92, badge: "SIGNAL STRONG" },
      { name: "Prompt Strategy & Optimization", level: 88 },
    ],
  },
  {
    id: 4,
    checkpointNumber: 4,
    category: "PROFESSIONAL",
    title: "Checkpoint 4 · PROFESSIONAL",
    subtitle: "Interrogation Building // Audio CH-2",
    skills: [
      { name: "Communication", level: 90, badge: "SIGNAL STRONG" },
      { name: "Customer Relation Management", level: 85 },
      { name: "Leadership", level: 86 },
    ],
  },
];
