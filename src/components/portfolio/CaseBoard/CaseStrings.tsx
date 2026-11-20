import React, { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CaseStringsProps {
  boardRef: React.RefObject<HTMLDivElement | null>;
  pinRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  hoveredFileId: string | null;
  caseCount: number;
}

interface Point {
  x: number;
  y: number;
}

export function CaseStrings({
  boardRef,
  pinRefs,
  hoveredFileId,
  caseCount,
}: CaseStringsProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [hasScrolledIn, setHasScrolledIn] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Update pin coordinates relative to the board
  const updatePinCoordinates = useCallback(() => {
    if (!boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();

    const newPoints: Point[] = [];
    for (let i = 0; i < caseCount; i++) {
      const pinEl = pinRefs.current[i];
      if (pinEl) {
        const pinRect = pinEl.getBoundingClientRect();
        newPoints.push({
          x: pinRect.left + pinRect.width / 2 - boardRect.left,
          y: pinRect.top + pinRect.height / 2 - boardRect.top,
        });
      }
    }

    if (newPoints.length === caseCount) {
      setPoints(newPoints);
    }
  }, [boardRef, pinRefs, caseCount]);

  // Track scroll-in visibility
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasScrolledIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [boardRef]);

  // Recalculate on mount, resize, and scroll
  useEffect(() => {
    updatePinCoordinates();
    window.addEventListener("resize", updatePinCoordinates);
    // Extra update after layout settles
    const timeout = setTimeout(updatePinCoordinates, 400);

    return () => {
      window.removeEventListener("resize", updatePinCoordinates);
      clearTimeout(timeout);
    };
  }, [updatePinCoordinates]);

  // Map hoveredFileId to card index: "builder"=0, "competitor"=1, "leader"=2, "mentor"=3, "poet"=4
  const hoveredIndex =
    hoveredFileId === "builder"
      ? 0
      : hoveredFileId === "competitor"
        ? 1
        : hoveredFileId === "leader"
          ? 2
          : hoveredFileId === "mentor"
            ? 3
            : hoveredFileId === "poet"
              ? 4
              : -1;

  if (points.length < 2) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block"
      aria-hidden="true"
    >
      <defs>
        {/* Subtle glow filter for hovered strings */}
        <filter id="string-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#EF4444" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* String segments connecting 01 -> 02 -> 03 -> 04 -> 05 */}
      {points.slice(0, -1).map((p1, idx) => {
        const p2 = points[idx + 1]!;
        const isSegmentHovered = hoveredIndex === idx || hoveredIndex === idx + 1;

        // Subtle curve with realistic gravitational sag
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 + 10;
        const pathData = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;

        return (
          <g key={`string-${idx}`}>
            {/* Background shadow for realistic depth */}
            <path
              d={pathData}
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              className="translate-y-1"
            />
            {/* The investigative red string */}
            <path
              d={pathData}
              fill="none"
              stroke="#DC2626"
              strokeWidth={isSegmentHovered ? "2.2" : "1.4"}
              strokeLinecap="round"
              filter={isSegmentHovered ? "url(#string-glow)" : undefined}
              className={cn(
                "transition-all duration-300",
                isSegmentHovered ? "stroke-[#EF4444] opacity-100" : "opacity-75",
                hasScrolledIn && !reduceMotion ? "animate-string-draw" : "",
              )}
              style={{
                strokeDasharray: reduceMotion ? "none" : 500,
                strokeDashoffset: reduceMotion || hasScrolledIn ? 0 : 500,
                transition: "stroke-dashoffset 400ms cubic-bezier(0.16, 1, 0.3, 1), stroke 300ms, stroke-width 300ms, opacity 300ms",
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
