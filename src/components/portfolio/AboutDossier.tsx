import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   DATA OBJECTS (Edit bio text, passport fields, profiles & stamps here)
   ───────────────────────────────────────────────────────────── */

export interface ProfileTagItem {
  id: string;
  name: string;
  url: string;
  ariaLabel: string;
  rotation: number;
}

export const VERIFIED_PROFILES: ProfileTagItem[] = [
  {
    id: "leetcode",
    name: "LEETCODE",
    url: "https://leetcode.com/u/Aswin787",
    ariaLabel: "Open Aswin's LeetCode profile (opens in a new tab)",
    rotation: -2,
  },
  {
    id: "codechef",
    name: "CODECHEF",
    url: "https://www.codechef.com/users/aswina_srit",
    ariaLabel: "Open Aswin's CodeChef profile (opens in a new tab)",
    rotation: 1,
  },
  {
    id: "linkedin",
    name: "LINKEDIN",
    url: "https://www.linkedin.com/in/aswin-a-709091293",
    ariaLabel: "Open Aswin's LinkedIn profile (opens in a new tab)",
    rotation: -1,
  },
];

export const PASSPORT_IDENTITY = {
  headerLeft: "PASSPORT OF THE BUILDER",
  headerRight: "No. ASWIN-A",
  photoSrc: "/assets/aswin.jpg",
  fallbackPhotoSrc: "/assets/hero-aswin.png",
  fields: [
    {
      label: "SURNAME / GIVEN NAME",
      value: "ASWIN A",
    },
    {
      label: "LOCATION",
      value: "TIRUCHIRAPPALLI, TAMIL NADU",
    },
    {
      label: "FIELD OF STUDY",
      value: "B.E. COMPUTER SCIENCE & ENGINEERING",
    },
  ],
  mrzLines: [
    "P<IND<ASWIN<<A<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",
    "CSE<STUDENT<<AI<ENGINEERING<<BUILDER<<<<<<<<",
  ],
};

export const BIO_PARAGRAPHS = [
  {
    id: "how-i-work",
    tabLabel: "HOW I WORK",
    text: "CSE student who learns by building. Give me a messy problem and my first move is to get something working, then break it, fix it, and keep improving it until it holds up. Regular practice on CodeChef and LeetCode gave me the habit of testing my own solutions harder than anyone else would.",
  },
  {
    id: "under-pressure",
    tabLabel: "UNDER PRESSURE",
    text: "Hackathons gave me time management and the ability to prove something under pressure. In a 72-hour build, with the clock running down and a team depending on me, you learn fast what actually matters in a demo. Presenting at an international expo taught me to explain an idea to people who have never heard of it. Across React, Node.js and Python, I build AI tools that stay simple enough for anyone to use.",
  },
  {
    id: "off-the-keyboard",
    tabLabel: "OFF THE KEYBOARD",
    text: "Away from the keyboard, I write poetry, which keeps me honest about words: if a sentence doesn't land, it gets cut. I enjoy leading a team as much as building inside one, and I'm happiest when a messy problem becomes something a person can use in a minute.",
  },
];

export interface VisaStampItem {
  id: string;
  shape: "rect" | "circle" | "rounded-dashed" | "oval";
  inkColor: string; // hex or tailwind class
  title: string;
  mainText: string;
  smallText: string;
  desktopRotation: number;
  mobileRotation: number;
}

