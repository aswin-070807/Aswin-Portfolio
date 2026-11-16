import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  type ServiceRecordItem,
  getOrgMonogram,
} from "@/data/experienceFallback";
import { useExperienceData } from "@/lib/experienceData";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 3;

// Shared SVG Definitions for paper grain texture & stamp bleed
function SharedServiceRecordDefs() {
  return (
    <svg className="sr-only" aria-hidden="true" width="0" height="0">
      <defs>
        {/* Paper Grain filter for duty log sheet */}
        <filter id="log-paper-grain" x="0%" y="0%" width="100%" height="100%">
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
        <filter id="service-stamp-bleed" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.16"
            numOctaves="2"
            result="stampNoise"
          />
          <feDisplacementMap in="SourceGraphic" in2="stampNoise" scale="1.8" />
        </filter>

        {/* Metal gradient for lanyard clip & swivel */}
        <linearGradient id="lanyard-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E5E7EB" />
          <stop offset="70%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#6B7280" />
        </linearGradient>
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
    for (let i = 0; i < 24; i++) {
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

// Status Rubber Stamp for Duty Log (ON DUTY / ASSIGNMENT COMPLETE)
function ServiceDutyStamp({
  status,
  className,
}: {
  status: "ON DUTY" | "ASSIGNMENT COMPLETE";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const isOngoing = status === "ON DUTY";

  return (
    <motion.div
      initial={
        reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.4, rotate: -15 }
      }
      animate={{ opacity: 1, scale: 1, rotate: -10 }}
      transition={{ duration: 0.35, delay: 0.15, ease: [0.175, 0.885, 0.32, 1.25] }}
      className={cn(
        "inline-flex flex-col items-center justify-center text-center font-mono font-black tracking-[0.12em] uppercase select-none pointer-events-none rounded px-3 py-1.5 min-h-[44px] z-20 shadow-md",
        isOngoing
          ? "bg-white text-[#0B1F4B] border-2 border-[#0B1F4B]"
          : "bg-[#FFD21F] text-[#0B1F4B] border-2 border-[#0B1F4B]",
        className
      )}
      style={{
        filter: "url(#service-stamp-bleed)",
        boxShadow: "inset 0 0 0 1.5px currentColor",
        mixBlendMode: "multiply",
      }}
    >
      <span className="text-[12px] sm:text-[13px] leading-tight font-black px-1">
        {status}
      </span>
    </motion.div>
  );
}

// Lanyard Straps and Metal Clip hanging from top
function AgencyLanyard({
  isHovered,
  className,
}: {
  isHovered: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("relative w-full h-14 sm:h-16 flex justify-center pointer-events-none select-none z-10", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 64"
        className="w-28 sm:w-32 h-full overflow-visible drop-shadow-[0_4px_6px_rgba(11,31,75,0.25)]"
      >
        {/* Left Navy Strap */}
        <polygon
          points="20,0 36,0 56,44 48,44"
          fill="#0B1F4B"
          stroke="#1A3A7A"
          strokeWidth="0.8"
        />
        {/* Right Navy Strap */}
        <polygon
          points="100,0 84,0 64,44 72,44"
          fill="#0B1F4B"
          stroke="#1A3A7A"
          strokeWidth="0.8"
        />

        {/* Small Yellow Pattern on Straps */}
        <line x1="28" y1="2" x2="52" y2="42" stroke="#FFD21F" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
        <line x1="92" y1="2" x2="68" y2="42" stroke="#FFD21F" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />

        {/* Metal Clip Ring & Swivel Mechanism */}
        <circle cx="60" cy="45" r="5" fill="none" stroke="url(#lanyard-metal-grad)" strokeWidth="2.5" />
        <rect
          x="54"
          y="48"
          width="12"
          height="12"
          rx="2"
          fill="url(#lanyard-metal-grad)"
          stroke="#4B5563"
          strokeWidth="1"
        />
        {/* Clasp Loop that passes through badge slot */}
        <path
          d="M 57 60 C 57 65 63 65 63 60"
          fill="none"
          stroke="url(#lanyard-metal-grad)"
          strokeWidth="2.2"
        />
      </svg>
    </div>
  );
}

// Metal Binder Clip at top of Duty Log Sheet
function DutyLogBinderClip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute -top-3.5 left-10 z-20 flex flex-col items-center pointer-events-none select-none drop-shadow-md",
        className
      )}
      aria-hidden="true"
    >
      <div className="w-9 h-4 bg-[#1F2937] rounded-sm border border-black/40 shadow-xs" />
      <div className="w-6 h-2.5 border-x-2 border-b-2 border-gray-400 rounded-b" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AGENCY ID BADGE (Left Column)
// ─────────────────────────────────────────────────────────────
function AgencyIdBadge({
  item,
  isTouch,
}: {
  item: ServiceRecordItem;
  isTouch: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  const monogram = useMemo(() => getOrgMonogram(item.organisation), [item.organisation]);

  // Hover 3D tilt & cursor sheen
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouch || reduceMotion || !badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    badgeRef.current.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    badgeRef.current.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  };

  const handlePointerLeave = () => {
    if (!badgeRef.current) return;
    badgeRef.current.style.setProperty("--mx", "50%");
    badgeRef.current.style.setProperty("--my", "50%");
    setIsHovered(false);
  };

  return (
    <div
      className="relative flex flex-col items-center w-full max-w-[280px] sm:max-w-[260px] mx-auto select-none"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      {/* Lanyard Strap & Clip */}
      <AgencyLanyard isHovered={isHovered} />

      {/* ID Badge Card Body */}
      <motion.div
        ref={badgeRef}
        animate={
          !reduceMotion && isHovered
            ? { y: -4, rotate: [-1.5, 1.5, -1.5] }
            : { y: 0, rotate: 0 }
        }
        transition={
          isHovered
            ? { rotate: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }, y: { duration: 0.25 } }
            : { duration: 0.3 }
        }
        style={{ transformOrigin: "top center" }}
        className="relative w-full min-h-[340px] rounded-xl bg-white border border-[#0B1F4B]/15 shadow-[0_1px_2px_rgba(11,31,75,0.1),0_10px_24px_rgba(11,31,75,0.14),0_24px_48px_rgba(11,31,75,0.1)] flex flex-col justify-between overflow-hidden text-[#0B1F4B]"
      >
        {/* Top Slot Hole for Clip */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-[#1F2937] border border-black/40 z-20 shadow-inner" />

        {/* Navy Header Band: ORGANISATION in white bold uppercase */}
        <div className="pt-6 pb-2.5 px-3 bg-[#0B1F4B] text-white text-center">
          <h4 className="font-mono text-xs sm:text-[13px] font-black uppercase tracking-wider truncate">
            {item.organisation}
          </h4>
        </div>
        {/* Thin Yellow Stripe */}
        <div className="h-1 bg-[#FFD21F] w-full" />

        {/* Badge Center: Photo / Insignia Monogram Area */}
        <div className="p-3.5 flex flex-col items-center flex-1 justify-between">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-[#0B1F4B] border-2 border-[#FFD21F] shadow-sm flex items-center justify-center overflow-hidden my-1">
            {item.logo ? (
              <img
                src={item.logo}
                alt={`${item.organisation} logo`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#FFD21F] tracking-tight">
                {monogram}
              </span>
            )}
          </div>

          {/* Typed Fields (11px uppercase, .04em letter-spacing) */}
          <div className="w-full space-y-1.5 font-['Special_Elite','Courier_Prime',monospace] text-[10.5px] sm:text-[11px] leading-tight uppercase tracking-[0.04em]">
            <div className="border-b border-[#0B1F4B]/10 pb-1">
              <span className="font-bold opacity-60">POSITION: </span>
              <span className="font-black text-[#0B1F4B]">{item.role}</span>
            </div>

            {item.validFrom && (
              <div className="flex justify-between border-b border-[#0B1F4B]/10 pb-0.5">
                <span className="font-bold opacity-60">VALID FROM: </span>
                <span className="font-semibold">{item.validFrom}</span>
              </div>
            )}

            {item.validTo ? (
              <div className="flex justify-between border-b border-[#0B1F4B]/10 pb-0.5">
                <span className="font-bold opacity-60">VALID TO: </span>
                <span className="font-semibold">{item.validTo}</span>
              </div>
            ) : item.rawPeriod ? (
              <div className="flex justify-between border-b border-[#0B1F4B]/10 pb-0.5">
                <span className="font-bold opacity-60">PERIOD: </span>
                <span className="font-semibold">{item.rawPeriod}</span>
              </div>
            ) : null}

            <div className="flex justify-between border-b border-[#0B1F4B]/10 pb-0.5">
              <span className="font-bold opacity-60">ID NO.: </span>
              <span className="font-mono font-black">{item.idNumber}</span>
            </div>

            {item.status && (
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-bold opacity-60">STATUS: </span>
                <span className="inline-flex items-center gap-1 font-bold">
                  {item.status === "ON DUTY" ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                      <span className="text-[#16A34A]">ON DUTY</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#0B1F4B]" />
                      <span className="text-[#0B1F4B]">ASSIGNED</span>
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Barcode at bottom of badge */}
          <div className="w-full pt-2 border-t border-dashed border-[#0B1F4B]/20 flex flex-col items-center">
            <BarcodeSVG seed={item.idNumber} />
            <span className="mt-0.5 text-[7.5px] font-mono tracking-widest opacity-65">
              *{item.idNumber}*
            </span>
          </div>
        </div>

        {/* Soft glossy diagonal sheen on hover */}
        {!reduceMotion && !isTouch && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background:
                "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 50%, transparent 75%)",
            }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DUTY LOG SHEET (Right Column)
// ─────────────────────────────────────────────────────────────
function DutyLogSheet({
  item,
}: {
  item: ServiceRecordItem;
}) {
  return (
    <div
      className="relative flex-1 min-h-[340px] rounded-xl border border-[#0B1F4B]/15 shadow-[0_1px_2px_rgba(11,31,75,0.1),0_10px_24px_rgba(11,31,75,0.14),0_24px_48px_rgba(11,31,75,0.1)] p-5 sm:p-7 flex flex-col justify-between overflow-visible text-[#0B1F4B] transform -rotate-[0.6deg]"
      style={{
        backgroundColor: "#FBF7EC",
        backgroundImage: `
          linear-gradient(90deg, transparent 38px, rgba(198, 40, 40, 0.22) 38px, rgba(198, 40, 40, 0.22) 40px, transparent 40px),
          repeating-linear-gradient(transparent, transparent 27px, rgba(11, 31, 75, 0.08) 27px, rgba(11, 31, 75, 0.08) 28px)
        `,
      }}
    >
      {/* Paper Grain Overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-[0.1] mix-blend-multiply"
        style={{ filter: "url(#log-paper-grain)" }}
        aria-hidden="true"
      />

      {/* Metal Binder Clip at Top-Left */}
      <DutyLogBinderClip />

      {/* Header (Typewriter style) */}
      <div className="relative border-b border-[#0B1F4B]/15 pb-3 pl-8 sm:pl-9">
        <div className="flex flex-wrap items-center justify-between gap-2 font-['Special_Elite','Courier_Prime',monospace] text-xs font-black uppercase tracking-wider text-[#0B1F4B]/70">
          <span>DUTY LOG · ASSIGNMENT {String(item.recordNumber).padStart(2, "0")}</span>
          <span className="text-[11px] font-normal">{item.rawPeriod}</span>
        </div>

        {/* Role as bold navy title */}
        <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold text-[#0B1F4B] tracking-tight leading-snug">
          {item.role}
        </h3>
        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#1A3A7A]">
          {item.organisation}
        </p>
      </div>

      {/* Log Entries: each starts with LOG 01, LOG 02... in muted navy */}
      <div className="relative py-4 pl-8 sm:pl-9 space-y-3 flex-1">
        {item.logEntries.map((entry, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            {/* Small yellow check mark */}
            <div className="mt-0.5 w-4 h-4 rounded-full bg-[#FFD21F] text-[#0B1F4B] flex items-center justify-center shrink-0 shadow-2xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>

            <div className="flex-1">
              <span className="font-['Special_Elite','Courier_Prime',monospace] text-xs font-bold text-[#1A3A7A] uppercase mr-2 tracking-wider">
                LOG {String(idx + 1).padStart(2, "0")}:
              </span>
              <span className="text-sm sm:text-[15px] font-medium leading-relaxed text-[#0B1F4B]">
                {entry}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Area: Link Buttons & Status Stamp */}
      <div className="relative pt-3 border-t border-[#0B1F4B]/10 pl-8 sm:pl-9 flex flex-wrap items-center justify-between gap-3">
        {/* Action Link Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          {/* Extracted Links from Description (e.g. Mentor Link) */}
          {item.extractedLinks.map((link, lIdx) => (
            <a
              key={lIdx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0B1F4B] bg-white border border-[#0B1F4B]/30 hover:bg-[#FFD21F] hover:border-[#FFD21F] transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4B]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </a>
          ))}

          {/* Optional Direct Link column */}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0B1F4B] bg-white border border-[#0B1F4B]/30 hover:bg-[#FFD21F] hover:border-[#FFD21F] transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4B]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{item.linkLabel || "View Assignment"}</span>
            </a>
          )}

          {/* Optional Certificate Link column */}
          {item.certificateLink && (
            <a
              href={item.certificateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#0B1F4B] hover:bg-[#FFD21F] hover:text-[#0B1F4B] transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4B]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </a>
          )}
        </div>

        {/* Rubber-ink Status Stamp in bottom-right corner */}
        {item.status && (
          <div className="ml-auto">
            <ServiceDutyStamp status={item.status} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ASSIGNMENT ROW: ID Badge + Duty Log Sheet + Tape Pin
// ─────────────────────────────────────────────────────────────
function ServiceAssignmentRow({
  item,
  index,
  isTouch,
}: {
  item: ServiceRecordItem;
  index: number;
  isTouch: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <article
      data-assignment-row
      className="relative flex items-stretch gap-6 sm:gap-8 lg:gap-10"
    >
      {/* Crime-scene Tape Timeline Pin marker */}
      <div
        className="absolute -left-6 sm:-left-8 lg:-left-9 top-10 -translate-x-1/2 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="w-3.5 h-3.5 rounded-full bg-[#0B1F4B] border-2 border-white shadow-[0_2px_6px_rgba(11,31,75,0.4)] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-white" />
        </div>
      </div>

      {/* Responsive Row Layout:
          Desktop: Badge (260px) + Sheet (flexible)
          Mobile: Stacked cleanly */}
      <motion.div
        initial={
          reduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 32 }
        }
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 sm:gap-8 items-stretch"
      >
        {/* Left: Agency ID Badge */}
        <div className="h-full flex flex-col">
          <AgencyIdBadge item={item} isTouch={isTouch} />
        </div>

        {/* Right: Typed Duty Log Sheet */}
        <div className="h-full flex flex-col">
          <DutyLogSheet item={item} />
        </div>
      </motion.div>
    </article>
  );
}

// Skeleton during initial loading
function ServiceRecordSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 sm:gap-8 animate-pulse mb-10">
      <div className="h-[380px] bg-white/40 rounded-xl border border-[#0B1F4B]/10 p-4" />
      <div className="h-[380px] bg-[#FBF7EC]/60 rounded-xl border border-[#0B1F4B]/10 p-6 space-y-4">
        <div className="h-6 w-48 bg-[#0B1F4B]/10 rounded" />
        <div className="h-4 w-3/4 bg-[#0B1F4B]/10 rounded" />
        <div className="h-4 w-full bg-[#0B1F4B]/10 rounded" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPERIENCE SECTION CONTAINER
// ─────────────────────────────────────────────────────────────
export function ExperienceServiceRecord() {
  const { items, isLoading } = useExperienceData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const sectionRef = useRef<HTMLDivElement | null>(null);
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

  const visibleCount = isExpanded
    ? items.length
    : Math.min(INITIAL_VISIBLE, items.length);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const hiddenCount = Math.max(0, items.length - INITIAL_VISIBLE);
  const showToggle = items.length > INITIAL_VISIBLE;

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setLiveAnnouncement(`${hiddenCount} more assignments shown`);
      setTimeout(() => {
        firstNewlyRevealedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    } else {
      setIsExpanded(false);
      setLiveAnnouncement(`Collapsed to first ${INITIAL_VISIBLE} assignments`);
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      id="experience"
      ref={sectionRef}
      className="relative w-full bg-transparent py-12 sm:py-16 overflow-hidden"
    >
      {/* Shared SVG Filters & Gradients (defined once) */}
      <SharedServiceRecordDefs />

      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Eyebrow */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#0B1F4B]/70 mb-2">
            EXPERIENCE
          </p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Where I've{" "}
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              worked
            </span>
          </h2>

          {/* Service Record Caption */}
          <p className="mt-3 text-xs sm:text-sm font-mono font-semibold text-[#1A3A7A] uppercase tracking-wider">
            SERVICE RECORD · {items.length} ASSIGNMENTS
          </p>
        </div>

        {/* Timeline Container with Yellow Crime-Scene Tape Spine */}
        <div className="relative pl-7 sm:pl-9 lg:pl-10">
          {/* Yellow Crime-Scene Tape Spine Running Down the Left */}
          <div
            className="absolute left-0 top-0 bottom-0 w-3 sm:w-7 bg-[#FFD21F] border-x border-[#0B1F4B]/30 shadow-sm overflow-hidden pointer-events-none select-none z-10"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #0B1F4B 0, #0B1F4B 3px, #FFD21F 3px, #FFD21F 8px)`,
            }}
            aria-hidden="true"
          >
            {/* Center yellow band with vertical text on desktop */}
            <div className="hidden sm:flex absolute inset-0 mx-1 bg-[#FFD21F] flex-col items-center justify-around py-4 text-[8px] font-mono font-black text-[#0B1F4B] tracking-widest uppercase [writing-mode:vertical-rl] opacity-90">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="my-6">
                  SERVICE RECORD ✦
                </span>
              ))}
            </div>
          </div>

          {/* Assignment Rows List */}
          <div className="space-y-10 sm:space-y-12">
            {visibleItems.length > 0 ? (
              visibleItems.map((item, idx) => {
                const isNewlyRevealed = isExpanded && idx === INITIAL_VISIBLE;

                return (
                  <div
                    key={item.id}
                    ref={isNewlyRevealed ? firstNewlyRevealedRef : undefined}
                  >
                    <ServiceAssignmentRow
                      item={item}
                      index={idx}
                      isTouch={isTouch}
                    />
                  </div>
                );
              })
            ) : isLoading ? (
              Array.from({ length: INITIAL_VISIBLE }).map((_, i) => (
                <ServiceRecordSkeleton key={i} />
              ))
            ) : (
              <div className="py-16 text-center space-y-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#0B1F4B]/10 p-8">
                <p className="text-base font-bold text-[#0B1F4B]">
                  Service record is being updated
                </p>
                <p className="text-xs text-[#0B1F4B]/65 font-medium max-w-md mx-auto">
                  New agency assignments are syncing from the record database. Check back shortly.
                </p>
              </div>
            )}
          </div>

          {/* "See more assignments (+N)" Toggle Button */}
          {showToggle && (
            <div className="mt-12 sm:mt-14 flex justify-center">
              <button
                id={seeMoreBtnId}
                type="button"
                onClick={handleToggleExpand}
                aria-expanded={isExpanded}
                aria-controls="service-record-list"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-mono font-bold tracking-wider uppercase bg-white text-[#0B1F4B] border-2 border-[#0B1F4B] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFD21F] hover:border-[#FFD21F] hover:shadow-[0_0_20px_rgba(255,210,31,0.5)] active:translate-y-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4B]"
              >
                {isExpanded ? (
                  <>
                    <span>Show fewer</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>See more assignments (+{hiddenCount})</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
