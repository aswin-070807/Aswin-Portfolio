import React, { useEffect, useRef, useState } from "react";

interface EvidenceMarker {
  id: number;
  x: number;
  y: number;
  num: number;
}

interface SnapBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function SmartCursor() {
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [cursorMode, setCursorMode] = useState<"default" | "button" | "file" | "text" | "pursuit">(
    "default",
  );
  const [cursorLabel, setCursorLabel] = useState<string>("OPEN");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [evidenceMarkers, setEvidenceMarkers] = useState<EvidenceMarker[]>([]);
  const [tapRipples, setTapRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Refs for smooth rAF animation
  const mouseRef = useRef({ x: -100, y: -100 });
  const dotRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  const snapBoundsRef = useRef<SnapBounds | null>(null);
  const clickCountRef = useRef(0);
  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // DOM node refs for direct transform updates (60fps)
  const dotDomRef = useRef<HTMLDivElement>(null);
  const ringDomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if pointer is fine (desktop)
    const mediaFine = window.matchMedia("(pointer: fine)");
    const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    setIsPointerFine(mediaFine.matches);
    setReducedMotion(mediaReduced.matches);

    const onMediaChange = () => setIsPointerFine(mediaFine.matches);
    const onReducedChange = () => setReducedMotion(mediaReduced.matches);

    mediaFine.addEventListener("change", onMediaChange);
    mediaReduced.addEventListener("change", onReducedChange);

    // On touch devices: show tap ripple
    const onTouchStart = (e: TouchEvent) => {
      if (mediaFine.matches) return;
      const touch = e.touches[0];
      if (!touch) return;
      const newRipple = { id: Date.now() + Math.random(), x: touch.clientX, y: touch.clientY };
      setTapRipples((prev) => [...prev.slice(-4), newRipple]);
      setTimeout(() => {
        setTapRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      mediaFine.removeEventListener("change", onMediaChange);
      mediaReduced.removeEventListener("change", onReducedChange);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  useEffect(() => {
    if (!isPointerFine) {
      document.documentElement.classList.remove("custom-cursor-active");
      return;
    }

    document.documentElement.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (!cursorVisible) setCursorVisible(true);

      // Inspect hovered element
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target) return;

      // 1. Check if inside Pursuit section
      const pursuitEl = target.closest("#skills, [data-cursor-section='pursuit']");
      if (pursuitEl) {
        setCursorMode("pursuit");
        snapBoundsRef.current = null;
        return;
      }

      // 2. Check for File / Evidence dossier element
      const fileEl = target.closest("[data-cursor='file']") as HTMLElement | null;
      if (fileEl) {
        setCursorMode("file");
        const rect = fileEl.getBoundingClientRect();
        snapBoundsRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
        setCursorLabel(fileEl.getAttribute("data-cursor-label") || "OPEN FILE");
        return;
      }

      // 3. Check for links, buttons, interactive elements
      const btnEl = target.closest(
        "a, button, [role='button'], input[type='submit'], [data-cursor='button']",
      ) as HTMLElement | null;
      if (btnEl) {
        setCursorMode("button");
        const rect = btnEl.getBoundingClientRect();
        snapBoundsRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
        const customLabel = btnEl.getAttribute("data-cursor-label");
        const textContent = (btnEl.textContent || "").trim().toUpperCase();
        let derived = "OPEN";
        if (customLabel) derived = customLabel;
        else if (textContent.includes("RESUME") || textContent.includes("CV"))
          derived = "DOWNLOAD RESUME";
        else if (textContent.includes("SEND") || textContent.includes("SUBMIT")) derived = "SEND";
        else if (textContent.includes("VIEW") || textContent.includes("PREVIEW")) derived = "VIEW";
        setCursorLabel(derived);
        return;
      }

      // 4. Check for text headings or paragraphs
      const textEl = target.closest("p, h1, h2, h3, h4, h5, h6, input[type='text'], textarea");
      if (textEl && !target.closest("button, a")) {
        setCursorMode("text");
        snapBoundsRef.current = null;
        return;
      }

      // 5. Default
      setCursorMode("default");
      snapBoundsRef.current = null;

      // Check background theme of current section
      const darkSection = target.closest(
        "[data-cursor-theme='dark'], .bg-[#050c18], .bg-[#0a1422], .bg-[#0f1b2d]",
      );
      setIsDarkTheme(!!darkSection);
    };

    const onMouseLeave = () => setCursorVisible(false);
    const onMouseEnter = () => setCursorVisible(true);

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 200);

      if (reducedMotion) return;

      // Increment evidence marker number
      clickCountRef.current += 1;
      const markerNum = clickCountRef.current;

      if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
      clickResetTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 4000);

      // Add evidence marker
      const newMarker: EvidenceMarker = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        num: markerNum,
      };

      setEvidenceMarkers((prev) => [...prev.slice(-4), newMarker]);

      setTimeout(() => {
        setEvidenceMarkers((prev) => prev.filter((m) => m.id !== newMarker.id));
      }, 1500);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mousedown", onMouseDown);

    // Lerp loop with requestAnimationFrame
    let rafId: number;
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      // Instant dot position
      dotRef.current.x = targetX;
      dotRef.current.y = targetY;

      // Lagged ring position
      const factor = reducedMotion ? 1 : 0.22;
      ringRef.current.x = lerp(ringRef.current.x, targetX, factor);
      ringRef.current.y = lerp(ringRef.current.y, targetY, factor);

      if (dotDomRef.current) {
        dotDomRef.current.style.transform = `translate3d(${dotRef.current.x}px, ${dotRef.current.y}px, 0)`;
      }

      if (ringDomRef.current) {
        if (snapBoundsRef.current && (cursorMode === "button" || cursorMode === "file")) {
          const b = snapBoundsRef.current;
          ringDomRef.current.style.transform = `translate3d(${b.left}px, ${b.top}px, 0)`;
          ringDomRef.current.style.width = `${b.width}px`;
          ringDomRef.current.style.height = `${b.height}px`;
        } else {
          ringDomRef.current.style.transform = `translate3d(${ringRef.current.x}px, ${ringRef.current.y}px, 0)`;
          ringDomRef.current.style.width = "";
          ringDomRef.current.style.height = "";
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mousedown", onMouseDown);
      cancelAnimationFrame(rafId);
      if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
    };
  }, [isPointerFine, cursorVisible, reducedMotion, cursorMode]);

