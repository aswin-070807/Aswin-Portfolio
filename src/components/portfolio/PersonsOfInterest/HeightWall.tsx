import React from "react";

interface HeightWallProps {
  activeHeightCm: number;
  inView?: boolean;
}

const HEIGHT_MARKS = [
  { cm: 200, ftIn: '6\'7"', major: true },
  { cm: 195, ftIn: '6\'5"', major: false },
  { cm: 190, ftIn: '6\'3"', major: true },
  { cm: 185, ftIn: '6\'1"', major: false },
  { cm: 180, ftIn: '5\'11"', major: true },
  { cm: 175, ftIn: '5\'9"', major: false },
  { cm: 170, ftIn: '5\'7"', major: true },
  { cm: 165, ftIn: '5\'5"', major: false },
  { cm: 160, ftIn: '5\'3"', major: true },
  { cm: 155, ftIn: '5\'1"', major: false },
  { cm: 150, ftIn: '4\'11"', major: true },
];

export function HeightWall({ activeHeightCm, inView = true }: HeightWallProps) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      {/* 1. Realistic Cinder-Block / Painted Concrete Texture */}
      <div className="absolute inset-0 bg-[#2C384A]" />

      {/* Concrete block grid using CSS linear gradients */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.45) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.45) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "160px 48px",
        }}
      />

      {/* Subtle concrete grain noise via inline SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.14] mix-blend-soft-light">
        <filter id="concrete-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.8 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#concrete-noise)" />
      </svg>

      {/* Vignette and depth gradient */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0B1528]/40 to-[#070D1B]/85" />

      {/* 2. Height Chart Scale (150cm to 200cm) */}
      <div className="absolute inset-x-0 bottom-0 top-0">
        {HEIGHT_MARKS.map(({ cm, ftIn, major }) => (
          <div
            key={cm}
            className="absolute inset-x-0 flex items-center justify-between"
            style={{
              bottom: `calc(var(--floor-offset, 48px) + (${cm} * var(--px-per-cm, 2.4px)))`,
            }}
          >
            {/* Left CM label + major tick */}
            <div className="flex items-center gap-1.5 pl-3 sm:pl-5">
              <span
                className={`font-mono text-[9px] sm:text-[11px] tabular-nums tracking-widest ${
                  major
                    ? "font-bold text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    : "font-normal text-slate-400/60"
                }`}
              >
                {cm} cm
              </span>
              <div
                className={`h-[1px] bg-slate-400 ${
                  major ? "w-6 sm:w-10 opacity-70" : "w-3 sm:w-5 opacity-40"
                }`}
              />
            </div>

            {/* Horizontal guideline spanning the entire wall */}
            <div
              className={`flex-1 mx-2 sm:mx-4 border-b ${
                major
                  ? "border-slate-400/25 border-dashed"
                  : "border-slate-500/10 border-dotted"
              }`}
            />

            {/* Right Feet-Inches label + major tick */}
            <div className="flex items-center gap-1.5 pr-3 sm:pl-0 pr-3 sm:pr-5">
              <div
                className={`h-[1px] bg-slate-400 ${
                  major ? "w-6 sm:w-10 opacity-70" : "w-3 sm:w-5 opacity-40"
                }`}
              />
              <span
                className={`font-mono text-[9px] sm:text-[11px] tabular-nums tracking-widest ${
                  major
                    ? "font-bold text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    : "font-normal text-slate-400/60"
                }`}
              >
                {ftIn}
              </span>
            </div>
          </div>
        ))}

        {/* 3. Laser Height Lock Guide Line for Active Suspect */}
        <div
          className="absolute inset-x-0 h-[2px] transition-all duration-300 ease-out z-10 pointer-events-none"
          style={{
            bottom: `calc(var(--floor-offset, 48px) + (${activeHeightCm} * var(--px-per-cm, 2.4px)))`,
            background: "linear-gradient(90deg, transparent 2%, #EF4444 15%, #F87171 50%, #EF4444 85%, transparent 98%)",
            boxShadow: "0 0 10px 1px rgba(239, 68, 68, 0.65), 0 0 2px rgba(255, 255, 255, 0.9)",
            opacity: inView ? 0.95 : 0,
          }}
        >
          {/* Active height badge on laser line */}
          <div className="absolute right-4 sm:right-7 -top-2.5 px-1.5 py-0.5 rounded-xs bg-red-600/90 text-[8px] sm:text-[9px] font-mono font-bold text-white tracking-widest uppercase shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            LOCK {activeHeightCm} CM
          </div>
        </div>
      </div>

      {/* 4. Floor Perspective Strip */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 border-t border-slate-600/60"
        style={{
          height: "var(--floor-offset, 48px)",
          background: "linear-gradient(to bottom, #1E293B 0%, #0F172A 40%, #0A1120 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 6px 12px rgba(0,0,0,0.6)",
        }}
      >
        {/* Subtle perspective floor floorboards */}
        <div
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 19%, rgba(255,255,255,0.12) 20%)",
          }}
        />
      </div>
    </div>
  );
}
