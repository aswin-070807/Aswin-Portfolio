import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Flag, MessageCircle, Trophy, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   DATA: The 4 Case Conclusion Findings
   Edit card text and metadata here.
   ───────────────────────────────────────────────────────────── */
interface FindingItem {
  id: string;
  findingNumber: string;
  caseNumber: string;
  title: string;
  text: string;
  icon: LucideIcon;
  fastener: "pin" | "paperclip";
  stampColor: "navy" | "gold";
  desktopTilt: number;
  mobileTilt: number;
  stampAngle: number;
}

const FINDINGS_DATA: FindingItem[] = [
  {
    id: "finding-01",
    findingNumber: "FINDING 01",
    caseNumber: "CASE #ASWIN-A",
    title: "Works under pressure",
    text: "I ship working solutions on tight deadlines, with a team depending on me.",
    icon: Trophy,
    fastener: "pin",
    stampColor: "navy",
    desktopTilt: -2,
    mobileTilt: -1,
    stampAngle: -6,
  },
  {
    id: "finding-02",
    findingNumber: "FINDING 02",
    caseNumber: "CASE #ASWIN-A",
    title: "Fast learner",
    text: "15+ certifications across AI, security, DevOps and design.",
    icon: Zap,
    fastener: "paperclip",
    stampColor: "gold",
    desktopTilt: 1.5,
    mobileTilt: 1,
    stampAngle: 7,
  },
  {
    id: "finding-03",
    findingNumber: "FINDING 03",
    caseNumber: "CASE #ASWIN-A",
    title: "Strong communicator",
    text: "Customer-facing experience: clear updates, no surprises.",
    icon: MessageCircle,
    fastener: "pin",
    stampColor: "navy",
    desktopTilt: -1,
    mobileTilt: -0.6,
    stampAngle: -5,
  },
  {
    id: "finding-04",
    findingNumber: "FINDING 04",
    caseNumber: "CASE #ASWIN-A",
    title: "Natural leader",
    text: "Campus Representative at GeeksforGeeks, running workshops.",
    icon: Flag,
    fastener: "paperclip",
    stampColor: "gold",
    desktopTilt: 2,
    mobileTilt: 0.8,
    stampAngle: 6,
  },
];

/* ─────────────────────────────────────────────────────────────
   SVG FASTENERS: Navy Push Pin & Silver Paperclip
   ───────────────────────────────────────────────────────────── */
function NavyPushPin({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        width="28"
        height="32"
        viewBox="0 0 28 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_5px_rgba(11,31,75,0.32)]"
      >
        {/* Soft shadow on paper */}
        <ellipse cx="14" cy="30" rx="4.5" ry="1.6" fill="rgba(11,31,75,0.22)" />
        {/* Needle metal tip entering the card */}
        <path d="M13.2 21.5 L14 29 L14.8 21.5 Z" fill="#64748B" />
        <path d="M13.7 21.5 L14 29 L14.3 21.5 Z" fill="#E2E8F0" />
        {/* Pin bottom collar */}
        <ellipse cx="14" cy="20.5" rx="5.5" ry="2.2" fill="#0B1F4B" />
        <ellipse cx="14" cy="19.5" rx="5.5" ry="2" fill="#1A3A7A" />
        <ellipse cx="13" cy="19" rx="3.5" ry="1.2" fill="rgba(255,255,255,0.2)" />
        {/* Cylindrical stem */}
        <path d="M9.8 12.5 C9.8 16.5 11.2 19.5 14 19.5 C16.8 19.5 18.2 16.5 18.2 12.5 Z" fill="#0B1F4B" />
        <path d="M11 13 C11 16 12.2 18.5 14 18.5 C14.8 18.5 15.6 16.8 15.8 13 Z" fill="#1E3A8A" />
        {/* Flange / ridge */}
        <ellipse cx="14" cy="11.5" rx="7" ry="2.8" fill="#0B1F4B" />
        <path d="M7 11.5 C7 7.5 9.2 4.5 14 4.5 C18.8 4.5 21 7.5 21 11.5 Z" fill="#0E275E" />
        {/* Head rounded cap */}
        <ellipse cx="14" cy="4.5" rx="7" ry="2.6" fill="#1E40AF" />
        <ellipse cx="14" cy="4" rx="5.8" ry="2" fill="#2563EB" />
        {/* Gloss highlight */}
        <ellipse cx="12.5" cy="3.2" rx="2.8" ry="1" fill="rgba(255,255,255,0.7)" />
        <circle cx="11.5" cy="7.5" r="1.2" fill="rgba(255,255,255,0.35)" />
      </svg>
    </div>
  );
}