  // Touch device view: Tap ripples only
  if (!isPointerFine) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden"
        aria-hidden="true"
      >
        {tapRipples.map((r) => (
          <div
            key={r.id}
            className="absolute rounded-full border-2 border-[#FFD21F] bg-[#FFD21F]/20 animate-ping"
            style={{
              left: r.x - 14,
              top: r.y - 14,
              width: 28,
              height: 28,
            }}
          />
        ))}
      </div>
    );
  }

  if (!cursorVisible) return null;

  // Color theme: dark section vs light section
  const ringColor = isDarkTheme ? "#FFD21F" : "#0B1F4B";
  const dotColor = isDarkTheme ? "#22d3ee" : "#0B1F4B";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ─── 1. EVIDENCE MARKERS (Dropped on click) ─── */}
      {evidenceMarkers.map((m) => (
        <div
          key={m.id}
          className="absolute z-10 transition-opacity duration-500 ease-out flex flex-col items-center"
          style={{
            left: m.x,
            top: m.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {/* Tent Marker Body */}
          <div className="relative px-1.5 py-0.5 rounded-t bg-[#FFD21F] border border-slate-900 shadow-lg text-slate-950 font-mono font-black text-[11px] leading-tight flex items-center justify-center min-w-[20px]">
            {m.num}
            {/* Tent fold crease */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-600/60" />
          </div>
          {/* Marker tent stand feet */}
          <div className="w-5 h-1 bg-slate-900/40 rounded-full blur-[1px]" />
        </div>
      ))}

      {/* ─── 2. INSTANT CENTER DOT (Hidden in button/file snap mode) ─── */}
      {cursorMode !== "button" && cursorMode !== "file" && cursorMode !== "pursuit" && (
        <div
          ref={dotDomRef}
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none -ml-[3px] -mt-[3px] will-change-transform z-30 transition-colors duration-200"
          style={{
            backgroundColor: dotColor,
            boxShadow: isDarkTheme ? "0 0 6px rgba(34,211,238,0.8)" : "none",
          }}
        />
      )}

      {/* ─── 3. MORPHING DETECTIVE RING / VIEWFINDER ─── */}
      {cursorMode !== "pursuit" && (
        <div
          ref={ringDomRef}
          className="fixed top-0 left-0 pointer-events-none will-change-transform z-20"
        >
          {/* MODE: DEFAULT (Thin Detective Lens Ring with Crosshair Notches) */}
          {cursorMode === "default" && (
            <div
              className={`relative -ml-3.5 -mt-3.5 w-7 h-7 rounded-full border border-dashed transition-all duration-150 ${
                isClicking ? "scale-150 bg-white/40 ring-4 ring-white" : ""
              }`}
              style={{
                borderColor: ringColor,
                boxShadow: isDarkTheme ? "0 0 10px rgba(255,210,31,0.4)" : "none",
              }}
            >
              {/* Detective Crosshair Notches */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-current"
                style={{ color: ringColor }}
              />
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-current"
                style={{ color: ringColor }}
              />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-current"
                style={{ color: ringColor }}
              />
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-current"
                style={{ color: ringColor }}
              />
            </div>
          )}

          {/* MODE: TEXT (Shrinks to Thin Vertical Beam) */}
          {cursorMode === "text" && (
            <div
              className="-ml-[1px] -mt-2.5 w-[2px] h-5 rounded-full"
              style={{
                backgroundColor: ringColor,
                boxShadow: isDarkTheme ? "0 0 8px rgba(34,211,238,0.8)" : "none",
              }}
            />
          )}

          {/* MODE: BUTTON & FILE (Snaps to Element Bounding Box with Corner Brackets) */}
          {(cursorMode === "button" || cursorMode === "file") && (
            <div className="relative w-full h-full -m-1 p-2">
              {/* 4 Corner Viewfinder Brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FFD21F] shadow-sm" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FFD21F] shadow-sm" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FFD21F] shadow-sm" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FFD21F] shadow-sm" />

              {/* Viewfinder Label Tag (Above-Right) */}
              <div className="absolute -top-5 right-0 px-1.5 py-0.5 rounded bg-slate-950/90 border border-[#FFD21F]/80 text-[#FFD21F] font-mono text-[9px] font-bold tracking-wider uppercase shadow-md whitespace-nowrap">
                {cursorLabel}
              </div>

              {/* Camera Flash effect on click */}
              {isClicking && (
                <div className="absolute inset-0 bg-white/40 rounded animate-ping pointer-events-none" />
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── 4. MODE: PURSUIT (Police Searchlight Conical Spotlight) ─── */}
      {cursorMode === "pursuit" && (
        <div
          ref={ringDomRef}
          className="fixed top-0 left-0 pointer-events-none will-change-transform z-20"
        >
          <div
            className={`relative -ml-24 -mt-24 w-48 h-48 rounded-full pointer-events-none transition-transform duration-100 ${
              isClicking ? "scale-125" : ""
            }`}
            style={{
              background:
                "radial-gradient(circle, rgba(34,211,238,0.28) 0%, rgba(34,211,238,0.12) 50%, rgba(34,211,238,0) 70%)",
            }}
          >
            {/* Center Reticle */}
            <div className="absolute inset-0 m-auto w-8 h-8 rounded-full border border-cyan-400/80 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.6)]">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
            </div>

            {/* Target Locked HUD Tag */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#071322]/90 border border-cyan-400 text-cyan-300 font-mono text-[8.5px] font-bold tracking-widest uppercase whitespace-nowrap shadow-lg">
              TARGET LOCKED · 92%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
