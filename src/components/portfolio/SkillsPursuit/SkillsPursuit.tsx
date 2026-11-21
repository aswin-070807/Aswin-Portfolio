import React from "react";
import type { IconType } from "react-icons";
import {
  SiPython,
  SiC,
  SiCplusplus,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiGit,
  SiGithub,
} from "react-icons/si";

/* ─────────────────────────────────────────────────────────────
   TOOLKIT DATA CONFIG
   Easily add or modify technical skills and competencies here.
   ───────────────────────────────────────────────────────────── */
export interface TechSkill {
  name: string;
  level: "Advanced" | "Proficient";
  icon: IconType;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export const MAIN_TECH_STACK: TechSkill[] = [
  { name: "Python", level: "Advanced", icon: SiPython },
  { name: "C", level: "Advanced", icon: SiC },
  { name: "C++", level: "Advanced", icon: SiCplusplus },
  { name: "JavaScript", level: "Proficient", icon: SiJavascript },
  { name: "React.js", level: "Proficient", icon: SiReact },
  { name: "Node.js", level: "Proficient", icon: SiNodedotjs },
  { name: "Git", level: "Advanced", icon: SiGit },
  { name: "GitHub", level: "Advanced", icon: SiGithub },
];

export const ADDITIONAL_SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Development",
    skills: [
      "Software Development",
      "Data Structures",
      "UI/UX Design",
      "Basic SEO",
      "AI-Assisted Development",
    ],
  },
  {
    category: "AI",
    skills: ["Generative AI Prompting"],
  },
  {
    category: "Professional",
    skills: ["Communication"],
  },
];

/* ─────────────────────────────────────────────────────────────
   MY TOOLKIT COMPONENT
   Clean, modern, recruiter-friendly tech stack and skills grid.
   ───────────────────────────────────────────────────────────── */
export function SkillsPursuit() {
  return (
    <section
      id="skills"
      aria-labelledby="toolkit-title"
      className="relative w-full bg-[#050c18] text-slate-100 py-16 sm:py-20 overflow-hidden"
    >
      {/* Subtle edge blend into the page's background */}
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

        {/* Part A: Main Tech Stack Logo Grid */}
        <ul
          role="list"
          aria-label="Core technologies"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {MAIN_TECH_STACK.map((skill) => {
            const Icon = skill.icon;
            return (
              <li
                key={skill.name}
                tabIndex={0}
                aria-label={`${skill.name}, ${skill.level}`}
                className="group relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-xl bg-[#081528]/90 border border-slate-800/90 hover:border-cyan-400/60 hover:-translate-y-1 transition-all duration-200 ease-out motion-reduce:hover:translate-y-0 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050c18] cursor-default"
              >
                <Icon
                  size={32}
                  aria-hidden="true"
                  className="text-slate-400 group-hover:text-cyan-400 transition-colors duration-200 shrink-0"
                />
                <span className="mt-3 font-sans font-medium text-sm sm:text-base text-slate-100 tracking-tight">
                  {skill.name}
                </span>
                <span className="mt-1 font-sans text-xs text-slate-400">
                  {skill.level}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Part B: Skills Without Logos (Pill Chips) */}
        <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-slate-800/80 space-y-6">
          {ADDITIONAL_SKILL_GROUPS.map((group) => (
            <div
              key={group.category}
              className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-6"
            >
              <h3 className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                {group.category}
              </h3>
              <ul
                role="list"
                aria-label={`${group.category} skills`}
                className="flex flex-wrap gap-2"
              >
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    tabIndex={0}
                    className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-sans bg-[#081528]/80 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050c18] cursor-default"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Backward-compatibility aliases for existing imports
export const ToolkitSurveillance = SkillsPursuit;
export const Toolkit = SkillsPursuit;
export default SkillsPursuit;
