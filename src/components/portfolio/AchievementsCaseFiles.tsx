import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Award,
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FileCheck,
  FileText,
  Folder,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  computeCaseStats,
  getDrivePreviewUrl,
  useAchievementsCaseFiles,
} from "@/lib/achievementsData";
import { cn } from "@/lib/utils";
import type { CaseFileItem } from "@/data/achievementsFallback";

const INITIAL_VISIBLE = 6;
const MOBILE_VISIBLE = 4;

// Paper Clip SVG Component for top-right corner of case files
function PaperClip({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0B1F4B"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-5 h-7 drop-shadow-sm select-none", className)}
      aria-hidden="true"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

// Rubber Stamp Component with double-ring border and authentic rotation
function RubberStamp({
  position,
  className,
}: {
  position: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const lower = position.toLowerCase();

  // Color rules:
  // 1. gold/silver/bronze/winner/1st/2nd/3rd or "top" => yellow stamp with navy ink
  // 2. "final" => navy ink
  // 3. "participat" or "qualif" => outlined navy at lighter opacity
  let stampStyle = "border-[#0B1F4B] text-[#0B1F4B] bg-[#0B1F4B]/8";

  if (
    /gold|silver|bronze|winner|1st|2nd|3rd|top/i.test(lower)
  ) {
    stampStyle =
      "border-[#FFD21F] text-[#0B1F4B] bg-[#FFD21F]/20 shadow-[0_0_12px_rgba(255,210,31,0.25)]";
  } else if (/final/i.test(lower)) {
    stampStyle = "border-[#0B1F4B] text-[#0B1F4B] bg-[#0B1F4B]/10";
  } else if (/participat|qualif/i.test(lower)) {
    stampStyle =
      "border-[#0B1F4B]/40 text-[#0B1F4B]/75 bg-transparent border-dashed";
  }

  const isLong = position.length > 20;

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.5, rotate: -16 }}
      animate={{ opacity: 0.9, scale: 1, rotate: -8 }}
      transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
      className={cn(
        "inline-flex flex-col items-center justify-center text-center font-mono font-extrabold uppercase tracking-wider rounded-md border-2 p-1.5 select-none pointer-events-none",
        stampStyle,
        isLong ? "text-[9.5px] max-w-[170px] leading-tight" : "text-xs px-2.5 py-1",
        className
      )}
      style={{
        boxShadow: "inset 0 0 0 1.5px currentColor",
      }}
    >
      <span className="break-words line-clamp-2">{position}</span>
    </motion.div>
  );
}

