import React, { useEffect, useRef, useState } from "react";
import { SuspectData } from "./suspectsData";
import { X, ExternalLink, ShieldAlert, Award, FileText, ArrowRight } from "lucide-react";

interface RapSheetProps {
  suspect: SuspectData | null;
  isOpen: boolean;
  onClose: () => void;
  reduceMotion?: boolean;
}

export function RapSheet({
  suspect,
  isOpen,
  onClose,
  reduceMotion = false,
}: RapSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [typedCharge, setTypedCharge] = useState("");
  const touchStartY = useRef<number | null>(null);

  // Typewriter effect for "Charged with:" line
  useEffect(() => {
    if (!isOpen || !suspect) {
      setTypedCharge("");
      return;
    }

    if (reduceMotion) {
      setTypedCharge(suspect.charge);
      return;
    }

    setTypedCharge("");
    let i = 0;
    const fullText = suspect.charge;
    const timer = setInterval(() => {
      i++;
      setTypedCharge(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [isOpen, suspect, reduceMotion]);

  // Lock body scroll when modal/bottom-sheet is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus panel on open
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  // Mobile swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;
    if (deltaY > 60) {
      onClose();
    }
    touchStartY.current = null;
  };

  if (!isOpen || !suspect) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Case File Dossier: ${suspect.name}`}
    >
      {/* Dossier Card / Bottom Sheet Container */}
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full sm:max-w-xl max-h-[88vh] sm:max-h-[92vh] flex flex-col bg-[#0F172A] border sm:border-2 border-slate-700/80 rounded-t-2xl sm:rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100 outline-none animate-in fade-in slide-in-from-bottom-6 sm:slide-in-from-right-8 duration-200"
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden flex justify-center py-2.5 bg-slate-900/60 border-b border-slate-800">
          <div className="w-12 h-1.5 rounded-full bg-slate-600" />
        </div>

        {/* Top Confidential Classified Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest text-red-400 uppercase">
              CONFIDENTIAL // CASE DOSSIER
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-amber-400">
              {suspect.code}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Case File"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Body with internal scroll */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
          {/* 1. Mugshot Header with Rotated Rubber Stamp */}
          <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-5 pb-5 border-b border-slate-800">
            {/* Mugshot Photo Frame */}
            <div className="relative w-28 h-36 flex-shrink-0 mx-auto sm:mx-0 rounded-md border-2 border-slate-600 bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Photo viewport zooming in on upper torso and face */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${suspect.imageSrc})`,
                  backgroundSize: "280%",
                  backgroundPosition: "50% 12%",
                  backgroundRepeat: "no-repeat",
                }}
              />

              {/* Crosshair Overlay */}
              <div className="absolute inset-2 border border-slate-400/20 pointer-events-none" />
              <div className="absolute bottom-1 inset-x-0 text-center bg-black/70 py-0.5 font-mono text-[8px] font-bold tracking-wider text-amber-400">
                {suspect.code}
              </div>
            </div>

            {/* Suspect Identity Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase mb-1.5 border"
                style={{
                  borderColor: suspect.accentColor,
                  color: suspect.accentColor,
                  backgroundColor: `${suspect.accentColor}15`,
                }}
              >
                SUSPECT NO. 0{suspect.number} • {suspect.pose}
              </div>

              <h3
                className="text-2xl sm:text-3xl font-black tracking-wider text-white uppercase leading-tight"
                style={{ fontFamily: "'Barlow Condensed', 'Space Grotesk', Impact, sans-serif" }}
              >
                {suspect.name}
              </h3>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 font-mono text-xs text-slate-300">
                <span className="px-2 py-0.5 rounded-xs bg-slate-800 border border-slate-700">
                  Height: <strong className="text-white">{suspect.heightCm} cm</strong> ({suspect.heightFtIn})
                </span>
                <span className="px-2 py-0.5 rounded-xs bg-slate-800 border border-slate-700">
                  Status: <strong className="text-amber-400">IN CUSTODY</strong>
                </span>
              </div>
            </div>

            {/* Rotated "PERSON OF INTEREST" Rubber Stamp */}
            <div
              className="absolute right-0 top-0 sm:right-2 sm:top-2 pointer-events-none select-none z-20"
              style={{ transform: "rotate(-12deg)" }}
              aria-hidden="true"
            >
              <div className="px-3 py-1 rounded-sm border-2 border-red-500/85 bg-red-950/40 text-red-500 font-mono text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                ★ PERSON OF INTEREST ★
              </div>
            </div>
          </div>

          {/* 2. Charged With: (Typewriter effect) */}
          <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-500/30">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-red-400 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CHARGED WITH:</span>
            </div>
            <p className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed min-h-[2.5rem]">
              "{typedCharge}"
              {!reduceMotion && typedCharge.length < suspect.charge.length && (
                <span className="inline-block w-2 h-3.5 bg-red-400 ml-0.5 animate-pulse" />
              )}
            </p>
          </div>

          {/* 3. Investigation Dossier / Bio */}
          {suspect.bio && (
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                INTERROGATION NOTES & PROFILE
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                {suspect.bio}
              </p>
            </div>
          )}

          {/* 4. Verified Skills Tags */}
          {suspect.skills && suspect.skills.length > 0 && (
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                SPECIALTY MODUS OPERANDI (SKILLS)
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {suspect.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition-colors"
                    style={{
                      backgroundColor: `${suspect.accentColor}12`,
                      borderColor: `${suspect.accentColor}40`,
                      color: suspect.accentColor,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Projects on File (Evidence Dossier) */}
          {suspect.projects && suspect.projects.length > 0 && (
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                EVIDENCE ON RECORD (KEY PROJECTS)
              </h4>
              <div className="space-y-2">
                {suspect.projects.map((proj, idx) => (
                  <a
                    key={idx}
                    href={proj.link}
                    target={proj.link.startsWith("http") ? "_blank" : undefined}
                    rel={proj.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group block p-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-600 transition-all cursor-pointer"
                    onClick={proj.link.startsWith("#") ? onClose : undefined}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                        {proj.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {proj.oneLiner}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 6. External Links & Records */}
          {suspect.links && suspect.links.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {suspect.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  onClick={link.url.startsWith("#") ? onClose : undefined}
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer Dossier Stamp */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>CASE FILE VERIFIED // IDENT: ASWIN A</span>
          <button
            onClick={onClose}
            className="text-amber-400 hover:underline font-bold cursor-pointer"
          >
            DISMISS RECORD [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
