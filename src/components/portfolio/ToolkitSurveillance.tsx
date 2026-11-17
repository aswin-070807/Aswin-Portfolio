import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Bot,
  Code2,
  Cpu,
  Layers,
  Radio,
  Shield,
  Sparkles,
  Terminal,
  Users,
  type LucideIcon,
} from "lucide-react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
      const start = 0;
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

// ─────────────────────────────────────────────────────────────
// CRIME SCENE ANIMATION COMPONENTS (Transform & Opacity Only)
// ─────────────────────────────────────────────────────────────

const POLICE_RADIO_LINES = [
  "UNIT 7 · SUSPECT HEADING NORTH · BACKUP EN ROUTE",
  "DISPATCH · CODE 3 ON HIGHWAY CORRIDOR · INTERCEPTORS RESPOND",
  "AIR-1 · AERIAL VISUAL LOCKED ON GETAWAY VEHICLE",
  "PRECINCT 4 · CHECKPOINT DELTA ENGAGED · PERIMETER SECURED",
  "FORENSICS · CRIME SCENE TAPE ACTIVE AT JUNCTION 12",
  "K-9 UNIT EN ROUTE · SUSPECT VEHICLE CORNERED AT SECTOR 6",
];

// Slim Police-Radio Ticker across the top of the control panel
function PoliceRadioTicker({ isInView }: { isInView: boolean }) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldAnimate = isInView && !reduceMotion && !isMobile;

  return (
    <div
      className="relative z-20 mb-4 px-3 py-1.5 rounded-lg bg-[#071320] border border-cyan-500/20 flex items-center gap-3 overflow-hidden text-[10.5px] font-mono select-none"
      aria-label="Police Radio Ticker"
    >
      {/* Ticker Frequency Badge */}
      <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold tracking-wider">
        <Radio className="w-3 h-3 text-cyan-400" />
        <span className="hidden sm:inline">DISPATCH 460.125 MHz</span>
        <span className="sm:hidden">RADIO</span>
      </div>

      {/* Marquee ticker text */}
      <div className="relative flex-1 overflow-hidden">
        {shouldAnimate ? (
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex items-center gap-8 whitespace-nowrap will-change-transform text-cyan-300/80"
          >
            {[...POLICE_RADIO_LINES, ...POLICE_RADIO_LINES].map((line, idx) => (
              <span key={idx} className="flex items-center gap-3">
                <span>{line}</span>
                <span className="text-cyan-600/60 font-black">///</span>
              </span>
            ))}
          </motion.div>
        ) : (
          <div className="text-cyan-300/80 truncate">{POLICE_RADIO_LINES[0]}</div>
        )}
      </div>
    </div>
  );
}

