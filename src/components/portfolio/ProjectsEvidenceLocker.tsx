import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FileSearch,
  FileText,
  GraduationCap,
  Leaf,
  Lock,
  Search,
  ShieldAlert,
  Store,
  X,
  type LucideIcon,
} from "lucide-react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { type ProjectItem } from "@/data/projectsFallback";
import { useProjectsData } from "@/lib/projectsData";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 3;

// Official GitHub SVG Logo
function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-4 h-4 shrink-0", className)}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// Category keyword to debossed icon mapping
function getCategoryIcon(category: string): LucideIcon {
  const cat = (category || "").toLowerCase();
  if (cat.includes("road") || cat.includes("safety")) return ShieldAlert;
  if (cat.includes("campus") || cat.includes("education")) return GraduationCap;
  if (cat.includes("sustainab") || cat.includes("environment")) return Leaf;
  if (
    cat.includes("commercial") ||
    cat.includes("web") ||
    cat.includes("business") ||
    cat.includes("cafe")
  )
    return Store;
  if (
    cat.includes("publication") ||
    cat.includes("book") ||
    cat.includes("paper") ||
    cat.includes("research")
  )
    return BookOpen;
  return FileText;
}

// Shared SVG Definitions (loaded once in DOM for 60fps performance)
function SharedEvidenceDefs() {
  return (
    <svg className="sr-only" aria-hidden="true" width="0" height="0">
      <defs>
        {/* Manila paper grain texture */}
        <filter id="manila-paper-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.05   0 0 0 0 0.12   0 0 0 0 0.3   0 0 0 0.12 0"
          />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>

        {/* Rubber ink stamp rough edges & bleed */}
        <filter id="stamp-ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
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
    for (let i = 0; i < 26; i++) {
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

// Fingerprint Watermark SVG behind grid
function FingerprintWatermark() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.05] text-[#0B1F4B] pointer-events-none select-none overflow-visible"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M100 20 C60 20 30 50 30 95 C30 145 60 175 100 175 C140 175 170 145 170 95 C170 50 140 20 100 20 Z" />
      <path d="M100 35 C70 35 45 60 45 95 C45 135 70 160 100 160 C130 160 155 135 155 95 C155 60 130 35 100 35 Z" />
      <path d="M100 50 C80 50 60 70 60 95 C60 125 80 145 100 145 C120 145 140 125 140 95 C140 70 120 50 100 50 Z" />
      <path d="M100 65 C88 65 75 78 75 95 C75 115 88 130 100 130 C112 130 125 115 125 95 C125 78 112 65 100 65 Z" />
      <path d="M100 80 C93 80 87 86 87 95 C87 105 93 112 100 112 C107 112 113 105 113 95 C113 86 107 80 100 80 Z" />
      <path d="M100 92 A3 3 0 1 0 100 98 A3 3 0 1 0 100 92 Z" fill="currentColor" />
    </svg>
  );
}

// A-Frame Crime Scene Evidence Marker Tent (standing on top-right of tab)
function EvidenceMarkerTent({
  number,
  className,
}: {
  number: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none filter drop-shadow-[0_4px_6px_rgba(11,31,75,0.25)]",
        className
      )}
      style={{ perspective: "400px" }}
      aria-hidden="true"
    >
      <div className="relative flex">
        {/* Left slanted face */}
        <div className="relative w-6 h-6 bg-[#FFD21F] border border-yellow-500 rounded-l flex items-center justify-center font-mono font-black text-xs text-[#0B1F4B] shadow-inner transform -skew-y-6">
          <span>{number}</span>
        </div>
        {/* Right shadow face */}
        <div className="relative w-3 h-6 bg-[#E6BC00] border-y border-r border-yellow-600 rounded-r transform skew-y-6 flex items-center justify-center">
          <div className="w-0.5 h-2.5 bg-black/15 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// High-Contrast Bold Rubber-Ink Status Stamp (Bold 14px, rotated -10deg, double border)
function CaseFolderStatusStamp({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const lower = (status || "").toLowerCase();

  let stampText = status.toUpperCase();
  let isSolved = false;

  if (/progress|building|investigat/i.test(lower)) {
    stampText = "UNDER INVESTIGATION";
  } else if (/complet|solved|live|published|done/i.test(lower)) {
    stampText = "CASE SOLVED";
    isSolved = true;
  }

  return (
    <motion.div
      initial={
        reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.35, rotate: -15 }
      }
      animate={{ opacity: 1, scale: 1, rotate: -10 }}
      transition={{ duration: 0.35, delay: 0.12, ease: [0.175, 0.885, 0.32, 1.25] }}
      className={cn(
        "inline-flex flex-col items-center justify-center text-center font-mono font-black tracking-[0.12em] uppercase select-none pointer-events-none rounded px-3 py-1.5 min-h-[44px] z-30 shadow-md",
        isSolved
          ? "bg-[#FFD21F] text-[#0B1F4B] border-2 border-[#0B1F4B]"
          : "bg-white text-[#0B1F4B] border-2 border-[#0B1F4B]",
        className
      )}
      style={{
        filter: "url(#stamp-ink-bleed)",
        boxShadow: "inset 0 0 0 1.5px currentColor",
        mixBlendMode: "multiply",
      }}
    >
      <span className="text-[13px] sm:text-[14px] leading-tight font-black px-1">
        {stampText}
      </span>
    </motion.div>
  );
}

// Button-and-String Tie Closure with Red Tamper Seal
function FolderTieClosure({
  isHovered,
  isOpening,
}: {
  isHovered: boolean;
  isOpening: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative w-full flex items-center justify-center py-2 select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Background horizontal flap boundary line */}
      <div className="absolute inset-x-0 h-px bg-[#8B6B38]/30 top-1/2 -translate-y-1/2" />

      {/* Button & String Artwork */}
      <div className="relative w-28 h-20 flex items-center justify-center">
        {/* SVG Figure-8 string and dangling tail */}
        <svg
          viewBox="0 0 112 80"
          className="absolute inset-0 w-full h-full overflow-visible"
        >
          {/* Figure-8 twisted string */}
          <motion.path
            d="M 56 16 C 70 16 72 38 56 46 C 40 54 42 74 56 74 C 70 74 70 54 56 46 C 42 38 42 16 56 16 Z"
            fill="none"
            stroke="#FAF8F3"
            strokeWidth="2.4"
            animate={
              isOpening
                ? { pathLength: 0, opacity: 0 }
                : { pathLength: 1, opacity: 1 }
            }
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
          {/* Red contrast spiral stripe on string */}
          <motion.path
            d="M 56 16 C 70 16 72 38 56 46 C 40 54 42 74 56 74 C 70 74 70 54 56 46 C 42 38 42 16 56 16 Z"
            fill="none"
            stroke="#C62828"
            strokeWidth="2.4"
            strokeDasharray="2.5 4"
            animate={
              isOpening
                ? { pathLength: 0, opacity: 0 }
                : { pathLength: 1, opacity: 0.9 }
            }
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />

          {/* Dangling tail cord */}
          <motion.path
            d="M 56 68 Q 62 78 52 92"
            fill="none"
            stroke="#FAF8F3"
            strokeWidth="2.2"
            strokeLinecap="round"
            animate={
              isOpening
                ? { opacity: 0, y: 10 }
                : !reduceMotion && isHovered
                ? { d: ["M 56 68 Q 62 78 52 92", "M 56 68 Q 50 78 58 92", "M 56 68 Q 62 78 52 92"] }
                : { d: "M 56 68 Q 62 78 52 92" }
            }
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 56 68 Q 62 78 52 92"
            fill="none"
            stroke="#C62828"
            strokeWidth="2.2"
            strokeDasharray="2 3.5"
            strokeLinecap="round"
            animate={
              isOpening
                ? { opacity: 0, y: 10 }
                : !reduceMotion && isHovered
                ? { d: ["M 56 68 Q 62 78 52 92", "M 56 68 Q 50 78 58 92", "M 56 68 Q 62 78 52 92"] }
                : { d: "M 56 68 Q 62 78 52 92" }
            }
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Top Button (26px cardboard washer) */}
        <div
          className="absolute top-1.5 w-6 h-6 rounded-full bg-[#D8C396] border-2 border-[#9C8052] shadow-sm flex items-center justify-center z-10"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#374151] border border-[#1F2937]" />
        </div>

        {/* Bottom Button (26px cardboard washer) */}
        <div
          className="absolute bottom-1.5 w-6 h-6 rounded-full bg-[#D8C396] border-2 border-[#9C8052] shadow-sm flex items-center justify-center z-10"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#374151] border border-[#1F2937]" />
        </div>
      </div>

      {/* Red Tamper Seal Sticker across Flap Over the String */}
      <motion.div
        animate={
          isOpening
            ? { scale: 0.9, opacity: 0 }
            : !reduceMotion && isHovered
            ? { rotate: -6, y: -2 }
            : { rotate: -4, y: 0 }
        }
        transition={{ duration: 0.3 }}
        className="absolute z-20 h-6 px-3 bg-[#C62828] text-white flex items-center justify-center shadow-md font-mono text-[9px] font-black uppercase tracking-wider text-center"
        style={{
          backgroundColor: "var(--seal-color, #C62828)",
          clipPath: "polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%)",
        }}
      >
        <span>★ EVIDENCE SEALED ★</span>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. THE CARD: A CLOSED EVIDENCE FILE
// ─────────────────────────────────────────────────────────────
function ClosedEvidenceFileCard({
  item,
  index,
  isTouch,
  onOpenReport,
}: {
  item: ProjectItem;
  index: number;
  isTouch: boolean;
  onOpenReport: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Case Number: SY-2026-001 (using year if exists, otherwise 2026)
  const caseNumber = useMemo(() => {
    const yr = item.year || "2026";
    const num = String(item.exhibitNumber).padStart(3, "0");
    return `SY-${yr}-${num}`;
  }, [item.year, item.exhibitNumber]);

  // Debossed category icon
  const CategoryIcon = useMemo(() => getCategoryIcon(item.category), [item.category]);

  // 3D hover tilt & cursor sheen
  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isTouch || reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    cardRef.current.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);

    const rx = ((0.5 - y) * 8).toFixed(1);
    const ry = ((x - 0.5) * 8).toFixed(1);
    cardRef.current.style.setProperty("--rx", `${rx}deg`);
    cardRef.current.style.setProperty("--ry", `${ry}deg`);
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--rx", "0deg");
    cardRef.current.style.setProperty("--ry", "0deg");
    cardRef.current.style.setProperty("--mx", "50%");
    cardRef.current.style.setProperty("--my", "50%");
    setIsHovered(false);
  };

  // Click / Enter interaction: plays opening animation (<= 450ms)
  const handleTriggerOpen = () => {
    if (reduceMotion) {
      onOpenReport();
      return;
    }
    setIsOpening(true);
    setTimeout(() => {
      onOpenReport();
      setIsOpening(false);
    }, 400);
  };

  return (
    <div className="relative w-full flex justify-center pb-5 pr-5 overflow-visible">
      <motion.button
        ref={cardRef}
        type="button"
        role="button"
        tabIndex={0}
        aria-label={`Open evidence file for ${item.exhibitLetter}: ${item.title}, status ${item.status}`}
        data-cursor="file"
        data-cursor-label="OPEN FILE"
        onClick={handleTriggerOpen}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        initial={
          reduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 26, scale: 0.96 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
        transition={{
          duration: 0.46,
          delay: index * 0.06,
          ease: [0.175, 0.885, 0.32, 1.2],
        }}
        className="group relative w-full max-w-[360px] h-[340px] text-left focus:outline-none focus-visible:ring-3 focus-visible:ring-[#0B1F4B] focus-visible:ring-offset-2 rounded-xl cursor-pointer select-none transition-transform duration-300 ease-out"
        style={{
          transform:
            !reduceMotion && !isTouch && isHovered
              ? "perspective(900px) translateY(-6px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))"
              : "perspective(900px) translateY(0) rotateX(0deg) rotateY(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Second folder sheet peeking out behind cover (stack effect) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#DEC993] to-[#CCA96E] rounded-xl border border-[#8B6B38]/40 translate-x-1.5 translate-y-1.5 rotate-[1.5deg] -z-10 shadow-sm"
          aria-hidden="true"
        />

        {/* Faint white paper interior revealed when opening */}
        <div
          className="absolute inset-1 bg-[#FCFAF7] rounded-lg border border-gray-200 -z-5"
          aria-hidden="true"
        />

        {/* Front Folder Cover (Animated swing when opening) */}
        <motion.div
          animate={
            isOpening
              ? { rotateY: -68, opacity: 0.75 }
              : { rotateY: 0, opacity: 1 }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ transformOrigin: "left center" }}
          className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#E8D8AC] to-[#DCC893] border-t border-l border-white/60 border-b border-r border-[#8B6B38]/40 shadow-[0_1px_2px_rgba(11,31,75,0.1),0_10px_24px_rgba(11,31,75,0.14),0_24px_48px_rgba(11,31,75,0.1)] flex flex-col justify-between p-4 overflow-visible"
        >
          {/* Paper Grain Overlay using SVG filter */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-[0.12] mix-blend-multiply"
            style={{ filter: "url(#manila-paper-grain)" }}
            aria-hidden="true"
          />

          {/* Folder Tab on Top-Left */}
          <div
            className="absolute -top-7 left-3 z-20 flex items-center gap-1.5"
            aria-hidden="true"
          >
            <div className="h-7 px-3 bg-gradient-to-b from-[#EFE0B8] to-[#E2D09F] border-t border-l border-r border-[#8B6B38]/35 rounded-t-lg shadow-2xs flex items-center">
              <span className="font-mono text-[11px] font-black uppercase text-[#0B1F4B] tracking-wider">
                {item.exhibitLetter}
              </span>
            </div>
            {/* Numbered Yellow Evidence Marker Tent */}
            <EvidenceMarkerTent number={item.exhibitNumber} className="-mt-1" />
          </div>

          {/* Faint Horizontal Fold Crease near bottom third */}
          <div
            className="absolute inset-x-0 bottom-24 h-px bg-[#8B6B38]/20 border-b border-white/30"
            aria-hidden="true"
          />

          {/* Faint Debossed Category Watermark Icon */}
          <div
            className="absolute right-5 bottom-14 opacity-[0.08] text-[#0B1F4B] pointer-events-none select-none"
            aria-hidden="true"
          >
            <CategoryIcon className="w-24 h-24 stroke-[1.2]" />
          </div>

          {/* 1. TYPED LABEL: Adhesive Off-White Label with Curled Corner & Barcode */}
          <div
            className="relative p-2.5 sm:p-3 bg-[#FAF8F3] border border-[#0B1F4B]/15 rounded shadow-sm text-[#0B1F4B] text-[10px] leading-tight select-none"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
            }}
          >
            {/* Curled corner visual illusion */}
            <div
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gradient-to-tl from-[#0B1F4B]/20 via-[#FAF8F3] to-white border-t border-l border-[#0B1F4B]/20"
              aria-hidden="true"
            />

            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-['Special_Elite','Courier_Prime',monospace] uppercase tracking-[0.04em]">
              <div>
                <span className="font-bold opacity-60">CASE NO: </span>
                <span className="font-black">{caseNumber}</span>
              </div>
              <div>
                <span className="font-bold opacity-60">ITEM NO: </span>
                <span className="font-black">{item.exhibitLetter}</span>
              </div>
              <div className="col-span-2 truncate">
                <span className="font-bold opacity-60">CATEGORY: </span>
                <span className="font-semibold">{item.category}</span>
              </div>
              <div className="col-span-2">
                <span className="font-bold opacity-60">STATUS: </span>
                <span className="font-semibold">{item.status}</span>
              </div>
            </div>

            {/* Barcode Strip seeded from case number */}
            <div className="mt-1.5 pt-1 border-t border-dashed border-[#0B1F4B]/20 flex items-center justify-between">
              <BarcodeSVG seed={caseNumber} />
              <span className="text-[7.5px] font-mono tracking-widest opacity-65">
                *{caseNumber}*
              </span>
            </div>
          </div>

          {/* 2. TITLE STRIP: Cream Paper Strip Taped On */}
          <div className="relative my-auto py-2">
            <div className="relative px-3.5 py-2.5 bg-[#FFFDF7] border-y border-[#0B1F4B]/15 shadow-2xs">
              {/* Left Tape */}
              <div
                className="absolute -top-1.5 left-2 w-5 h-2.5 bg-[#FFD21F]/40 transform -rotate-6 border border-yellow-600/20"
                aria-hidden="true"
              />
              {/* Right Tape */}
              <div
                className="absolute -top-1.5 right-2 w-5 h-2.5 bg-[#FFD21F]/40 transform rotate-6 border border-yellow-600/20"
                aria-hidden="true"
              />
              <h3 className="font-display font-bold text-lg sm:text-[20px] leading-[1.25] text-[#0B1F4B] tracking-tight line-clamp-2">
                {item.title}
              </h3>
            </div>
          </div>

          {/* 4. CLOSURE: Button-and-String Tie with Red Tamper Seal */}
          <FolderTieClosure isHovered={isHovered} isOpening={isOpening} />

          {/* Bottom Row: 6. Open Cue (Left) & 5. Status Stamp (Right Overlapping Edge) */}
          <div className="relative flex items-end justify-between pt-1">
            {/* Open Cue: Typewriter 11px muted navy */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#0B1F4B]/70 tracking-wider">
              <Search className="w-3.5 h-3.5" />
              <span>OPEN FILE</span>
            </div>

            {/* 5. Status Stamp: Overlapping cover bottom-right edge by 16px, NEVER clipped */}
            {item.status && (
              <div className="absolute -bottom-3 -right-4 z-30">
                <CaseFolderStatusStamp status={item.status} />
              </div>
            )}
          </div>

          {/* Cursor Glossy Sheen overlay */}
          {!reduceMotion && !isTouch && (
            <div
              className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                background:
                  "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 50%, transparent 75%)",
              }}
              aria-hidden="true"
            />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. THE OPENED FILE (FORENSIC REPORT MODAL)
// ─────────────────────────────────────────────────────────────
function ForensicReportModal({
  item,
  onClose,
  onNavigate,
  hasPrev,
  hasNext,
  currentIndex,
  totalCount,
}: {
  item: ProjectItem;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalCount: number;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Focus trap & key navigation
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onNavigate("prev");
      else if (e.key === "ArrowRight" && hasNext) onNavigate("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNavigate, hasPrev, hasNext]);

  const caseNumber = useMemo(() => {
    const yr = item.year || "2026";
    const num = String(item.exhibitNumber).padStart(3, "0");
    return `SY-${yr}-${num}`;
  }, [item.year, item.exhibitNumber]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-title"
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 md:p-8"
    >
      {/* Dimmed blurred backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0B1F4B]/65 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Manila Folder Frame (12px manila border) around white paper sheet */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#E8D8AC] to-[#DCC893] p-3 sm:p-4 rounded-2xl shadow-[0_24px_60px_rgba(11,31,75,0.4)] border border-[#8B6B38]/40 overflow-hidden"
      >
        {/* Inner White Paper Sheet resting inside the manila frame */}
        <div className="relative flex-1 flex flex-col bg-[#FCFAF7] text-[#0B1F4B] rounded-xl border border-[#0B1F4B]/15 overflow-hidden shadow-inner">
          {/* Top Header Strip with small torn piece of red seal tape */}
          <div className="relative flex items-center justify-between px-5 sm:px-7 py-3 bg-[#FAF8F3] border-b border-[#0B1F4B]/15">
            {/* Torn red seal tape piece */}
            <div
              className="absolute top-0 left-8 w-12 h-2 bg-[#C62828] transform -rotate-1 shadow-2xs"
              style={{
                clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
              }}
              aria-hidden="true"
            />

            <div className="flex items-center gap-3 pt-1">
              <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-[#0B1F4B] uppercase">
                FORENSIC REPORT · {item.exhibitLetter}
              </span>
              <span className="text-[11px] font-mono text-[#0B1F4B]/60 hidden sm:inline">
                [{caseNumber}] · ({currentIndex + 1} of {totalCount})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center mr-2">
                <button
                  type="button"
                  onClick={() => onNavigate("prev")}
                  disabled={!hasPrev}
                  aria-label="Previous exhibit"
                  className="p-1 rounded text-[#0B1F4B] hover:bg-[#FFD21F] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("next")}
                  disabled={!hasNext}
                  aria-label="Next exhibit"
                  className="p-1 rounded text-[#0B1F4B] hover:bg-[#FFD21F] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close forensic report"
                className="p-1.5 rounded-full text-[#0B1F4B] hover:bg-[#0B1F4B] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dossier Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
            {/* Title & Status Stamp */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0B1F4B]/10">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#E1F5FE] text-[#0B1F4B] border border-[#0B1F4B]/15 uppercase mb-1">
                  {item.category}
                </span>
                <h2
                  id="report-title"
                  className="text-2xl sm:text-3xl font-display font-extrabold text-[#0B1F4B] tracking-tight"
                >
                  {item.title}
                </h2>
              </div>

              {item.status && <CaseFolderStatusStamp status={item.status} />}
            </div>

            {/* WANTED Poster style block if Problem column exists */}
            {item.problem && (
              <div className="p-4 rounded-xl border-2 border-dashed border-[#0B1F4B]/35 bg-[#FFD21F]/15">
                <div className="flex items-center gap-1.5 text-xs font-mono font-black uppercase text-[#0B1F4B] mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#0B1F4B]" />
                  <span>WANTED: THE PROBLEM STATEMENT</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-[#0B1F4B]/90">
                  {item.problem}
                </p>
                <div className="mt-2 text-xs font-mono font-bold text-[#0B1F4B]/80 uppercase">
                  BROUGHT TO JUSTICE BY: {item.title}
                </div>
              </div>
            )}

            {/* Two Column Layout on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: METHOD & VERDICT */}
              <div className={cn("space-y-5", item.screenshots.length > 0 ? "lg:col-span-7" : "lg:col-span-12")}>
                {/* METHOD: Full description + Bracketed SIH/other note */}
                <div>
                  <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#0B1F4B]/70 mb-1.5">
                    METHOD & FINDINGS
                  </h4>
                  <p className="text-sm sm:text-base font-medium leading-relaxed text-[#0B1F4B]/85">
                    {item.descriptionMain}
                  </p>
                  {item.descriptionNote && (
                    <p className="mt-2 text-xs italic font-mono text-[#1A3A7A]">
                      {item.descriptionNote}
                    </p>
                  )}
                </div>

                {/* VERDICT: Result if exists */}
                {item.result && (
                  <div className="p-3.5 rounded-lg bg-white border border-[#0B1F4B]/15 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-black uppercase text-[#0B1F4B]/60">
                        FINAL VERDICT / IMPACT
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/30">
                        CASE CLOSED
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#0B1F4B]">
                      {item.result}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: EVIDENCE (Screenshots if any exist) */}
              {item.screenshots.length > 0 && (
                <div className="lg:col-span-5 space-y-3">
                  <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#0B1F4B]/70">
                    EXHIBIT EVIDENCE PHOTOGRAPHS
                  </h4>
                  <div className="space-y-3">
                    {item.screenshots.map((shot, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-white rounded border border-[#0B1F4B]/20 shadow-sm"
                      >
                        <img
                          src={shot}
                          alt={`Evidence photograph for ${item.title}`}
                          loading="lazy"
                          className="w-full aspect-[16/10] object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* EVIDENCE: Technologies Deployed (Tech Stack Chips) */}
            <div>
              <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#0B1F4B]/70 mb-2">
                TECHNOLOGIES DEPLOYED
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#E1F5FE] text-[#0B1F4B] border border-[#0B1F4B]/15"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* REPOSITORY: GitHub Button OR Confidential Classified Box */}
            <div className="pt-4 border-t border-[#0B1F4B]/10 flex flex-wrap items-center gap-3">
              {item.isConfidential && item.confidentialMessage ? (
                /* Full confidential message exactly as written in classified box, NO link */
                <div className="w-full p-3.5 rounded-lg border border-dashed border-[#0B1F4B]/40 bg-[#FFD21F]/15">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-black uppercase text-[#0B1F4B] mb-1">
                    <Lock className="w-3.5 h-3.5 text-[#0B1F4B]" />
                    <span>CONFIDENTIAL EXHIBIT</span>
                  </div>
                  <p className="text-xs italic text-[#0B1F4B] font-medium leading-relaxed">
                    {item.confidentialMessage}
                  </p>
                </div>
              ) : item.githubLink ? (
                <a
                  href={item.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0B1F4B] hover:bg-[#FFD21F] hover:text-[#0B1F4B] transition-all shadow-sm"
                >
                  <GitHubMark />
                  <span>View Source on GitHub</span>
                </a>
              ) : null}

              {item.liveUrl && (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#0B1F4B] bg-white border border-[#0B1F4B]/30 hover:bg-[#FFD21F] hover:border-[#FFD21F] transition-all shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{item.linkLabel || "Live Demonstration"}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Case Folder Skeleton (used during initial load)
function CaseFolderSkeleton() {
  return (
    <div className="relative w-full max-w-[360px] h-[340px] mx-auto bg-[#E8D8AC]/60 rounded-xl border border-[#8B6B38]/30 p-4 animate-pulse flex flex-col justify-between">
      <div className="h-6 w-24 bg-[#0B1F4B]/10 rounded -mt-6 ml-2" />
      <div className="h-20 bg-white/70 rounded p-2 space-y-2">
        <div className="h-3 w-3/4 bg-[#0B1F4B]/10 rounded" />
        <div className="h-3 w-1/2 bg-[#0B1F4B]/10 rounded" />
      </div>
      <div className="h-14 bg-white/80 rounded" />
      <div className="h-10 bg-white/50 rounded" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION CONTAINER: Evidence Locker
// ─────────────────────────────────────────────────────────────
export function ProjectsEvidenceLocker() {
  const { items, isLoading } = useProjectsData();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const sectionHeadingRef = useRef<HTMLDivElement | null>(null);
  const firstNewlyRevealedRef = useRef<HTMLDivElement | null>(null);
  const seeMoreBtnId = useId();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouchDev =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setIsTouch(isTouchDev);
    }
  }, []);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [items, selectedCategory]);

  // Lead exhibit (only if row has featured = true)
  const leadExhibit = useMemo(() => {
    return items.find((p) => p.featured) || null;
  }, [items]);

  // Non-lead items for 3-card grid
  const gridPoolItems = useMemo(() => {
    if (!leadExhibit) return filteredItems;
    return filteredItems.filter((p) => p.id !== leadExhibit.id);
  }, [filteredItems, leadExhibit]);

  // Limit to INITIAL_VISIBLE = 3
  const visibleCount = isExpanded
    ? gridPoolItems.length
    : Math.min(INITIAL_VISIBLE, gridPoolItems.length);

  const visibleItems = useMemo(
    () => gridPoolItems.slice(0, visibleCount),
    [gridPoolItems, visibleCount]
  );

  const hiddenCount = Math.max(0, gridPoolItems.length - INITIAL_VISIBLE);
  const showToggle = gridPoolItems.length > INITIAL_VISIBLE;

  // Category filter tabs
  const categoryTabs = useMemo(() => {
    const distinct = Array.from(new Set(items.map((p) => p.category).filter(Boolean)));
    return ["All", ...distinct];
  }, [items]);

  const handleTabChange = (cat: string) => {
    setSelectedCategory(cat);
    setIsExpanded(false);
  };

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setLiveAnnouncement(`${hiddenCount} more exhibits shown`);
      setTimeout(() => {
        firstNewlyRevealedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    } else {
      setIsExpanded(false);
      setLiveAnnouncement(`Collapsed to first ${INITIAL_VISIBLE} exhibits`);
      sectionHeadingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Active project for report modal
  const activeIndex = filteredItems.findIndex((p) => p.id === selectedProjectId);
  const activeProject = activeIndex >= 0 ? filteredItems[activeIndex] : null;

  const handleModalNavigate = (direction: "prev" | "next") => {
    if (activeIndex < 0) return;
    const targetIdx = direction === "prev" ? activeIndex - 1 : activeIndex + 1;
    if (targetIdx >= 0 && targetIdx < filteredItems.length) {
      const targetProj = filteredItems[targetIdx];
      if (targetProj) {
        setSelectedProjectId(targetProj.id);
        if (targetIdx >= INITIAL_VISIBLE && !isExpanded) {
          setIsExpanded(true);
        }
      }
    }
  };

  return (
    <div className="relative w-full bg-transparent py-12 sm:py-16 overflow-hidden">
      {/* Shared SVG Filters & Gradients (defined once) */}
      <SharedEvidenceDefs />

      {/* Fingerprint Watermark SVG behind grid */}
      <FingerprintWatermark />

      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Eyebrow */}
        <div ref={sectionHeadingRef} className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#0B1F4B]/70 mb-2">
            PROJECTS
          </p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Things I've{" "}
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              built
            </span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm font-mono font-semibold text-[#1A3A7A] uppercase tracking-wider">
            EVIDENCE LOCKER · {items.length} EXHIBITS
          </p>
        </div>

        {/* Evidence-Label Filter Tabs */}
        {categoryTabs.length > 1 && (
          <div
            className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-10 sm:mb-12"
            role="tablist"
            aria-label="Filter exhibits by category"
          >
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs border",
                    isActive
                      ? "bg-[#0B1F4B] text-white border-[#0B1F4B] shadow-md -translate-y-0.5"
                      : "bg-white/90 text-[#0B1F4B] border-white/80 hover:bg-white hover:-translate-y-0.5 hover:shadow-xs"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full border border-current",
                      isActive ? "bg-white" : "bg-transparent"
                    )}
                    aria-hidden="true"
                  />
                  <span>{tab}</span>
                  {tab === "All" && (
                    <span className="ml-1 opacity-60">({items.length})</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Optional Lead Exhibit Card (if featured = true) */}
        {leadExhibit &&
          (selectedCategory === "All" ||
            leadExhibit.category.toLowerCase() === selectedCategory.toLowerCase()) && (
            <div className="mb-12 flex justify-center">
              <ClosedEvidenceFileCard
                item={leadExhibit}
                index={0}
                isTouch={isTouch}
                onOpenReport={() => setSelectedProjectId(leadExhibit.id)}
              />
            </div>
          )}

        {/* Closed Evidence File Cards Grid (3 cols desktop, 2 cols tablet, 1 col mobile) */}
        <div
          id="evidence-locker-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-items-center"
        >
          {visibleItems.length > 0 ? (
            visibleItems.map((item, idx) => {
              const isNewlyRevealed = isExpanded && idx === INITIAL_VISIBLE;
              const isThirdCardTablet = visibleItems.length === 3 && idx === 2;

              return (
                <div
                  key={item.id}
                  ref={isNewlyRevealed ? firstNewlyRevealedRef : undefined}
                  className={cn(
                    "w-full flex justify-center",
                    isThirdCardTablet && "md:col-span-2 lg:col-span-1"
                  )}
                >
                  <ClosedEvidenceFileCard
                    item={item}
                    index={idx}
                    isTouch={isTouch}
                    onOpenReport={() => setSelectedProjectId(item.id)}
                  />
                </div>
              );
            })
          ) : isLoading ? (
            Array.from({ length: INITIAL_VISIBLE }).map((_, i) => (
              <CaseFolderSkeleton key={i} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center space-y-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#0B1F4B]/10 p-8">
              <FileSearch className="w-10 h-10 mx-auto text-[#0B1F4B]/50" />
              <p className="text-base font-bold text-[#0B1F4B]">
                Evidence is being collected
              </p>
              <p className="text-xs text-[#0B1F4B]/65 font-medium max-w-md mx-auto">
                No exhibits filed under this category. Check back shortly as fresh items sync from the locker.
              </p>
            </div>
          )}
        </div>

        {/* "See more evidence (+N)" Toggle Button */}
        {showToggle && (
          <div className="mt-12 sm:mt-14 flex justify-center">
            <button
              id={seeMoreBtnId}
              type="button"
              onClick={handleToggleExpand}
              aria-expanded={isExpanded}
              aria-controls="evidence-locker-grid"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-mono font-bold tracking-wider uppercase bg-white text-[#0B1F4B] border-2 border-[#0B1F4B] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFD21F] hover:border-[#FFD21F] hover:shadow-[0_0_20px_rgba(255,210,31,0.5)] active:translate-y-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4B]"
            >
              {isExpanded ? (
                <>
                  <span>Show fewer</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>See more evidence (+{hiddenCount})</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Forensic Report Modal (Inside of the case file) */}
      <AnimatePresence>
        {activeProject && (
          <ForensicReportModal
            item={activeProject}
            currentIndex={activeIndex}
            totalCount={filteredItems.length}
            hasPrev={activeIndex > 0}
            hasNext={activeIndex < filteredItems.length - 1}
            onClose={() => setSelectedProjectId(null)}
            onNavigate={handleModalNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
