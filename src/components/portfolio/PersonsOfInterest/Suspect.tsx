import React from "react";
import { SuspectData } from "./suspectsData";
import { Placard } from "./Placard";

interface SuspectProps {
  suspect: SuspectData;
  isActive: boolean;
  isAnyActive: boolean;
  onSelect: (suspect: SuspectData) => void;
  onHover: (suspect: SuspectData | null) => void;
  reduceMotion?: boolean;
}

export function Suspect({
  suspect,
  isActive,
  isAnyActive,
  onSelect,
  onHover,
  reduceMotion = false,
}: SuspectProps) {
  // Head top lands exactly at stated heightCm on the height chart!
  // In the 400x900 canvas, feet are at y=880 (20px up from bottom) and head is at y=60 (820px tall).
  // Total canvas height = (heightCm * pxPerCm) * (900 / 820).
  const containerHeightStyle = `calc(var(--px-per-cm, 2.4px) * ${suspect.heightCm} * (900 / 820))`;
  const containerBottomStyle = `calc(var(--floor-offset, 48px) - (var(--px-per-cm, 2.4px) * ${suspect.heightCm} * (20 / 820)))`;

  // Visual state: active vs dimmed
  const isDimmed = isAnyActive && !isActive;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${suspect.name}, Suspect number ${suspect.number}, Height ${suspect.heightCm} cm. Press Enter to view case file.`}
      className={`group relative flex flex-col items-center justify-end cursor-pointer outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm ${
        isDimmed ? "opacity-45 filter grayscale-[55%] scale-[0.98]" : "opacity-100 scale-100 z-20"
      }`}
      style={{
        width: "min(280px, 19vw)",
        height: "100%",
      }}
      onClick={() => onSelect(suspect)}
      onMouseEnter={() => onHover(suspect)}
      onMouseLeave={() => onHover(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(suspect);
        }
      }}
    >
      {/* 1. Overhead Spotlight Cone */}
      <div
        className={`absolute -top-10 inset-x-0 h-[480px] pointer-events-none transition-opacity duration-300 ${
          isActive ? "opacity-100" : isDimmed ? "opacity-20" : "opacity-40 group-hover:opacity-80"
        }`}
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 75%)`,
          clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)",
        }}
        aria-hidden="true"
      />

      {/* 2. Warm Floor Glow Ellipse (Active suspect) */}
      <div
        className={`absolute bottom-8 w-44 h-12 rounded-full pointer-events-none transition-all duration-300 blur-md ${
          isActive ? "opacity-100 scale-110" : "opacity-0 scale-90"
        }`}
        style={{
          background: `radial-gradient(ellipse, ${suspect.accentGlow} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* 3. Figure Container (Sized strictly according to stated heightCm) */}
      <div
        className={`relative flex items-center justify-center transition-transform duration-300 ${
          isActive && !reduceMotion
            ? "-translate-y-2.5 scale-[1.02]"
            : "group-hover:-translate-y-1.5 group-hover:scale-[1.01]"
        }`}
        style={{
          position: "absolute",
          bottom: containerBottomStyle,
          height: containerHeightStyle,
          width: "auto",
          aspectRatio: "400 / 900",
        }}
      >
        {/* Figure PNG */}
        <img
          src={suspect.imageSrc}
          alt={`${suspect.name}, suspect ${suspect.number}`}
          width={400}
          height={900}
          loading={suspect.number === 1 ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] select-none pointer-events-none"
        />

        {/* Real Case Number overlaid on the jumpsuit's white chest patch */}
        <div
          className="absolute font-mono font-black text-slate-900 tracking-tighter select-none pointer-events-none"
          style={{
            left: `${suspect.chestPatchOffset.x}%`,
            top: `${suspect.chestPatchOffset.y}%`,
            transform: "translate(-50%, -50%)",
            fontSize: "clamp(6px, 0.75vw, 8.5px)",
            letterSpacing: "-0.05em",
          }}
          aria-hidden="true"
        >
          {suspect.code}
        </div>

        {/* Handheld Lineup Placard Overlay at Chest Level */}
        <div
          className="absolute z-30"
          style={{
            left: "50%",
            top: "37.5%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Placard suspect={suspect} />
        </div>
      </div>

      {/* 4. Glossy Flipped Floor Reflection */}
      <div
        className="absolute overflow-hidden pointer-events-none select-none z-10"
        style={{
          top: "calc(100% - var(--floor-offset, 48px))",
          height: "calc(var(--floor-offset, 48px) * 0.9)",
          width: "min(280px, 19vw)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 85%)",
        }}
        aria-hidden="true"
      >
        <div
          className="relative w-full flex items-center justify-center opacity-30 filter blur-[0.8px]"
          style={{
            height: containerHeightStyle,
            transform: "scaleY(-1)",
            transformOrigin: "top center",
          }}
        >
          <img
            src={suspect.imageSrc}
            alt=""
            width={400}
            height={900}
            className="w-full h-full object-contain select-none"
          />
        </div>
      </div>

      {/* 5. Floor Stand Marker: [ X ] STAND X */}
      <div
        className="absolute z-20 flex items-center justify-center"
        style={{
          bottom: "12px",
        }}
      >
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border font-mono text-[9px] sm:text-[10px] tracking-widest transition-all duration-200 ${
            isActive
              ? "border-amber-400 bg-amber-400/15 text-amber-300 font-bold shadow-[0_0_10px_rgba(255,210,31,0.35)]"
              : "border-slate-700/80 bg-slate-900/60 text-slate-400 group-hover:border-slate-500 group-hover:text-slate-200"
          }`}
        >
          <span className="font-bold text-amber-400">[ {suspect.number} ]</span>
          <span className="hidden sm:inline">STAND {suspect.number}</span>
        </div>
      </div>
    </div>
  );
}
