import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  type EducationRecordItem,
  getEducationRecords,
} from "@/data/educationData";
import { cn } from "@/lib/utils";

// Shared SVG Definitions for paper grain texture & stamp bleed
function SharedEducationDefs() {
  return (
    <svg className="sr-only" aria-hidden="true" width="0" height="0">
      <defs>
        {/* Paper Grain filter for academic form */}
        <filter id="edu-paper-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.05   0 0 0 0 0.12   0 0 0 0 0.3   0 0 0 0.1 0"
          />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>

        {/* Rubber ink stamp rough edges & bleed */}
        <filter id="edu-stamp-bleed" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.16"
            numOctaves="2"
            result="stampNoise"
          />
          <feDisplacementMap in="SourceGraphic" in2="stampNoise" scale="1.8" />
        </filter>
      </defs>
    </svg>
  );
}

// Deterministic Vector Barcode Generator (22px tall)
function BarcodeSVG({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const bars = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const pattern: { x: number; width: number }[] = [];
    let currentX = 0;
    for (let i = 0; i < 22; i++) {
      const bit = Math.abs((hash ^ (i * 997)) % 7);
      const width = (bit % 3) + 1.2;
      const gap = ((bit + 1) % 2) + 1.4;
      pattern.push({ x: currentX, width });
      currentX += width + gap;
    }
    return { pattern, totalWidth: currentX };
  }, [seed]);

  return (
    <svg
      viewBox={`0 0 ${bars.totalWidth} 22`}
      className={cn("h-[22px] w-auto", className)}
      fill="#0B1F4B"
      aria-hidden="true"
    >
      {bars.pattern.map((b, idx) => (
        <rect key={idx} x={b.x} y={0} width={b.width} height={22} />
      ))}
    </svg>
  );
}

// Hand-Drawn Blue Ballpoint Check Mark
function BlueBallpointCheckMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn("w-4 h-4 text-[#1A3A7A] drop-shadow-2xs", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <motion.path
        d="M 4 11 L 8.5 15.5 L 16 5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </svg>
  );
}

