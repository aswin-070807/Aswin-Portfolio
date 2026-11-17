import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CHECKPOINTS_DATA, type CheckpointData } from "./skillsData";
import { SkillCard } from "./SkillCard";
import { GetawayCar, PoliceCar } from "./Car";
import {
  RoadblockProps,
  CrashSiteProps,
  TrafficCameraProps,
  InterrogationProps,
} from "./CheckpointProps";

const PursuitTimer = React.memo(function PursuitTimer({ isRunning }: { isRunning: boolean }) {
  const timerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isRunning) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const mm = String(Math.floor(elapsed / 60000)).padStart(2, "0");
      const ss = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, "0");
      const ms = String(Math.floor((elapsed % 1000) / 10)).padStart(2, "0");
      if (timerRef.current) {
        timerRef.current.textContent = `T+ ${mm}:${ss}.${ms}`;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <span ref={timerRef} className="text-slate-400 font-bold tracking-wider hidden md:inline text-[11px]">
      T+ 00:00.00
    </span>
  );
});

export function SkillsPursuit() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [activeCp, setActiveCp] = useState<number>(1);
  const reduceMotion = useReducedMotion();

  // Single IntersectionObserver for the entire section: pauses all CSS/loops when off-screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToPanel = useCallback((id: number) => {
    setActiveCp(id);
    const el = document.getElementById(`pursuit-panel-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full bg-[#050c18] text-slate-100 py-12 sm:py-16 overflow-hidden select-none"
      aria-label="Field Kit Skills Section"
    >
      {/* Soft edge blend into the page's sky-blue background */}
      <div
        className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#E8F1FC]/25 via-transparent to-transparent pointer-events-none z-20"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#E8F1FC]/25 via-transparent to-transparent pointer-events-none z-20"
        aria-hidden="true"
      />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* ─── 1. SECTION HEADER ─── */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-cyan-400 mb-2">
            FIELD KIT · THE PURSUIT
          </p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            My{" "}
            <span className="text-white underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              toolkit
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base font-semibold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Tech stack used in my projects: React.js, Node.js, Python.
          </p>
        </div>

        {/* ─── 2. FULL-WIDTH NIGHT CHASE STRIP (160-190px tall on desktop) ─── */}
        <div className="relative w-full h-36 sm:h-44 md:h-48 rounded-2xl bg-gradient-to-b from-[#071324] via-[#09172c] to-[#060e18] border border-cyan-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.7)] overflow-hidden mb-6 flex flex-col justify-between">
          {/* Distant Skyline & Starfield */}
          <div className="absolute inset-x-0 top-0 h-24 opacity-40 pointer-events-none">
            <svg viewBox="0 0 1200 90" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,90 L0,55 L40,55 L40,35 L80,35 L80,60 L140,60 L140,25 L180,25 L180,90 L260,90 L260,40 L310,40 L310,90 L400,90 L400,20 L450,20 L450,90 L560,90 L560,50 L620,50 L620,90 L720,90 L720,30 L780,30 L780,90 L880,90 L880,45 L940,45 L940,90 L1040,90 L1040,25 L1100,25 L1100,90 L1200,90 Z"
                fill="#0c2340"
              />
              {/* Window dots */}
              {Array.from({ length: 24 }).map((_, i) => (
                <rect
                  key={i}
                  x={70 + i * 46}
                  y={40 + ((i * 13) % 35)}
                  width="3"
                  height="4"
                  fill={i % 3 === 0 ? "#FFD21F" : "#22d3ee"}
                  opacity={0.6}
                />
              ))}
            </svg>
          </div>

          {/* Top HUD inside Strip: Checkpoint dots & Status */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 font-mono text-xs border-b border-cyan-500/20 bg-[#06101e]/95">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
              <span className="font-bold text-cyan-300 tracking-wider text-[11px] sm:text-xs">
                PURSUIT IN PROGRESS · 118 MPH
              </span>
            </div>

            {/* Checkpoint Jump Dots (CP 1-4) */}
            <div className="flex items-center gap-2 sm:gap-4">
              {CHECKPOINTS_DATA.map((cp) => {
                const isSelected = activeCp === cp.id;
                return (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => scrollToPanel(cp.id)}
                    aria-label={`Scroll to Checkpoint ${cp.checkpointNumber}`}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-0.5 rounded transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
                      isSelected
                        ? "bg-cyan-950 border border-cyan-400 text-cyan-300"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full transition-transform",
                        isSelected
                          ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] scale-125"
                          : "bg-slate-600"
                      )}
                    />
                    <span className="text-[10px] font-bold tracking-wider">
                      CP {cp.checkpointNumber}
                    </span>
                  </button>
                );
              })}
            </div>

            <PursuitTimer isRunning={isSectionVisible} />
          </div>

          {/* Road Bed with Getaway & Police Cars in Chase */}
          <div className="relative w-full h-16 sm:h-20 bg-[#060e18] border-t-2 border-slate-700/80 flex items-center overflow-hidden">
            {/* Dashed Lane Line */}
            <div
              className={cn(
                "absolute inset-x-0 top-1/2 -translate-y-1/2 h-0 border-b-2 border-dashed border-[#FFD21F]/80 w-[200%]",
                isSectionVisible && !reduceMotion && "animate-road-scroll"
              )}
              style={{
                animationPlayState: isSectionVisible ? "running" : "paused",
              }}
            />

            {/* Pursuit Cars Formation */}
            <div className="relative z-10 flex items-center gap-8 sm:gap-14 pl-6 sm:pl-16">
              <div className="scale-75 sm:scale-90 origin-left">
                <PoliceCar isVisible={isSectionVisible} isStopped={false} />
              </div>
              <div className="scale-75 sm:scale-90 origin-left">
                <GetawayCar isVisible={isSectionVisible} isStopped={false} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. 2x2 GRID OF CHECKPOINT PANELS ON DESKTOP (Stacked on mobile) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {CHECKPOINTS_DATA.map((checkpoint) => (
            <CheckpointPanel
              key={checkpoint.id}
              checkpoint={checkpoint}
              isSectionVisible={isSectionVisible}
            />
          ))}
        </div>

        {/* ─── 4. FINALE STAMP CARD ─── */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#091526] to-[#060e18] border border-red-500/50 p-6 sm:p-8 text-center shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Flashing Police Siren Stage Wash */}
          <motion.div
            animate={
              isSectionVisible && !reduceMotion
                ? { opacity: [0.1, 0.35, 0.1] }
                : { opacity: 0.15 }
            }
            transition={{ duration: 0.6, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-blue-600/20 to-red-600/20 blur-2xl pointer-events-none"
          />

          {/* Big "CAUGHT" Stamp */}
          <motion.div
            initial={reduceMotion ? { scale: 1, opacity: 1, rotate: -7 } : { scale: 1.4, opacity: 0, rotate: -12 }}
            whileInView={{ scale: 1, opacity: 1, rotate: -7 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.175, 0.885, 0.32, 1.25] }}
            className="inline-block px-8 sm:px-12 py-3 rounded-xl border-4 border-red-500 bg-[#140508]/95 text-red-500 font-display font-black text-4xl sm:text-6xl tracking-widest uppercase shadow-[0_0_40px_rgba(239,68,68,0.6)] select-none will-change-transform"
          >
            CAUGHT
          </motion.div>

          {/* Finale Line */}
          <p className="mt-4 font-mono text-xs sm:text-sm font-bold tracking-widest text-cyan-300 uppercase bg-[#081528] border border-cyan-500/40 py-2 px-5 rounded-full inline-block shadow-lg">
            4/4 CHECKPOINTS CLEARED · OPERATOR:{" "}
            <span className="text-white">ASWIN A</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SINGLE CHECKPOINT PANEL (Compact, 2-inner cols for CP2)
// ─────────────────────────────────────────────────────────────
function CheckpointPanel({
  checkpoint,
  isSectionVisible,
}: {
  checkpoint: CheckpointData;
  isSectionVisible: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isTriggered = hasEntered || !isSectionVisible || !!reduceMotion;

  return (
    <div
      ref={panelRef}
      id={`pursuit-panel-${checkpoint.id}`}
      className="relative rounded-2xl bg-[#091526] border border-cyan-500/30 p-4 sm:p-5 shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-cyan-400/50"
    >
      {/* Panel Top Bar: Checkpoint Name & Mini Icon Scene */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <h3 className="text-xs sm:text-sm font-bold text-cyan-300 tracking-wider uppercase">
            {checkpoint.title}
          </h3>
        </div>

        {/* Small Icon Scene Props */}
        <div className="shrink-0 scale-75 origin-right">
          {checkpoint.id === 1 && <RoadblockProps isVisible={isSectionVisible} />}
          {checkpoint.id === 2 && <CrashSiteProps isVisible={isSectionVisible} />}
          {checkpoint.id === 3 && <TrafficCameraProps isVisible={isSectionVisible} />}
          {checkpoint.id === 4 && <InterrogationProps isVisible={isSectionVisible} />}
        </div>
      </div>

      {/* Grid of Skills with Speedometer Gauges (CP2 uses 2 inner columns) */}
      <div
        className={cn(
          "grid gap-2.5 flex-1",
          checkpoint.skills.length === 6
            ? "grid-cols-1 sm:grid-cols-2" // CP2: 2 inner columns of 3 cards each
            : checkpoint.skills.length === 4
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1"
        )}
      >
        {checkpoint.skills.map((skill, sIdx) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            category={checkpoint.category}
            index={sIdx}
            isTriggered={isTriggered}
          />
        ))}
      </div>
    </div>
  );
}

export const ToolkitSurveillance = SkillsPursuit;
export default SkillsPursuit;
