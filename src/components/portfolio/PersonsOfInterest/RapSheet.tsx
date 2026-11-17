import React, { useEffect } from "react";
import { SuspectData } from "./suspectsData";
import { X, ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react";

interface RapSheetProps {
  suspect: SuspectData | null;
  onClose: () => void;
}

export const RapSheet: React.FC<RapSheetProps> = ({ suspect, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!suspect) return null;

  const scrollToEvidence = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Police Dossier for ${suspect.alias}`}
      data-cursor="file"
      data-cursor-label="OPEN FILE"
      className="relative w-full max-w-md bg-[#FAF9F5] border-2 border-[#0B1F4B] shadow-2xl rounded-sm p-5 font-mono text-[#0B1F4B] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Background confidential watermark */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04] text-7xl font-black rotate-[-25deg]"
        aria-hidden="true"
      >
        EVIDENCE
      </div>

      {/* Red "IDENTIFIED" stamp */}
      <div
        className="absolute top-4 right-12 pointer-events-none z-10 border-4 border-[#DC2626] text-[#DC2626] font-black text-xs sm:text-sm px-2.5 py-1 tracking-widest uppercase rounded rotate-[-12deg] shadow-sm animate-in zoom-in-75 duration-300"
        aria-hidden="true"
      >
        IDENTIFIED · MATCH 100%
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close dossier"
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-[#0B1F4B]/10 text-[#0B1F4B]/70 hover:text-[#0B1F4B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B1F4B]"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header bar */}
      <div className="border-b-2 border-[#0B1F4B] pb-3 mb-4">
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#0B1F4B]/70 uppercase">
          <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>CENTRAL POLICE ARCHIVE · RAP SHEET</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#0B1F4B] mt-1">
          {suspect.alias}
        </h3>
        <div className="flex items-center gap-4 text-xs font-semibold text-[#0B1F4B]/80 mt-1">
          <span>CODE: {suspect.code}</span>
          <span>•</span>
          <span>HEIGHT: {suspect.heightCm} CM ({suspect.heightFtIn})</span>
        </div>
      </div>

      {/* Content Fields */}
      <div className="space-y-3.5 text-xs">
        <div>
          <span className="block text-[10px] tracking-wider text-[#0B1F4B]/60 font-bold uppercase">
            KNOWN FOR
          </span>
          <p className="text-sm font-semibold text-[#0B1F4B] mt-0.5 leading-relaxed">
            {suspect.knownFor}
          </p>
        </div>

        <div>
          <span className="block text-[10px] tracking-wider text-[#0B1F4B]/60 font-bold uppercase">
            LAST SEEN AT
          </span>
          <p className="text-sm font-semibold text-[#0B1F4B] mt-0.5">
            {suspect.lastSeenAt}
          </p>
        </div>

        <div>
          <span className="block text-[10px] tracking-wider text-[#0B1F4B]/60 font-bold uppercase">
            EVIDENCE ON FILE
          </span>
          <a
            href={`#${suspect.evidenceId}`}
            onClick={(e) => scrollToEvidence(e, suspect.evidenceId)}
            className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 bg-[#0B1F4B] text-white hover:bg-[#1A3675] active:scale-95 rounded text-xs font-bold transition-all shadow-sm"
          >
            <span>{suspect.evidenceLabel}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Danger to Bugs Meter */}
        <div className="pt-2 border-t border-[#0B1F4B]/15">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] tracking-wider text-[#0B1F4B]/70 font-bold uppercase">
              DANGER TO BUGS
            </span>
            <span className="text-xs font-black text-[#DC2626]">
              {suspect.danger}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((lvl) => (
              <div
                key={lvl}
                className={`h-2.5 rounded-sm transition-all duration-300 ${
                  lvl <= suspect.dangerLevel
                    ? lvl === 3
                      ? "bg-[#DC2626]"
                      : lvl === 2
                      ? "bg-[#EA580C]"
                      : "bg-[#F59E0B]"
                    : "bg-[#0B1F4B]/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer stamp confirmation */}
      <div className="mt-5 pt-3 border-t border-[#0B1F4B]/20 flex items-center justify-between text-[10px] text-[#0B1F4B]/60">
        <div className="flex items-center gap-1 text-emerald-700 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>STATUS: APPREHENDED & CATALOGUED</span>
        </div>
        <span className="font-mono">ROOM 04</span>
      </div>
    </div>
  );
};