// CAM 01: Mini Night-Road Strip (top-down view with getaway & police chase)
function Cam01NightRoadScene({ isInView }: { isInView: boolean }) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldAnimate = isInView && !reduceMotion && !isMobile;

  return (
    <div
      className="relative mt-3 rounded-lg bg-[#060f1b] border border-cyan-500/25 overflow-hidden h-[76px] flex flex-col justify-between p-1.5 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"
      aria-hidden="true"
    >
      {/* Top Telemetry Stamp */}
      <div className="relative z-20 flex items-center justify-between text-[9px] font-mono text-cyan-400/70 tracking-widest uppercase px-1 pointer-events-none">
        <span>CAM-01 · HWY 101 N</span>
        <span>PURSUIT IN PROGRESS</span>
      </div>

      {/* Road Bed */}
      <div className="relative w-full h-9 rounded bg-[#08121f] border-y border-slate-800/80 overflow-hidden flex items-center">
        {/* Soft Red & Blue Siren Road-Edge Glow Flicker (opacity only!) */}
        <motion.div
          animate={shouldAnimate ? { opacity: [0.15, 0.7, 0.25, 0.8, 0.15] } : { opacity: 0.3 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-red-500/40 to-transparent pointer-events-none z-10"
        />
        <motion.div
          animate={shouldAnimate ? { opacity: [0.2, 0.8, 0.15, 0.7, 0.2] } : { opacity: 0.3 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: 0.3,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-blue-500/40 to-transparent pointer-events-none z-10"
        />

        {/* Center Yellow Dashed Line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0 border-b border-dashed border-yellow-400/75 z-0" />

        {/* Pursuit Cars Convoy: Police Car chasing Getaway Car */}
        <motion.div
          initial={{ x: "-140%" }}
          animate={shouldAnimate ? { x: ["-140%", "360%"] } : { x: "25%" }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="relative z-10 flex items-center gap-3.5 will-change-transform"
        >
          {/* POLICE CAR (Trailing Behind) */}
          <div className="relative shrink-0">
            {/* Siren Light Pulsing Flares (opacity only!) */}
            <motion.div
              animate={shouldAnimate ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.7 }}
              transition={{ duration: 0.25, repeat: Infinity }}
              className="absolute -top-1 left-2.5 w-4 h-4 rounded-full bg-red-500/60 blur-xs pointer-events-none"
            />
            <motion.div
              animate={shouldAnimate ? { opacity: [1, 0.3, 1] } : { opacity: 0.7 }}
              transition={{ duration: 0.25, repeat: Infinity }}
              className="absolute -bottom-1 left-2.5 w-4 h-4 rounded-full bg-blue-500/60 blur-xs pointer-events-none"
            />
            {/* Top-Down Police Cruiser SVG */}
            <svg viewBox="0 0 46 22" className="w-10 h-5">
              {/* Wheels */}
              <rect x="7" y="1" width="7" height="2.5" rx="1" fill="#0f172a" />
              <rect x="32" y="1" width="7" height="2.5" rx="1" fill="#0f172a" />
              <rect x="7" y="18.5" width="7" height="2.5" rx="1" fill="#0f172a" />
              <rect x="32" y="18.5" width="7" height="2.5" rx="1" fill="#0f172a" />
              {/* Cruiser Body */}
              <path
                d="M4 11 C4 6, 8 3.5, 14 3.5 L34 3.5 C40 3.5, 43 7, 43 11 C43 15, 40 18.5, 34 18.5 L14 18.5 C8 18.5, 4 16, 4 11 Z"
                fill="#0b1728"
                stroke="#38bdf8"
                strokeWidth="1"
              />
              {/* White Roof Section */}
              <rect x="16" y="5" width="12" height="12" rx="1" fill="#e2e8f0" />
              {/* Push Bumper */}
              <rect x="42.5" y="6" width="1.5" height="10" rx="0.5" fill="#64748b" />
              {/* Siren Bar: Red & Blue */}
              <rect x="20.5" y="6" width="3" height="4.5" rx="0.5" fill="#ef4444" />
              <rect x="20.5" y="11.5" width="3" height="4.5" rx="0.5" fill="#3b82f6" />
              {/* Headlights */}
              <circle cx="43" cy="5" r="1" fill="#ffffff" />
              <circle cx="43" cy="17" r="1" fill="#ffffff" />
            </svg>
          </div>

          {/* GETAWAY CAR (Ahead) */}
          <div className="relative shrink-0">
            {/* Top-Down Getaway Sports Car SVG */}
            <svg viewBox="0 0 44 20" className="w-9 h-4.5">
              {/* Wheels */}
              <rect x="6" y="0.5" width="6" height="2.5" rx="1" fill="#0f172a" />
              <rect x="30" y="0.5" width="6" height="2.5" rx="1" fill="#0f172a" />
              <rect x="6" y="17" width="6" height="2.5" rx="1" fill="#0f172a" />
              <rect x="30" y="17" width="6" height="2.5" rx="1" fill="#0f172a" />
              {/* Body */}
              <path
                d="M3 10 C3 5, 8 3, 14 3 L33 3 C39 3, 42 6, 42 10 C42 14, 39 17, 33 17 L14 17 C8 17, 3 15, 3 10 Z"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="0.9"
              />
              {/* Dark Windshield & Canopy */}
              <path d="M14 5 L27 5 L25 15 L14 15 Z" fill="#050811" />
              <rect x="17" y="6" width="6" height="8" rx="1" fill="#0f172a" />
              {/* Rear Red Taillights */}
              <rect x="3" y="4.5" width="1.5" height="2.5" rx="0.5" fill="#ef4444" />
              <rect x="3" y="13" width="1.5" height="2.5" rx="0.5" fill="#ef4444" />
              {/* Front Yellow Headlights */}
              <circle cx="41.5" cy="4.5" r="1" fill="#fef08a" />
              <circle cx="41.5" cy="15.5" r="1" fill="#fef08a" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Bottom Telemetry Stamp */}
      <div className="relative z-20 flex items-center justify-between text-[8.5px] font-mono text-cyan-500/60 tracking-wider px-1 pointer-events-none">
        <span>SECTOR 04 · INTERCEPT</span>
        <span>VEL: 114 MPH</span>
      </div>
    </div>
  );
}

// CAM 02: Footer Status Strip Cycling (FEED STATUS: ACTIVE <-> INCIDENT DETECTED)
function Cam02FooterScene({ isInView, timecode }: { isInView: boolean; timecode: string }) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldAnimate = isInView && !reduceMotion && !isMobile;
  const [incidentActive, setIncidentActive] = useState(false);

  useEffect(() => {
    if (!shouldAnimate) {
      setIncidentActive(false);
      return;
    }

    // Cycle: 4.5s ACTIVE, 4.5s INCIDENT
    const interval = setInterval(() => {
      setIncidentActive((prev) => !prev);
    }, 4500);

    return () => clearInterval(interval);
  }, [shouldAnimate]);

  return (
    <div className="relative z-20 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest select-none overflow-hidden h-7">
      {!incidentActive ? (
        <div className="flex items-center justify-between w-full text-cyan-400/60">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full bg-emerald-400",
                shouldAnimate && "animate-pulse",
              )}
            />
            <span>FEED STATUS: ACTIVE</span>
          </div>
          <span className="sm:hidden text-slate-500">{timecode}</span>
        </div>
      ) : (
        <div className="relative flex items-center justify-between w-full">
          {/* Incident Alert Tag */}
          <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[9.5px]">INCIDENT DETECTED</span>
          </div>

          {/* Colliding Tiny Cars in Center */}
          <div className="relative flex items-center justify-center w-14 h-4 mx-auto z-10">
            {/* Left car */}
            <motion.div
              initial={{ x: -16 }}
              animate={{ x: -2 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="will-change-transform"
            >
              <div className="w-3.5 h-2 rounded-xs bg-slate-300 border border-slate-500 relative">
                {/* Blinking hazard light */}
                <motion.div
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="absolute -top-0.5 -left-0.5 w-1 h-1 rounded-full bg-amber-400"
                />
              </div>
            </motion.div>

            {/* Impact star */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 0.9], opacity: [0, 1, 0.8] }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="absolute text-yellow-300 text-xs font-black will-change-transform pointer-events-none"
            >
              💥
            </motion.div>

            {/* Right car */}
            <motion.div
              initial={{ x: 16 }}
              animate={{ x: 2 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="will-change-transform"
            >
              <div className="w-3.5 h-2 rounded-xs bg-cyan-700 border border-cyan-400 relative">
                {/* Blinking hazard light */}
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="absolute -bottom-0.5 -right-0.5 w-1 h-1 rounded-full bg-amber-400"
                />
              </div>
            </motion.div>
          </div>

          {/* Yellow Crime-Scene Tape sliding in across */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ delay: 0.75, duration: 0.45, ease: "easeOut" }}
            className="absolute inset-y-0 right-0 left-1/3 flex items-center justify-center bg-amber-400 text-slate-950 font-black text-[8px] px-2 shadow-md z-20 will-change-transform tracking-wider"
          >
            /// CAUTION · CRIME SCENE ///
          </motion.div>
        </div>
      )}
    </div>
  );
}

// CAM 03: Dark Silhouette with Scanning Box, Sweeping Scan Line, & MATCH 92%
function Cam03BiometricScene({ isInView }: { isInView: boolean }) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldAnimate = isInView && !reduceMotion && !isMobile;

  return (
    <div
      className="relative mt-3 rounded-lg bg-[#060f1b] border border-cyan-500/25 overflow-hidden h-28 sm:h-32 flex flex-col justify-between p-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
      aria-hidden="true"
    >
      {/* CCTV Frame Metadata */}
      <div className="relative z-20 flex items-center justify-between text-[9px] font-mono text-cyan-400/70 tracking-widest uppercase pointer-events-none">
        <span>CAM-03 · AI RECON</span>
        <span>SYS: BIOMETRIC_V2</span>
      </div>

      {/* Central Biometric Scan Stage */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Subtle Surveillance Grid Backdrop */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.15) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Suspect Silhouette */}
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 70 70" className="w-16 h-16 sm:w-18 sm:h-18">
            {/* Silhouette Head */}
            <circle cx="35" cy="25" r="12" fill="#0d1b2d" stroke="#1e3a5f" strokeWidth="1" />
            {/* Silhouette Bust */}
            <path
              d="M15 58 C15 42, 24 38, 35 38 C46 38, 55 42, 55 58 Z"
              fill="#0d1b2d"
              stroke="#1e3a5f"
              strokeWidth="1"
            />
          </svg>

          {/* Tracking & Lock-on Box with Corner Brackets */}
          <motion.div
            animate={
              shouldAnimate
                ? {
                    x: [-4, 3, -1, 0, 0],
                    y: [-3, 2, -1, 0, 0],
                    scale: [1.25, 1.25, 0.95, 1.0, 1.0],
                  }
                : { x: 0, y: 0, scale: 1 }
            }
            transition={
              shouldAnimate
                ? {
                    duration: 4.5,
                    repeat: Infinity,
                    times: [0, 0.25, 0.5, 0.65, 1],
                    ease: "easeInOut",
                  }
                : {}
            }
            className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 pointer-events-none will-change-transform"
          >
            {/* 4 Corner Brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            {/* Cyan Scan Line Sweeping Down (transform & opacity only) */}
            <motion.div
              animate={
                shouldAnimate
                  ? {
                      y: ["-25px", "25px"],
                      opacity: [0, 0.9, 0.9, 0],
                    }
                  : { opacity: 0 }
              }
              transition={
                shouldAnimate
                  ? {
                      duration: 1.8,
                      delay: 0.6,
                      repeat: Infinity,
                      repeatDelay: 2.7,
                      ease: "easeInOut",
                    }
                  : {}
              }
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] will-change-transform pointer-events-none"
            />
          </motion.div>

          {/* "MATCH 92%" Blinks In */}
          <motion.div
            animate={
              shouldAnimate
                ? {
                    opacity: [0, 0, 0, 1, 0.2, 1, 1, 0],
                    scale: [0.9, 0.9, 0.9, 1.05, 1, 1, 1, 0.9],
                  }
                : { opacity: 1, scale: 1 }
            }
            transition={
              shouldAnimate
                ? {
                    duration: 4.5,
                    repeat: Infinity,
                    times: [0, 0.55, 0.6, 0.65, 0.7, 0.75, 0.92, 1],
                  }
                : {}
            }
            className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-950/95 border border-emerald-400/90 text-emerald-400 font-mono text-[8.5px] sm:text-[9.5px] font-black tracking-wider uppercase shadow-[0_0_8px_rgba(16,185,129,0.5)] whitespace-nowrap z-30 will-change-transform"
          >
            MATCH 92%
          </motion.div>
        </div>
      </div>

      {/* Bottom Telemetry Stamp */}
      <div className="relative z-20 flex items-center justify-between text-[8.5px] font-mono text-cyan-500/60 tracking-wider pointer-events-none">
        <span>TARGET LOCK: VERIFIED</span>
        <span>ID #08492</span>
      </div>
    </div>
  );
}

