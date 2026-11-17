import React, { Suspense, lazy, useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CHECKPOINTS_DATA, type CheckpointData } from "./skillsData";
import { SkillCard } from "./SkillCard";
import { Scene2DFallback } from "./Scene2DFallback";
import { SearchlightMask } from "./SearchlightMask";

// Lazy-load the heavy 3D Scene module so initial page load remains fast
const Scene3D = lazy(() => import("./Scene3D"));

function checkCanUse3D(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 768) return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    // Check concurrency if available
    if (
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency < 4
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// SINGLE SCENE COMPONENT (100svh, Intersection Observer, 3D Canvas / Fallback)
// ─────────────────────────────────────────────────────────────
function CheckpointScene({
  checkpoint,
  isActive,
  isNear,
  use3D,
  onVisible,
}: {
  checkpoint: CheckpointData;
  isActive: boolean;
  isNear: boolean;
  use3D: boolean;
  onVisible: () => void;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTriggered(true);
            onVisible();
          }
        });
      },
      { threshold: 0.45 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      ref={sceneRef}
      id={`checkpoint-${checkpoint.id}`}
      className="relative w-full h-[100svh] min-h-[580px] max-h-[1080px] flex flex-col justify-between overflow-hidden snap-start pt-20 pb-8 px-4 sm:px-8 lg:px-12 select-none"
      data-cursor-section="pursuit"
      aria-labelledby={`cp-title-${checkpoint.id}`}
    >
      {/* 3D Canvas or 2D Layered-SVG Fallback */}
      {use3D && isNear ? (
        <Suspense
          fallback={<Scene2DFallback checkpointId={checkpoint.id} isTriggered={triggered} />}
        >
          <Scene3D
            checkpointId={checkpoint.id}
            isTriggered={triggered || isActive}
            isFinale={checkpoint.id === 4 && triggered}
          />
        </Suspense>
      ) : (
        <Scene2DFallback
          checkpointId={checkpoint.id}
          isTriggered={triggered || isActive}
          isFinale={checkpoint.id === 4 && triggered}
        />
      )}

      {/* ─── CHECKPOINT CONTENT (HTML Overlaid onto Scene) ─── */}
      <SearchlightMask containerRef={sceneRef}>
        <div className="relative z-10 max-w-[1200px] mx-auto w-full h-full flex flex-col justify-between pointer-events-auto">
          {/* Checkpoint Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/20 font-mono">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <h3
                id={`cp-title-${checkpoint.id}`}
                className="text-sm sm:text-base font-bold text-cyan-300 tracking-wider uppercase"
              >
                {checkpoint.title}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono tracking-wide hidden sm:inline">
              {checkpoint.subtitle}
            </span>
          </div>

          {/* Grid of Skill Cards (Engineered to fit at 1080p without vertical scrolling) */}
          <div className="my-auto py-2">
            <div
              className={cn(
                "grid gap-3 w-full",
                checkpoint.skills.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                  : checkpoint.skills.length === 3
                    ? "grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto"
                    : checkpoint.skills.length === 4
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", // 6 cards at CP2: 3 cols x 2 rows
              )}
            >
              {checkpoint.skills.map((skill, sIdx) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  category={checkpoint.category}
                  index={sIdx}
                  isTriggered={triggered || isActive || !!reduceMotion}
                />
              ))}
            </div>
          </div>

          {/* Bottom Spacing reserve for road */}
          <div className="h-16 sm:h-20 pointer-events-none" />
        </div>
      </SearchlightMask>
    </div>
  );
}

