import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
  const [cursorMode, setCursorMode] = useState<
    "default" | "button" | "file" | "text" | "pursuit"
  >("default");
  const [cursorLabel, setCursorLabel] = useState<string>("OPEN");
  const [isClicking, setIsClicking] = useState(false);
  const [evidenceMarkers, setEvidenceMarkers] = useState<EvidenceMarker[]>([]);
  const [tapRipples, setTapRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  // Coordinates refs for zero-overhead rAF
  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  // Cached target & bounds (Never queried inside rAF!)
  const activeElementRef = useRef<HTMLElement | null>(null);
  const cachedBoundsRef = useRef<SnapBounds | null>(null);

  // rAF and idle tracking
  const rafRunning = useRef(false);
  const lastMoveTime = useRef(0);
  const clickCountRef = useRef(0);
  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // DOM direct transforms
  const dotDomRef = useRef<HTMLDivElement>(null);
  const ringDomRef = useRef<HTMLDivElement>(null);

  const modeRef = useRef<CursorMode>("default");
  const labelRef = useRef<string>("OPEN");

  const updateMode = useCallback((m: CursorMode) => {
    if (modeRef.current !== m) {
      modeRef.current = m;
      setCursorMode(m);
    }
  }, []);

  const updateLabel = useCallback((l: string) => {
    if (labelRef.current !== l) {
      labelRef.current = l;
      setCursorLabel(l);
    }
  }, []);

  useEffect(() => {
    const mediaFine = window.matchMedia("(pointer: fine)");
    setIsPointerFine(mediaFine.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };
    mediaFine.addEventListener("change", onMediaChange);

    // Touch device tap ripple
    const onTouchStart = (e: TouchEvent) => {
      if (mediaFine.matches) return;
      const t = e.touches[0];
      if (!t) return;
      const ripple = { id: Date.now() + Math.random(), x: t.clientX, y: t.clientY };
      setTapRipples((prev) => [...prev.slice(-3), ripple]);
      setTimeout(() => {
        setTapRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 500);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      mediaFine.removeEventListener("change", onMediaChange);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  useEffect(() => {
    if (!isPointerFine) {
      document.documentElement.classList.remove("custom-cursor-active");
      return;
    }

    document.documentElement.classList.add("custom-cursor-active");

    // Helper: start rAF loop only when mouse moves
    const startLoop = () => {
      if (rafRunning.current) return;
      rafRunning.current = true;
      requestAnimationFrame(tick);
    };

    // Main rAF tick: Only updates transform, zero getBoundingClientRect
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      const tx = mousePos.current.x;
      const ty = mousePos.current.y;

      // Instant dot
      dotPos.current.x = tx;
      dotPos.current.y = ty;

      // Lagged ring
      ringPos.current.x = lerp(ringPos.current.x, tx, 0.22);
      ringPos.current.y = lerp(ringPos.current.y, ty, 0.22);

      if (dotDomRef.current) {
        dotDomRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }

      if (ringDomRef.current) {
        if (cachedBoundsRef.current) {
          const b = cachedBoundsRef.current;
          ringDomRef.current.style.transform = `translate3d(${b.left}px, ${b.top}px, 0)`;
          ringDomRef.current.style.width = `${b.width}px`;
          ringDomRef.current.style.height = `${b.height}px`;
        } else {
          ringDomRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
          ringDomRef.current.style.width = "";
          ringDomRef.current.style.height = "";
        }
      }

      // Check if mouse is idle and ring has settled
      const dist = Math.hypot(tx - ringPos.current.x, ty - ringPos.current.y);
      const isIdle = performance.now() - lastMoveTime.current > 150;

      if (isIdle && dist < 0.2) {
        rafRunning.current = false; // Stop rAF loop when idle!
        return;
      }

      requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      lastMoveTime.current = performance.now();
      if (!cursorVisible) setCursorVisible(true);
      startLoop();
    };

    // Event Delegation for hover detection (Single listener on document!)
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target === activeElementRef.current) return;

      // 1. File / Evidence cards check
      const fileEl = target.closest("[data-cursor='file']") as HTMLElement | null;
      if (fileEl) {
        if (activeElementRef.current !== fileEl) {
          activeElementRef.current = fileEl;
          const rect = fileEl.getBoundingClientRect();
          cachedBoundsRef.current = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          };
          updateLabel(fileEl.getAttribute("data-cursor-label") || "OPEN FILE");
          updateMode("file");
          startLoop();
        }
        return;
      }

      // 2. Interactive buttons & links check
      const btnEl = target.closest("a, button, [role='button'], input[type='submit']") as HTMLElement | null;
      if (btnEl) {
        if (activeElementRef.current !== btnEl) {
          activeElementRef.current = btnEl;
          const rect = btnEl.getBoundingClientRect();
          cachedBoundsRef.current = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          };
          const custom = btnEl.getAttribute("data-cursor-label");
          const txt = (btnEl.textContent || "").trim().toUpperCase();
          let derived = "OPEN";
          if (custom) derived = custom;
          else if (txt.includes("RESUME")) derived = "DOWNLOAD RESUME";
          else if (txt.includes("SEND") || txt.includes("SUBMIT")) derived = "SEND";
          else if (txt.includes("VIEW")) derived = "VIEW";
          updateLabel(derived);
          updateMode("button");
          startLoop();
        }
        return;
      }

      // 3. Text headings or paragraphs
      const textEl = target.closest("p, h1, h2, h3, h4, h5, h6");
      if (textEl && !target.closest("button, a")) {
        activeElementRef.current = textEl as HTMLElement;
        cachedBoundsRef.current = null;
        updateMode("text");
        startLoop();
        return;
      }

      // 4. Default
      activeElementRef.current = null;
      cachedBoundsRef.current = null;
      updateMode("default");
      startLoop();
    };

    // Throttled passive scroll/resize update for cached bounding box
    let scrollThrottle = false;
    const onScrollOrResize = () => {
      if (scrollThrottle || !activeElementRef.current) return;
      scrollThrottle = true;
      requestAnimationFrame(() => {
        if (activeElementRef.current) {
          const r = activeElementRef.current.getBoundingClientRect();
          cachedBoundsRef.current = {
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
          };
          startLoop();
        }
        scrollThrottle = false;
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 180);

      clickCountRef.current += 1;
      const num = clickCountRef.current;

      if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
      clickResetTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 4000);

      const marker: EvidenceMarker = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        num,
      };

      setEvidenceMarkers((prev) => [...prev.slice(-4), marker]);
      setTimeout(() => {
        setEvidenceMarkers((prev) => prev.filter((m) => m.id !== marker.id));
      }, 1500);
    };

    const onMouseLeave = () => setCursorVisible(false);
    const onMouseEnter = () => setCursorVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
    };
  }, [isPointerFine, cursorVisible]);

  // Touch device: tap ripples only
  if (!isPointerFine) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden" aria-hidden="true">
        {tapRipples.map((r) => (
          <div
            key={r.id}
            className="absolute rounded-full border-2 border-[#FFD21F] bg-[#FFD21F]/20 animate-ping"
            style={{
              left: r.x - 12,
              top: r.y - 12,
              width: 24,
              height: 24,
            }}
          />
        ))}
      </div>
    );
  }

  if (!cursorVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none" aria-hidden="true">
      {/* Evidence Markers (Tent shaped) */}
      {evidenceMarkers.map((m) => (
        <div
          key={m.id}
          className="absolute z-10 transition-opacity duration-300 flex flex-col items-center"
          style={{
            left: m.x,
            top: m.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="relative px-1.5 py-0.5 rounded-t bg-[#FFD21F] border border-slate-900 shadow-md text-slate-950 font-mono font-black text-[10px] leading-tight">
            {m.num}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-600/60" />
          </div>
          <div className="w-4 h-0.5 bg-slate-900/30 rounded-full" />
        </div>
      ))}

      {/* Center Dot */}
      {cursorMode !== "button" && cursorMode !== "file" && (
        <div
          ref={dotDomRef}
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none -ml-[3px] -mt-[3px] will-change-transform z-30 bg-[#FFD21F]"
          style={{
            boxShadow: "0 0 6px rgba(255,210,31,0.8)",
          }}
        />
      )}

      {/* Detective Lens Ring / Snapped Viewfinder */}
      <div
        ref={ringDomRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-20"
      >
        {cursorMode === "default" && (
          <div
            className={cn(
              "relative -ml-3.5 -mt-3.5 w-7 h-7 rounded-full border border-dashed border-[#FFD21F] transition-transform duration-100",
              isClicking && "scale-125 bg-[#FFD21F]/20"
            )}
            style={{
              boxShadow: "0 0 8px rgba(255,210,31,0.4)",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-[#FFD21F]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-[#FFD21F]" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-[#FFD21F]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-[#FFD21F]" />
          </div>
        )}

        {cursorMode === "text" && (
          <div className="-ml-[1px] -mt-2.5 w-[2px] h-5 rounded-full bg-[#FFD21F] shadow-[0_0_6px_rgba(255,210,31,0.8)]" />
        )}

        {(cursorMode === "button" || cursorMode === "file") && (
          <div className="relative w-full h-full -m-1 p-2">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FFD21F]" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FFD21F]" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FFD21F]" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FFD21F]" />
            <div className="absolute -top-5 right-0 px-1.5 py-0.5 rounded bg-slate-950/90 border border-[#FFD21F] text-[#FFD21F] font-mono text-[9px] font-bold tracking-wider uppercase shadow-md whitespace-nowrap">
              {cursorLabel}
            </div>
            {isClicking && (
              <div className="absolute inset-0 bg-[#FFD21F]/20 rounded animate-ping pointer-events-none" />
            )}
          </div>
        )}

        {cursorMode === "pursuit" && (
          <div className="relative -ml-4 -mt-4 w-8 h-8 rounded-full border border-cyan-400 bg-cyan-400/10 shadow-[0_0_12px_rgba(34,211,238,0.6)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
          </div>
        )}
      </div>
    </div>
  );
}
