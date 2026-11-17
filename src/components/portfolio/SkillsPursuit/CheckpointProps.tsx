import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// CHECKPOINT 1: POLICE ROADBLOCK
export function RoadblockProps({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative flex items-end gap-3 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Flashing Beacon on Barrier */}
      <motion.div
        animate={!reduceMotion ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.8 }}
        transition={{ duration: 0.4, repeat: Infinity }}
        className="absolute -top-3 left-4 w-4 h-4 rounded-full bg-amber-400 blur-xs"
      />

      {/* Police Roadblock Barricade SVG */}
      <svg viewBox="0 0 90 48" className="w-22 sm:w-26 h-auto">
        <defs>
          <pattern
            id="barrierStripes"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="6" height="12" fill="#facc15" />
            <rect x="6" width="6" height="12" fill="#0f172a" />
          </pattern>
        </defs>
        {/* Legs / Stand */}
        <line
          x1="14"
          y1="12"
          x2="6"
          y2="46"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="76"
          y1="12"
          x2="84"
          y2="46"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="12"
          x2="22"
          y2="46"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="76"
          y1="12"
          x2="68"
          y2="46"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Top & Bottom Planks */}
        <rect
          x="4"
          y="10"
          width="82"
          height="12"
          rx="1.5"
          fill="url(#barrierStripes)"
          stroke="#0f172a"
          strokeWidth="1"
        />
        <rect
          x="4"
          y="26"
          width="82"
          height="10"
          rx="1.5"
          fill="url(#barrierStripes)"
          stroke="#0f172a"
          strokeWidth="1"
        />
      </svg>

      {/* Traffic Cones */}
      <div className="flex items-end gap-1.5 -ml-2 mb-0.5">
        <svg viewBox="0 0 20 28" className="w-4 sm:w-5 h-auto">
          {/* Base */}
          <rect x="1" y="24" width="18" height="3" rx="0.5" fill="#1e293b" />
          {/* Cone body */}
          <polygon points="10,2 17,24 3,24" fill="#f97316" />
          {/* Reflective White Stripes */}
          <polygon points="8.2,8 11.8,8 13.5,14 6.5,14" fill="#ffffff" />
          <polygon points="5.5,17 14.5,17 15.8,21 4.2,21" fill="#ffffff" />
        </svg>
        <svg viewBox="0 0 20 28" className="w-3.5 sm:w-4.5 h-auto opacity-90">
          <rect x="1" y="24" width="18" height="3" rx="0.5" fill="#1e293b" />
          <polygon points="10,2 17,24 3,24" fill="#f97316" />
          <polygon points="8.2,8 11.8,8 13.5,14 6.5,14" fill="#ffffff" />
          <polygon points="5.5,17 14.5,17 15.8,21 4.2,21" fill="#ffffff" />
        </svg>
      </div>

      {/* Spike Strip along the road */}
      <svg viewBox="0 0 80 12" className="w-20 sm:w-24 h-auto">
        <line x1="2" y1="10" x2="78" y2="10" stroke="#334155" strokeWidth="2.5" />
        {Array.from({ length: 9 }).map((_, i) => (
          <polygon
            key={i}
            points={`${8 + i * 8},10 ${12 + i * 8},2 ${16 + i * 8},10`}
            fill="#94a3b8"
          />
        ))}
      </svg>
    </div>
  );
}

