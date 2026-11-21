import React from "react";
import {
  SiPython,
  SiC,
  SiCplusplus,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiReact,
  SiNodedotjs,
  SiGit,
  SiGithub,
} from "react-icons/si";
import {
  Code2,
  Network,
  Palette,
  Search,
  Bot,
  Sparkles,
  MessageSquare,
  Puzzle,
  Users,
  Clock,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TOOLKIT DATA CONFIG
   Single unified config array. Edit skills, levels, and icons here.
   ───────────────────────────────────────────────────────────── */
export type ProficiencyLevel = "Advanced" | "Proficient" | "Working knowledge";

export interface SkillItem {
  name: string;
  level: ProficiencyLevel;
  icon: React.ComponentType<{
    className?: string;
    size?: number | string;
    strokeWidth?: number;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
}

export interface SkillGroup {
  groupName: string;
  skills: SkillItem[];
}

export const TOOLKIT_GROUPS: SkillGroup[] = [
  {
    groupName: "Languages",
    skills: [
      { name: "Python", level: "Advanced", icon: SiPython },
      { name: "C", level: "Advanced", icon: SiC },
      { name: "C++", level: "Advanced", icon: SiCplusplus },
      { name: "JavaScript", level: "Proficient", icon: SiJavascript },
      { name: "HTML", level: "Advanced", icon: SiHtml5 },
      { name: "CSS", level: "Proficient", icon: SiCss },
    ],
  },
  {
    groupName: "Frameworks and tools",
    skills: [
      { name: "React.js", level: "Proficient", icon: SiReact },
      { name: "Node.js", level: "Proficient", icon: SiNodedotjs },
      { name: "Git", level: "Advanced", icon: SiGit },
      { name: "GitHub", level: "Advanced", icon: SiGithub },
    ],
  },
  {
    groupName: "Development",
    skills: [
      { name: "Software Development", level: "Advanced", icon: Code2 },
      { name: "Data Structures", level: "Proficient", icon: Network },
      { name: "UI/UX Design", level: "Proficient", icon: Palette },
      { name: "Basic SEO", level: "Working knowledge", icon: Search },
    ],
  },
  {
    groupName: "AI and professional",
    skills: [
      { name: "AI-Assisted Development", level: "Advanced", icon: Bot },
      { name: "Generative AI Prompting", level: "Advanced", icon: Sparkles },
      { name: "Communication", level: "Advanced", icon: MessageSquare },
      { name: "Problem Solving", level: "Advanced", icon: Puzzle },
      { name: "Teamwork", level: "Advanced", icon: Users },
      { name: "Time Management", level: "Proficient", icon: Clock },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   MY TOOLKIT COMPONENT
   Unified tile grid with 6-column desktop layout.
   ───────────────────────────────────────────────────────────── */
export function SkillsPursuit() {
  return (
    <section
      id="skills"
      aria-labelledby="toolkit-title"
      className="relative w-full bg-[#050c18] text-slate-100 py-16 sm:py-20 overflow-hidden"
    >
      {/* Subtle edge blend into adjacent sections */}
      <div
        className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#E8F1FC]/20 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#E8F1FC]/20 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2
            id="toolkit-title"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            My toolkit
          </h2>
          <p className="mt-3 text-sm sm:text-base font-sans text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Tech stack used in my projects: React.js, Node.js, Python.
          </p>
        </div>

        {/* Skill Groups */}
        <div className="space-y-8 sm:space-y-10">
          {TOOLKIT_GROUPS.map((group) => {
            const groupId = `group-${group.groupName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return (
              <div key={group.groupName}>
                {/* Sentence case, medium weight, muted color, left-aligned heading */}
                <h3
                  id={groupId}
                  className="font-sans text-sm sm:text-base font-medium text-slate-400 mb-3 sm:mb-4 text-left"
                >
                  {group.groupName}
                </h3>

                {/* 6 columns on desktop (>=1100px), 3 columns on tablet (600-1099px), 2 columns on mobile (<600px).
                    Groups with 4 tiles are left-aligned and do not stretch. */}
                <ul
                  role="list"
                  aria-labelledby={groupId}
                  className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[1100px]:grid-cols-6 gap-3 sm:gap-4"
                >
                  {group.skills.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <li
                        key={skill.name}
                        tabIndex={0}
                        aria-label={`${skill.name}, ${skill.level}`}
                        className="group relative flex flex-col items-center justify-between text-center p-3.5 sm:p-4 rounded-xl min-h-[128px] h-full bg-[#081528]/90 border border-slate-800/90 hover:border-cyan-400/60 hover:-translate-y-[2px] transition-all duration-200 ease-out motion-reduce:hover:translate-y-0 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050c18] cursor-default select-none"
                      >
                        {/* Icon: Same size, muted default, cyan on hover */}
                        <div className="flex items-center justify-center h-8 shrink-0">
                          <Icon
                            size={28}
                            strokeWidth={1.8}
                            aria-hidden="true"
                            className="w-7 h-7 text-slate-400 group-hover:text-cyan-400 transition-colors duration-200 shrink-0"
                          />
                        </div>

                        {/* Skill Name: Vertically centered, wraps cleanly up to 2 lines */}
                        <div className="flex-1 flex items-center justify-center my-1.5 px-0.5">
                          <span className="font-sans font-medium text-xs sm:text-sm text-slate-100 leading-snug line-clamp-2 text-center">
                            {skill.name}
                          </span>
                        </div>

                        {/* Level Label: Small, muted, consistent baseline */}
                        <span className="font-sans text-[11px] sm:text-xs text-slate-400 shrink-0">
                          {skill.level}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Backward-compatibility exports
export const ToolkitSurveillance = SkillsPursuit;
export const Toolkit = SkillsPursuit;
export default SkillsPursuit;