export const VISA_STAMPS: VisaStampItem[] = [
  {
    id: "visa-1",
    shape: "rect",
    inkColor: "#0B1F4B", // Navy ink
    title: "OPEN TO",
    mainText: "AI & Software Engineering roles",
    smallText: "Internships and entry-level positions",
    desktopRotation: -6,
    mobileRotation: -2,
  },
  {
    id: "visa-2",
    shape: "circle",
    inkColor: "#C99A00", // Yellow-gold ink
    title: "EXPLORING NOW",
    mainText: "Agentic AI & LLM apps",
    smallText: "Building tools that act, not just answer",
    desktopRotation: 4,
    mobileRotation: 1.5,
  },
  {
    id: "visa-3",
    shape: "rounded-dashed",
    inkColor: "#0B1F4B", // Navy ink
    title: "WORKS BEST IN",
    mainText: "Small teams, fast feedback loops",
    smallText: "Ship early, learn from users",
    desktopRotation: -3,
    mobileRotation: -1.5,
  },
  {
    id: "visa-4",
    shape: "oval",
    inkColor: "#C4452B", // Muted red-orange ink
    title: "SIDE QUEST",
    mainText: "Poetry & writing",
    smallText: "Where the 'cut what doesn't land' habit comes from",
    desktopRotation: 7,
    mobileRotation: 2,
  },
];

/* ─────────────────────────────────────────────────────────────
   FAINT CIRCULAR WATERMARK SEAL (Kept on Right Page Only)
   ───────────────────────────────────────────────────────────── */
