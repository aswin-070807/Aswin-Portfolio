import React from "react";
import { SuspectData } from "./suspectsData";

interface PlacardProps {
  suspect: SuspectData;
  isFocused?: boolean;
}

export const Placard: React.FC<PlacardProps> = ({ suspect, isFocused }) => {
  return (
    <div
      className={`relative w-44 sm:w-48 px-3 py-2 bg-[#0F172A] border-2 ${
        isFocused ? "border-[#FFD21F] shadow-[0_0_15px_rgba(255,210,31,0.5)]" : "border-white/30"
      } rounded-sm shadow-xl select-none transition-all duration-300 font-mono`}
    >
      {/* Top hanger notch / chain holes */}
      <div className="absolute -top-1.5 left-4 w-1.5 h-1.5 rounded-full bg-white/40" />
      <div className="absolute -top-1.5 right-4 w-1.5 h-1.5 rounded-full bg-white/40" />

      {/* Header bar */}
      <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-white/60 tracking-widest border-b border-white/20 pb-1 mb-1">
        <span>POLICE LINEUP</span>
        <span>{suspect.code}</span>
      </div>

      {/* Suspect Alias */}
      <div className="text-center font-black tracking-wider text-[11px] sm:text-xs text-white uppercase drop-shadow-sm truncate">
        {suspect.alias}
      </div>

      {/* Bottom stats row */}
      <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-[#FFD21F] font-bold pt-1 border-t border-white/10 mt-1">
        <span>NO. 0{suspect.number}</span>
        <span>{suspect.heightCm} CM / {suspect.heightFtIn}</span>
      </div>
    </div>
  );
};
