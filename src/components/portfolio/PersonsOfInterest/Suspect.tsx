import React from "react";
import { SuspectData } from "./suspectsData";
import { Placard } from "./Placard";

interface SuspectProps {
  suspect: SuspectData;
  isActive: boolean;
  isDimmed: boolean;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const Suspect: React.FC<SuspectProps> = ({
  suspect,
  isActive,
  isDimmed,
  onSelect,
  onKeyDown,
}) => {
  // Height proportion calculation relative to 175cm baseline
  // 169cm to 181cm range
  const heightScale = suspect.heightCm / 175;

  // Render prop SVG icon
  const renderProp = () => {
    switch (suspect.id) {
      case "builder":
        // Laptop
        return (
          <g transform="translate(18, 140)">
            <rect x="0" y="0" width="30" height="20" rx="2" fill="#38BDF8" opacity="0.9" />
            <rect x="2" y="2" width="26" height="15" rx="1" fill="#0B1F4B" />
            <path d="M-4 20 L34 20 L32 23 L-2 23 Z" fill="#94A3B8" />
            <line x1="6" y1="7" x2="20" y2="7" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="6" y1="11" x2="16" y2="11" stroke="#38BDF8" strokeWidth="1.5" />
          </g>
        );
      case "competitor":
        // Trophy
        return (
          <g transform="translate(16, 128)">
            <path
              d="M6 4 L22 4 L20 18 C20 24 14 28 14 28 C14 28 8 24 8 18 Z"
              fill="#FFD21F"
            />
            <path
              d="M6 7 C2 7 2 15 6 15 M22 7 C26 7 26 15 22 15"
              fill="none"
              stroke="#FFD21F"
              strokeWidth="2"
            />
            <rect x="12" y="28" width="4" height="6" fill="#D97706" />
            <rect x="8" y="34" width="12" height="4" rx="1" fill="#78350F" />
            <polygon points="14,9 15.5,13 19.5,13 16.5,15.5 17.5,19.5 14,17 10.5,19.5 11.5,15.5 8.5,13 12.5,13" fill="#FFFFFF" opacity="0.8" />
          </g>
        );
      case "leader":
        // Megaphone
        return (
          <g transform="translate(18, 134) rotate(-15)">
            <polygon points="0,10 24,0 24,24 0,14" fill="#F87171" />
            <rect x="-4" y="9" width="4" height="6" rx="1" fill="#DC2626" />
            <path d="M8 14 L8 24 L13 24 L13 14" fill="#991B1B" />
            <ellipse cx="24" cy="12" rx="3" ry="12" fill="#FECACA" />
          </g>
        );
      case "mentor":
        // Notebook / Clipboard
        return (
          <g transform="translate(20, 135) rotate(12)">
            <rect x="0" y="0" width="22" height="30" rx="2" fill="#E2E8F0" stroke="#0B1F4B" strokeWidth="1.5" />
            <line x1="5" y1="8" x2="17" y2="8" stroke="#3B82F6" strokeWidth="1.5" />
            <line x1="5" y1="13" x2="17" y2="13" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="5" y1="18" x2="14" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="5" y1="23" x2="16" y2="23" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="11" cy="3" r="2" fill="#EF4444" />
          </g>
        );
      case "poet":
        // Pen & parchment page
        return (
          <g transform="translate(16, 130)">
            <rect x="0" y="4" width="20" height="26" rx="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
            <line x1="4" y1="9" x2="16" y2="9" stroke="#92400E" strokeWidth="1" />
            <line x1="4" y1="14" x2="14" y2="14" stroke="#92400E" strokeWidth="1" />
            <line x1="4" y1="19" x2="16" y2="19" stroke="#92400E" strokeWidth="1" />
            <path d="M18 -4 L26 18 L24 20 L16 -2 Z" fill="#475569" />
            <polygon points="26,18 27,23 23,20" fill="#0F172A" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-cursor-label="INSPECT"
      aria-label={`Inspect Suspect ${suspect.number}: ${suspect.alias}, Height ${suspect.heightCm} centimeters`}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={`relative group flex flex-col items-center cursor-pointer outline-none transition-all duration-300 ${
        isDimmed ? "opacity-40 filter grayscale-[40%]" : "opacity-100"
      } ${isActive ? "z-30 -translate-y-2.5 scale-[1.025]" : "z-10 hover:-translate-y-1.5"}`}
    >
      {/* Overhead Spotlight Cone */}
      <div
        className={`absolute -top-32 w-48 h-64 pointer-events-none transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-30 group-hover:opacity-75"
        }`}
        style={{
          background:
            "conic-gradient(from 180deg at 50% 0%, rgba(255,210,31,0.24) 0deg, rgba(255,255,255,0.4) 30deg, transparent 65deg, transparent 295deg, rgba(255,255,255,0.4) 330deg, rgba(255,210,31,0.24) 360deg)",
          filter: "blur(10px)",
        }}
      />

      {/* Silhouette & Props Wrapper */}
      <div
        className="relative flex flex-col items-center"
        style={{
          transform: `scale(${heightScale})`,
          transformOrigin: "bottom center",
          height: "360px",
          width: "140px",
        }}
      >
        <svg
          viewBox="0 0 140 360"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
        >
          {/* Subtle Silhouette Body in Deep Navy */}
          {/* Head & Hair */}
          <circle cx="70" cy="46" r="24" fill="#0B1F4B" />
          {/* Hair silhouette flair */}
          <path
            d="M48 42 C48 24 92 24 92 42 C92 32 80 20 68 20 C56 20 48 30 48 42 Z"
            fill="#081738"
          />
          {/* Neck */}
          <rect x="63" y="68" width="14" height="16" rx="2" fill="#0B1F4B" />

          {/* Torso & Shoulders */}
          <path
            d="M32 94 C32 82 46 80 70 80 C94 80 108 82 108 94 L104 210 L36 210 Z"
            fill="#0B1F4B"
          />

          {/* Arms holding placard */}
          <path
            d="M32 96 L20 180 L44 186 L48 116 Z"
            fill="#081738"
          />
          <path
            d="M108 96 L120 180 L96 186 L92 116 Z"
            fill="#081738"
          />

          {/* Legs */}
          <path
            d="M42 208 L40 330 L58 330 L64 216 Z"
            fill="#06122E"
          />
          <path
            d="M98 208 L100 330 L82 330 L76 216 Z"
            fill="#06122E"
          />

          {/* Shoes */}
          <path d="M34 328 L58 328 L62 342 L28 342 Z" fill="#0B1F4B" />
          <path d="M106 328 L82 328 L78 342 L112 342 Z" fill="#0B1F4B" />

          {/* Render Specific Suspect Prop */}
          {renderProp()}
        </svg>

        {/* Chest Placard */}
        <div className="absolute top-[148px] pointer-events-none">
          <Placard suspect={suspect} isFocused={isActive} />
        </div>
      </div>

      {/* Floor Yellow Taped Stand Mark */}
      <div className="mt-2 flex flex-col items-center">
        <div
          className={`w-16 h-7 border-2 border-dashed ${
            isActive
              ? "border-[#FFD21F] bg-[#FFD21F]/20 text-[#0B1F4B] font-black scale-105"
              : "border-[#0B1F4B]/40 bg-[#0B1F4B]/5 text-[#0B1F4B]/70 font-bold"
          } rounded flex items-center justify-center font-mono text-xs transition-all duration-300 shadow-sm`}
        >
          [ {suspect.number} ]
        </div>
        <span className="text-[10px] font-mono text-[#0B1F4B]/60 tracking-wider mt-0.5">
          STAND {suspect.number}
        </span>
      </div>
    </div>
  );
};
