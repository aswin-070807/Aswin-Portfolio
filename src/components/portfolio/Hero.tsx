import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ChevronDown, Mail, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import TechText from "../TechText";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "./chrome";
import { ResumeButton } from "./ResumeButton";

interface InvestigationSheet {
  id: string;
  label: string;
  text: string;
  colorScheme: "white" | "yellow" | "navy";
  hasGreenDot?: boolean;
  hasTape?: boolean;
  tapeColor?: "yellow" | "white";
  hasFold?: boolean;
  baseRot: number;
  entranceDelay: number;
  swayDuration: number;
  swayDelay: number;
  targetId: string;
  positionClasses: string;
  responsiveHide?: "tablet" | "mobile" | "never";
}

const SHEETS: InvestigationSheet[] = [
  {
    id: "sheet-1",
    label: "STATUS",
    text: "Open to AI & Software roles",
    colorScheme: "white",
    hasGreenDot: true,
    hasTape: true,
    tapeColor: "white",
    hasFold: true,
    baseRot: -3,
    entranceDelay: 0.12,
    swayDuration: 5.2,
    swayDelay: 0.2,
    targetId: "contact",
    positionClasses: "left-[2%] sm:left-[4%] lg:left-[5%] xl:left-[6%] top-[8%] sm:top-[6%] lg:top-[5%]",
    responsiveHide: "never",
  },
  {
    id: "sheet-2",
    label: "FILE 01",
    text: "Agentic AI",
    colorScheme: "yellow",
    hasFold: true,
    baseRot: 4,
    entranceDelay: 0.24,
    swayDuration: 6.0,
    swayDelay: 0.8,
    targetId: "projects",
    positionClasses: "left-[2%] sm:left-[4%] lg:left-[5%] xl:left-[6%] top-[26%] sm:top-[24%] lg:top-[23%]",
    responsiveHide: "never",
  },
  {
    id: "sheet-3",
    label: "FILE 02",
    text: "CodeChef · LeetCode",
    colorScheme: "navy",
    hasFold: true,
    baseRot: -4,
    entranceDelay: 0.36,
    swayDuration: 4.8,
    swayDelay: 1.4,
    targetId: "skills",
    positionClasses: "left-[3%] sm:left-[5%] lg:left-[6%] xl:left-[7%] top-[44%] sm:top-[42%] lg:top-[41%]",
    responsiveHide: "mobile",
  },
  {
    id: "sheet-4",
    label: "FILE 03",
    text: "Python · AI/ML",
    colorScheme: "white",
    hasFold: true,
    baseRot: 3,
    entranceDelay: 0.48,
    swayDuration: 5.6,
    swayDelay: 0.5,
    targetId: "skills",
    positionClasses: "left-[4%] sm:left-[6%] lg:left-[7%] xl:left-[8%] top-[62%] sm:top-[60%] lg:top-[59%]",
    responsiveHide: "mobile",
  },
  {
    id: "sheet-5",
    label: "FILE 04",
    text: "Problem Solver",
    colorScheme: "yellow",
    hasTape: true,
    tapeColor: "yellow",
    hasFold: true,
    baseRot: -5,
    entranceDelay: 0.6,
    swayDuration: 6.4,
    swayDelay: 1.1,
    targetId: "skills",
    positionClasses: "left-[3%] sm:left-[5%] lg:left-[5%] xl:left-[6%] top-[80%] sm:top-[78%] lg:top-[77%]",
    responsiveHide: "tablet",
  },
  {
    id: "sheet-6",
    label: "FILE 05",
    text: "React · Node · Python",
    colorScheme: "white",
    hasFold: true,
    baseRot: 4,
    entranceDelay: 0.72,
    swayDuration: 5.4,
    swayDelay: 0.3,
    targetId: "projects",
    positionClasses: "right-[2%] sm:right-[4%] lg:right-[5%] xl:right-[6%] top-[8%] sm:top-[6%] lg:top-[5%]",
    responsiveHide: "never",
  },
  {
    id: "sheet-7",
    label: "FILE 06",
    text: "LLM Apps",
    colorScheme: "navy",
    hasFold: true,
    baseRot: -3,
    entranceDelay: 0.84,
    swayDuration: 6.2,
    swayDelay: 1.0,
    targetId: "projects",
    positionClasses: "right-[2%] sm:right-[4%] lg:right-[5%] xl:right-[6%] top-[28%] sm:top-[26%] lg:top-[25%]",
    responsiveHide: "never",
  },
  {
    id: "sheet-8",
    label: "FILE 07",
    text: "Full-Stack Builds",
    colorScheme: "white",
    hasFold: true,
    baseRot: 2,
    entranceDelay: 0.96,
    swayDuration: 5.0,
    swayDelay: 1.5,
    targetId: "projects",
    positionClasses: "right-[3%] sm:right-[5%] lg:right-[6%] xl:right-[7%] top-[56%] sm:top-[54%] lg:top-[53%]",
    responsiveHide: "tablet",
  },
];

