import { useEffect, useRef, useState } from "react";

const BAND_1_ITEMS = [
  "AGENTIC AI",
  "LLM APPS",
  "REACT",
  "NODE.JS",
  "PYTHON",
  "AI/ML",
  "FULL-STACK BUILDS",
];

const BAND_2_ITEMS = [
  "HACKATHON BUILDER",
  "PROBLEM SOLVER",
  "CODECHEF",
  "LEETCODE",
  "BUILD",
  "BREAK",
  "FIX",
  "SHIP",
];

export function MarqueeTape() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [scrollYOffset, setScrollYOffset] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaReduced.matches);
    setIsMobile(window.innerWidth <= 768);

    const onMediaChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaReduced.addEventListener("change", onMediaChange);

    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });

    // Tab visibility handling
    const onVisibilityChange = () => setIsTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Entrance intersection observer
    const el = containerRef.current;
    if (el) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry && entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(el);

      return () => {
        observer.disconnect();
        mediaReduced.removeEventListener("change", onMediaChange);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }

    return () => {
      mediaReduced.removeEventListener("change", onMediaChange);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // Subtle scroll parallax (desktop only)
  useEffect(() => {
    if (reduceMotion || isMobile || typeof window === "undefined") return;

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // Shift a few pixels relative to viewport center
        const centerOffset = (window.innerHeight / 2 - rect.top) * 0.035;
        setScrollYOffset(Math.max(-18, Math.min(18, centerOffset)));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion, isMobile]);

  // Repeat sequence 4 times per half track to ensure seamless infinite looping on any screen size up to 4K
  const renderTrackItems = (
    items: string[],
    starClass: string,
    textClass: string
  ) => {
    const sequence = [];
    for (let loop = 0; loop < 4; loop++) {
      for (let i = 0; i < items.length; i++) {
        sequence.push(
          <span key={`${loop}-${i}`} className="inline-flex items-center">
            <span className={textClass}>{items[i]}</span>
            <span className={`mx-3 sm:mx-4 select-none ${starClass}`}>✦</span>
          </span>
        );
      }
    }
    return sequence;
  };

  const playState = isTabHidden ? "paused" : "running";

  return (
    <section
      ref={containerRef}
      className="relative w-full py-6 sm:py-8 my-1 sm:my-3 overflow-x-clip select-none pointer-events-auto bg-transparent"
      style={{ minHeight: "140px" }}
      aria-label="Skill Highlights"
    >
      {/* Screen reader announcement for accessibility */}
      <p className="sr-only">
        Skills: Agentic AI, LLM apps, React, Node.js, Python, AI/ML, full-stack builds
      </p>

      {/* Decorative crossing tape bands */}
      <div className="relative flex flex-col items-center justify-center w-full" aria-hidden="true">
        {/* ── BAND 1 (FRONT): SUNSHINE YELLOW, SCROLLS LEFT, ROTATED -2deg ── */}
        <div
          className="marquee-band relative z-10 w-[116vw] -ml-[8vw] flex items-center shadow-[0_6px_16px_rgba(11,31,75,0.18)] cursor-default transition-transform duration-700 ease-out py-2.5 sm:py-3.5 lg:py-4 bg-[#FFD21F]"
          style={{
            transform: reduceMotion
              ? isMobile
                ? "rotate(-1.5deg)"
                : "rotate(-2deg)"
              : isVisible
              ? `rotate(${isMobile ? -1.5 : -2}deg) translateX(${scrollYOffset}px)`
              : `rotate(${isMobile ? -1.5 : -2}deg) translateX(-8%)`,
            opacity: reduceMotion || isVisible ? 1 : 0,
            transformOrigin: "center center",
          }}
        >
          <div
            className="flex w-max will-change-transform"
            style={{
              animation: reduceMotion
                ? "none"
                : `marquee-left 38s linear infinite ${playState}`,
            }}
          >
            {/* Half 1 */}
            <div className="flex shrink-0 items-center whitespace-nowrap font-display font-extrabold uppercase tracking-[0.08em] text-[#0B1F4B] text-sm sm:text-base md:text-lg lg:text-[20px]">
              {renderTrackItems(BAND_1_ITEMS, "text-[#0B1F4B]/80", "text-[#0B1F4B]")}
            </div>
            {/* Half 2 (Exact duplicate for seamless looping) */}
            <div className="flex shrink-0 items-center whitespace-nowrap font-display font-extrabold uppercase tracking-[0.08em] text-[#0B1F4B] text-sm sm:text-base md:text-lg lg:text-[20px]">
              {renderTrackItems(BAND_1_ITEMS, "text-[#0B1F4B]/80", "text-[#0B1F4B]")}
            </div>
          </div>
        </div>

        {/* ── BAND 2 (BEHIND): DEEP NAVY, SCROLLS RIGHT, ROTATED +1.5deg, CROSSES TAPE ── */}
        <div
          className="marquee-band relative z-[5] w-[116vw] -ml-[8vw] -mt-3.5 sm:-mt-4 md:-mt-5 lg:-mt-6 flex items-center shadow-[0_6px_16px_rgba(11,31,75,0.22)] cursor-default transition-transform duration-700 ease-out py-2.5 sm:py-3.5 lg:py-4 bg-[#0B1F4B]"
          style={{
            transform: reduceMotion
              ? isMobile
                ? "rotate(1deg)"
                : "rotate(1.5deg)"
              : isVisible
              ? `rotate(${isMobile ? 1 : 1.5}deg) translateX(${-scrollYOffset}px)`
              : `rotate(${isMobile ? 1 : 1.5}deg) translateX(8%)`,
            opacity: reduceMotion || isVisible ? 1 : 0,
            transformOrigin: "center center",
          }}
        >
          <div
            className="flex w-max will-change-transform"
            style={{
              animation: reduceMotion
                ? "none"
                : `marquee-right 48s linear infinite ${playState}`,
            }}
          >
            {/* Half 1 */}
            <div className="flex shrink-0 items-center whitespace-nowrap font-display font-extrabold uppercase tracking-[0.08em] text-white text-sm sm:text-base md:text-lg lg:text-[20px]">
              {renderTrackItems(BAND_2_ITEMS, "text-[#FFD21F]", "text-white")}
            </div>
            {/* Half 2 (Exact duplicate for seamless looping) */}
            <div className="flex shrink-0 items-center whitespace-nowrap font-display font-extrabold uppercase tracking-[0.08em] text-white text-sm sm:text-base md:text-lg lg:text-[20px]">
              {renderTrackItems(BAND_2_ITEMS, "text-[#FFD21F]", "text-white")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
