import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpeedometerGauge } from "./Gauge";
import type { Skill } from "./skillsData";

interface SkillSignProps {
  skill: Skill;
  category: string;
  index: number;
  isTriggered?: boolean;
  className?: string;
}

export function SkillSign({
  skill,
  category,
  index,
  isTriggered = true,
  className,
}: SkillSignProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 1, y: 0, rotate: 0 }
          : { opacity: 0, y: -18, rotate: index % 2 === 0 ? -6 : 6 }
      }
      animate={
        reduceMotion || isTriggered
          ? { opacity: 1, y: 0, rotate: 0 }
          : { opacity: 0, y: -18, rotate: index % 2 === 0 ? -6 : 6 }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay: reduceMotion ? 0 : index * 0.08,
        ease: [0.175, 0.885, 0.32, 1.15], // Subtle spring swing-in
      }}
      className={cn(
        "relative rounded-xl bg-[#091526]/95 border border-cyan-500/30 p-3 sm:p-3.5 backdrop-blur-md shadow-[0_8px_20px_rgba(3,10,22,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.18)] flex items-center justify-between gap-3 overflow-hidden",
        className,
      )}
    >
      {/* Top Street-Sign Rivets */}
      <div
        className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-slate-500 border border-slate-700 shadow-inner"
        aria-hidden="true"
      />
      <div
        className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-slate-500 border border-slate-700 shadow-inner"
        aria-hidden="true"
      />

      {/* Left Details: Category Label, Skill Name, Badge */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[9px] font-mono font-bold text-cyan-400/80 tracking-widest uppercase">
            {category}
          </span>
          {skill.badge && (
            <span
              className={cn(
                "px-1.5 py-0.2 rounded text-[8px] font-mono font-bold tracking-wider uppercase bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shadow-[0_0_6px_rgba(16,185,129,0.3)]",
                !reduceMotion && "animate-pulse",
              )}
            >
              {skill.badge}
            </span>
          )}
        </div>

        <h4 className="font-semibold text-slate-100 text-xs sm:text-sm tracking-wide truncate">
          {skill.name}
        </h4>
      </div>

      {/* Right Side: Speedometer Gauge */}
      <div className="shrink-0">
        <SpeedometerGauge level={skill.level} skillName={skill.name} isTriggered={isTriggered} />
      </div>
    </motion.div>
  );
}