// Count-Up Score Animated Value
function AnimatedScoreDisplay({
  item,
  isInView,
}: {
  item: EducationRecordItem;
  isInView: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [displayVal, setDisplayVal] = useState<string>(
    reduceMotion ? item.scoreValue || "" : "0"
  );

  useEffect(() => {
    if (reduceMotion || !isInView || !item.numericScore || !item.scoreValue) {
      setDisplayVal(item.scoreValue || "");
      return;
    }

    const targetNum = item.numericScore;
    const isPercentage = item.scoreValue.includes("%");
    const isCgpa = /^cgpa/i.test(item.scoreValue);

    let start = 0;
    const duration = 800; // ms
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (targetNum - start) * eased;

      if (isPercentage) {
        setDisplayVal(`${current.toFixed(1)}%`);
      } else if (isCgpa) {
        setDisplayVal(`CGPA ${current.toFixed(2)}`);
      } else {
        setDisplayVal(current.toFixed(1));
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setDisplayVal(item.scoreValue!);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [isInView, item.numericScore, item.scoreValue, reduceMotion]);

  return (
    <div className="relative inline-block my-1">
      {/* Yellow Highlighter Swipe behind score */}
      <div
        className="absolute inset-x-[-6px] inset-y-1 bg-[#FFD21F]/40 -skew-y-1 rounded pointer-events-none"
        aria-hidden="true"
      />
      <span className="relative z-10 font-display text-3xl sm:text-4xl font-black text-[#0B1F4B] tracking-tight">
        {displayVal}
      </span>
    </div>
  );
}

// Status Stamp (COMPLETED / IN PROGRESS)
function AcademicStatusStamp({
  status,
  rotation,
}: {
  status: "IN PROGRESS" | "COMPLETED";
  rotation: number;
}) {
  const reduceMotion = useReducedMotion();
  const isCompleted = status === "COMPLETED";

  return (
    <motion.div
      initial={
        reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.45 }
      }
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ duration: 0.35, delay: 0.2, ease: [0.175, 0.885, 0.32, 1.25] }}
      className={cn(
        "inline-flex flex-col items-center justify-center text-center font-mono font-black tracking-[0.12em] uppercase select-none pointer-events-none rounded px-3 py-1.5 min-h-[44px] z-20 shadow-md",
        isCompleted
          ? "bg-[#FFD21F] text-[#0B1F4B] border-2 border-[#0B1F4B]"
          : "bg-white/95 text-[#0B1F4B] border-2 border-[#0B1F4B]"
      )}
      style={{
        filter: "url(#edu-stamp-bleed)",
        boxShadow: "inset 0 0 0 1.5px currentColor",
        mixBlendMode: "multiply",
      }}
    >
      <span className="text-[13px] sm:text-[14px] leading-tight font-black px-1">
        {status}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN EDUCATION ACADEMIC FORM COMPONENT
// ─────────────────────────────────────────────────────────────
export function EducationAcademicForm() {
  const reduceMotion = useReducedMotion();
  const records = useMemo(() => getEducationRecords(), []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const swipeStripRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  const [activeSwipeIndex, setActiveSwipeIndex] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);

  // Track horizontal swipe for dots on mobile
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasSwiped) setHasSwiped(true);
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const idx = Math.round(scrollLeft / (width * 0.85));
    setActiveSwipeIndex(Math.min(records.length - 1, Math.max(0, idx)));
  };

  const handleDotClick = (index: number) => {
    if (!swipeStripRef.current) return;
    const width = swipeStripRef.current.clientWidth;
    swipeStripRef.current.scrollTo({
      left: index * (width * 0.85),
      behavior: "smooth",
    });
  };

  return (
    <div
      id="education"
      ref={containerRef}
      className="relative w-full bg-transparent py-12 sm:py-16 overflow-hidden"
    >
      {/* Shared SVG Filters (Paper Grain & Stamp Bleed) */}
      <SharedEducationDefs />

      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Eyebrow */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#0B1F4B]/70 mb-2">
            EDUCATION
          </p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Academic{" "}
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              journey
            </span>
          </h2>
        </div>

        {/* Wide Horizontal Tri-Fold Form Container */}
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-2xl border border-[#0B1F4B]/20 shadow-[0_1px_2px_rgba(11,31,75,0.1),0_10px_24px_rgba(11,31,75,0.14),0_24px_48px_rgba(11,31,75,0.1)] p-5 sm:p-7 md:p-8 transform md:-rotate-[0.6deg]"
          style={{
            backgroundColor: "#FBF7EC",
          }}
        >
          {/* Paper Grain Overlay using SVG filter */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.11] mix-blend-multiply"
            style={{ filter: "url(#edu-paper-grain)" }}
            aria-hidden="true"
          />

          {/* Metal Binder Clip at Top-Center */}
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none select-none drop-shadow-md"
            aria-hidden="true"
          >
            <div className="w-10 h-4 bg-[#1F2937] rounded-sm border border-black/40 shadow-xs" />
            <div className="w-7 h-2.5 border-x-2 border-b-2 border-gray-400 rounded-b" />
          </div>

          {/* Translucent Corner Washi Tapes */}
          <div
            className="absolute -top-2 left-6 w-7 h-3.5 bg-[#FFD21F]/40 border border-yellow-600/20 transform -rotate-6 pointer-events-none z-20"
            aria-hidden="true"
          />
          <div
            className="absolute -top-2 right-6 w-7 h-3.5 bg-[#FFD21F]/40 border border-yellow-600/20 transform rotate-6 pointer-events-none z-20"
            aria-hidden="true"
          />

          {/* Top Form Header Band (Typewriter 11px uppercase) */}
          <div className="relative border-b-2 border-[#0B1F4B]/20 pb-3 flex flex-wrap items-center justify-between gap-3 text-[#0B1F4B] font-['Special_Elite','Courier_Prime',monospace] text-[11px] uppercase tracking-[0.04em] select-none">
            <div className="flex items-center gap-2">
              <span className="font-black text-xs sm:text-[13px] tracking-wider">
                FORM AB-01 · ACADEMIC BACKGROUND RECORD
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold opacity-75">SECTION 1-3</span>
              <BarcodeSVG seed="ACADEMIC-AB-01-2026" />
            </div>
          </div>

          {/* Progress Rail across all 3 qualifications */}
          <div
            className="relative my-5 px-2 select-none pointer-events-none"
            aria-hidden="true"
          >
            <div className="flex items-center justify-between relative">
              {/* Solid line up to completed, dashed after */}
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex items-center z-0">
                {/* 1st segment: SSLC -> HSC (Solid completed) */}
                <div className="flex-1 h-0.5 bg-[#0B1F4B]" />
                <ChevronRight className="w-3.5 h-3.5 text-[#0B1F4B] -mx-1" />
                {/* 2nd segment: HSC -> B.E. (Dashed in progress) */}
                <div className="flex-1 h-0.5 border-t-2 border-dashed border-[#0B1F4B]/40" />
                <ChevronRight className="w-3.5 h-3.5 text-[#0B1F4B]/50 -mx-1" />
              </div>

              {/* Progress Nodes */}
              {records.map((rec) => {
                const isCompleted = rec.status === "COMPLETED";

                return (
                  <div key={rec.id} className="relative z-10 flex flex-col items-center">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isCompleted
                          ? "bg-[#0B1F4B] border-[#0B1F4B] text-white shadow-xs"
                          : "bg-white border-[#FFD21F] text-[#0B1F4B] shadow-[0_0_12px_rgba(255,210,31,0.6)]"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21F] animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              DESKTOP VIEW: 3 Columns side-by-side (> 720px)
              Shared CSS Grid rows ensures exact horizontal alignment across columns
             ───────────────────────────────────────────────────────────── */}
          <div className="hidden md:grid md:grid-cols-3 gap-0 relative">
            {records.map((item, colIdx) => (
              <React.Fragment key={item.id}>
                {/* Faint Tri-Fold Vertical Crease Line & Dotted Tear line */}
                {colIdx > 0 && (
                  <div
                    className={cn(
                      "absolute top-0 bottom-0 pointer-events-none select-none z-10",
                      colIdx === 1 ? "left-1/3" : "left-2/3"
                    )}
                    aria-hidden="true"
                  >
                    <div className="h-full w-px border-l border-dashed border-[#0B1F4B]/25 -translate-x-1/2 shadow-xs" />
                  </div>
                )}

                <article
                  data-qualification-column
                  className={cn(
                    "flex flex-col justify-between p-4 sm:p-5 text-[#0B1F4B] relative",
                    colIdx === 0 && "pl-2",
                    colIdx === 2 && "pr-2"
                  )}
                >
                  <div className="space-y-4">
                    {/* SECTION 01 / 02 / 03 Tab */}
                    <div className="flex items-center justify-between border-b border-[#0B1F4B]/15 pb-2">
                      <span className="font-['Special_Elite','Courier_Prime',monospace] text-xs font-black uppercase tracking-wider text-[#1A3A7A]">
                        {item.sectionNumber}
                      </span>
                      <span className="text-[10px] font-mono text-[#0B1F4B]/60 font-semibold">
                        ENTRY {colIdx + 1}
                      </span>
                    </div>

                    {/* QUALIFICATION: Heading font bold 20px, up to 2 lines */}
                    <div className="min-h-[56px] flex items-center">
                      <h3 className="font-display text-lg sm:text-[20px] font-extrabold leading-snug text-[#0B1F4B] tracking-tight">
                        {item.qualification}
                      </h3>
                    </div>

                    {/* INSTITUTION: 15px, up to 3 lines */}
                    <div className="min-h-[50px] flex items-center">
                      <p className="text-sm sm:text-[15px] font-semibold text-[#1A3A7A] leading-relaxed">
                        {item.institution}
                      </p>
                    </div>

                    {/* PERIOD: Typewriter 11px uppercase label + 1px navy fill-in line */}
                    <div>
                      <span className="block font-['Special_Elite','Courier_Prime',monospace] text-[10.5px] uppercase tracking-wider text-[#0B1F4B]/60 mb-0.5">
                        PERIOD:
                      </span>
                      <div className="border-b border-[#0B1F4B]/40 pb-0.5 min-h-[22px]">
                        {item.period ? (
                          <span className="font-mono text-xs font-bold text-[#0B1F4B]">
                            {item.period}
                          </span>
                        ) : (
                          /* Empty fill-in line for missing period (no N/A) */
                          <span className="text-transparent select-none">
                            ____________________
                          </span>
                        )}
                      </div>
                    </div>

                    {/* SCORE: Label + ~44px bold navy value with yellow highlighter swipe */}
                    <div className="pt-1">
                      <span className="block font-['Special_Elite','Courier_Prime',monospace] text-[10.5px] uppercase tracking-wider text-[#0B1F4B]/60 mb-0.5">
                        {item.scoreLabel}:
                      </span>
                      <AnimatedScoreDisplay item={item} isInView={isInView} />
                    </div>

                    {/* STATUS Checkboxes: Hand-drawn blue ballpoint check on matching one */}
                    <div className="pt-2 border-t border-dashed border-[#0B1F4B]/20">
                      <span className="block font-['Special_Elite','Courier_Prime',monospace] text-[10px] uppercase tracking-wider text-[#0B1F4B]/60 mb-1.5">
                        RECORDED STATUS:
                      </span>
                      <div className="space-y-1.5 font-['Special_Elite','Courier_Prime',monospace] text-xs font-bold">
                        {/* IN PROGRESS Box */}
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm border-2 border-[#0B1F4B] bg-white flex items-center justify-center">
                            {item.status === "IN PROGRESS" && <BlueBallpointCheckMark />}
                          </div>
                          <span className={item.status === "IN PROGRESS" ? "text-[#0B1F4B]" : "text-[#0B1F4B]/40"}>
                            IN PROGRESS
                          </span>
                        </div>

                        {/* COMPLETED Box */}
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm border-2 border-[#0B1F4B] bg-white flex items-center justify-center">
                            {item.status === "COMPLETED" && <BlueBallpointCheckMark />}
                          </div>
                          <span className={item.status === "COMPLETED" ? "text-[#0B1F4B]" : "text-[#0B1F4B]/40"}>
                            COMPLETED
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Caption "FOR OFFICIAL USE" + Status Stamp */}
                  <div className="mt-8 pt-4 border-t border-[#0B1F4B]/15 flex items-end justify-between min-h-[64px]">
                    <span className="font-['Special_Elite','Courier_Prime',monospace] text-[9.5px] uppercase tracking-wider text-[#0B1F4B]/50 select-none">
                      FOR OFFICIAL USE
                    </span>
                    <AcademicStatusStamp
                      status={item.status}
                      rotation={item.stampRotation}
                    />
                  </div>
                </article>
              </React.Fragment>
            ))}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              MOBILE VIEW: Horizontal Swipe Strip (<= 720px)
              Snap-scroll with swipe dots and "SWIPE →" hint
             ───────────────────────────────────────────────────────────── */}
          <div className="block md:hidden">
            {/* Swipe hint */}
            {!hasSwiped && (
              <div className="text-right text-[11px] font-mono font-bold text-[#1A3A7A] mb-2 animate-pulse">
                SWIPE →
              </div>
            )}

            {/* Horizontal Swipe Container */}
            <div
              ref={swipeStripRef}
              onScroll={handleScroll}
              tabIndex={0}
              aria-label="Academic qualifications swipe strip"
              className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] rounded-xl"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {records.map((item, colIdx) => (
                <article
                  key={item.id}
                  data-qualification-column
                  className="w-[85vw] max-w-[340px] shrink-0 snap-start bg-[#FAF8F3] rounded-xl border border-[#0B1F4B]/20 p-5 flex flex-col justify-between text-[#0B1F4B] shadow-sm"
                >
                  <div className="space-y-4">
                    {/* SECTION Tab */}
                    <div className="flex items-center justify-between border-b border-[#0B1F4B]/15 pb-2">
                      <span className="font-['Special_Elite','Courier_Prime',monospace] text-xs font-black uppercase tracking-wider text-[#1A3A7A]">
                        {item.sectionNumber}
                      </span>
                      <span className="text-[10px] font-mono text-[#0B1F4B]/60 font-semibold">
                        ENTRY {colIdx + 1} OF 3
                      </span>
                    </div>

                    {/* QUALIFICATION */}
                    <h3 className="font-display text-lg font-extrabold leading-snug text-[#0B1F4B]">
                      {item.qualification}
                    </h3>

                    {/* INSTITUTION */}
                    <p className="text-sm font-semibold text-[#1A3A7A]">
                      {item.institution}
                    </p>

                    {/* PERIOD */}
                    <div>
                      <span className="block font-['Special_Elite','Courier_Prime',monospace] text-[10px] uppercase tracking-wider text-[#0B1F4B]/60 mb-0.5">
                        PERIOD:
                      </span>
                      <div className="border-b border-[#0B1F4B]/40 pb-0.5 min-h-[22px]">
                        {item.period ? (
                          <span className="font-mono text-xs font-bold text-[#0B1F4B]">
                            {item.period}
                          </span>
                        ) : (
                          <span className="text-transparent select-none">
                            ____________________
                          </span>
                        )}
                      </div>
                    </div>

                    {/* SCORE */}
                    <div>
                      <span className="block font-['Special_Elite','Courier_Prime',monospace] text-[10px] uppercase tracking-wider text-[#0B1F4B]/60 mb-0.5">
                        {item.scoreLabel}:
                      </span>
                      <AnimatedScoreDisplay item={item} isInView={isInView} />
                    </div>

                    {/* STATUS Checkboxes */}
                    <div className="pt-2 border-t border-dashed border-[#0B1F4B]/20">
                      <span className="block font-['Special_Elite','Courier_Prime',monospace] text-[10px] uppercase tracking-wider text-[#0B1F4B]/60 mb-1.5">
                        RECORDED STATUS:
                      </span>
                      <div className="space-y-1.5 font-['Special_Elite','Courier_Prime',monospace] text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm border-2 border-[#0B1F4B] bg-white flex items-center justify-center">
                            {item.status === "IN PROGRESS" && <BlueBallpointCheckMark />}
                          </div>
                          <span className={item.status === "IN PROGRESS" ? "text-[#0B1F4B]" : "text-[#0B1F4B]/40"}>
                            IN PROGRESS
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm border-2 border-[#0B1F4B] bg-white flex items-center justify-center">
                            {item.status === "COMPLETED" && <BlueBallpointCheckMark />}
                          </div>
                          <span className={item.status === "COMPLETED" ? "text-[#0B1F4B]" : "text-[#0B1F4B]/40"}>
                            COMPLETED
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stamp */}
                  <div className="mt-6 pt-3 border-t border-[#0B1F4B]/15 flex items-end justify-between">
                    <span className="font-['Special_Elite','Courier_Prime',monospace] text-[9.5px] uppercase tracking-wider text-[#0B1F4B]/50 select-none">
                      FOR OFFICIAL USE
                    </span>
                    <AcademicStatusStamp
                      status={item.status}
                      rotation={item.stampRotation}
                    />
                  </div>
                </article>
              ))}
            </div>

            {/* Tappable Progress Dots */}
            <div className="flex justify-center items-center gap-2.5 mt-3">
              {records.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Scroll to qualification ${i + 1}`}
                  onClick={() => handleDotClick(i)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-200 cursor-pointer",
                    activeSwipeIndex === i
                      ? "bg-[#0B1F4B] w-6"
                      : "bg-[#0B1F4B]/30 hover:bg-[#0B1F4B]/60"
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
