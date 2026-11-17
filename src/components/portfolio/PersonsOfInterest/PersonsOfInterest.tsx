import React, { useState, useEffect, useRef, useCallback } from "react";
import { SUSPECTS_DATA, SuspectData } from "./suspectsData";
import { HeightWall } from "./HeightWall";
import { Suspect } from "./Suspect";
import { RapSheet } from "./RapSheet";
import { Volume2, Radio, Clock, Shield, Sparkles } from "lucide-react";

const ObservationClock = React.memo(function ObservationClock({ isVisible }: { isVisible: boolean }) {
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isVisible) return;
    const update = () => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date().toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <span className="flex items-center gap-1 text-white/80">
      <Clock className="w-3.5 h-3.5" />
      <span ref={timeRef}>21:45:00</span>
    </span>
  );
});

export const PersonsOfInterest: React.FC = () => {
  const [selectedSuspect, setSelectedSuspect] = useState<SuspectData | null>(null);
  const [hoveredSuspect, setHoveredSuspect] = useState<SuspectData | null>(null);
  const [inspectedIds, setInspectedIds] = useState<Set<string>>(new Set());
  const [isFlashing, setIsFlashing] = useState(false);
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  const [speakerCommand, setSpeakerCommand] = useState("NUMBER 3, STEP FORWARD");
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const autoCycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // IntersectionObserver to pause off-screen execution
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry ? entry.isIntersecting : false);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Active suspect for the height laser and card display
  const activeSuspect = selectedSuspect || hoveredSuspect;

  const handleSelectSuspect = useCallback((suspect: SuspectData) => {
    setSelectedSuspect(suspect);
    setSpeakerCommand(`SUSPECT #${suspect.number}, STAND STILL`);
    setInspectedIds((prev) => new Set([...prev, suspect.id]));

    // Quick camera flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 160);
  }, []);

  const handleHoverSuspect = useCallback((suspect: SuspectData | null) => {
    setHoveredSuspect(suspect);
    if (suspect) {
      setSpeakerCommand(`IDENTIFYING SUSPECT #${suspect.number}...`);
      setInspectedIds((prev) => new Set([...prev, suspect.id]));
    } else if (!selectedSuspect) {
      setSpeakerCommand("NUMBER 3, STEP FORWARD");
    }
  }, [selectedSuspect]);

  // Auto-cycle through suspects 1 -> 5 when clicking the intercom / speaker
  const triggerAutoCycle = () => {
    if (isAutoCycling) return;
    setIsAutoCycling(true);
    let index = 0;

    const cycleNext = () => {
      if (index >= SUSPECTS_DATA.length) {
        setIsAutoCycling(false);
        setSpeakerCommand("ALL SUSPECTS REVIEWED");
        return;
      }
      const s = SUSPECTS_DATA[index];
      if (s) {
        handleSelectSuspect(s);
      }
      index++;
      autoCycleTimerRef.current = setTimeout(cycleNext, 1800);
    };

    cycleNext();
  };

  useEffect(() => {
    return () => {
      if (autoCycleTimerRef.current) clearTimeout(autoCycleTimerRef.current);
    };
  }, []);

  // Keyboard navigation for lineup
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % SUSPECTS_DATA.length;
      const el = document.getElementById(`suspect-${SUSPECTS_DATA[next]?.id}`);
      el?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + SUSPECTS_DATA.length) % SUSPECTS_DATA.length;
      const el = document.getElementById(`suspect-${SUSPECTS_DATA[prev]?.id}`);
      el?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const s = SUSPECTS_DATA[index];
      if (s) handleSelectSuspect(s);
    }
  };

  const allInspected = inspectedIds.size >= SUSPECTS_DATA.length;

  return (
    <section
      ref={sectionRef}
      id="lineup"
      aria-label="Persons of Interest Police Lineup"
      className="relative w-full py-16 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50/60 via-[#E8F3FA] to-sky-100/50 overflow-hidden select-none"
    >
      {/* Top & bottom blending gradients into sky theme */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#81D4FA]/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#81D4FA]/20 to-transparent pointer-events-none" />

      {/* Quick Camera Flash Overlay */}
      {isFlashing && (
        <div
          className="fixed inset-0 z-50 bg-white/70 pointer-events-none transition-opacity duration-150 animate-out fade-out"
          aria-hidden="true"
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B1F4B]/10 border border-[#0B1F4B]/20 rounded-full text-xs font-mono font-bold text-[#0B1F4B] tracking-widest uppercase mb-2">
            <Radio className="w-3.5 h-3.5 text-[#0B1F4B] animate-pulse" />
            <span>CASE FILE · LINEUP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B1F4B] tracking-tight font-sans">
            Persons of Interest
          </h2>
          <p className="mt-2 text-sm sm:text-base font-mono text-[#0B1F4B]/75 max-w-lg mx-auto">
            Identify the suspect. Click or inspect any silhouette to review their record.
          </p>
        </div>

        {/* Observation Room / 2-Way Mirror Frame */}
        <div className="relative rounded-xl border-4 border-[#0B1F4B]/30 bg-[#0B1F4B]/5 p-2 sm:p-4 shadow-2xl backdrop-blur-sm">
          {/* Mirror Header Console */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0B1F4B] text-white rounded-lg font-mono text-xs mb-3 shadow-inner">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>REC [LIVE]</span>
              </span>
              <span className="text-white/40">|</span>
              <span className="font-bold tracking-wider text-sky-200">
                OBSERVATION WINDOW · 2-WAY MIRROR
              </span>
            </div>

            {/* Intercom Speaker Grille Button */}
            <button
              onClick={triggerAutoCycle}
              disabled={isAutoCycling}
              title="Click to cycle suspects automatically"
              className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 rounded transition-all text-[#FFD21F] font-bold"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isAutoCycling ? "animate-bounce" : ""}`} />
              <span className="truncate max-w-[160px] sm:max-w-xs">{speakerCommand}</span>
            </button>

            <div className="flex items-center gap-3">
              <ObservationClock isVisible={isVisible} />
              <span className="px-2 py-0.5 bg-[#FFD21F] text-[#0B1F4B] font-black rounded text-[10px]">
                ROOM 04
              </span>
            </div>
          </div>

          {/* Lineup Stage Container */}
          <div className="relative w-full h-[520px] sm:h-[500px] rounded-lg overflow-hidden border border-[#0B1F4B]/20 shadow-inner flex flex-col justify-end">
            {/* SVG Height Wall Background */}
            <HeightWall
              activeHeight={activeSuspect?.heightCm || null}
              activeFtIn={activeSuspect?.heightFtIn || null}
              isLocked={Boolean(activeSuspect)}
            />

            {/* Suspects Silhouettes Row */}
            <div className="relative z-10 w-full px-2 sm:px-6 flex items-end justify-around pb-2">
              {SUSPECTS_DATA.map((suspect, idx) => (
                <div
                  key={suspect.id}
                  id={`suspect-${suspect.id}`}
                  onMouseEnter={() => handleHoverSuspect(suspect)}
                  onMouseLeave={() => handleHoverSuspect(null)}
                >
                  <Suspect
                    suspect={suspect}
                    isActive={activeSuspect?.id === suspect.id}
                    isDimmed={Boolean(activeSuspect && activeSuspect.id !== suspect.id)}
                    onSelect={() => handleSelectSuspect(suspect)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                  />
                </div>
              ))}
            </div>

            {/* Sliding Rap-Sheet Dossier Overlay / Modal */}
            {selectedSuspect && (
              <div
                className="absolute inset-0 z-40 bg-[#0B1F4B]/40 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={() => setSelectedSuspect(null)}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <RapSheet
                    suspect={selectedSuspect}
                    onClose={() => setSelectedSuspect(null)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reveal Conclusion Line after inspecting all 5 */}
        <div className="mt-8 min-h-[56px] flex flex-col items-center justify-center text-center">
          {allInspected ? (
            <div className="inline-flex flex-col items-center gap-1.5 p-4 rounded-xl bg-[#0B1F4B] text-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 font-mono">
              <div className="flex items-center gap-2 text-[#FFD21F] font-black text-sm sm:text-base tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-[#FFD21F]" />
                <span>CASE FILE FINDING: All five suspects are the same person.</span>
              </div>
              <p className="text-xs text-white/80">
                Subject: Aswin A — The Builder, Competitor, Leader, Mentor, and Poet.
              </p>
            </div>
          ) : (
            <p className="text-xs font-mono text-[#0B1F4B]/60 tracking-wider">
              INSPECTED {inspectedIds.size} / 5 SUSPECTS · INSPECT ALL TO CONCLUDE THE LINEUP
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
