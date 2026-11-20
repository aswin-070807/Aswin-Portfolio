import React from "react";
import { CaseFile } from "./caseFilesData";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseCardProps {
  file: CaseFile;
  isActive: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: (file: CaseFile) => void;
  pinRef?: (el: HTMLDivElement | null) => void;
  cardIndex: number;
}

export const CaseCard = React.forwardRef<HTMLButtonElement, CaseCardProps>(
  ({ file, isActive, isHovered, onHover, onSelect, pinRef, cardIndex }, ref) => {
    // Check prefers-reduced-motion
    const [reduceMotion, setReduceMotion] = React.useState(false);
    React.useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduceMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    // Subtle vertical stagger for desktop
    const desktopStaggerClass =
      cardIndex === 0
        ? "lg:translate-y-2"
        : cardIndex === 1
          ? "lg:-translate-y-2"
          : cardIndex === 2
            ? "lg:translate-y-3"
            : cardIndex === 3
              ? "lg:-translate-y-1"
              : "lg:translate-y-2";

    const transformStyle = reduceMotion
      ? "none"
      : isHovered || isActive
        ? "rotate(0deg) translateY(-6px)"
        : `rotate(${file.rotation}deg)`;

    return (
      <div
        className={cn("relative group transition-transform duration-300", desktopStaggerClass)}
        style={{
          transform: transformStyle,
          transition: reduceMotion
            ? "none"
            : "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 350ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Metal Pushpin at top center */}
        <div
          ref={pinRef}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className={cn(
              "w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.5)] border border-amber-950/40",
              isActive || isHovered
                ? "bg-gradient-to-br from-[#FFE57F] via-[#FFD21F] to-[#B78103] ring-2 ring-[#FFD21F]/80 scale-110"
                : "bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700",
            )}
          />
          <div className="w-2 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5" />
        </div>

        {/* Paper Case Card Button */}
        <button
          ref={ref}
          type="button"
          onClick={() => onSelect(file)}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
          onFocus={() => onHover(true)}
          onBlur={() => onHover(false)}
          aria-haspopup="dialog"
          aria-label={`Open evidence file for ${file.caseNumber}: ${file.role}. Result: ${file.oneLiner}`}
          className={cn(
            "w-full text-left select-none cursor-pointer flex flex-col justify-between",
            "min-h-[175px] sm:min-h-[190px] p-5 sm:p-6 rounded-xl",
            "bg-[#FBFBFA] text-[#0B1F4B] transition-all duration-300",
            "border shadow-lg",
            isActive || isHovered
              ? "border-[#FFD21F] shadow-[0_16px_32px_-8px_rgba(0,0,0,0.4),0_0_20px_rgba(255,210,31,0.35)] ring-2 ring-[#FFD21F]/80"
              : "border-[#0B1F4B]/15 hover:border-[#FFD21F]/70 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3)]",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD21F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F4B]",
          )}
        >
          {/* Card Front: EXACTLY 3 elements as specified */}
          {/* 1. CASE 0X / THE ROLE */}
          <div className="flex items-center justify-between gap-2 border-b border-[#0B1F4B]/10 pb-2.5">
            <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-[#0B1F4B]/70 uppercase">
              {file.caseNumber} / {file.role}
            </span>
            <span
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                isActive || isHovered ? "bg-[#FFD21F]" : "bg-[#0B1F4B]/20",
              )}
              aria-hidden="true"
            />
          </div>

          {/* 2. One-line result */}
          <p className="my-3 text-xs sm:text-[13px] md:text-sm font-bold text-[#0B1F4B] leading-snug tracking-tight">
            {file.oneLiner}
          </p>

          {/* 3. Small "Open file" action */}
          <div className="flex items-center justify-between pt-2.5 border-t border-[#0B1F4B]/10 text-xs font-semibold text-[#0B1F4B]/80 group-hover:text-[#0B1F4B] transition-colors">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide">
              <FolderOpen className="w-3.5 h-3.5 text-[#0B1F4B]/60 group-hover:text-[#0B1F4B] transition-colors" />
              Open file
            </span>
            <span className="grid place-items-center w-5 h-5 rounded-full bg-[#0B1F4B]/5 group-hover:bg-[#FFD21F] text-[#0B1F4B] transition-all group-hover:translate-x-0.5">
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </button>
      </div>
    );
  },
);

CaseCard.displayName = "CaseCard";
