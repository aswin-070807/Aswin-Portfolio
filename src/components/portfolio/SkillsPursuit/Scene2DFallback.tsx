import React from "react";
import { GetawayCar, PoliceCar } from "./Car";
import {
  RoadblockProps,
  CrashSiteProps,
  TrafficCameraProps,
  InterrogationProps,
} from "./CheckpointProps";

interface Scene2DFallbackProps {
  checkpointId: number;
  isTriggered: boolean;
  isFinale?: boolean;
}

export function Scene2DFallback({
  checkpointId,
  isTriggered,
  isFinale = false,
}: Scene2DFallbackProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-1 flex flex-col justify-end overflow-hidden"
      aria-hidden="true"
    >
      {/* Upper Airspace: Stars, Moon & Police Helicopter */}
      <div className="absolute top-4 right-8 flex items-center gap-6 opacity-80">
        {/* Glowing Moon */}
        <div className="w-10 h-10 rounded-full bg-yellow-100 shadow-[0_0_20px_rgba(254,240,138,0.8)]" />
      </div>

      {/* Checkpoint Specific Props positioned along the road shoulder */}
      <div className="relative z-10 flex justify-end px-6 sm:px-12 pb-2">
        {checkpointId === 1 && <RoadblockProps />}
        {checkpointId === 2 && <CrashSiteProps />}
        {checkpointId === 3 && <TrafficCameraProps />}
        {checkpointId === 4 && <InterrogationProps />}
      </div>

      {/* Detailed Night Road Bed with Asphalt & Dashes */}
      <div className="relative w-full h-24 sm:h-28 bg-[#060e18] border-t-2 border-slate-700/80 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] flex items-center overflow-hidden">
        {/* Curbs */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 opacity-70" />
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 opacity-70" />

        {/* Dashed Center Lane Line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0 border-b-2 border-dashed border-[#FFD21F]" />

        {/* Cars in Pursuit */}
        <div className="relative z-10 flex items-center gap-6 sm:gap-10 pl-6 sm:pl-16">
          <div className="transform scale-90 sm:scale-100 origin-left">
            <PoliceCar isStopped={isFinale} />
          </div>
          <div className="transform scale-90 sm:scale-100 origin-left">
            <GetawayCar isStopped={isFinale} />
          </div>
        </div>
      </div>
    </div>
  );
}