// CAM 04: Interrogation Room with Speech Bubbles & Spiking Polygraph
function Cam04InterrogationScene({ isInView }: { isInView: boolean }) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldAnimate = isInView && !reduceMotion && !isMobile;

  return (
    <div
      className="relative mt-3 rounded-lg bg-[#060f1b] border border-cyan-500/25 overflow-hidden h-28 sm:h-32 flex flex-col justify-between p-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
      aria-hidden="true"
    >
      {/* Top Header Stamp */}
      <div className="relative z-20 flex items-center justify-between text-[9px] font-mono text-cyan-400/70 tracking-widest uppercase pointer-events-none">
        <span>CAM-04 · ROOM 03</span>
        <span>AUDIO: CH-2 MON</span>
      </div>

      {/* Interrogation Room Scene */}
      <div className="relative flex-1 flex items-end justify-center pb-1">
        {/* Overhead Conical Light Beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-16 bg-gradient-to-b from-cyan-400/12 via-cyan-400/4 to-transparent pointer-events-none rounded-b-full" />

        {/* Room Characters Container */}
        <div className="relative flex items-end justify-center gap-2 sm:gap-3 w-full max-w-[200px]">
          {/* Interrogator / Detective (Left) */}
          <div className="relative flex flex-col items-center">
            {/* Speech Bubble 1 (Pops in first) */}
            <motion.div
              animate={
                shouldAnimate
                  ? {
                      scale: [0, 1.05, 1, 1, 0],
                      opacity: [0, 1, 1, 1, 0],
                    }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                shouldAnimate
                  ? {
                      duration: 4.8,
                      repeat: Infinity,
                      times: [0, 0.15, 0.25, 0.45, 0.52],
                    }
                  : {}
              }
              className="absolute -top-4 sm:-top-5 -left-1 px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/70 text-cyan-300 text-[8px] sm:text-[8.5px] font-mono font-bold tracking-tight shadow-xs whitespace-nowrap z-20 will-change-transform"
            >
              WHERE WERE YOU?
            </motion.div>

            {/* Silhouette */}
            <svg viewBox="0 0 28 32" className="w-6 h-7 sm:w-7 sm:h-8">
              <circle cx="15" cy="8" r="5" fill="#0d1b2d" stroke="#1e3a5f" strokeWidth="0.8" />
              <path
                d="M7 30 C7 18, 14 16, 21 16 L23 30 Z"
                fill="#0d1b2d"
                stroke="#1e3a5f"
                strokeWidth="0.8"
              />
            </svg>
          </div>

          {/* Interrogation Table */}
          <div className="w-12 sm:w-16 h-1 bg-slate-700/80 rounded-xs mb-1 border-t border-cyan-500/30" />

          {/* Suspect (Right) */}
          <div className="relative flex flex-col items-center">
            {/* Speech Bubble 2 (Pops in second) */}
            <motion.div
              animate={
                shouldAnimate
                  ? {
                      scale: [0, 0, 1.05, 1, 0],
                      opacity: [0, 0, 1, 1, 0],
                    }
                  : { scale: 0, opacity: 0 }
              }
              transition={
                shouldAnimate
                  ? {
                      duration: 4.8,
                      repeat: Infinity,
                      times: [0, 0.5, 0.6, 0.85, 0.95],
                    }
                  : {}
              }
              className="absolute -top-4 sm:-top-5 -right-1 px-1.5 py-0.5 rounded bg-amber-950/90 border border-amber-400/70 text-amber-300 text-[8px] sm:text-[8.5px] font-mono font-bold tracking-tight shadow-xs whitespace-nowrap z-20 will-change-transform"
            >
              I WAS AT HOME
            </motion.div>

            {/* Silhouette */}
            <svg viewBox="0 0 28 32" className="w-6 h-7 sm:w-7 sm:h-8">
              <circle cx="13" cy="8" r="5" fill="#0d1b2d" stroke="#1e3a5f" strokeWidth="0.8" />
              <path
                d="M5 30 L7 16 C14 16, 21 18, 21 30 Z"
                fill="#0d1b2d"
                stroke="#1e3a5f"
                strokeWidth="0.8"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Polygraph Line Readout */}
      <div className="relative rounded bg-[#040913] border border-cyan-900/60 px-2 py-0.5 flex items-center justify-between overflow-hidden h-6.5">
        <span className="text-[8px] font-mono text-cyan-400/70 uppercase tracking-widest shrink-0">
          POLYGRAPH // GSR
        </span>

        {/* Scrolling / Spiking Waveform */}
        <div className="relative flex-1 h-full mx-2 overflow-hidden flex items-center">
          <motion.div
            animate={shouldAnimate ? { x: ["0%", "-50%"] } : { x: "0%" }}
            transition={
              shouldAnimate
                ? {
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "linear",
                  }
                : {}
            }
            className="flex items-center will-change-transform"
          >
            {/* Waveform Segment 1 */}
            <svg
              viewBox="0 0 100 16"
              className="w-28 h-4 shrink-0 text-cyan-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M0,8 L15,8 L18,4 L21,12 L24,8 L35,8 L38,1 L41,15 L44,2 L47,14 L50,5 L53,11 L56,8 L75,8 L78,4 L81,12 L84,8 L100,8" />
            </svg>
            {/* Waveform Segment 2 (for seamless loop) */}
            <svg
              viewBox="0 0 100 16"
              className="w-28 h-4 shrink-0 text-cyan-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M0,8 L15,8 L18,4 L21,12 L24,8 L35,8 L38,1 L41,15 L44,2 L47,14 L50,5 L53,11 L56,8 L75,8 L78,4 L81,12 L84,8 L100,8" />
            </svg>
          </motion.div>
        </div>

        {/* Stress Spike Status Alert */}
        <motion.span
          animate={shouldAnimate ? { opacity: [0.35, 0.35, 1, 0.35] } : { opacity: 0.8 }}
          transition={
            shouldAnimate ? { duration: 4.8, repeat: Infinity, times: [0, 0.55, 0.75, 0.95] } : {}
          }
          className="font-mono text-[8.5px] font-bold text-red-400 shrink-0"
        >
          STRESS: 94%
        </motion.span>
      </div>
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
        reduceMotion ? { opacity: 1 } : { opacity: 0, scaleY: 0.05, filter: "brightness(2.5)" }
      }
      animate={isInView ? { opacity: 1, scaleY: 1, filter: "brightness(1)" } : {}}
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
                !reduceMotion && "animate-pulse",
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
                        !reduceMotion && "animate-pulse",
                      )}
                    >
                      SIGNAL STRONG
                    </span>
                  )}
                </div>

                <span className="font-mono font-bold text-cyan-300 shrink-0">{skill.level}%</span>
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

        {/* Crime scene mini animations in empty space under skills */}
        {feed.camId === "CAM 01" && <Cam01NightRoadScene isInView={isInView} />}

        {feed.camId === "CAM 03" && <Cam03BiometricScene isInView={isInView} />}

        {feed.camId === "CAM 04" && <Cam04InterrogationScene isInView={isInView} />}
      </div>

      {/* Screen Bottom Bar: CAM 02 has cycling Incident animation in footer, others standard */}
      {feed.camId === "CAM 02" ? (
        <Cam02FooterScene isInView={isInView} timecode={timecode} />
      ) : (
        <div className="relative z-20 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest select-none">
          <span>FEED STATUS: ACTIVE</span>
          <span className="sm:hidden text-slate-500">{timecode}</span>
        </div>
      )}
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

          {/* Slim Police-Radio Ticker across top of Control Panel */}
          <PoliceRadioTicker isInView={isInView} />

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