function SilverPaperclip({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        width="22"
        height="38"
        viewBox="0 0 22 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_3px_4px_rgba(11,31,75,0.25)]"
      >
        {/* Clip cast shadow */}
        <path
          d="M6.5 5 V24 C6.5 28 9.5 31 13 31 C16.5 31 19.5 28 19.5 24 V7.5 C19.5 5 17.5 3 15 3 C12.5 3 10.5 5 10.5 7.5 V22.5 C10.5 24 11.8 25 13 25 C14.2 25 15.5 24 15.5 22.5 V9.5"
          stroke="rgba(11,31,75,0.2)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Main chrome wire */}
        <path
          d="M5.5 4 V23 C5.5 27 8.5 30 12 30 C15.5 30 18.5 27 18.5 23 V6.5 C18.5 4 16.5 2 14 2 C11.5 2 9.5 4 9.5 6.5 V21.5 C9.5 23 10.8 24 12 24 C13.2 24 14.5 23 14.5 21.5 V8.5"
          stroke="url(#caseSilverClipGrad)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner specular line */}
        <path
          d="M5.5 4 V23 C5.5 27 8.5 30 12 30 C15.5 30 18.5 27 18.5 23 V6.5"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="caseSilverClipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="30%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONFIRMED RUBBER STAMP COMPONENT
   ───────────────────────────────────────────────────────────── */
function ConfirmedStamp({
  color,
  angle,
  inView,
  index,
  reduceMotion,
}: {
  color: "navy" | "gold";
  angle: number;
  inView: boolean;
  index: number;
  reduceMotion: boolean;
}) {
  const isNavy = color === "navy";
  const stampColorClass = isNavy
    ? "text-[#0B1F4B] border-[#0B1F4B]"
    : "text-[#E0B400] border-[#E0B400]";

  // Timing: card drops in at index * 0.15s (duration ~0.42s).
  // Stamp slams ~0.3s after card lands.
  const slamDelay = index * 0.15 + 0.42;

  const stampVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 1.6,
      rotate: angle,
    },
    slam: {
      opacity: 0.88,
      scale: [1.6, 0.96, 1],
      rotate: angle,
      transition: {
        delay: slamDelay,
        duration: 0.28,
        times: [0, 0.72, 1],
        ease: "easeOut",
      },
    },
    hover: {
      rotate: [angle, angle - 2.5, angle + 2.5, angle],
      transition: {
        duration: 0.35,
        ease: "easeInOut",
      },
    },
    reduced: {
      opacity: 0.88,
      scale: 1,
      rotate: angle,
      transition: { duration: 0 },
    },
  };

  return (
    <motion.div
      variants={stampVariants}
      initial={reduceMotion ? "reduced" : "hidden"}
      animate={reduceMotion ? "reduced" : inView ? "slam" : "hidden"}
      whileHover={reduceMotion ? undefined : "hover"}
      className={cn(
        "absolute bottom-3 right-3 select-none pointer-events-none z-20",
        stampColorClass,
      )}
      style={{
        transformOrigin: "center center",
        mixBlendMode: "multiply",
        filter: "url(#case-stamp-bleed)",
      }}
      aria-hidden="true"
    >
      <div
        className={cn(
          "relative px-2.5 py-1 rounded-[3px] border-[2px] border-current font-typewriter uppercase text-xs sm:text-[12.5px] font-black tracking-[0.16em]",
        )}
        style={{
          boxShadow: "inset 0 0 0 1.2px currentColor",
        }}
      >
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-[10px]">✔</span>
          <span>CONFIRMED</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   INDEX CARD COMPONENT
   ───────────────────────────────────────────────────────────── */
function IndexCard({
  item,
  index,
  inView,
  isMobile,
  reduceMotion,
}: {
  item: FindingItem;
  index: number;
  inView: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
}) {
  const tilt = isMobile ? item.mobileTilt : item.desktopTilt;
  const slamDelay = index * 0.15 + 0.42;

  // Outer container controls the drop-in animation and hover lift
  const cardDropVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -26,
      rotate: 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: tilt,
      transition: {
        delay: index * 0.15,
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    reduced: {
      opacity: 1,
      y: 0,
      rotate: tilt,
      transition: { duration: 0 },
    },
  };

  // Card shake variant: triggers when the CONFIRMED stamp hits the card
  const shakeVariants: Variants = {
    initial: { x: 0, y: 0 },
    shake: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 1, 0],
      transition: {
        delay: slamDelay + 0.05,
        duration: 0.22,
        ease: "easeInOut",
      },
    },
    reduced: {
      x: 0,
      y: 0,
      transition: { duration: 0 },
    },
  };

  const Icon = item.icon;

  return (
    <motion.li
      variants={cardDropVariants}
      initial={reduceMotion ? "reduced" : "hidden"}
      animate={reduceMotion ? "reduced" : inView ? "visible" : "hidden"}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -6,
              rotate: 0,
              transition: { duration: 0.22, ease: "easeOut" },
            }
      }
      className="relative flex flex-col h-full list-none group"
      style={{
        transformOrigin: "center top",
        willChange: "transform, opacity",
      }}
    >
      {/* Top Fastener (Pin or Paperclip) */}
      {item.fastener === "pin" ? <NavyPushPin /> : <SilverPaperclip />}

      {/* Shake Wrapper (for rubber stamp impact feedback) */}
      <motion.article
        variants={shakeVariants}
        initial={reduceMotion ? "reduced" : "initial"}
        animate={reduceMotion ? "reduced" : inView ? "shake" : "initial"}
        className="relative flex flex-col flex-1 w-full bg-[#FFFDF5] rounded-[5px] border border-[#0B1F4B]/15 overflow-hidden transition-shadow duration-300 shadow-[0_4px_6px_-1px_rgba(11,31,75,0.07),0_12px_28px_-4px_rgba(11,31,75,0.12),0_1px_2px_0_rgba(11,31,75,0.05)] group-hover:shadow-[0_8px_16px_rgba(11,31,75,0.08),0_20px_36px_-6px_rgba(11,31,75,0.18)]"
      >
        {/* Subtle Paper Grain Filter Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply z-[1]"
          style={{ filter: "url(#case-paper-grain)" }}
          aria-hidden="true"
        />

        {/* 1. Header Strip with Red Rule */}
        <header className="relative z-10 px-4 py-2.5 border-b-[1.5px] border-[#EF5350]/75 flex items-center justify-between bg-[#FFFDF5]">
          <span
            className="font-typewriter text-xs font-bold tracking-wider text-[#0B1F4B]"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            {item.findingNumber}
          </span>
          <span
            className="font-typewriter text-[10px] tracking-widest text-[#0B1F4B]/60 font-semibold"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            {item.caseNumber}
          </span>
        </header>

        {/* 2. Card Body with ruled lines on the lower section */}
        <div
          className="relative z-10 flex flex-col flex-1 px-5 pt-4 pb-14"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 25px, rgba(144, 202, 249, 0.4) 25px, rgba(144, 202, 249, 0.4) 26px)",
            backgroundPosition: "0 8px",
          }}
        >
          {/* Circular Outlined Icon Badge */}
          <div className="flex items-center">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[1.5px] border-[#0B1F4B]/20 bg-[#E1F5FE]/60 text-[#0B1F4B] shadow-xs"
              aria-hidden="true"
            >
              <Icon className="h-5 w-5" strokeWidth={2.1} />
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-3 text-lg font-bold text-[#0B1F4B] tracking-tight font-display">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#1A3A7A] font-medium">
            {item.text}
          </p>

          {/* Rubber Stamp CONFIRMED at bottom right */}
          <ConfirmedStamp
            color={item.stampColor}
            angle={item.stampAngle}
            inView={inView}
            index={index}
            reduceMotion={reduceMotion}
          />
        </div>
      </motion.article>
    </motion.li>
  );
}