function WatermarkSeal() {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-60 sm:h-60 pointer-events-none opacity-[0.06] select-none"
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-[#0B1F4B]">
        <circle cx="100" cy="100" r="92" strokeWidth="2.5" strokeDasharray="6 3" />
        <circle cx="100" cy="100" r="82" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="66" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="44" strokeWidth="1.5" />
        {/* Emblem Stars & Compass */}
        <polygon
          points="100,60 105,74 120,74 108,83 112,97 100,88 88,97 92,83 80,74 95,74"
          fill="#0B1F4B"
          opacity="0.6"
        />
        <text
          x="100"
          y="126"
          textAnchor="middle"
          fontSize="9"
          fontWeight="bold"
          letterSpacing="0.2em"
          fill="#0B1F4B"
        >
          OFFICIAL PASSPORT
        </text>
        <text
          x="100"
          y="138"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="bold"
          letterSpacing="0.16em"
          fill="#0B1F4B"
        >
          • THE BUILDER •
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DARK INK IMMIGRATION SEAL (Left Page Lower-Left Area)
   ───────────────────────────────────────────────────────────── */
function ImmigrationSeal({
  inView,
  reduceMotion,
}: {
  inView: boolean;
  reduceMotion: boolean;
}) {
  const sealVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 1.6,
      rotate: -12,
    },
    slam: {
      opacity: 0.78,
      scale: [1.6, 0.96, 1],
      rotate: -12,
      transition: {
        delay: 0.52,
        duration: 0.28,
        times: [0, 0.72, 1],
        ease: "easeOut",
      },
    },
    reduced: {
      opacity: 0.78,
      scale: 1,
      rotate: -12,
      transition: { duration: 0 },
    },
  };

  return (
    <motion.div
      variants={sealVariants}
      initial={reduceMotion ? "reduced" : "hidden"}
      animate={reduceMotion ? "reduced" : inView ? "slam" : "hidden"}
      className="absolute -bottom-7 -left-7 sm:-bottom-8 sm:-left-8 md:-bottom-6 md:-left-6 z-[5] pointer-events-none select-none w-[140px] h-[140px] sm:w-[190px] sm:h-[190px] md:w-[200px] md:h-[200px]"
      style={{
        transformOrigin: "center center",
        mixBlendMode: "multiply",
        filter: "url(#passport-stamp-bleed)",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#12224A]"
      >
        <defs>
          {/* Top curve for IMMIGRATION · OFFICIAL ENTRY */}
          <path id="seal-top-arc" d="M 22,100 A 78,78 0 1,1 178,100" fill="none" />
          {/* Bottom curve for BUILDER'S PASSPORT · 2026 */}
          <path id="seal-bottom-arc" d="M 22,100 A 78,78 0 0,0 178,100" fill="none" />
        </defs>

        {/* Double Circular Rings */}
        <circle cx="100" cy="100" r="95" stroke="#12224A" strokeWidth="2.8" />
        <circle cx="100" cy="100" r="88" stroke="#12224A" strokeWidth="1.2" strokeDasharray="5 2.5" />
        <circle cx="100" cy="100" r="62" stroke="#12224A" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="57" stroke="#12224A" strokeWidth="1.8" />

        {/* Curved Text along Top Arc */}
        <text
          fill="#12224A"
          fontSize="10.2"
          fontWeight="900"
          letterSpacing="0.18em"
          fontFamily="'Special Elite', 'Courier Prime', Courier, monospace"
        >
          <textPath href="#seal-top-arc" startOffset="50%" textAnchor="middle">
            IMMIGRATION · OFFICIAL ENTRY
          </textPath>
        </text>

        {/* Curved Text along Bottom Arc */}
        <text
          fill="#12224A"
          fontSize="9.8"
          fontWeight="900"
          letterSpacing="0.16em"
          fontFamily="'Special Elite', 'Courier Prime', Courier, monospace"
        >
          <textPath href="#seal-bottom-arc" startOffset="50%" textAnchor="middle">
            BUILDER'S PASSPORT · 2026
          </textPath>
        </text>

        {/* Star in Center (Top of Band) */}
        <polygon
          points="100,68 102.8,76.5 112,76.5 104.5,82 107.2,90.5 100,85.5 92.8,90.5 95.5,82 88,76.5 97.2,76.5"
          fill="#12224A"
        />

        {/* Star in Center (Bottom of Band) */}
        <polygon
          points="100,132 102.8,123.5 112,123.5 104.5,118 107.2,109.5 100,114.5 92.8,109.5 95.5,118 88,123.5 97.2,123.5"
          fill="#12224A"
          opacity="0.8"
        />

        {/* Center Horizontal Band: ENTRY GRANTED */}
        <rect
          x="28"
          y="87"
          width="144"
          height="26"
          rx="3"
          fill="#FBF6E9"
          stroke="#12224A"
          strokeWidth="2.2"
        />
        <rect
          x="31"
          y="90"
          width="138"
          height="20"
          rx="1.5"
          fill="none"
          stroke="#12224A"
          strokeWidth="0.8"
          strokeDasharray="3 2"
        />
        <text
          x="100"
          y="104.5"
          textAnchor="middle"
          fill="#12224A"
          fontSize="11.5"
          fontWeight="900"
          letterSpacing="0.22em"
          fontFamily="'Special Elite', 'Courier Prime', Courier, monospace"
        >
          ENTRY GRANTED
        </text>
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PASSPORT VISA STAMP COMPONENT
   ───────────────────────────────────────────────────────────── */
function VisaStamp({
  stamp,
  index,
  inView,
  isMobile,
  reduceMotion,
}: {
  stamp: VisaStampItem;
  index: number;
  inView: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
}) {
  const rotation = isMobile ? stamp.mobileRotation : stamp.desktopRotation;
  // Timing: booklet settles by ~0.5s, then stamps slam on staggered every 0.3s
  const slamDelay = 0.55 + index * 0.3;

  const stampVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 1.7,
      rotate: rotation,
    },
    slam: {
      opacity: 0.88,
      scale: [1.7, 0.96, 1],
      rotate: rotation,
      transition: {
        delay: slamDelay,
        duration: 0.28,
        times: [0, 0.72, 1],
        ease: "easeOut",
      },
    },
    hover: {
      rotate: [rotation, rotation - 2, rotation + 2, rotation],
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    reduced: {
      opacity: 0.88,
      scale: 1,
      rotate: rotation,
      transition: { duration: 0 },
    },
  };

  return (
    <motion.li
      variants={stampVariants}
      initial={reduceMotion ? "reduced" : "hidden"}
      animate={reduceMotion ? "reduced" : inView ? "slam" : "hidden"}
      whileHover={reduceMotion ? undefined : "hover"}
      className="relative flex-1 min-w-[210px] max-w-[260px] mx-auto select-none pointer-events-auto list-none group"
      style={{
        transformOrigin: "center center",
        mixBlendMode: "multiply",
        color: stamp.inkColor,
        filter: "url(#passport-stamp-bleed)",
      }}
    >
      {/* SHAPE 1: Rectangle with Double Border */}
      {stamp.shape === "rect" && (
        <div
          className="relative px-4 py-3 rounded-[4px] border-[2.2px] border-current text-center bg-[#FBF6E9]/40 transition-transform duration-200"
          style={{ boxShadow: "inset 0 0 0 1.2px currentColor" }}
        >
          <div className="flex items-center justify-between border-b border-current/40 pb-1 mb-1.5">
            <span
              className="text-[10px] font-black uppercase tracking-[0.2em] font-typewriter"
              style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
            >
              {stamp.title}
            </span>
            <span className="text-[8px] font-mono opacity-70">ENTRY ★ 01</span>
          </div>
          <p
            className="text-[13.5px] font-bold leading-tight uppercase font-typewriter tracking-tight"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            {stamp.mainText}
          </p>
          <p className="mt-1 text-[10.5px] font-medium leading-snug opacity-85 font-sans">
            {stamp.smallText}
          </p>
        </div>
      )}

      {/* SHAPE 2: Circle with Ring Border and Star */}
      {stamp.shape === "circle" && (
        <div
          className="relative w-[190px] h-[190px] mx-auto rounded-full border-[2.2px] border-current flex flex-col items-center justify-center text-center p-3.5 bg-[#FBF6E9]/40 transition-transform duration-200"
          style={{ boxShadow: "inset 0 0 0 1.2px currentColor" }}
        >
          {/* Inner concentric dotted ring */}
          <div className="absolute inset-1.5 rounded-full border border-dashed border-current/50 pointer-events-none" />
          <span className="text-sm leading-none mb-0.5">★</span>
          <span
            className="text-[10px] font-black uppercase tracking-[0.22em] font-typewriter mb-1"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            {stamp.title}
          </span>
          <p
            className="text-[13px] font-bold leading-tight uppercase font-typewriter px-1"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            {stamp.mainText}
          </p>
          <p className="mt-1 text-[10px] font-medium leading-tight opacity-85 px-1 font-sans">
            {stamp.smallText}
          </p>
        </div>
      )}

      {/* SHAPE 3: Rounded Rectangle with Perforated Edge */}
      {stamp.shape === "rounded-dashed" && (
        <div
          className="relative px-4 py-3.5 rounded-xl border-[2.2px] border-dashed border-current text-center bg-[#FBF6E9]/40 transition-transform duration-200"
          style={{ boxShadow: "inset 0 0 0 1.2px currentColor" }}
        >
          <div className="text-[9px] font-mono tracking-widest uppercase opacity-75 border-b border-current/30 pb-0.5 mb-1">
            VERIFIED RECORD • INSP
          </div>
          <span
            className="text-[10px] font-black uppercase tracking-[0.2em] font-typewriter block"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            {stamp.title}
          </span>
          <p
            className="text-[13.5px] font-bold leading-tight uppercase font-typewriter tracking-tight mt-1"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            {stamp.mainText}
          </p>
          <p className="mt-1 text-[10.5px] font-medium leading-snug opacity-85 font-sans">
            {stamp.smallText}
          </p>
        </div>
      )}

      {/* SHAPE 4: Oval with Double Border */}
      {stamp.shape === "oval" && (
        <div
          className="relative px-5 py-3.5 rounded-[50px] border-[2.2px] border-current text-center bg-[#FBF6E9]/40 transition-transform duration-200"
          style={{ boxShadow: "inset 0 0 0 1.2px currentColor" }}
        >
          <span
            className="text-[10px] font-black uppercase tracking-[0.22em] font-typewriter block mb-0.5"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            {stamp.title}
          </span>
          <p
            className="text-[13.5px] font-bold leading-tight uppercase font-typewriter tracking-tight"
            style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
          >
            {stamp.mainText}
          </p>
          <p className="mt-1 text-[10px] font-medium leading-snug opacity-85 font-sans">
            {stamp.smallText}
          </p>
        </div>
      )}
    </motion.li>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN ABOUT SECTION COMPONENT (Passport Booklet + Visas Strip)
   ───────────────────────────────────────────────────────────── */
export function AboutDossier() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const reduceMotion = Boolean(useReducedMotion());

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Booklet entrance animation (fade up 24px and settle)
  const bookletVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    reduced: {
      opacity: 1,
      y: 0,
      transition: { duration: 0 },
    },
  };

  // Micro shake when stamps hit
  const bookletShakeVariants: Variants = {
    initial: { x: 0, y: 0 },
    shake: {
      x: [0, -1.5, 1.5, -1, 0],
      y: [0, 1, -1, 0],
      transition: {
        delay: 0.65,
        duration: 0.25,
        ease: "easeInOut",
      },
    },
    reduced: {
      x: 0,
      y: 0,
      transition: { duration: 0 },
    },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-transparent py-14 sm:py-20 overflow-hidden select-text"
      aria-label="About the Holder - Passport"
    >
      {/* ─────────────────────────────────────────────────────────────
          SHARED SVG FILTERS (Guilloche Pattern & Rubber Stamp Bleed)
          ───────────────────────────────────────────────────────────── */}
      <svg className="sr-only" aria-hidden="true" width="0" height="0">
        <defs>
          {/* Subtle paper grain texture */}
          <filter id="passport-paper-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.04   0 0 0 0 0.12   0 0 0 0 0.3   0 0 0 0.1 0"
            />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>

          {/* Rubber ink stamp rough edges & bleed */}
          <filter id="passport-stamp-bleed" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.17"
              numOctaves="2"
              result="stampNoise"
            />
            <feDisplacementMap in="SourceGraphic" in2="stampNoise" scale="1.5" />
          </filter>

          {/* Guilloche security pattern in light sky blue */}
          <pattern
            id="passport-guilloche-pattern"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 22 Q11 4, 22 22 T44 22"
              fill="none"
              stroke="#0284C7"
              strokeWidth="0.7"
              opacity="0.7"
            />
            <path
              d="M0 22 Q11 40, 22 22 T44 22"
              fill="none"
              stroke="#0284C7"
              strokeWidth="0.7"
              opacity="0.7"
            />
            <path
              d="M22 0 Q4 11, 22 22 T22 44"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="0.5"
              opacity="0.6"
            />
            <path
              d="M22 0 Q40 11, 22 22 T22 44"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="0.5"
              opacity="0.6"
            />
          </pattern>
        </defs>
      </svg>

      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────────────────────
            SECTION HEADER
            ───────────────────────────────────────────────────────────── */}
        <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#1A3A7A] mb-2 font-mono">
            ABOUT ME
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Code, creativity &amp;{" "}
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              leadership
            </span>
          </h2>
        </header>

        {/* ─────────────────────────────────────────────────────────────
            THE OPEN PASSPORT BOOKLET
            Desktop: Side by Side (Left: Identity, Right: Bio) with Center Spine
            Mobile: Stacked Vertically with Horizontal Spine
            ───────────────────────────────────────────────────────────── */}
        <motion.div
          variants={bookletVariants}
          initial={reduceMotion ? "reduced" : "hidden"}
          animate={reduceMotion ? "reduced" : isInView ? "visible" : "hidden"}
          className="relative w-full"
        >
          {/* Navy Leather Cover Edge peeking behind and under the booklet */}
          <div
            className="absolute -inset-2 sm:-inset-2.5 bg-[#0B1F4B] rounded-[16px] shadow-[0_4px_6px_rgba(11,31,75,0.08),0_18px_38px_rgba(11,31,75,0.16),0_32px_64px_rgba(11,31,75,0.12)] -rotate-[0.5deg] pointer-events-none"
            aria-hidden="true"
          >
            {/* Subtle gold foil embossed border accent on the cover edge */}
            <div className="absolute inset-[3px] rounded-[14px] border border-[#FFD21F]/25 pointer-events-none" />
          </div>

          {/* Shake feedback container when stamps land */}
          <motion.article
            variants={bookletShakeVariants}
            initial={reduceMotion ? "reduced" : "initial"}
            animate={reduceMotion ? "reduced" : isInView ? "shake" : "initial"}
            className="relative w-full bg-[#FBF6E9] rounded-[14px] border border-[#0B1F4B]/15 overflow-hidden shadow-[0_1px_3px_rgba(11,31,75,0.08)]"
            aria-label="Passport Booklet of Aswin A"
            data-cursor="file"
            data-cursor-label="INSPECT PASSPORT"
          >
            {/* Paper Grain Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply z-[1]"
              style={{ filter: "url(#passport-paper-grain)" }}
              aria-hidden="true"
            />

            {/* Grid Container for Left & Right Pages */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
              {/* ─────────────────────────────────────────────────────────────
                  LEFT PAGE: IDENTITY PAGE
                  ───────────────────────────────────────────────────────────── */}
              <div className="relative p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#0B1F4B]/10 overflow-hidden">
                {/* Guilloche Security Pattern */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.12] z-0"
                  style={{ backgroundImage: "url(#passport-guilloche-pattern)" }}
                  aria-hidden="true"
                />

                {/* Dark Ink Immigration Seal (Replaces the old faint watermark & circular photo seal) */}
                <ImmigrationSeal inView={isInView} reduceMotion={reduceMotion} />

                {/* Page Content */}
                <div className="relative z-10">
                  {/* Top Header */}
                  <div className="flex items-center justify-between pb-2 border-b-2 border-double border-[#0B1F4B]/25 mb-6">
                    <span
                      className="font-typewriter text-xs font-bold tracking-wider text-[#0B1F4B]"
                      style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
                    >
                      {PASSPORT_IDENTITY.headerLeft}
                    </span>
                    <span
                      className="font-typewriter text-xs font-bold tracking-widest text-[#0B1F4B]/70"
                      style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
                    >
                      {PASSPORT_IDENTITY.headerRight}
                    </span>
                  </div>

                  {/* Photo & Identity Fields Row */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    {/* Framed ID-Style Photo Print */}
                    <div className="relative shrink-0 mx-auto sm:mx-0">
                      {/* Cream Matte & Border Frame */}
                      <div className="relative p-1.5 bg-[#FFFDF5] border border-[#0B1F4B]/35 rounded-[7px] shadow-xs w-32 sm:w-36 aspect-[4/5]">
                        {/* 4 Transparent-Edge Corner Marks */}
                        <span className="absolute top-0.5 left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#0B1F4B]/50" />
                        <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#0B1F4B]/50" />
                        <span className="absolute bottom-0.5 left-0.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#0B1F4B]/50" />
                        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#0B1F4B]/50" />

                        <div className="w-full h-full rounded-[5px] overflow-hidden bg-sky-100 flex items-center justify-center">
                          <img
                            src={PASSPORT_IDENTITY.photoSrc}
                            alt="Aswin A - Passport Photo"
                            loading="lazy"
                            onError={(e) => {
                              // Safe fallback in case of missing asset
                              (e.target as HTMLImageElement).src =
                                PASSPORT_IDENTITY.fallbackPhotoSrc;
                            }}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data Fields on the Right of Photo */}
                    <div className="flex-1 space-y-3 w-full">
                      {PASSPORT_IDENTITY.fields.map((field) => (
                        <div key={field.label} className="border-b border-[#0B1F4B]/20 pb-1">
                          <span className="block text-[10px] font-semibold tracking-[0.16em] uppercase text-[#1A3A7A]/75">
                            {field.label}
                          </span>
                          <span
                            className="font-typewriter text-[13px] font-bold text-[#0B1F4B] tracking-wide block mt-0.5"
                            style={{
                              fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace",
                            }}
                          >
                            {field.value}
                          </span>
                        </div>
                      ))}

                      {/* VERIFIED PROFILES: Luggage-Tag Style Clickable Links */}
                      <div className="pt-1">
                        <span className="block text-[10px] font-semibold tracking-[0.16em] uppercase text-[#1A3A7A]/75 mb-1.5">
                          VERIFIED PROFILES
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {VERIFIED_PROFILES.map((tag) => (
                            <a
                              key={tag.id}
                              href={tag.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={tag.ariaLabel}
                              className={cn(
                                "group/tag relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[#0B1F4B]/40 bg-[#FFFDF5] text-[#0B1F4B] shadow-2xs cursor-pointer select-none",
                                "font-typewriter text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em]",
                                "transition-all duration-200 ease-out",
                                "hover:bg-[#FFD21F] hover:-translate-y-0.5 hover:scale-[1.05] hover:shadow-xs hover:border-[#0B1F4B]",
                                "active:scale-95 active:translate-y-0",
                                "focus-visible:outline-2 focus-visible:outline-[#0B1F4B] focus-visible:outline-offset-2",
                              )}
                              style={{
                                fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace",
                                transform: `rotate(${tag.rotation}deg)`,
                              }}
                            >
                              {/* Luggage Tag Punched Hole on Left */}
                              <span
                                className="w-1.5 h-1.5 rounded-full border border-[#0B1F4B]/60 bg-[#FBF6E9] shrink-0 shadow-inner group-hover/tag:border-[#0B1F4B]"
                                aria-hidden="true"
                              />
                              <span>{tag.name}</span>
                              <span
                                className="text-[11px] font-sans font-bold leading-none transition-transform duration-200 group-hover/tag:translate-x-0.5 group-hover/tag:-translate-y-0.5"
                                aria-hidden="true"
                              >
                                ↗
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Machine-Readable Zone (MRZ) */}
                <div
                  className="relative z-10 mt-8 pt-3 border-t border-[#0B1F4B]/20 overflow-hidden"
                  aria-hidden="true"
                >
                  <p className="font-mono text-[11px] sm:text-[12px] font-bold text-[#0B1F4B]/60 tracking-[0.18em] sm:tracking-[0.22em] leading-relaxed whitespace-nowrap overflow-x-hidden">
                    {PASSPORT_IDENTITY.mrzLines[0]}
                    <br />
                    {PASSPORT_IDENTITY.mrzLines[1]}
                  </p>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  RIGHT PAGE: ABOUT THE HOLDER (The Bio)
                  ───────────────────────────────────────────────────────────── */}
              <div
                className="relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
                aria-label="About the holder"
              >
                {/* Guilloche Security Pattern */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.12] z-0"
                  style={{ backgroundImage: "url(#passport-guilloche-pattern)" }}
                  aria-hidden="true"
                />

                {/* Faint Circular Watermark Seal (Kept on Right Page Only) */}
                <WatermarkSeal />

                {/* Page Content */}
                <div className="relative z-10">
                  {/* Top Header */}
                  <div className="flex items-center justify-between pb-2 border-b-2 border-double border-[#0B1F4B]/25 mb-6">
                    <span
                      className="font-typewriter text-xs font-bold tracking-wider text-[#0B1F4B]"
                      style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
                    >
                      ABOUT THE HOLDER
                    </span>
                    <span
                      className="font-typewriter text-xs font-bold tracking-widest text-[#0B1F4B]/70"
                      style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
                    >
                      PAGE 02
                    </span>
                  </div>

                  {/* The 3 Bio Paragraphs with Typed Tab Labels */}
                  <div className="space-y-5">
                    {BIO_PARAGRAPHS.map((p) => (
                      <div key={p.id}>
                        <div className="mb-1.5">
                          <span
                            className="font-typewriter text-xs font-bold uppercase tracking-[0.16em] text-[#0B1F4B] inline-block border-b-2 border-[#FFD21F] pb-0.5"
                            style={{
                              fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace",
                            }}
                          >
                            {p.tabLabel}
                          </span>
                        </div>
                        <p className="text-[15px] leading-[1.7] text-[#0B1F4B]/90 font-sans">
                          {p.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Signature Area */}
                <div className="relative z-10 mt-6 pt-3 flex flex-col items-end">
                  <div className="w-48 text-right">
                    <span
                      className="font-['Caveat',cursive] text-2xl sm:text-3xl font-bold text-[#0B1F4B] block pr-3 -rotate-2 select-none leading-none"
                      aria-label="Signature: Aswin A"
                    >
                      Aswin A
                    </span>
                    <div className="w-full border-t border-[#0B1F4B]/35 mt-1.5" />
                    <span
                      className="block mt-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#0B1F4B]/60 font-typewriter text-right"
                      style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
                    >
                      HOLDER'S SIGNATURE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                CENTER SPINE (Shadow Gradient + Dashed Stitch Line)
                Desktop: Vertical Down the Middle
                Mobile: Horizontal Between Stacked Pages
                ───────────────────────────────────────────────────────────── */}
            {/* Desktop Vertical Spine */}
            <div
              className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-20 bg-gradient-to-r from-black/10 via-black/20 to-black/10"
              aria-hidden="true"
            >
              <div className="h-full w-full flex justify-center">
                <div className="h-full border-r border-dashed border-[#0B1F4B]/40" />
              </div>
            </div>

            {/* Mobile Horizontal Spine */}
            <div
              className="block md:hidden absolute top-1/2 left-0 right-0 -translate-y-1/2 h-6 pointer-events-none z-20 bg-gradient-to-b from-black/10 via-black/20 to-black/10"
              aria-hidden="true"
            >
              <div className="w-full h-full flex items-center">
                <div className="w-full border-b border-dashed border-[#0B1F4B]/40" />
              </div>
            </div>
          </motion.article>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            VISA PAGE STRIP (The 4 Approved Cards as Rubber Visa Stamps)
            ───────────────────────────────────────────────────────────── */}
        <div className="mt-10 sm:mt-12 w-full">
          <div className="relative p-5 sm:p-7 bg-[#FBF6E9] rounded-[14px] border border-[#0B1F4B]/15 overflow-hidden shadow-[0_4px_16px_rgba(11,31,75,0.06)]">
            {/* Paper Grain Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply z-0"
              style={{ filter: "url(#passport-paper-grain)" }}
              aria-hidden="true"
            />

            {/* Guilloche Security Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.10] z-0"
              style={{ backgroundImage: "url(#passport-guilloche-pattern)" }}
              aria-hidden="true"
            />

            {/* Header Strip: VISAS / ENTRY RECORD */}
            <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-[#0B1F4B]/20 mb-6">
              <span
                className="font-typewriter text-sm sm:text-base font-black uppercase tracking-[0.22em] text-[#0B1F4B]"
                style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
              >
                VISAS
              </span>
              <span
                className="font-typewriter text-xs font-bold uppercase tracking-[0.2em] text-[#0B1F4B]/60"
                style={{ fontFamily: "'Special Elite', 'Courier Prime', Courier, monospace" }}
              >
                ENTRY RECORD
              </span>
            </div>

            {/* 4 Rubber Visa Stamps (1 row on desktop, 2x2 tablet/mobile) */}
            <ul
              role="list"
              className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 items-center justify-items-center"
            >
              {VISA_STAMPS.map((stamp, index) => (
                <VisaStamp
                  key={stamp.id}
                  stamp={stamp}
                  index={index}
                  inView={isInView}
                  isMobile={isMobile}
                  reduceMotion={reduceMotion}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