// ─── 4. FINALE SECTION (Slams after CP4) ───
function FinaleSection({ onVisible }: { onVisible: () => void }) {
  const finaleRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = finaleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTriggered(true);
            onVisible();
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      ref={finaleRef}
      id="checkpoint-finale"
      className="relative w-full h-[80svh] min-h-[480px] flex flex-col items-center justify-center text-center snap-start px-4 select-none overflow-hidden"
    >
      {/* Flashing Police Lights Wash */}
      <motion.div
        animate={!reduceMotion ? { opacity: [0.15, 0.45, 0.15] } : { opacity: 0.25 }}
        transition={{ duration: 0.55, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-red-600/25 via-blue-600/25 to-red-600/25 blur-3xl pointer-events-none"
      />

      {/* Big "CAUGHT" Stamp Slam (scale 1.4 to 1 with slight rotation) */}
      <motion.div
        initial={
          reduceMotion
            ? { scale: 1, opacity: 1, rotate: -7 }
            : { scale: 1.4, opacity: 0, rotate: -14 }
        }
        animate={triggered || reduceMotion ? { scale: 1, opacity: 1, rotate: -7 } : {}}
        transition={{ duration: 0.45, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="relative z-10 px-8 sm:px-12 py-3 sm:py-4 rounded-xl border-4 border-red-500/90 bg-[#120406]/95 text-red-500 font-display font-black text-4xl sm:text-7xl tracking-widest uppercase shadow-[0_0_50px_rgba(239,68,68,0.7)] select-none will-change-transform"
      >
        CAUGHT
      </motion.div>

      {/* Finale Text Line */}
      <motion.div
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        animate={triggered || reduceMotion ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-10 mt-6 font-mono text-xs sm:text-sm font-bold tracking-widest text-cyan-300 uppercase bg-[#081528]/95 border border-cyan-500/50 px-6 py-2.5 rounded-full shadow-2xl"
      >
        4/4 CHECKPOINTS CLEARED · OPERATOR: <span className="text-white">ASWIN A</span>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT: SKILLS PURSUIT COMPONENT
// ─────────────────────────────────────────────────────────────
export function SkillsPursuit() {
  const [activeCp, setActiveCp] = useState<number>(1);
  const [use3D, setUse3D] = useState(false);
  const [timerText, setTimerText] = useState("00:00.00");

  useEffect(() => {
    setUse3D(checkCanUse3D());

    // Live Mono Timer
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

  const scrollToScene = useCallback((id: number) => {
    const el = document.getElementById(`checkpoint-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section
      id="skills"
      className="relative w-full bg-[#050c18] overflow-hidden"
      style={{
        scrollSnapType: "y proximity",
      }}
      aria-label="Field Kit Skills Pursuit Section"
    >
      {/* Soft edge blend into the page's sky-blue background */}
      <div
        className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#E8F1FC]/25 via-transparent to-transparent pointer-events-none z-30"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#E8F1FC]/25 via-transparent to-transparent pointer-events-none z-30"
        aria-hidden="true"
      />

      {/* ─── 1. SECTION HEADER ─── */}
      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-4 text-center z-40">
        <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-cyan-400/90 mb-2">
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

      {/* ─── 2. PERSISTENT TOP HUD (Clickable & Keyboard-Accessible Checkpoint Dots) ─── */}
      <div className="sticky top-4 z-50 px-4 sm:px-8 pointer-events-none mb-2">
        <div className="max-w-[1100px] mx-auto rounded-xl bg-[#071322]/90 border border-cyan-500/40 px-3.5 sm:px-5 py-2.5 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 text-xs font-mono pointer-events-auto select-none">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
            <span className="font-bold text-cyan-300 tracking-wider">PURSUIT IN PROGRESS</span>
          </div>

          {/* Clickable & Keyboard-Navigable Checkpoint Dots */}
          <nav aria-label="Checkpoint Navigation" className="flex items-center gap-2 sm:gap-4">
            {CHECKPOINTS_DATA.map((cp) => {
              const isActive = activeCp === cp.id;

              return (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => scrollToScene(cp.id)}
                  aria-label={`Jump to ${cp.title}`}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
                    isActive
                      ? "bg-cyan-950/80 border border-cyan-400 text-cyan-300"
                      : "text-slate-400 hover:text-slate-200",
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      isActive
                        ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] scale-125"
                        : "bg-slate-600",
                    )}
                  />
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider">
                    CP {cp.checkpointNumber}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Live Timer & Mobile Prev/Next Controls */}
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-wider text-cyan-300 hidden sm:inline">
              T+ {timerText}
            </span>

            {/* Mobile Prev / Next Buttons */}
            <div className="flex items-center gap-1 sm:hidden">
              <button
                type="button"
                onClick={() => scrollToScene(Math.max(1, activeCp - 1))}
                disabled={activeCp <= 1}
                aria-label="Previous Checkpoint"
                className="px-2 py-0.5 rounded bg-[#09182d] border border-cyan-500/40 text-cyan-300 disabled:opacity-30"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => scrollToScene(Math.min(4, activeCp + 1))}
                disabled={activeCp >= 4}
                aria-label="Next Checkpoint"
                className="px-2 py-0.5 rounded bg-[#09182d] border border-cyan-500/40 text-cyan-300 disabled:opacity-30"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. FOUR FULL-VIEWPORT CHECKPOINT SCENES (100svh Each) ─── */}
      <div className="w-full">
        {CHECKPOINTS_DATA.map((cp) => {
          const isActive = activeCp === cp.id;
          // Mount 3D canvas only when this scene or an adjacent scene is active
          const isNear = Math.abs(activeCp - cp.id) <= 1;

          return (
            <CheckpointScene
              key={cp.id}
              checkpoint={cp}
              isActive={isActive}
              isNear={isNear}
              use3D={use3D}
              onVisible={() => setActiveCp(cp.id)}
            />
          );
        })}

        {/* Finale Section */}
        <FinaleSection onVisible={() => setActiveCp(4)} />
      </div>
    </section>
  );
}

export const ToolkitSurveillance = SkillsPursuit;
export default SkillsPursuit;
