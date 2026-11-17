import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CHECKPOINTS_DATA, type CheckpointData } from "./skillsData";
import { SkillSign } from "./SkillSign";
import { GetawayCar, PoliceCar } from "./Car";
import {
  RoadblockProps,
  CrashSiteProps,
  TrafficCameraProps,
  InterrogationProps,
} from "./CheckpointProps";

function MobileCheckpointCard({
  checkpoint,
  index,
}: {
  checkpoint: CheckpointData;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl bg-[#091526]/95 border border-cyan-500/30 p-4 shadow-xl overflow-hidden"
    >
      {/* Checkpoint Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-cyan-500/20 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-bold text-cyan-300 tracking-wider">{checkpoint.title}</span>
        </div>
        <span className="text-[10px] text-slate-400">CP {checkpoint.checkpointNumber}/4</span>
      </div>

      {/* Compact SVG Scene Header: Road + Car + Checkpoint Props */}
      <div className="relative w-full h-24 rounded-xl bg-[#060e18] border border-cyan-500/20 mb-3 overflow-hidden flex flex-col justify-between p-2">
        {/* Checkpoint Props in upper section */}
        <div className="relative z-10 flex justify-end">
          {checkpoint.id === 1 && <RoadblockProps className="scale-75 origin-top-right" />}
          {checkpoint.id === 2 && <CrashSiteProps className="scale-75 origin-top-right" />}
          {checkpoint.id === 3 && <TrafficCameraProps className="scale-75 origin-top-right" />}
          {checkpoint.id === 4 && <InterrogationProps className="scale-75 origin-top-right" />}
        </div>

        {/* Mini Road Bed with Pursuit Cars */}
        <div className="relative w-full h-10 rounded bg-[#08121f] border-y border-slate-700/80 flex items-center overflow-hidden">
          {/* Dashed Lane Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0 border-b border-dashed border-[#FFD21F]/80" />

          {/* Cars in Pursuit */}
          <div className="relative z-10 flex items-center gap-3 pl-2">
            <div className="scale-65 origin-left">
              <PoliceCar isStopped={false} />
            </div>
            <div className="scale-65 origin-left">
              <GetawayCar isStopped={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Skill Signs with Speedometer Gauges */}
      <div className="space-y-2.5">
        {checkpoint.skills.map((skill, sIdx) => (
          <SkillSign
            key={skill.name}
            skill={skill}
            category={checkpoint.category}
            index={sIdx}
            isTriggered={isInView}
          />
        ))}
      </div>
    </div>
  );
}

export function SkillsPursuitMobile() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-full space-y-6 select-none">
      {CHECKPOINTS_DATA.map((checkpoint, index) => (
        <MobileCheckpointCard key={checkpoint.id} checkpoint={checkpoint} index={index} />
      ))}

      {/* Finale Stamp Card for Mobile */}
      <div className="relative rounded-2xl bg-[#0b1626] border border-red-500/40 p-6 text-center shadow-2xl overflow-hidden">
        {/* Police Flashing Overlay */}
        <motion.div
          animate={!reduceMotion ? { opacity: [0.1, 0.35, 0.1] } : { opacity: 0.2 }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-blue-600/20 to-red-600/20 blur-xl pointer-events-none"
        />

        {/* "CAUGHT" Stamp */}
        <motion.div
          initial={{ scale: 1.3, opacity: 0, rotate: -10 }}
          whileInView={{ scale: 1, opacity: 1, rotate: -6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="inline-block px-6 py-2 rounded-lg border-3 border-red-500 bg-[#140508]/95 text-red-500 font-display font-black text-3xl tracking-widest uppercase shadow-[0_0_30px_rgba(239,68,68,0.5)] will-change-transform"
        >
          CAUGHT
        </motion.div>

        {/* Finale Line */}
        <p className="mt-4 font-mono text-[11px] font-bold tracking-wider text-cyan-300 uppercase bg-[#081528] border border-cyan-500/40 py-1.5 px-3 rounded-full inline-block">
          4/4 CHECKPOINTS CLEARED · OPERATOR: <span className="text-white">ASWIN A</span>
        </p>
      </div>
    </div>
  );
}