function SheetPin() {
  return (
    <div
      className="relative z-20 flex items-center justify-center -mt-2.5 mb-1 pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="w-3.5 h-3.5 rounded-full bg-[#0B1F4B] shadow-[0_2px_4px_rgba(11,31,75,0.45)] border border-[#1A3A7A] relative">
        {/* Highlight glint */}
        <span className="absolute top-[2px] left-[2.5px] w-1 h-1 rounded-full bg-white/80" />
      </div>
      {/* Drop shadow on paper */}
      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-1.5 rounded-full bg-[#0B1F4B]/25 blur-[1px]" />
    </div>
  );
}

function WashiTape({ color = "yellow" }: { color?: "yellow" | "white" }) {
  return (
    <div
      className={cn(
        "absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 pointer-events-none z-10 shadow-[0_1px_3px_rgba(11,31,75,0.12)] rotate-[-2deg]",
        color === "yellow"
          ? "bg-[#FFD21F]/70 border border-yellow-400/50"
          : "bg-white/70 border border-white/80",
      )}
      style={{
        clipPath: "polygon(2% 0%, 98% 2%, 100% 98%, 0% 100%)",
      }}
      aria-hidden="true"
    />
  );
}

function FoldedCorner({ colorScheme }: { colorScheme: "white" | "yellow" | "navy" }) {
  const foldBg =
    colorScheme === "yellow" ? "#E5BD1B" : colorScheme === "navy" ? "#1A3A7A" : "#ECEFF1";

  return (
    <div
      className="absolute bottom-0 right-0 w-3 h-3 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="w-full h-full"
        style={{
          background: "linear-gradient(135deg, transparent 50%, rgba(11, 31, 75, 0.16) 50%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2 shadow-sm"
        style={{
          backgroundColor: foldBg,
          borderTopLeftRadius: "1px",
        }}
      />
    </div>
  );
}

function RotatingBadge({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(11,31,75,0.14)] border border-white/80 ${className || ""}`}
      style={{ width: "88px", height: "88px" }}
      aria-label="Open to AI & Software roles badge"
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-spin-slow select-none pointer-events-none"
        aria-hidden="true"
      >
        <path
          id="circleBadgePath"
          d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
          fill="none"
        />
        <text className="text-[9.2px] font-extrabold uppercase tracking-[0.16em] fill-[#0B1F4B]">
          <textPath href="#circleBadgePath" startOffset="0%">
            OPEN TO AI & SOFTWARE ROLES ✦{" "}
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-[#FFD21F] flex items-center justify-center text-[#0B1F4B] shadow-[0_0_10px_rgba(255,210,31,0.6)]">
        <Sparkles className="w-3.5 h-3.5 fill-[#0B1F4B]" />
      </div>
    </div>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hoveredSheetId, setHoveredSheetId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const pinRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [pinCoords, setPinCoords] = useState<Record<string, { x: number; y: number }>>({});
  const [windowWidth, setWindowWidth] = useState(1280);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
      setWindowWidth(window.innerWidth);
    }
  }, []);

  const updatePinCoords = useCallback(() => {
    if (!stageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    if (stageRect.width === 0 || stageRect.height === 0) return;

    const coords: Record<string, { x: number; y: number }> = {};
    for (const sheet of SHEETS) {
      const pin = pinRefs.current[sheet.id];
      if (pin && pin.offsetParent !== null) {
        const pinRect = pin.getBoundingClientRect();
        coords[sheet.id] = {
          x: pinRect.left + pinRect.width / 2 - stageRect.left,
          y: pinRect.top + pinRect.height / 2 - stageRect.top,
        };
      }
    }
    setPinCoords(coords);
  }, []);

  useEffect(() => {
    updatePinCoords();
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      updatePinCoords();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    const timer1 = setTimeout(updatePinCoords, 150);
    const timer2 = setTimeout(updatePinCoords, 700);
    const timer3 = setTimeout(updatePinCoords, 1300);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [updatePinCoords]);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };

  const photoParallaxX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-8, 8]),
    springConfig,
  );
  const photoParallaxY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-6, 6]),
    springConfig,
  );

  const sheetsParallaxX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    springConfig,
  );
  const sheetsParallaxY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-10, 10]),
    springConfig,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion || isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
    requestAnimationFrame(updatePinCoords);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    requestAnimationFrame(updatePinCoords);
  };

  const photoVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.25,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const bottomVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        delay: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Helper to build sagging string bezier curves
  const getStringPath = (p1?: { x: number; y: number }, p2?: { x: number; y: number }, isLongArch = false) => {
    if (!p1 || !p2) return "";
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (isLongArch) {
      // Long arching string across the board, sagging behind photo
      const midX = (p1.x + p2.x) / 2;
      const midY = Math.max(p1.y, p2.y) + Math.min(85, dist * 0.12);
      return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    // Normal hanging string with natural gravity sag
    const midX = (p1.x + p2.x) / 2 + (dx > 0 ? 6 : -6);
    const midY = (p1.y + p2.y) / 2 + Math.min(22, Math.max(12, dist * 0.1));
    return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  };

  const pathA = getStringPath(pinCoords["sheet-1"], pinCoords["sheet-2"]);
  const pathB = getStringPath(pinCoords["sheet-3"], pinCoords["sheet-4"]);
  const pathC = getStringPath(pinCoords["sheet-6"], pinCoords["sheet-7"]);
  const pathD = getStringPath(pinCoords["sheet-2"], pinCoords["sheet-7"], true);

  const isHighlightedA = hoveredSheetId === "sheet-1" || hoveredSheetId === "sheet-2";
  const isHighlightedB = hoveredSheetId === "sheet-3" || hoveredSheetId === "sheet-4";
  const isHighlightedC = hoveredSheetId === "sheet-6" || hoveredSheetId === "sheet-7";
  const isHighlightedD = hoveredSheetId === "sheet-2" || hoveredSheetId === "sheet-7";

  const isMobile = windowWidth <= 768;
  const isTabletOrBelow = windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;
  const showStringB = windowWidth >= 640;

  return (
    <section
      id="home"
      aria-label="Hero Introduction"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-x-hidden overflow-y-visible select-none bg-transparent"
      style={{
        paddingTop: "calc(var(--nav-h, 72px) + 24px)",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          LAYER 1: BACKGROUND GRID PATTERN & SPARKLES / PLUS SIGNS
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
        {/* Faint dotted grid pattern fading out toward edges and bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(11, 31, 75, 0.16) 1.75px, transparent 1.75px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 35%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 35%, transparent 90%)",
          }}
        />

        {/* Small sparkles and plus signs */}
        <span className="absolute top-[18%] left-[12%] text-[#FFD21F] font-bold text-lg opacity-70">✦</span>
        <span className="absolute top-[32%] left-[22%] text-[#0B1F4B] font-bold text-sm opacity-40">+</span>
        <span className="absolute top-[22%] right-[15%] text-[#FFD21F] font-bold text-xl opacity-75">✦</span>
        <span className="absolute top-[42%] right-[22%] text-[#0B1F4B] font-bold text-base opacity-40">+</span>
        <span className="absolute top-[58%] left-[16%] text-[#FFD21F] font-bold text-sm opacity-60">✦</span>
        <span className="absolute top-[62%] right-[18%] text-[#0B1F4B] font-bold text-sm opacity-35">+</span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CENTER STAGE:
          Layer 2: Yellow circle + offset ring (z-[2])
          Layer 2.5: Strings SVG overlay (z-[2], behind photo & "ASWIN A")
          Layer 3: TechText Name (z-[3])
          Layer 4: Photo Cutout (z-[4])
          Layer 5: Rotating Badge (z-[5])
          Layer 6: Pinned Paper Sheets (z-[6])
          ───────────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="relative w-full flex-1 flex items-end justify-center overflow-visible min-h-[500px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[620px] px-4 pt-2 sm:pt-4"
      >
        {/* ── LAYER 2.5: STRINGS SVG OVERLAY (BEHIND PHOTO & "ASWIN A", ABOVE BACKGROUND) ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[2] overflow-visible"
          aria-hidden="true"
        >
          {/* Connection A: Sheet 1 (Open to roles) to Sheet 2 (Agentic AI) */}
          {pathA && (
            <motion.path
              d={pathA}
              fill="none"
              stroke={isHighlightedA ? "#FFF59D" : "#FFD21F"}
              strokeWidth={isHighlightedA ? 2.4 : 1.7}
              strokeLinecap="round"
              initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 1.05, ease: "easeInOut" }}
              filter={
                isHighlightedA
                  ? "drop-shadow(0 0 6px rgba(255, 210, 31, 0.9))"
                  : "drop-shadow(0 1px 2px rgba(11, 31, 75, 0.25))"
              }
            />
          )}

          {/* Connection B: Sheet 3 (CodeChef) to Sheet 4 (Python · AI/ML) - Tablet & Desktop */}
          {showStringB && pathB && (
            <motion.path
              d={pathB}
              fill="none"
              stroke={isHighlightedB ? "#FFF59D" : "#FFD21F"}
              strokeWidth={isHighlightedB ? 2.4 : 1.7}
              strokeLinecap="round"
              initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 1.15, ease: "easeInOut" }}
              filter={
                isHighlightedB
                  ? "drop-shadow(0 0 6px rgba(255, 210, 31, 0.9))"
                  : "drop-shadow(0 1px 2px rgba(11, 31, 75, 0.25))"
              }
            />
          )}

          {/* Connection C: Sheet 6 (React · Node · Python) to Sheet 7 (LLM Apps) */}
          {pathC && (
            <motion.path
              d={pathC}
              fill="none"
              stroke={isHighlightedC ? "#FFF59D" : "#FFD21F"}
              strokeWidth={isHighlightedC ? 2.4 : 1.7}
              strokeLinecap="round"
              initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 1.25, ease: "easeInOut" }}
              filter={
                isHighlightedC
                  ? "drop-shadow(0 0 6px rgba(255, 210, 31, 0.9))"
                  : "drop-shadow(0 1px 2px rgba(11, 31, 75, 0.25))"
              }
            />
          )}

          {/* Connection D: Long Arching String from Sheet 2 to Sheet 7 (Desktop only, passes behind photo & name) */}
          {isDesktop && pathD && (
            <motion.path
              d={pathD}
              fill="none"
              stroke={isHighlightedD ? "#FFF59D" : "#FFD21F"}
              strokeWidth={isHighlightedD ? 2.4 : 1.7}
              strokeLinecap="round"
              initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 1.35, ease: "easeInOut" }}
              filter={
                isHighlightedD
                  ? "drop-shadow(0 0 6px rgba(255, 210, 31, 0.9))"
                  : "drop-shadow(0 1px 2px rgba(11, 31, 75, 0.25))"
              }
            />
          )}
        </svg>

        {/* ── ONE CENTRED WRAPPER: CIRCLE, RING, NAME, PHOTO ── */}
        <div className="relative mx-auto flex flex-col items-center justify-end z-[3]">
          {/* ── LAYER 2: SUNSHINE YELLOW CIRCLE + OUTLINED RING ── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-[2]"
            aria-hidden="true"
            style={{
              top: isMobile ? "8px" : isTabletOrBelow ? "14px" : "18px",
            }}
          >
            {/* Thin outlined ring offset about 20px around the circle */}
            <div
              className="absolute -inset-5 rounded-full border-2 border-[#FFD21F]/70 pointer-events-none"
              style={{ transform: "rotate(16deg) scale(1.04)" }}
            />

            {/* Sunshine-yellow circle with breathing animation */}
            <div
              className="hero-breathing-circle w-[270px] sm:w-[330px] md:w-[390px] lg:w-[480px] xl:w-[500px] h-[270px] sm:h-[330px] md:h-[390px] lg:h-[480px] xl:h-[500px] rounded-full shadow-[0_12px_45px_rgba(255,210,31,0.38)]"
              style={{
                background: "radial-gradient(circle at 45% 35%, #FFF176 0%, #FFD21F 60%, #F5BE00 100%)",
              }}
            />
          </div>

          {/* Accessible, visually hidden h1 for SEO and screen readers */}
          <h1 className="sr-only">Aswin A</h1>

          {/* ── LAYER 3: TECHTEXT NAME ANIMATION ── */}
          <div
            className="hero-name relative z-[3] pointer-events-auto mx-auto"
            style={{
              width: "min(880px, 92vw)",
              height: isMobile ? 150 : isTabletOrBelow ? 260 : 320,
            }}
          >
            <TechText
              text="ASWIN A"
              fontFamily='"Space Grotesk", ui-sans-serif, system-ui, sans-serif'
              fontWeight={800}
              fontSize={260}
              letterSpacing={-0.04}
              align="center"
              color="#0B1F4B"
              accentColor="#0B1F4B"
              reveal="letter"
              reach={isMobile ? 120 : 200}
              softness={0.7}
              lineStyle="dashed"
              dashLength={4}
              dashGap={2}
              strokeWidth={1.5}
              specks={isMobile ? 6 : 15}
              selection={true}
              labels={!isMobile}
              draggable={!isMobile}
              bounce={0.4}
              clickKick={!isMobile}
              intro={isMobile ? "type" : "assemble"}
              introDuration={2.2}
              guides={false}
              sweep={true}
              speed={1}
            />
          </div>

          {/* ── LAYER 4: PHOTO CUTOUT (15-20% LARGER, ANCHORED TO BOTTOM, SOFT FADE) ── */}
          <motion.div
            style={reduceMotion || isTouchDevice ? {} : { x: photoParallaxX, y: photoParallaxY }}
            variants={photoVariants}
            initial="hidden"
            animate="visible"
            className="relative z-[4] flex flex-col items-center pointer-events-none select-none max-w-full -mt-[95px] sm:-mt-[135px] md:-mt-[160px] lg:-mt-[185px] xl:-mt-[195px]"
          >
            {/* Subtle contact shadow under shoulders */}
            <div
              className="absolute -bottom-2 w-[75%] max-w-[380px] h-7 bg-[#0B1F4B]/15 blur-xl rounded-full pointer-events-none"
              aria-hidden="true"
            />

            {/* Photo wrapper: anchored to bottom with soft gradient mask */}
            <div
              className="relative overflow-hidden w-[280px] sm:w-[350px] md:w-[430px] lg:w-[490px] xl:w-[520px] h-[340px] sm:h-[410px] md:h-[470px] lg:h-[530px] xl:h-[560px] flex justify-center items-start"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
              }}
            >
              <img
                src="/assets/hero-aswin.png"
                alt="Aswin A"
                width={1024}
                height={1536}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-auto max-w-none object-cover select-none pointer-events-none"
                style={{
                  objectPosition: "top center",
                  filter: "drop-shadow(0 14px 28px rgba(11, 31, 75, 0.22)) drop-shadow(0 0 2px rgba(11, 31, 75, 0.15))",
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── LAYER 5: ROTATING BADGE ── */}
        <div className="absolute right-[12%] sm:right-[16%] md:right-[18%] lg:right-[20%] xl:right-[22%] top-[34%] sm:top-[30%] md:top-[28%] lg:top-[26%] hidden sm:block z-[5] pointer-events-auto">
          <RotatingBadge />
        </div>

        {/* ── LAYER 6: PINNED PAPER SHEETS ON INVESTIGATION BOARD ── */}
        <motion.div
          style={reduceMotion || isTouchDevice ? {} : { x: sheetsParallaxX, y: sheetsParallaxY }}
          className="absolute inset-0 pointer-events-none z-[6] overflow-visible"
        >
          {SHEETS.map((sheet) => {
            const isHiddenMobile = sheet.responsiveHide === "mobile" || sheet.responsiveHide === "tablet";
            const isHiddenTablet = sheet.responsiveHide === "tablet";

            return (
              <div
                key={sheet.id}
                className={cn(
                  "absolute pointer-events-auto",
                  sheet.positionClasses,
                  isHiddenTablet ? "hidden lg:block" : isHiddenMobile ? "hidden sm:block" : "block",
                )}
              >
                <motion.div
                  initial={
                    reduceMotion
                      ? { opacity: 1, y: 0, rotate: sheet.baseRot }
                      : { opacity: 0, y: -26, rotate: sheet.baseRot - 5 }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1, y: 0, rotate: sheet.baseRot }
                      : {
                          opacity: 1,
                          y: hoveredSheetId === sheet.id ? -4 : 0,
                          rotate:
                            hoveredSheetId === sheet.id
                              ? sheet.baseRot + (sheet.baseRot > 0 ? 3.5 : -3.5)
                              : [sheet.baseRot - 1.5, sheet.baseRot + 1.5, sheet.baseRot - 1.5],
                          scale: hoveredSheetId === sheet.id ? 1.04 : 1,
                        }
                  }
                  transition={
                    hoveredSheetId === sheet.id
                      ? { duration: 0.2, ease: "easeOut" }
                      : {
                          rotate: {
                            duration: sheet.swayDuration,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: sheet.swayDelay,
                          },
                          opacity: { duration: 0.5, delay: sheet.entranceDelay },
                          y: { duration: 0.5, delay: sheet.entranceDelay, ease: [0.18, 0.9, 0.32, 1.25] },
                          default: { duration: 0.5, delay: sheet.entranceDelay },
                        }
                  }
                  style={{ transformOrigin: "50% 8px" }}
                  onMouseEnter={() => setHoveredSheetId(sheet.id)}
                  onMouseLeave={() => setHoveredSheetId(null)}
                  onClick={() => {
                    const targetEl = document.getElementById(sheet.targetId);
                    if (targetEl) {
                      targetEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "relative flex flex-col items-center cursor-pointer select-none rounded-[5px] transition-shadow duration-200",
                    sheet.colorScheme === "yellow"
                      ? "bg-[#FFD21F] text-[#0B1F4B] border border-yellow-400/80 shadow-[0_4px_16px_rgba(11,31,75,0.13),0_1px_3px_rgba(11,31,75,0.08)]"
                      : sheet.colorScheme === "navy"
                        ? "bg-[#0B1F4B] text-white border border-white/20 shadow-[0_4px_16px_rgba(11,31,75,0.22),0_1px_3px_rgba(11,31,75,0.12)]"
                        : "bg-white text-[#0B1F4B] border border-[#0B1F4B]/15 shadow-[0_4px_16px_rgba(11,31,75,0.11),0_1px_3px_rgba(11,31,75,0.06)]",
                    hoveredSheetId === sheet.id && "shadow-[0_10px_28px_rgba(11,31,75,0.2),0_0_15px_rgba(255,210,31,0.5)]",
                    "px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 min-w-[90px] sm:min-w-[110px] md:min-w-[130px]",
                  )}
                >
                  {/* Washi Tape strip */}
                  {sheet.hasTape && sheet.tapeColor && <WashiTape color={sheet.tapeColor} />}

                  {/* Pin element (pin head anchored at top center) */}
                  <div
                    ref={(el) => {
                      pinRefs.current[sheet.id] = el;
                    }}
                  >
                    <SheetPin />
                  </div>

                  {/* Upper Case Label Line */}
                  <span
                    className={cn(
                      "block text-[8px] sm:text-[9px] md:text-[10px] font-mono font-bold tracking-widest uppercase mb-0.5",
                      sheet.colorScheme === "navy" ? "text-white/65" : "text-[#0B1F4B]/65",
                    )}
                  >
                    {sheet.label}
                  </span>

                  {/* Main Text Content */}
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    {sheet.hasGreenDot && (
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" aria-hidden="true" />
                    )}
                    <span className="font-bold text-[10px] sm:text-xs md:text-sm tracking-tight">
                      {sheet.text}
                    </span>
                  </div>

                  {/* Folded Corner */}
                  {sheet.hasFold && <FoldedCorner colorScheme={sheet.colorScheme} />}
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM ROW: NORMAL DOCUMENT FLOW, FULLY VISIBLE, NEVER CLIPPED
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        variants={bottomVariants}
        initial="hidden"
        animate="visible"
        className="relative z-30 w-full px-5 sm:px-8 lg:px-12 pt-4 pb-8 sm:pb-12"
      >
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6 text-center lg:text-left">
          {/* Left Block: Hi Aswin + Hackathon Builder + Tagline + Buttons */}
          <div className="flex flex-col items-center lg:items-start max-w-lg">
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#0B1F4B]/80 mb-1">
              Hi, I'm Aswin 👋
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1F4B] tracking-tight font-display">
              Hackathon Builder
            </h2>
            <p className="mt-1 text-sm sm:text-base text-[#0B1F4B]/85 font-medium leading-relaxed">
              I build AI tools simple enough for anyone to use.
            </p>

            {/* Buttons: Primary Navy, Secondary White, Lift 2px + Yellow Glow */}
            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-7 py-3 rounded-full text-sm font-bold text-white bg-[#0B1F4B] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(255,210,31,0.6)] active:translate-y-0 cursor-pointer"
              >
                View Projects
              </a>
              <ResumeButton className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-7 py-3 rounded-full text-sm font-bold text-[#0B1F4B] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(255,210,31,0.5)] border border-white/90 active:translate-y-0 cursor-pointer shadow-sm">
                Resume
              </ResumeButton>
            </div>
          </div>

          {/* Center: Scroll down indicator */}
          <div className="hidden md:flex flex-col items-center justify-center gap-1.5 text-[#0B1F4B]/70 py-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase">Scroll</span>
            <motion.div
              animate={reduceMotion ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 text-[#0B1F4B]" />
            </motion.div>
          </div>

          {/* Right Block: CSE student · Coimbatore + Social Row */}
          <div className="flex flex-col items-center lg:items-end">
            <span className="text-sm sm:text-base font-bold text-[#0B1F4B]">
              CSE student · Coimbatore
            </span>
            <div className="mt-2.5 flex items-center gap-2.5">
              {[
                { icon: GithubIcon, href: profile.github, label: "GitHub" },
                { icon: LinkedinIcon, href: profile.linkedin, label: "LinkedIn" },
                { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0B1F4B] shadow-[0_2px_8px_rgba(11,31,75,0.08)] border border-white/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,210,31,0.6)] hover:bg-[#FFD21F] hover:text-[#0B1F4B]"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM BLEND: TALL GRADIENT FADE + SOFT SKY-BLUE WAVE (ABOUT 120PX)
          Flows seamlessly into next section with no visible seam!
          ───────────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-b from-transparent via-[#81D4FA]/25 to-[#81D4FA]/50 z-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden leading-none select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 lg:h-28 opacity-40"
        >
          {/* Subtle translucent cloud drift */}
          <path
            d="M0,45 C280,85 560,20 840,55 C1120,90 1320,35 1440,60 L1440,120 L0,120 Z"
            fill="rgba(255, 255, 255, 0.45)"
          />
          {/* Soft sky-blue wave blend */}
          <path
            d="M0,65 C340,25 680,75 1020,48 C1240,30 1360,65 1440,58 L1440,120 L0,120 Z"
            fill="rgba(129, 212, 250, 0.7)"
          />
        </svg>
      </div>
    </section>
  );
}
