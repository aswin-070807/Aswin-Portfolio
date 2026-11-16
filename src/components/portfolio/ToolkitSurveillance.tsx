import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  Bot,
  Code2,
  Cpu,
  Layers,
  Shield,
  Sparkles,
  Terminal,
  Users,
  type LucideIcon,
} from "lucide-react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SkillItem {
  name: string;
  level: number;
}

interface MonitorFeed {
  camId: string;
  title: string;
  icon: LucideIcon;
  skills: SkillItem[];
}

const FEEDS_DATA: MonitorFeed[] = [
  {
    camId: "CAM 01",
    title: "PROGRAMMING",
    icon: Terminal,
    skills: [
      { name: "C", level: 85 },
      { name: "C++", level: 85 },
      { name: "Python", level: 88 },
      { name: "JavaScript", level: 80 },
    ],
  },
  {
    camId: "CAM 02",
    title: "DEVELOPMENT",
    icon: Layers,
    skills: [
      { name: "Software Development", level: 85 },
      { name: "Data Structures", level: 82 },
      { name: "Git & GitHub", level: 85 },
      { name: "AI-Assisted Development", level: 90 },
      { name: "UI/UX Design", level: 78 },
      { name: "Basic SEO", level: 70 },
    ],
  },
  {
    camId: "CAM 03",
    title: "AI",
    icon: Sparkles,
    skills: [
      { name: "Generative AI Prompting", level: 92 },
      { name: "Prompt Strategy & Optimization", level: 88 },
    ],
  },
  {
    camId: "CAM 04",
    title: "PROFESSIONAL",
    icon: Users,
    skills: [
      { name: "Communication", level: 90 },
      { name: "Customer Relation Management", level: 85 },
      { name: "Leadership", level: 86 },
    ],
  },
];