/* ─────────────────────────────────────────────────────────────
   CASE CONCLUSION / FINDINGS MAIN SECTION
   ───────────────────────────────────────────────────────────── */
export function CaseConclusionFindings() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const reduceMotion = Boolean(useReducedMotion());

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // CASE CLOSED Stamp timing: occurs after all 4 cards and their stamps land
  // 4th stamp finishes at ~ 3 * 0.15 + 0.42 + 0.28 = ~1.15s
  const caseClosedVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 1.6,
      rotate: -6,
    },
    slam: {
      opacity: 0.9,
      scale: [1.6, 0.96, 1],
      rotate: -6,
      transition: {
        delay: 1.25,
        duration: 0.32,
        times: [0, 0.75, 1],
        ease: "easeOut",
      },
    },
    reduced: {
      opacity: 0.9,
      scale: 1,
      rotate: -6,
      transition: { duration: 0 },
    },
  };

  return (
    <section
      id="why"
      ref={sectionRef}
      className="relative w-full bg-transparent py-20 sm:py-24 md:py-28 overflow-hidden select-text"
      aria-label="Case Conclusion: The Findings"
    >
      {/* ─────────────────────────────────────────────────────────────
          SHARED SVG FILTERS (Paper Grain Texture & Stamp Bleed Effect)
          ───────────────────────────────────────────────────────────── */}
      <svg className="sr-only" aria-hidden="true" width="0" height="0">
        <defs>
          {/* Subtle paper grain texture */}
          <filter id="case-paper-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="3"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.04   0 0 0 0 0.12   0 0 0 0 0.3   0 0 0 0.12 0"
            />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>

          {/* Rubber ink stamp rough edges & ink bleed */}
          <filter id="case-stamp-bleed" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.18"
              numOctaves="2"
              result="stampNoise"
            />
            <feDisplacementMap in="SourceGraphic" in2="stampNoise" scale="1.6" />
          </filter>
        </defs>
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          FAINT DOTTED BACKGROUND PATTERN (Identical to Hero, Low Opacity)
          ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(11, 31, 75, 0.16) 1.75px, transparent 1.75px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, black 30%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, black 30%, transparent 95%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* ─────────────────────────────────────────────────────────────
            SECTION HEADER
            ───────────────────────────────────────────────────────────── */}
        <header className="mb-12 sm:mb-14 max-w-2xl text-left">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#1A3A7A]">
            CASE CONCLUSION
          </p>
          <h2 className="text-3xl font-extrabold text-[#0B1F4B] sm:text-4xl md:text-5xl font-display">
            The{" "}
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              findings
            </span>
          </h2>
          <p
            className="mt-3.5 text-sm sm:text-base font-medium text-[#0B1F4B]/80 font-typewriter"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            After reviewing the evidence, four things stand out.
          </p>
        </header>

        {/* ─────────────────────────────────────────────────────────────
            THE 4 INDEX CARDS (Grid: 1 col mobile, 2x2 tablet, 4 cols desktop)
            ───────────────────────────────────────────────────────────── */}
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 md:gap-6 items-stretch"
        >
          {FINDINGS_DATA.map((finding, index) => (
            <IndexCard
              key={finding.id}
              item={finding}
              index={index}
              inView={inView}
              isMobile={isMobile}
              reduceMotion={reduceMotion}
            />
          ))}
        </ul>

        {/* ─────────────────────────────────────────────────────────────
            CASE CLOSED RUBBER STAMP (Centered below cards, slam animation)
            ───────────────────────────────────────────────────────────── */}
        <div className="mt-14 sm:mt-16 flex flex-col items-center justify-center">
          <motion.div
            variants={caseClosedVariants}
            initial={reduceMotion ? "reduced" : "hidden"}
            animate={reduceMotion ? "reduced" : inView ? "slam" : "hidden"}
            className="inline-block select-none pointer-events-none"
            style={{
              transformOrigin: "center center",
              mixBlendMode: "multiply",
              filter: "url(#case-stamp-bleed)",
            }}
            aria-hidden="true"
          >
            <div
              className="relative px-6 sm:px-8 py-3 sm:py-3.5 rounded-[4px] border-[2.8px] border-[#0B1F4B] text-[#0B1F4B] bg-[#FFFDF5]/40 text-center"
              style={{
                boxShadow: "inset 0 0 0 1.5px #0B1F4B",
              }}
            >
              <div
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.26em] font-typewriter text-[#0B1F4B]/80 mb-0.5"
                style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
              >
                OFFICIAL VERDICT • FILE #ASWIN-A
              </div>
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.2em] font-typewriter text-[#0B1F4B] leading-tight py-1"
                style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
              >
                CASE CLOSED
              </div>
              <div
                className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-[0.24em] font-typewriter text-[#0B1F4B]/80 mt-0.5"
                style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
              >
                ★ ALL FINDINGS CONFIRMED &amp; VERIFIED ★
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