// Dossier Modal for Viewing Certificate and Case Details
function CaseDossierModal({
  item,
  onClose,
  onNavigate,
  hasPrev,
  hasNext,
  currentIndex,
  totalCount,
}: {
  item: CaseFileItem;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalCount: number;
}) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const previewUrl = useMemo(
    () => (item.certificateLink ? getDrivePreviewUrl(item.certificateLink) : ""),
    [item.certificateLink]
  );

  // Lock body scroll and handle keyboard accessibility
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        onNavigate("prev");
      } else if (e.key === "ArrowRight" && hasNext) {
        onNavigate("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNavigate, hasPrev, hasNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 md:p-8"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0B1F4B]/65 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Modal Sheet Container */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FAF8F3] text-[#0B1F4B] rounded-2xl shadow-[0_24px_60px_rgba(11,31,75,0.35)] border border-[#0B1F4B]/15 overflow-hidden"
      >
        {/* Header Bar styled like folder tab */}
        <div className="relative flex items-center justify-between px-5 sm:px-7 py-3.5 bg-gradient-to-r from-[#E1F5FE] via-[#FAF8F3] to-[#E1F5FE] border-b border-[#0B1F4B]/12">
          <div className="flex items-center gap-2.5">
            <Folder className="w-5 h-5 text-[#0B1F4B]" />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#0B1F4B] uppercase">
              CONFIDENTIAL CASE DOSSIER · {item.caseNumber}
            </span>
            <span className="text-[11px] font-mono text-[#0B1F4B]/60 hidden sm:inline">
              ({currentIndex + 1} of {totalCount})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Prev / Next Arrows in header */}
            <div className="flex items-center mr-2">
              <button
                type="button"
                onClick={() => onNavigate("prev")}
                disabled={!hasPrev}
                aria-label="Previous case file"
                className="p-1 rounded text-[#0B1F4B] hover:bg-[#FFD21F] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("next")}
                disabled={!hasNext}
                aria-label="Next case file"
                className="p-1 rounded text-[#0B1F4B] hover:bg-[#FFD21F] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close dossier"
              className="p-1.5 rounded-full text-[#0B1F4B] hover:bg-[#0B1F4B] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Two columns on desktop, stacked on mobile */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Official Case File Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase bg-[#FFD21F] text-[#0B1F4B] rounded border border-[#0B1F4B]/15">
                  {item.caseNumber}
                </span>
                <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-[#E1F5FE] text-[#0B1F4B] border border-[#0B1F4B]/12">
                  {item.level}
                </span>
              </div>

              <div>
                <h3
                  id="dossier-title"
                  className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1F4B] leading-tight"
                >
                  {item.eventName}
                </h3>
                {item.hostedBy && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1A3A7A]">
                    <Building2 className="w-4 h-4 shrink-0 text-[#0B1F4B]/70" />
                    <span>{item.hostedBy}</span>
                  </p>
                )}
                {item.year && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-mono font-medium text-[#0B1F4B]/70">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Year: {item.year}</span>
                  </p>
                )}
              </div>

              {item.description && (
                <div className="p-3 bg-white rounded-lg border border-[#0B1F4B]/10 text-xs text-[#0B1F4B]/80 leading-relaxed font-medium">
                  {item.description}
                </div>
              )}

              {/* Rubber Stamp Result */}
              <div className="pt-2">
                <span className="block text-[10px] font-mono font-bold tracking-widest text-[#0B1F4B]/60 uppercase mb-2">
                  OFFICIAL VERDICT / RESULT:
                </span>
                <RubberStamp position={item.position} className="scale-110 origin-left" />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#0B1F4B]/10 space-y-2.5">
              {item.certificateLink && (
                <a
                  href={item.certificateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#0B1F4B] hover:bg-[#FFD21F] hover:text-[#0B1F4B] transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Certificate in Google Drive</span>
                </a>
              )}

              <div className="flex items-center justify-between text-xs text-[#0B1F4B]/70 pt-1">
                <span>Navigate cases with ← / → keys</span>
                <span>ESC to close</span>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Certificate Preview with Fallback */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] rounded-xl overflow-hidden bg-white border border-[#0B1F4B]/15 shadow-inner flex items-center justify-center">
              {item.certificateLink && previewUrl ? (
                <>
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F4F8FA] text-[#0B1F4B] z-10 gap-2">
                      <div className="w-8 h-8 rounded-full border-3 border-[#0B1F4B]/20 border-t-[#0B1F4B] animate-spin" />
                      <span className="text-xs font-mono font-semibold">
                        Decrypting Certificate File...
                      </span>
                    </div>
                  )}

                  {!iframeError ? (
                    <iframe
                      src={previewUrl}
                      title={`Certificate for ${item.eventName}`}
                      loading="lazy"
                      className="w-full h-full border-0"
                      onLoad={() => setIframeLoading(false)}
                      onError={() => {
                        setIframeLoading(false);
                        setIframeError(true);
                      }}
                    />
                  ) : (
                    <div className="p-6 text-center space-y-3">
                      <FileCheck className="w-10 h-10 mx-auto text-[#0B1F4B]" />
                      <p className="text-sm font-bold text-[#0B1F4B]">
                        Certificate Preview Unavailable in iframe
                      </p>
                      <p className="text-xs text-[#0B1F4B]/70 max-w-sm mx-auto">
                        Google Drive requires opening this file in a new window.
                      </p>
                      <a
                        href={item.certificateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B1F4B] hover:bg-[#FFD21F] hover:text-[#0B1F4B] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View on Google Drive</span>
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-6 text-center space-y-2 text-[#0B1F4B]/60">
                  <FileText className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-sm font-medium font-mono">
                    No verified certificate link attached to this case file.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Main Case File Card Component
function CaseFileCard({
  item,
  index,
  onOpenDossier,
}: {
  item: CaseFileItem;
  index: number;
  onOpenDossier: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Deterministic slight tilt (-1.2deg to +1.2deg) per card based on index
  const baseTilt = useMemo(() => {
    const tilts = [-1.1, 0.8, -0.6, 1.2, -0.9, 0.7, -1.2, 0.9, -0.5];
    return tilts[index % tilts.length] || 0;
  }, [index]);

  return (
    <motion.div
      layout
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col h-full"
    >
      <div
        role="button"
        tabIndex={0}
        data-case={item.caseNumber}
        data-cursor="file"
        data-cursor-label="OPEN FILE"
        aria-label={`Open ${item.caseNumber}: ${item.eventName}, ${item.position}`}
        onClick={onOpenDossier}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenDossier();
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col justify-between h-full bg-[#FAF7F0] rounded-2xl border border-[#0B1F4B]/15 shadow-[0_8px_24px_rgba(11,31,75,0.07)] p-5 sm:p-6 transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] focus-visible:ring-offset-2"
        style={{
          transform: reduceMotion
            ? "none"
            : isHovered
            ? "translateY(-6px) rotate(0deg)"
            : `rotate(${baseTilt}deg)`,
        }}
      >
        {/* Top Folder Tab holding "CASE 001" */}
        <div className="absolute -top-3.5 left-5 px-3 py-0.5 rounded-t-md bg-[#FAF7F0] border-t border-x border-[#0B1F4B]/15 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B1F4B] shadow-sm z-10 flex items-center gap-1.5">
          <span>{item.caseNumber}</span>
          {item.year && <span className="opacity-60">· {item.year}</span>}
        </div>

        {/* Paper Clip Graphic at Top-Right */}
        <div
          className={cn(
            "absolute -top-3.5 right-5 z-20 transition-transform duration-300",
            isHovered && "rotate-6 scale-105"
          )}
        >
          <PaperClip />
        </div>

        {/* Card Header & Content */}
        <div className="pt-2">
          {/* Level Pill */}
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-[#0B1F4B]/50 uppercase">
              CASE RECORD
            </span>
            <span className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold bg-[#E1F5FE] text-[#0B1F4B] border border-[#0B1F4B]/12">
              {item.level}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="font-display text-base sm:text-lg font-bold text-[#0B1F4B] leading-snug group-hover:text-[#1A3A7A] transition-colors">
            {item.eventName}
          </h3>

          {/* Hosted By Line with Tiny Building Icon */}
          {item.hostedBy && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#1A3A7A] font-medium leading-relaxed">
              <Building2 className="w-3.5 h-3.5 shrink-0 text-[#0B1F4B]/70" />
              <span>{item.hostedBy}</span>
            </p>
          )}

          {/* Rubber Stamp for Position Result */}
          <div className="mt-4 flex items-center justify-start min-h-[46px]">
            <RubberStamp position={item.position} />
          </div>
        </div>

        {/* Dotted Tear-Line & Bottom Action Row */}
        <div className="mt-5 pt-3.5 border-t border-dashed border-[#0B1F4B]/20 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#0B1F4B]/50 uppercase">
            STATUS: ARCHIVED
          </span>

          {item.certificateLink ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-[#0B1F4B] text-[#0B1F4B] bg-white group-hover:bg-[#FFD21F] group-hover:border-[#FFD21F] transition-all duration-200 shadow-xs">
              <Award className="w-3.5 h-3.5" />
              <span>VIEW CERTIFICATE</span>
            </span>
          ) : (
            <span className="text-[11px] font-mono text-[#0B1F4B]/40 italic">
              No certificate yet
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton Card for Initial Loading State if Cache/Bundled is not ready
function CaseFileSkeleton() {
  return (
    <div className="relative flex flex-col justify-between h-[230px] bg-[#FAF7F0]/60 rounded-2xl border border-[#0B1F4B]/10 p-5 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-24 bg-[#0B1F4B]/10 rounded" />
        <div className="h-5 w-4/5 bg-[#0B1F4B]/15 rounded" />
        <div className="h-4 w-1/2 bg-[#0B1F4B]/10 rounded" />
        <div className="h-8 w-28 bg-[#0B1F4B]/10 rounded-md mt-4" />
      </div>
      <div className="pt-3 border-t border-dashed border-[#0B1F4B]/15 flex justify-between items-center">
        <div className="h-3 w-20 bg-[#0B1F4B]/10 rounded" />
        <div className="h-6 w-28 bg-[#0B1F4B]/10 rounded-full" />
      </div>
    </div>
  );
}

export function AchievementsCaseFiles() {
  const { items, isLoading } = useAchievementsCaseFiles();
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const sectionHeadingRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const firstNewlyRevealedRef = useRef<HTMLDivElement | null>(null);
  const seeMoreBtnId = useId();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Compute stats from the FULL dataset (never only visible cards)
  const stats = useMemo(() => computeCaseStats(items), [items]);

  // Distinct levels found in the dataset for folder tabs
  const levelTabs = useMemo(() => {
    const distinct = Array.from(new Set(items.map((i) => i.level).filter(Boolean)));
    return ["All", ...distinct];
  }, [items]);

  // Filter full list first
  const filteredItems = useMemo(() => {
    if (selectedLevel === "All") return items;
    return items.filter(
      (item) => item.level.toLowerCase() === selectedLevel.toLowerCase()
    );
  }, [items, selectedLevel]);

  // Determine visible count
  const initialLimit = isMobile ? MOBILE_VISIBLE : INITIAL_VISIBLE;
  const visibleCount = isExpanded ? filteredItems.length : Math.min(initialLimit, filteredItems.length);
  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

  const hiddenCount = Math.max(0, filteredItems.length - initialLimit);
  const showToggle = filteredItems.length > initialLimit;

  // Handle Level Tab Switch: resets to collapsed (6 or 4 cards)
  const handleTabChange = (level: string) => {
    setSelectedLevel(level);
    setIsExpanded(false);
  };

  // Toggle "See more" / "Show fewer"
  const handleToggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setLiveAnnouncement(`${hiddenCount} more case files shown`);
      setTimeout(() => {
        firstNewlyRevealedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    } else {
      setIsExpanded(false);
      setLiveAnnouncement(`Collapsed to first ${initialLimit} case files`);
      sectionHeadingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Active dossier for modal
  const activeCaseIndex = filteredItems.findIndex((i) => i.id === selectedCaseId);
  const activeCase = activeCaseIndex >= 0 ? filteredItems[activeCaseIndex] : null;

  // Navigate next/prev in modal (auto-expand if user navigates to a hidden case)
  const handleModalNavigate = (direction: "prev" | "next") => {
    if (activeCaseIndex < 0) return;
    const targetIdx = direction === "prev" ? activeCaseIndex - 1 : activeCaseIndex + 1;
    if (targetIdx >= 0 && targetIdx < filteredItems.length) {
      const targetCase = filteredItems[targetIdx];
      if (targetCase) {
        setSelectedCaseId(targetCase.id);
        // Auto-expand the grid if hidden
        if (targetIdx >= initialLimit && !isExpanded) {
          setIsExpanded(true);
        }
      }
    }
  };

  return (
    <div className="relative w-full bg-transparent py-12 sm:py-16">
      {/* Aria Live Announcement for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle hero tie-in line */}
        <div className="flex items-center justify-center gap-2 mb-3 select-none">
          <span className="w-8 sm:w-16 h-[1.5px] bg-[#FFD21F]/70" />
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#0B1F4B]/60">
            CASE BOARD INVESTIGATION ARCHIVE
          </span>
          <span className="w-8 sm:w-16 h-[1.5px] bg-[#FFD21F]/70" />
        </div>

        {/* Section Heading & Eyebrow */}
        <div ref={sectionHeadingRef} className="text-center max-w-3xl mx-auto mb-8">
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#0B1F4B]/70 mb-2">
            ACHIEVEMENTS &amp; HACKATHONS
          </p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Proven under{" "}
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              pressure
            </span>
          </h2>

          {/* Computed Case Board Subtitle Line */}
          <p className="mt-3 text-xs sm:text-sm font-mono font-semibold text-[#1A3A7A] flex items-center justify-center gap-2 flex-wrap">
            <span>{stats.total} case files</span>
            <span>·</span>
            <span>{stats.finals} finals</span>
            <span>·</span>
            <span>{stats.globalOrInternational} international/global</span>
          </p>
        </div>

        {/* Folder-styled Filter Tabs */}
        {levelTabs.length > 1 && (
          <div
            className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-8 sm:mb-10"
            role="tablist"
            aria-label="Filter case files by level"
          >
            {levelTabs.map((tab) => {
              const isActive = selectedLevel === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "relative px-4 sm:px-5 py-2 rounded-t-xl rounded-b-md text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs border",
                    isActive
                      ? "bg-[#0B1F4B] text-white border-[#0B1F4B] shadow-md -translate-y-0.5"
                      : "bg-white/90 text-[#0B1F4B] border-white/80 hover:bg-white hover:-translate-y-0.5 hover:shadow-sm"
                  )}
                >
                  <span>{tab}</span>
                  {tab === "All" && (
                    <span className="ml-1.5 opacity-60">({items.length})</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Case File Cards Grid: 3 cols desktop, 2 tablet, 1 mobile */}
        <div
          ref={gridContainerRef}
          id="case-files-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch"
        >
          {visibleItems.length > 0 ? (
            visibleItems.map((item, idx) => {
              const isNewlyRevealed = isExpanded && idx === initialLimit;
              return (
                <div
                  key={item.id}
                  ref={isNewlyRevealed ? firstNewlyRevealedRef : undefined}
                  className="h-full"
                >
                  <CaseFileCard
                    item={item}
                    index={idx}
                    onOpenDossier={() => setSelectedCaseId(item.id)}
                  />
                </div>
              );
            })
          ) : isLoading ? (
            Array.from({ length: initialLimit }).map((_, i) => (
              <CaseFileSkeleton key={i} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center space-y-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#0B1F4B]/10 p-8">
              <Folder className="w-10 h-10 mx-auto text-[#0B1F4B]/50" />
              <p className="text-base font-bold text-[#0B1F4B]">
                Case files are being updated
              </p>
              <p className="text-xs text-[#0B1F4B]/65 font-medium max-w-md mx-auto">
                No files found under this level filter. Check back shortly as fresh records sync.
              </p>
            </div>
          )}
        </div>

        {/* "See More / Show Fewer" Button */}
        {showToggle && (
          <div className="mt-10 sm:mt-12 flex justify-center">
            <button
              id={seeMoreBtnId}
              type="button"
              onClick={handleToggleExpand}
              aria-expanded={isExpanded}
              aria-controls="case-files-grid"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-mono font-bold tracking-wider uppercase bg-white text-[#0B1F4B] border-2 border-[#0B1F4B] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFD21F] hover:border-[#FFD21F] hover:shadow-[0_0_20px_rgba(255,210,31,0.5)] active:translate-y-0 cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <span>Show fewer</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>See more case files (+{hiddenCount})</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Dossier Modal */}
      <AnimatePresence>
        {activeCase && (
          <CaseDossierModal
            item={activeCase}
            currentIndex={activeCaseIndex}
            totalCount={filteredItems.length}
            hasPrev={activeCaseIndex > 0}
            hasNext={activeCaseIndex < filteredItems.length - 1}
            onClose={() => setSelectedCaseId(null)}
            onNavigate={handleModalNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