// CHECKPOINT 2: CRASH SITE
export function CrashSiteProps({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative flex flex-col select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Top Banner Alert Label */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/90 border border-amber-500/50 text-amber-400 font-mono text-[9px] font-bold tracking-wider mb-2 self-start shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        INCIDENT DETECTED // SECTOR 2
      </div>

      {/* Two Wrecked Cars Angled Together */}
      <div className="relative flex items-end">
        {/* Wrecked Car 1 (Tilted Left) */}
        <div className="transform -rotate-6">
          <svg viewBox="0 0 70 30" className="w-18 sm:w-22 h-auto">
            <path
              d="M 4,18 C 4,14 10,12 18,11 L 34,9 C 40,6 50,5 60,8 L 66,16 C 68,20 64,24 58,24 L 8,24 Z"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="1"
            />
            <polygon points="58,16 66,18 64,22" fill="#f59e0b" />
            {/* Blinking hazard */}
            <motion.circle
              cx="64"
              cy="16"
              r="2.5"
              fill="#fbbf24"
              animate={!reduceMotion ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.8 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </svg>
        </div>

        {/* Impact Smoke / Sparks / Scattered Debris */}
        <div className="relative -ml-4 z-10 flex flex-col items-center">
          <motion.div
            animate={
              !reduceMotion
                ? { scale: [0.9, 1.15, 0.95], opacity: [0.4, 0.8, 0.4] }
                : { opacity: 0.6 }
            }
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-amber-400 text-xs font-black"
          >
            ⚠️
          </motion.div>
          {/* Debris particles */}
          <div className="flex gap-1.5 mt-1">
            <div className="w-1.5 h-1 bg-slate-500 transform rotate-45" />
            <div className="w-2 h-1 bg-slate-600 transform -rotate-12" />
            <div className="w-1 h-1 bg-amber-400" />
          </div>
        </div>

        {/* Wrecked Car 2 (Tilted Right) */}
        <div className="transform rotate-12 -ml-3">
          <svg viewBox="0 0 70 30" className="w-18 sm:w-22 h-auto">
            <path
              d="M 66,18 C 66,14 60,12 52,11 L 36,9 C 30,6 20,5 10,8 L 4,16 C 2,20 6,24 12,24 L 62,24 Z"
              fill="#0f2238"
              stroke="#0284c7"
              strokeWidth="1"
            />
            <motion.circle
              cx="8"
              cy="16"
              r="2.5"
              fill="#fbbf24"
              animate={!reduceMotion ? { opacity: [1, 0.2, 1] } : { opacity: 0.8 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </svg>
        </div>
      </div>

      {/* Yellow Caution Tape Stretched Across */}
      <div className="mt-1 flex items-center bg-amber-400 text-slate-950 font-black font-mono text-[8.5px] px-3 py-0.5 rounded-xs shadow-md tracking-widest whitespace-nowrap">
        /// CAUTION · EVIDENCE PERIMETER · CRIME SCENE ///
      </div>
    </div>
  );
}

// CHECKPOINT 3: TRAFFIC CAMERA & BIOMETRIC SWEEP
export function TrafficCameraProps({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative flex flex-col items-center select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* CCTV Camera on Tall Overhead Pole */}
      <div className="relative flex flex-col items-center">
        {/* Camera Unit */}
        <div className="relative">
          <svg viewBox="0 0 44 24" className="w-11 sm:w-13 h-auto">
            {/* Mounting Arm */}
            <rect x="0" y="8" width="12" height="4" fill="#334155" />
            {/* Camera Housing */}
            <path
              d="M 12,5 L 36,8 L 38,18 L 12,17 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            {/* Lens */}
            <rect x="36" y="9" width="4" height="8" rx="1" fill="#0284c7" />
            {/* Blinking REC LED */}
            <motion.circle
              cx="16"
              cy="10"
              r="1.8"
              fill="#ef4444"
              animate={!reduceMotion ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.8 }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </svg>

          {/* Sweeping Cyan Scan Cone Downward */}
          <motion.div
            animate={
              !reduceMotion
                ? {
                    opacity: [0.2, 0.65, 0.2],
                    rotate: [-8, 8, -8],
                  }
                : { opacity: 0.4, rotate: 0 }
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top center" }}
            className="absolute top-4 left-6 w-36 h-36 bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent pointer-events-none"
            style-clip="polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)"
          />
        </div>

        {/* Tall Metal Pole */}
        <div className="w-2 h-28 sm:h-36 bg-gradient-to-b from-slate-600 to-slate-800 rounded-b shadow-md" />
      </div>

      {/* Face-Tracking Bracket Box & MATCH 92% Tag */}
      <motion.div
        animate={
          !reduceMotion
            ? {
                scale: [0.95, 1.05, 0.98, 1],
                opacity: [0.8, 1, 0.85, 1],
              }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 -left-12 px-2 py-1 rounded bg-[#071322]/95 border border-cyan-400/80 font-mono shadow-[0_0_15px_rgba(34,211,238,0.3)] z-20"
      >
        <div className="flex items-center gap-1.5 text-[8.5px] text-cyan-300 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>[TGT ACQUIRED]</span>
        </div>
        <div className="text-[10px] text-emerald-400 font-black tracking-wider mt-0.5">
          MATCH 92%
        </div>
      </motion.div>
    </div>
  );
}

// CHECKPOINT 4: INTERROGATION BUILDING & POLYGRAPH
export function InterrogationProps({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative flex flex-col select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Brick / Facade Interrogation Room Building */}
      <div className="relative rounded-t-xl bg-[#091424] border border-cyan-500/30 p-3 sm:p-4 shadow-2xl w-44 sm:w-52">
        {/* Monospace Room Stamp */}
        <div className="flex items-center justify-between text-[8px] font-mono text-cyan-400/70 uppercase tracking-widest pb-2 border-b border-cyan-500/20">
          <span>INT. ROOM 04</span>
          <span>AUDIO REC</span>
        </div>

        {/* Lit Interrogation Window with Table, Pendant Lamp & Two Silhouettes */}
        <div className="relative mt-2 rounded-lg bg-[#0e213b] border border-cyan-400/40 p-2 overflow-hidden h-20 flex flex-col justify-between">
          {/* Overhead Hanging Lamp & Light Beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-0.5 h-3 bg-slate-400" />
            <div className="w-5 h-2 rounded-t-full bg-amber-400/90 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            <div className="w-24 h-16 bg-gradient-to-b from-amber-400/20 to-transparent rounded-b-full pointer-events-none" />
          </div>

          {/* Room Characters Seated at Table */}
          <div className="relative flex-1 flex items-end justify-between px-2 pb-0.5 z-10">
            {/* Interrogator */}
            <svg viewBox="0 0 24 28" className="w-5 h-6 text-slate-300">
              <circle cx="13" cy="7" r="4.5" fill="#07101d" stroke="#1e3a5f" strokeWidth="0.8" />
              <path
                d="M 6,26 C 6,16 12,14 18,14 L 20,26 Z"
                fill="#07101d"
                stroke="#1e3a5f"
                strokeWidth="0.8"
              />
            </svg>

            {/* Table */}
            <div className="w-12 h-1 bg-slate-600 rounded mb-0.5 border-t border-cyan-400/40" />

            {/* Suspect */}
            <svg viewBox="0 0 24 28" className="w-5 h-6 text-slate-300">
              <circle cx="11" cy="7" r="4.5" fill="#07101d" stroke="#1e3a5f" strokeWidth="0.8" />
              <path
                d="M 4,26 L 6,14 C 12,14 18,16 18,26 Z"
                fill="#07101d"
                stroke="#1e3a5f"
                strokeWidth="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Polygraph Line Running Along Base */}
        <div className="mt-2.5 pt-1.5 border-t border-cyan-500/20">
          <div className="flex items-center justify-between text-[7.5px] font-mono text-cyan-400/70 mb-1">
            <span>POLYGRAPH // GSR</span>
            <span className="text-red-400 font-bold">STRESS: HIGH</span>
          </div>

          {/* Active Spiking Waveform */}
          <div className="relative w-full h-4 bg-[#040810] rounded border border-cyan-950 overflow-hidden flex items-center">
            <motion.div
              animate={!reduceMotion ? { x: ["0%", "-50%"] } : { x: "0%" }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
              className="flex items-center shrink-0 will-change-transform"
            >
              <svg
                viewBox="0 0 80 14"
                className="w-24 h-3.5 shrink-0 text-cyan-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M0,7 L12,7 L15,3 L18,11 L21,7 L30,7 L33,1 L36,13 L39,2 L42,12 L45,4 L48,10 L51,7 L65,7 L68,3 L71,11 L74,7 L80,7" />
              </svg>
              <svg
                viewBox="0 0 80 14"
                className="w-24 h-3.5 shrink-0 text-cyan-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M0,7 L12,7 L15,3 L18,11 L21,7 L30,7 L33,1 L36,13 L39,2 L42,12 L45,4 L48,10 L51,7 L65,7 L68,3 L71,11 L74,7 L80,7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
