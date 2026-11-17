import React, { useState, useEffect, useRef, useCallback } from "react";
import { SUSPECTS_DATA, SuspectData } from "./suspectsData";
import { HeightWall } from "./HeightWall";
import { Suspect } from "./Suspect";
import { RapSheet } from "./RapSheet";
import { Placard } from "./Placard";
import { ChevronLeft, ChevronRight, Volume2, Sparkles, AlertCircle } from "lucide-react";

function ObservationClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return <span>{time || "22:00:00"}</span>;
}

export function PersonsOfInterest() {
  const [activeSuspect, setActiveSuspect] = useState<SuspectData>(SUSPECTS_DATA[0]);
  const [hoveredSuspect, setHoveredSuspect] = useState<SuspectData | null>(null);
  const [selectedSuspect, setSelectedSuspect] = useState<SuspectData | null>(null);
  const [isCaseFileOpen, setIsCaseFileOpen] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hasSwiped, setHasSwiped] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Displayed suspect in HUD center speaker pill: hover takes priority over active
  const currentInterrogationSuspect = hoveredSuspect || activeSuspect;

  // Camera flash trigger on selection
  const triggerCameraFlash = useCallback(() => {
    if (reduceMotion) return;
    setIsFlashActive(true);
    setTimeout(() => {
      setIsFlashActive(false);
    }, 150);
  }, [reduceMotion]);

  const handleSelectSuspect = (suspect: SuspectData) => {
    setActiveSuspect(suspect);
    setSelectedSuspect(suspect);
    triggerCameraFlash();
    setIsCaseFileOpen(true);
  };

  const handleCloseCaseFile = () => {
    setIsCaseFileOpen(false);
  };

  // Keyboard navigation for suspects
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isCaseFileOpen) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = (activeSuspect.number % SUSPECTS_DATA.length);
      setActiveSuspect(SUSPECTS_DATA[nextIdx]);
      scrollToMobileIndex(nextIdx);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = (activeSuspect.number - 2 + SUSPECTS_DATA.length) % SUSPECTS_DATA.length;
      setActiveSuspect(SUSPECTS_DATA[prevIdx]);
      scrollToMobileIndex(prevIdx);
    }
  };

  // Mobile slider scroll tracking to update active suspect
  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    if (!hasSwiped) setHasSwiped(true);

    const container = sliderRef.current;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    const slides = container.children;

    let closestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement;
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(scrollCenter - slideCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    }

    if (SUSPECTS_DATA[closestIdx] && SUSPECTS_DATA[closestIdx].id !== activeSuspect.id) {
      setActiveSuspect(SUSPECTS_DATA[closestIdx]);
    }
  };

  const scrollToMobileIndex = (index: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const targetSlide = container.children[index] as HTMLElement | undefined;
    if (targetSlide) {
      const scrollPos = targetSlide.offsetLeft - (container.clientWidth - targetSlide.offsetWidth) / 2;
      container.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
    setActiveSuspect(SUSPECTS_DATA[index]);
  };

  return (
    <section
      id="lineup"
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      className="relative w-full py-14 sm:py-20 px-3 sm:px-6 lg:px-8 bg-[#070D1B] text-slate-100 overflow-hidden"
      aria-label="Police Lineup - Persons of Interest"
    >
      {/* 1. Camera Flash Overlay (150ms pulse on suspect click) */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none bg-white transition-opacity duration-150 ${
          isFlashActive ? "opacity-95" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Section Heading & Context Monologue */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono text-xs font-bold tracking-widest uppercase mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>INTERROGATION ROOM // OBSERVATION RECORD</span>
          </div>

          <h2
            className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "'Barlow Condensed', 'Space Grotesk', Impact, sans-serif" }}
          >
            PERSONS OF INTEREST
          </h2>
          <p className="mt-2 text-xs sm:text-sm font-mono text-slate-400 max-w-xl mx-auto">
            Five suspicious profiles detained under suspicion of excessive craft, relentless prototyping, and terminal curiosity. Inspect each record.
          </p>
        </div>

        {/* 2. Realistic Interrogation-Room Observation Window (2-Way Mirror Frame) */}
        <div
          className="relative rounded-xl sm:rounded-2xl border-4 sm:border-8 border-[#0B1528] bg-[#0A1020] shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_2px_8px_rgba(255,255,255,0.08)] overflow-hidden"
          style={{
            // Responsive px-per-cm scale:
            // Desktop: ~2.4px per cm, Mobile: ~2.0px per cm
            // This guarantees head tops land strictly on stated height line with full shoes & floor visible!
            ["--px-per-cm" as any]: "clamp(1.95px, 0.2vw + 1.5px, 2.42px)",
            ["--floor-offset" as any]: "48px",
          }}
        >
          {/* Subtle 2-Way Mirror Glass Reflection & Vignette Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-30 select-none opacity-40 mix-blend-screen"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 40%, transparent 60%)",
            }}
            aria-hidden="true"
          />

          {/* 3. Top HUD Observation Bar */}
          <div className="relative z-40 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#070D1B] via-[#0B162C] to-[#070D1B] border-b border-slate-700/80 font-mono select-none">
            {/* Left: REC [LIVE] */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-red-950/60 border border-red-500/40 text-[10px] sm:text-xs font-bold text-red-400 tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>REC [LIVE]</span>
              </div>
              <span className="hidden md:inline text-[11px] font-semibold text-slate-400 tracking-wider">
                OBSERVATION WINDOW • 2-WAY MIRROR
              </span>
            </div>

            {/* Center: Intercom Speaker Pill (NUMBER X, STEP FORWARD) */}
            <div
              className="flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-slate-900 border border-amber-400/50 shadow-[0_0_12px_rgba(255,210,31,0.2)] text-amber-400 font-bold text-[10px] sm:text-xs tracking-wider"
              aria-live="polite"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>NUMBER {currentInterrogationSuspect.number}, STEP FORWARD</span>
            </div>

            {/* Right: Live Digital Clock & Room Badge */}
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono text-slate-300">
              <span className="tabular-nums tracking-widest text-slate-400 hidden xs:inline">
                <ObservationClock />
              </span>
              <span className="px-2 py-0.5 rounded-xs bg-amber-400/20 border border-amber-400/40 text-amber-400 font-bold">
                ROOM 04
              </span>
            </div>
          </div>

          {/* 4. The Stage (Height Chart + Concrete Wall + Figures) */}
          <div className="relative w-full h-[470px] sm:h-[540px] lg:h-[570px] overflow-hidden">
            {/* Wall & Height Chart background */}
            <HeightWall activeHeightCm={currentInterrogationSuspect.heightCm} />

            {/* 4A. DESKTOP / TABLET LINEUP (>= 768px): All 5 figures in line */}
            <div className="hidden md:flex absolute inset-0 z-20 items-end justify-around px-4 lg:px-8 pb-0">
              {SUSPECTS_DATA.map((suspect) => (
                <Suspect
                  key={suspect.id}
                  suspect={suspect}
                  isActive={activeSuspect.id === suspect.id}
                  isAnyActive={Boolean(hoveredSuspect ? hoveredSuspect.id !== suspect.id : false)}
                  onSelect={handleSelectSuspect}
                  onHover={setHoveredSuspect}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>

            {/* 4B. MOBILE SWIPE SLIDER (< 768px): CSS Scroll-Snap horizontal slider */}
            <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-end pb-0">
              {/* Slider Track with snap-x mandatory */}
              <div
                ref={sliderRef}
                onScroll={handleSliderScroll}
                className="w-full flex-1 flex items-end overflow-x-auto snap-x snap-mandatory scrollbar-none touch-pan-x overscroll-x-contain pb-0"
                style={{
                  scrollPadding: "0 13vw",
                }}
              >
                {SUSPECTS_DATA.map((suspect) => {
                  const isActive = activeSuspect.id === suspect.id;
                  const containerHeightStyle = `calc(var(--px-per-cm, 2.0px) * ${suspect.heightCm} * (1400 / 1260))`;
                  const containerBottomStyle = `calc(var(--floor-offset, 48px) - (var(--px-per-cm, 2.0px) * ${suspect.heightCm} * (40 / 1260)))`;

                  return (
                    <div
                      key={suspect.id}
                      className="flex-shrink-0 w-[74vw] snap-center flex flex-col items-center justify-end relative h-full cursor-pointer select-none"
                      onClick={() => handleSelectSuspect(suspect)}
                    >
                      {/* Overhead Mobile Spotlight */}
                      <div
                        className={`absolute -top-6 inset-x-0 h-[400px] pointer-events-none transition-opacity duration-200 ${
                          isActive ? "opacity-95" : "opacity-20"
                        }`}
                        style={{
                          background: `radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 75%)`,
                          clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
                        }}
                      />

                      {/* Floor Glow */}
                      <div
                        className={`absolute bottom-6 w-36 h-10 rounded-full pointer-events-none transition-all duration-200 blur-md ${
                          isActive ? "opacity-100 scale-105" : "opacity-0"
                        }`}
                        style={{
                          background: `radial-gradient(ellipse, ${suspect.accentGlow} 0%, transparent 70%)`,
                        }}
                      />

                      {/* Scaled Figure with Exact Height Scale (Zero blur, dims with brightness/saturate, scales down when inactive) */}
                      <div
                        className={`relative flex items-center justify-center transition-all duration-200 ${
                          isActive
                            ? "scale-100 opacity-100"
                            : "scale-95 opacity-45 filter brightness-75 saturate-50"
                        }`}
                        style={{
                          position: "absolute",
                          bottom: containerBottomStyle,
                          height: containerHeightStyle,
                          width: "auto",
                          aspectRatio: "600 / 1400",
                        }}
                      >
                        <img
                          src={suspect.imageSrc}
                          srcSet={`${suspect.imageSrc} 1x, ${suspect.imageSrc} 2x`}
                          sizes="74vw"
                          alt={`${suspect.name}, suspect ${suspect.number}`}
                          width={600}
                          height={1400}
                          loading={suspect.number === 1 ? "eager" : "lazy"}
                          decoding="async"
                          className="w-full h-full object-contain pointer-events-none"
                          style={{ imageRendering: "auto" }}
                        />

                        {/* Chest Patch Overlay */}
                        <div
                          className="absolute font-mono font-black text-slate-900 tracking-tighter select-none pointer-events-none"
                          style={{
                            left: `${suspect.chestPatchOffset.x}%`,
                            top: `${suspect.chestPatchOffset.y}%`,
                            transform: "translate(-50%, -50%)",
                            fontSize: "7px",
                            letterSpacing: "-0.05em",
                          }}
                        >
                          {suspect.code}
                        </div>

                        {/* Handheld Placard (Compact on Mobile) */}
                        <div
                          className="absolute z-30"
                          style={{
                            left: "50%",
                            top: "37.5%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <Placard suspect={suspect} isCompact={true} />
                        </div>
                      </div>

                      {/* Stand Marker Button on Mobile Floor */}
                      <div
                        className="absolute z-20"
                        style={{ bottom: "10px" }}
                      >
                        <div
                          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-sm border font-mono text-[9px] tracking-wider transition-colors ${
                            isActive
                              ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold"
                              : "border-slate-700 bg-slate-900/60 text-slate-400"
                          }`}
                        >
                          <span>[ {suspect.number} ]</span>
                          <span>STAND {suspect.number}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile "SWIPE" Guide Badge (Disappears after first swipe) */}
              {!hasSwiped && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
                  <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/60 text-amber-300 font-mono text-[10px] font-bold tracking-widest uppercase shadow-lg flex items-center gap-1.5">
                    <span>SWIPE ↔</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Mobile Navigation Bar & Stand Indicators */}
          <div className="md:hidden flex items-center justify-between px-3 py-2 bg-[#070D1B] border-t border-slate-800">
            {/* Prev Arrow */}
            <button
              onClick={() => {
                const prev = (activeSuspect.number - 2 + SUSPECTS_DATA.length) % SUSPECTS_DATA.length;
                scrollToMobileIndex(prev);
              }}
              className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Previous Suspect"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Five Stand Marker Dots: [ 1 ] .. [ 5 ] */}
            <div className="flex items-center gap-1.5">
              {SUSPECTS_DATA.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => scrollToMobileIndex(idx)}
                  className={`px-2 py-0.5 rounded-xs font-mono text-[10px] tracking-wider transition-all ${
                    activeSuspect.id === s.id
                      ? "bg-amber-400 text-slate-950 font-bold shadow-[0_0_8px_rgba(255,210,31,0.5)]"
                      : "bg-slate-800/80 text-slate-400 border border-slate-700"
                  }`}
                  aria-label={`Go to suspect ${s.number}: ${s.name}`}
                >
                  {s.number}
                </button>
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={() => {
                const next = activeSuspect.number % SUSPECTS_DATA.length;
                scrollToMobileIndex(next);
              }}
              className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Next Suspect"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6. Closing Investigator Note (The Punchline) */}
        <div className="mt-5 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-slate-900/70 border border-slate-800 text-slate-300 font-mono text-xs shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-semibold">NOTE FOR RECORD:</span>
            <span className="text-slate-200">
              Facial biometric cross-match 99.8%. <strong className="text-amber-400 font-bold">All five suspects are the same person.</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 7. Case File Dossier Panel (Side panel on desktop, Bottom sheet on mobile) */}
      <RapSheet
        suspect={selectedSuspect}
        isOpen={isCaseFileOpen}
        onClose={handleCloseCaseFile}
        reduceMotion={reduceMotion}
      />
    </section>
  );
}
