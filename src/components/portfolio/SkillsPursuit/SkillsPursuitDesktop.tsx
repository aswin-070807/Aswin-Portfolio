import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CHECKPOINTS_DATA } from "./skillsData";
import { SkillSign } from "./SkillSign";
import { GetawayCar, PoliceCar } from "./Car";
import {
  RoadblockProps,
  CrashSiteProps,
  TrafficCameraProps,
  InterrogationProps,
} from "./CheckpointProps";

export function SkillsPursuitDesktop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Scroll progress (0 to 1) over the 400vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Current progress state for UI updates
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Running Timer for the HUD
  const [timerText, setTimerText] = useState("00:00.00");
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const mm = String(Math.floor(elapsed / 60000)).padStart(2, "0");
      const ss = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, "0");
      const ms = String(Math.floor((elapsed % 1000) / 10)).padStart(2, "0");
      setTimerText(`${mm}:${ss}.${ms}`);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Parallax Skyline Offsets (Transforms only)
  const farSkylineX = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const midSkylineX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const nearSkylineX = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);
  const roadDashX = useTransform(scrollYProgress, [0, 1], ["0%", "-300%"]);

  // Car Swerve at Roadblock (Checkpoint 1 around progress 0.08 - 0.18)
  const carSwerveY = useTransform(scrollYProgress, [0.08, 0.13, 0.18], [0, -22, 0]);

  // Finale triggered when progress > 0.88
  const isFinale = progress >= 0.88;
  const isStopped = isFinale;

  // Active Checkpoint Index:
  // CP 1: 0.00 - 0.24
  // CP 2: 0.24 - 0.50
  // CP 3: 0.50 - 0.74
  // CP 4: 0.74 - 0.88
  // Finale: 0.88 - 1.00
  let activeCpIndex = 0;
  if (progress >= 0.74 && progress < 0.88) activeCpIndex = 3;
  else if (progress >= 0.5 && progress < 0.74) activeCpIndex = 2;
  else if (progress >= 0.24 && progress < 0.5) activeCpIndex = 1;
  else if (progress < 0.24) activeCpIndex = 0;

  const currentCp = CHECKPOINTS_DATA[activeCpIndex];

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#050c18] select-none">
      {/* STICKY 100vh STAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Soft edge blend into the page's sky-blue background */}
        <div
          className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#E8F1FC]/25 via-transparent to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#E8F1FC]/25 via-transparent to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* ─── 1. NIGHT SKY WITH STARFIELD ─── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040914] via-[#081528] to-[#0a182e] pointer-events-none z-0">
          <svg className="w-full h-full opacity-60">
            {Array.from({ length: 45 }).map((_, i) => (
              <circle
                key={i}
                cx={`${(i * 37) % 100}%`}
                cy={`${(i * 19) % 55}%`}
                r={i % 3 === 0 ? 1.5 : 1}
                fill="#ffffff"
                opacity={0.3 + (i % 5) * 0.14}
              />
            ))}
          </svg>
        </div>

        {/* ─── 2. 3-LAYER PARALLAX NIGHT-CITY SKYLINE ─── */}
        {/* Layer 1: Far Skyline (Slowest) */}
        <motion.div
          style={{ x: reduceMotion ? 0 : farSkylineX }}
          className="absolute bottom-28 sm:bottom-32 left-0 w-[200%] h-48 opacity-35 pointer-events-none z-1 will-change-transform"
        >
          <svg
            viewBox="0 0 1440 180"
            className="w-full h-full preserve-3d"
            preserveAspectRatio="none"
          >
            <path
              d="M0,180 L0,90 L40,90 L40,70 L80,70 L80,110 L130,110 L130,50 L160,50 L160,180 L220,180 L220,60 L250,60 L270,40 L300,60 L300,180 L380,180 L380,85 L440,85 L440,180 L520,180 L520,40 L560,40 L560,180 L650,180 L650,95 L720,95 L720,65 L760,65 L760,180 L840,180 L840,55 L890,55 L890,180 L980,180 L980,75 L1040,75 L1040,180 L1150,180 L1150,45 L1200,45 L1200,180 L1300,180 L1300,80 L1360,80 L1360,180 L1440,180 Z"
              fill="#061222"
            />
          </svg>
        </motion.div>

        {/* Layer 2: Mid Skyline with Grid Window Lights (Medium) */}
        <motion.div
          style={{ x: reduceMotion ? 0 : midSkylineX }}
          className="absolute bottom-28 sm:bottom-32 left-0 w-[240%] h-56 opacity-65 pointer-events-none z-2 will-change-transform"
        >
          <svg viewBox="0 0 1440 220" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,220 L0,110 L50,110 L50,75 L90,75 L90,220 L150,220 L150,60 L210,60 L210,220 L270,220 L270,100 L330,100 L330,220 L400,220 L400,45 L470,45 L470,220 L540,220 L540,90 L610,90 L610,220 L680,220 L680,70 L750,70 L750,220 L830,220 L830,50 L900,50 L900,220 L980,220 L980,85 L1050,85 L1050,220 L1140,220 L1140,65 L1210,65 L1210,220 L1300,220 L1300,95 L1370,95 L1370,220 L1440,220 Z"
              fill="#091b33"
            />
            {/* Illuminated Building Windows */}
            {Array.from({ length: 30 }).map((_, i) => (
              <rect
                key={i}
                x={80 + i * 44}
                y={80 + ((i * 17) % 90)}
                width="4"
                height="6"
                fill={i % 4 === 0 ? "#FFD21F" : "#22d3ee"}
                opacity={0.65}
              />
            ))}
          </svg>
        </motion.div>

        {/* Layer 3: Near Industrial Foreground (Fastest) */}
        <motion.div
          style={{ x: reduceMotion ? 0 : nearSkylineX }}
          className="absolute bottom-28 sm:bottom-32 left-0 w-[300%] h-36 opacity-90 pointer-events-none z-3 will-change-transform"
        >
          <svg viewBox="0 0 1440 140" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,140 L0,80 L70,80 L70,55 L130,55 L130,140 L210,140 L210,90 L260,90 L260,140 L350,140 L350,70 L420,70 L420,140 L530,140 L530,60 L600,60 L600,140 L700,140 L700,85 L760,85 L760,140 L870,140 L870,65 L940,65 L940,140 L1050,140 L1050,75 L1120,75 L1120,140 L1230,140 L1230,55 L1300,55 L1300,140 L1440,140 Z"
              fill="#0d2442"
            />
          </svg>
        </motion.div>

        {/* ─── 3. SLIM TOP HUD ─── */}
        <div className="relative z-40 px-4 sm:px-8 pt-5">
          <div className="max-w-[1100px] mx-auto rounded-xl bg-[#071322]/90 border border-cyan-500/30 px-3.5 sm:px-5 py-2.5 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none">
            {/* Left Status: Pursuit Indicator & Speed */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
              <span className="font-bold text-cyan-300 tracking-wider">PURSUIT IN PROGRESS</span>
              <span className="text-cyan-500/70 hidden sm:inline">·</span>
              <span className="text-slate-300 hidden sm:inline">
                SPD: {isStopped ? "0 MPH [HALT]" : "118 MPH"}
              </span>
            </div>

            {/* Center: 4 Checkpoint Status Dots */}
            <div className="flex items-center gap-2 sm:gap-4">
              {CHECKPOINTS_DATA.map((cp, idx) => {
                const isCleared = progress >= idx * 0.24;
                const isCurrent = activeCpIndex === idx && !isFinale;

                return (
                  <div key={cp.id} className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        isCleared
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                          : "bg-slate-700",
                        isCurrent && "ring-2 ring-cyan-400 scale-125",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] hidden md:inline font-bold tracking-widest",
                        isCurrent
                          ? "text-cyan-300"
                          : isCleared
                            ? "text-emerald-400"
                            : "text-slate-500",
                      )}
                    >
                      CP {cp.checkpointNumber}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Mono Timer */}
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-400 text-[11px]">T+</span>
              <span className="font-bold tracking-wider text-cyan-300">{timerText}</span>
            </div>
          </div>
        </div>

        {/* ─── 4. CHECKPOINT STAGE SCENE & SKILL BILLBOARDS ─── */}
        <div className="relative z-30 flex-1 flex flex-col justify-center px-4 sm:px-8 max-w-[1100px] mx-auto w-full my-auto">
          {!isFinale ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full flex flex-col"
              >
                {/* Checkpoint Header Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-cyan-500/20 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-black tracking-wider uppercase">
                      {currentCp.title}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {currentCp.subtitle}
                    </span>
                  </div>

                  {/* Checkpoint Scene Specific Prop on Desktop */}
                  <div className="hidden lg:block shrink-0">
                    {currentCp.id === 1 && <RoadblockProps />}
                    {currentCp.id === 2 && <CrashSiteProps />}
                    {currentCp.id === 3 && <TrafficCameraProps />}
                    {currentCp.id === 4 && <InterrogationProps />}
                  </div>
                </div>

                {/* Grid of Skill Signs with Speedometer Gauges */}
                <div
                  className={cn(
                    "grid gap-3 w-full",
                    currentCp.skills.length <= 2
                      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                      : currentCp.skills.length === 3
                        ? "grid-cols-1 sm:grid-cols-3"
                        : currentCp.skills.length === 4
                          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                  )}
                >
                  {currentCp.skills.map((skill, sIdx) => (
                    <SkillSign
                      key={skill.name}
                      skill={skill}
                      category={currentCp.category}
                      index={sIdx}
                      isTriggered={true}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* ─── 5. FINALE SCREEN (Car stops, Police lights flood, CAUGHT stamp slams) ─── */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full flex flex-col items-center justify-center text-center py-6"
            >
              {/* Flashing Police Siren Stage Floodlight Overlay */}
              <motion.div
                animate={!reduceMotion ? { opacity: [0.15, 0.45, 0.15] } : { opacity: 0.25 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-blue-600/20 to-red-600/20 blur-2xl pointer-events-none"
              />

              {/* Big "CAUGHT" Stamp Slam (scale 1.4 to 1 with slight rotation) */}
              <motion.div
                initial={{ scale: 1.4, opacity: 0, rotate: -14 }}
                animate={{ scale: 1, opacity: 1, rotate: -7 }}
                transition={{
                  duration: 0.45,
                  ease: [0.175, 0.885, 0.32, 1.275],
                }}
                className="relative z-10 px-8 py-3 rounded-lg border-4 border-red-500/90 bg-[#120406]/95 text-red-500 font-display font-black text-4xl sm:text-6xl tracking-widest uppercase shadow-[0_0_40px_rgba(239,68,68,0.6)] select-none will-change-transform"
              >
                CAUGHT
              </motion.div>

              {/* Finale Line */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative z-10 mt-5 font-mono text-xs sm:text-sm font-bold tracking-widest text-cyan-300 uppercase bg-[#081528]/90 border border-cyan-500/40 px-5 py-2 rounded-full shadow-lg"
              >
                4/4 CHECKPOINTS CLEARED · OPERATOR: <span className="text-white">ASWIN A</span>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* ─── 6. ROAD STRIP & PURSUIT CARS ─── */}
        <div className="relative z-30 w-full h-28 sm:h-32 bg-[#060e18] border-t-2 border-slate-700/80 shadow-[0_-15px_30px_rgba(0,0,0,0.8)] overflow-hidden flex items-center">
          {/* Curb / Shoulder Rumble Strips */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 opacity-60" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 opacity-60" />

          {/* Scrolling Yellow Dashed Lane Lines */}
          <motion.div
            style={{ x: reduceMotion ? 0 : roadDashX }}
            className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-0 border-b-2 border-dashed border-[#FFD21F] w-[400%] will-change-transform"
          />

          {/* Pursuit Formation on Road */}
          {/* Police Cruiser (Trailing behind at left: 16%) */}
          <div className="absolute bottom-5 left-[12%] sm:left-[16%] z-20">
            <PoliceCar isStopped={isStopped} />
          </div>

          {/* Getaway Sports Car (Ahead at left: 42%, swerves at roadblock) */}
          <motion.div
            style={{ y: reduceMotion ? 0 : carSwerveY }}
            className="absolute bottom-5 left-[38%] sm:left-[42%] z-20 will-change-transform"
          >
            <GetawayCar isStopped={isStopped} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
