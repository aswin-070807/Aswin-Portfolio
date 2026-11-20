import React, { useEffect, useRef } from "react";
import { CaseFile } from "./caseFilesData";
import { X, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseFileDialogProps {
  file: CaseFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CaseFileDialog({ file, isOpen, onClose }: CaseFileDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Trap focus inside modal
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !file) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#040914]/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
    >
      {/* Dialog Paper Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-dialog-title"
        aria-describedby="case-dialog-result"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl",
          "bg-[#FDFDFD] text-[#0B1F4B] p-6 sm:p-8",
          "border border-[#0B1F4B]/15 shadow-2xl",
          "animate-in zoom-in-95 duration-200",
        )}
      >
        {/* Top Metallic Pin Accent */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FFE57F] via-[#FFD21F] to-[#B78103] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border border-amber-950/40" />
        </div>

        {/* Dialog Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#0B1F4B]/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B1F4B]/70">
                OFFICIAL DOSSIER / {file.caseNumber}
              </span>
            </div>
            <h3
              id="case-dialog-title"
              className="font-['Barlow_Condensed',sans-serif] text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#0B1F4B]"
            >
              {file.role}
            </h3>
          </div>

          {/* Close button with accessible focus state */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close case file dialog"
            className="p-2 rounded-lg text-[#0B1F4B]/60 hover:text-[#0B1F4B] hover:bg-[#0B1F4B]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verified Result Banner */}
        <div className="mt-5 p-4 rounded-xl bg-[#0B1F4B]/5 border border-[#0B1F4B]/10">
          <span className="font-mono text-[11px] font-bold tracking-wider text-[#0B1F4B]/60 uppercase block mb-1">
            KEY RESULT DELIVERED
          </span>
          <p
            id="case-dialog-result"
            className="text-base sm:text-lg font-bold text-[#0B1F4B] leading-snug"
          >
            {file.oneLiner}
          </p>
        </div>

        {/* Investigative Sections: Problem & Solution */}
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B1F4B]/70 flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B1F4B]" />
              THE PROBLEM
            </h4>
            <p className="text-sm text-[#0B1F4B]/90 leading-relaxed pl-3 border-l-2 border-[#0B1F4B]/20">
              {file.problem}
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B1F4B]/70 flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              INVESTIGATION & SOLUTION
            </h4>
            <p className="text-sm text-[#0B1F4B]/90 leading-relaxed pl-3 border-l-2 border-emerald-600/40">
              {file.solution}
            </p>
          </div>
        </div>

        {/* Methods & Tech Tags */}
        <div className="mt-6">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B1F4B]/70 mb-2">
            METHODS & TOOLS USED
          </h4>
          <div className="flex flex-wrap gap-2">
            {file.methods.map((method) => (
              <span
                key={method}
                className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#0B1F4B]/5 text-[#0B1F4B] border border-[#0B1F4B]/15 font-semibold"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Area: Muted Red CASE CLOSED Stamp + Verified Link Button */}
        <div className="mt-8 pt-5 border-t border-[#0B1F4B]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Muted Red Stamp (Red ONLY for stamp and strings) */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded border-2 border-[#DC2626]/85 text-[#DC2626] font-mono text-xs font-black tracking-widest uppercase select-none shadow-sm -rotate-3"
            aria-label="Stamp: Case Closed"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            CASE CLOSED
          </div>

          {/* Action Button linking to real project/repo/certificate */}
          <a
            href={file.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "w-full sm:w-auto inline-flex items-center justify-center gap-2",
              "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold",
              "bg-[#FFD21F] text-[#0B1F4B] hover:bg-[#FFDB4D]",
              "border border-amber-500/40 shadow-md hover:shadow-lg transition-all",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD21F] focus-visible:ring-offset-2",
            )}
          >
            <span>{file.linkLabel}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
