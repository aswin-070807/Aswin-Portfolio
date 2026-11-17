import React, { useEffect, useState, useRef } from "react";

interface SearchlightMaskProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

export function SearchlightMask({ containerRef, children }: SearchlightMaskProps) {
  const [lightPos, setLightPos] = useState<{ x: number; y: number } | null>(null);
  const [isClicking, setIsClicking] = useState(false);
  const isFinePointer = useRef(false);

  useEffect(() => {
    isFinePointer.current = window.matchMedia("(pointer: fine)").matches;

    const container = containerRef.current;
    if (!container) return;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      setLightPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const onPointerDown = () => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 220);
    };

    const onPointerLeave = () => {
      if (isFinePointer.current) {
        setLightPos(null);
      }
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerleave", onPointerLeave);

    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [containerRef]);

  // Mask style: radial-gradient spotlight centered at cursor
  const maskStyle = lightPos
    ? {
        background: `radial-gradient(circle ${isClicking ? 260 : 210}px at ${lightPos.x}px ${lightPos.y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.42) 75%, rgba(255,255,255,0.35) 100%)`,
        WebkitMaskImage: `radial-gradient(circle ${isClicking ? 260 : 210}px at ${lightPos.x}px ${lightPos.y}px, black 0%, black 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.35) 100%)`,
      }
    : undefined;

  return (
    <div className="relative w-full h-full">
      {/* Content Layer (Dimmed to ~35% outside light beam, 100% inside) */}
      <div className="w-full h-full transition-[opacity,filter] duration-150" style={maskStyle}>
        {children}
      </div>

      {/* Target Locked Tag when hovering over scene */}
      {lightPos && (
        <div
          className="pointer-events-none fixed z-40 hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-[9px] font-bold tracking-wider shadow-lg"
          style={{
            left: (containerRef.current?.getBoundingClientRect().left || 0) + lightPos.x + 18,
            top: (containerRef.current?.getBoundingClientRect().top || 0) + lightPos.y - 12,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          TARGET LOCKED · 92%
        </div>
      )}
    </div>
  );
}
