import React from "react";
import { SuspectData } from "./suspectsData";
import { Hammer, Trophy, Flag, Compass, Feather } from "lucide-react";

interface PlacardProps {
  suspect: SuspectData;
  isCompact?: boolean;
}

export function Placard({ suspect, isCompact = false }: PlacardProps) {
  const renderIcon = () => {
    const props = { className: isCompact ? "w-3 h-3 text-white" : "w-3.5 h-3.5 text-white" };
    switch (suspect.icon) {
      case "hammer":
        return <Hammer {...props} />;
      case "trophy":
        return <Trophy {...props} />;
      case "flag":
        return <Flag {...props} />;
      case "compass":
        return <Compass {...props} />;
      case "quill":
        return <Feather {...props} />;
      default:
        return <Hammer {...props} />;
    }
  };

  return (
    <div
      className={`relative select-none pointer-events-none transition-transform duration-200 z-30 ${
        isCompact ? "w-[112px] py-1.5 px-2" : "w-[118px] lg:w-[142px] py-1.5 lg:py-2 px-2 lg:px-2.5"
      } rounded-md bg-[#0F172A] border-[1.5px] border-slate-200 shadow-[0_8px_16px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4)]`}
      style={{
        transform: `translate(${suspect.placardOffset.x}px, ${suspect.placardOffset.y}px) rotate(${suspect.placardTilt}deg)`,
      }}
    >
      {/* 1. Metallic clips at the top */}
      <div className="absolute -top-2 left-2.5 w-2 h-2.5 rounded-xs bg-gradient-to-b from-slate-200 to-slate-400 border border-slate-600 shadow-xs" />
      <div className="absolute -top-2 right-2.5 w-2 h-2.5 rounded-xs bg-gradient-to-b from-slate-200 to-slate-400 border border-slate-600 shadow-xs" />

      {/* 2. Top Header: Precinct & Case Code */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-0.5 mb-1">
        <span className="font-mono text-[6.5px] lg:text-[7.5px] font-bold tracking-widest text-slate-400 uppercase">
          POLICE LINEUP
        </span>
        <span className="font-mono text-[6.5px] lg:text-[7.5px] font-bold tracking-wider text-amber-400">
          {suspect.code}
        </span>
      </div>

      {/* 3. Character Name in Bold Condensed Font */}
      <div className="text-center my-0.5">
        <h4
          className={`font-black tracking-wider text-slate-100 uppercase leading-none ${
            isCompact ? "text-[10px]" : "text-[11px] lg:text-[13px]"
          }`}
          style={{ fontFamily: "'Barlow Condensed', 'Space Grotesk', Impact, sans-serif" }}
        >
          {suspect.name}
        </h4>
      </div>

      {/* 4. Subline: Number & Height */}
      <div className="flex items-center justify-between pt-0.5 border-t border-slate-700/80 mt-1">
        <span className="font-mono text-[7px] lg:text-[8px] font-semibold text-slate-400">
          NO. 0{suspect.number}
        </span>
        <span className="font-mono text-[7px] lg:text-[8px] font-bold text-slate-300">
          {suspect.heightCm} CM
        </span>
      </div>

      {/* 5. Themed Icon Sticker ON TOP of Board Corner */}
      <div
        className="absolute -top-2 -right-2 z-40 p-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.5)] border-2 border-slate-900"
        style={{
          backgroundColor: suspect.accentColor,
          transform: "rotate(10deg)",
        }}
        title={`${suspect.name} Specialty Icon`}
      >
        {renderIcon()}
      </div>
    </div>
  );
}