// Single 10-Segment Signal Strength Gauge
function SignalGauge({
  level,
  isInView,
  delay,
}: {
  level: number;
  isInView: boolean;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  const [animatedLevel, setAnimatedLevel] = useState(reduceMotion ? level : 0);

  useEffect(() => {
    if (reduceMotion || !isInView) {
      setAnimatedLevel(level);
      return;
    }

    const timer = setTimeout(() => {
      let start = 0;
      const duration = 650;
      const startTime = performance.now();

      const frame = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedLevel(Math.round(start + (level - start) * eased));

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          setAnimatedLevel(level);
        }
      };

      const reqId = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(reqId);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, level, delay, reduceMotion]);

  // 10 Segments (each 10%)
  return (
    <div className="flex items-center gap-1 w-full h-2 mt-1.5" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => {
        const segMin = i * 10;
        const segMax = (i + 1) * 10;
        const isFull = animatedLevel >= segMax;
        const isPartial = animatedLevel > segMin && animatedLevel < segMax;
        const partialPct = isPartial ? ((animatedLevel - segMin) / 10) * 100 : 0;

        return (
          <div
            key={i}
            className="flex-1 h-full rounded-[1.5px] overflow-hidden bg-[#071320] border border-cyan-950/70"
          >
            {isFull ? (
              <div className="w-full h-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.7)]" />
            ) : isPartial ? (
              <div
                className="h-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.7)]"
                style={{ width: `${partialPct}%` }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// Single CCTV Monitor Screen
function CctvMonitor({
  feed,
  index,
  timecode,
  isInView,
}: {
  feed: MonitorFeed;
  index: number;
  timecode: string;
  isInView: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const Icon = feed.icon;

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 0, scaleY: 0.05, filter: "brightness(2.5)" }
      }
      animate={
        isInView
          ? { opacity: 1, scaleY: 1, filter: "brightness(1)" }
          : {}
      }
      transition={{
        duration: 0.45,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative rounded-xl bg-[#0a1422] border border-cyan-500/25 p-4 sm:p-5 shadow-[inset_0_0_30px_rgba(0,240,255,0.04),0_10px_25px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.12)] flex flex-col justify-between"
    >
      {/* Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 240, 255, 0.04) 2px, rgba(0, 240, 255, 0.04) 4px)",
        }}
        aria-hidden="true"
      />

      {/* Screen CRT Curved Corner Highlights */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none border border-cyan-400/10 shadow-[inset_0_0_12px_rgba(0,240,255,0.06)]"
        aria-hidden="true"
      />

      {/* Top Bar inside Screen: CAM ID, Category Title, Glowing Icon, REC Dot, Running Timecode */}
      <div className="relative z-20 flex items-center justify-between pb-3 border-b border-cyan-500/20 font-mono">
        <div className="flex items-center gap-2">
          {/* Glowing Icon Circle */}
          <div className="w-6 h-6 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.35)] shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs sm:text-[13px] font-bold text-cyan-300 tracking-wider">
            {feed.camId} · {feed.title}
          </span>
        </div>

        {/* REC & Timecode */}
        <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono tracking-widest">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]",
                !reduceMotion && "animate-pulse"
              )}
            />
            <span className="text-red-400 font-black">REC</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">[{timecode}]</span>
        </div>
      </div>

      {/* Skills Rows Container */}
      <div className="relative z-20 py-4 space-y-3.5 flex-1">
        {feed.skills.map((skill, sIdx) => {
          const isSignalStrong = skill.level >= 90;

          return (
            <div key={skill.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs sm:text-[13.5px]">
                <div className="flex items-center truncate pr-2">
                  <span className="font-semibold text-slate-200 tracking-wide truncate">
                    {skill.name}
                  </span>
                  {/* SIGNAL STRONG Tag */}
                  {isSignalStrong && (
                    <span
                      className={cn(
                        "ml-2 shrink-0 px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9px] font-mono font-bold tracking-wider uppercase bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shadow-[0_0_6px_rgba(16,185,129,0.3)]",
                        !reduceMotion && "animate-pulse"
                      )}
                    >
                      SIGNAL STRONG
                    </span>
                  )}
                </div>

                <span className="font-mono font-bold text-cyan-300 shrink-0">
                  {skill.level}%
                </span>
              </div>

              {/* 10-Segment Signal Gauge */}
              <SignalGauge
                level={skill.level}
                isInView={isInView}
                delay={0.25 + index * 0.1 + sIdx * 0.05}
              />
            </div>
          );
        })}
      </div>

      {/* Screen Bottom Bar: Tiny "FEED STATUS: ACTIVE" */}
      <div className="relative z-20 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest select-none">
        <span>FEED STATUS: ACTIVE</span>
        <span className="sm:hidden text-slate-500">{timecode}</span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN SURVEILLANCE ROOM CONTROL PANEL COMPONENT
// ─────────────────────────────────────────────────────────────
export function ToolkitSurveillance() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  // Running Timecode HH:MM:SS
  const [timecode, setTimecode] = useState("00:00:00");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTimecode(`${hh}:${mm}:${ss}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="skills"
      ref={containerRef}
      className="relative w-full bg-transparent py-12 sm:py-16 overflow-hidden toolkit-cctv"
    >
      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. SECTION HEADER (Outside Panel) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Eyebrow in letter-spaced monospace */}
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#0B1F4B]/70 mb-2">
            SURVEILLANCE ROOM · LIVE FEEDS
          </p>

          {/* Heading: "My toolkit" with yellow underline */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            My{" "}
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              toolkit
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-sm sm:text-base font-semibold text-[#1A3A7A] leading-relaxed">
            Tech stack used in my projects: React.js, Node.js, Python.
          </p>
        </div>

        {/* 2. ONE LARGE DARK CONTROL-ROOM PANEL */}
        <div className="relative rounded-[24px] bg-gradient-to-b from-[#0f1b2d] to-[#16263d] p-4 sm:p-6 md:p-8 border border-cyan-500/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_20px_50px_rgba(11,31,75,0.35)]">
          {/* Top Edge Label Plate */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-0.5 rounded bg-[#0a1422] border border-cyan-500/40 text-cyan-400 font-mono text-[9.5px] sm:text-[10px] font-black tracking-widest uppercase shadow-sm select-none"
            aria-hidden="true"
          >
            CONTROL ROOM · FIELD KIT
          </div>

          {/* Corner Screws (4 metallic screws with slot line) */}
          <div
            className="absolute top-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center shadow-inner opacity-80"
            aria-hidden="true"
          >
            <div className="w-2 h-0.5 bg-slate-900 transform rotate-45" />
          </div>
          <div
            className="absolute top-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center shadow-inner opacity-80"
            aria-hidden="true"
          >
            <div className="w-2 h-0.5 bg-slate-900 transform -rotate-45" />
          </div>
          <div
            className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center shadow-inner opacity-80"
            aria-hidden="true"
          >
            <div className="w-2 h-0.5 bg-slate-900 transform -rotate-30" />
          </div>
          <div
            className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center shadow-inner opacity-80"
            aria-hidden="true"
          >
            <div className="w-2 h-0.5 bg-slate-900 transform rotate-60" />
          </div>

          {/* 3 & 4. 2x2 GRID OF FOUR CCTV MONITORS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-1">
            {FEEDS_DATA.map((feed, index) => (
              <CctvMonitor
                key={feed.camId}
                feed={feed}
                index={index}
                timecode={timecode}
                isInView={isInView}
              />
            ))}
          </div>

          {/* 5. PANEL FOOTER STATUS BAR */}
          <div className="mt-6 pt-3 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] sm:text-xs text-slate-300">
            {/* Left: ALL FEEDS ACTIVE · 4/4 ONLINE */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="font-bold text-emerald-400 tracking-wider">
                ALL FEEDS ACTIVE · 4/4 ONLINE
              </span>
            </div>

            {/* Right: OPERATOR: ASWIN A */}
            <div className="text-slate-400 font-semibold tracking-wider">
              OPERATOR: <span className="text-slate-200 font-bold">ASWIN A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
