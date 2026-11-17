import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpeedometerGauge } from "./Gauge";
import type { Skill } from "./skillsData";

interface SkillCardProps {
  skill: Skill;
  category: string;
  index: number;
  isTriggered?: boolean;
  className?: string;
}

export function SkillCard({
  skill,
  category,
  index,
  isTriggered = true,
  className,
}: SkillCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.94 }}
      animate={
        reduceMotion || isTriggered
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 20, scale: 0.94 }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "relative rounded-xl bg-[#081426]/90 border border-cyan-500/35 p-3 sm:p-4 backdrop-blur-md shadow-[0_10px_25px_rgba(2,8,20,0.65),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.22)] flex items-center justify-between gap-3 overflow-hidden select-none group",
        className,
      )}
      style={{
        minHeight: "clamp(72px, 8vh, 96px)",
      }}
    >
      {/* Street Sign Corner Accents */}
      <div
        className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-slate-500/80 border border-slate-700"
        aria-hidden="true"
      />
      <div
        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-500/80 border border-slate-700"
        aria-hidden="true"
      />

      {/* Left Details */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
            {category}
          </span>
          {skill.badge && (
            <span
              className={cn(
                "px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold tracking-wider uppercase bg-emerald-950/90 text-emerald-400 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
                !reduceMotion && "animate-pulse",
              )}
            >
              {skill.badge}
            </span>
          )}
        </div>

        {/* Real text: at least 16px font as requested */}
        <h4 className="font-semibold text-white text-[15px] sm:text-base lg:text-[17px] tracking-wide truncate group-hover:text-cyan-200 transition-colors">
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
