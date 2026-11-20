import React, { useState, useRef, useEffect } from "react";
import { caseFiles, CaseFile } from "./caseFilesData";
import { CaseCard } from "./CaseCard";
import { CaseFileDialog } from "./CaseFileDialog";
import { CaseStrings } from "./CaseStrings";
import { cn } from "@/lib/utils";

export function CaseBoard() {
  const [activeFile, setActiveFile] = useState<CaseFile | null>(null);
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  // Focus return handling when dialog closes
  const lastActiveIndexRef = useRef<number | null>(null);

  const handleSelectFile = (file: CaseFile, index: number) => {
    lastActiveIndexRef.current = index;
    setActiveFile(file);
  };

  const handleCloseDialog = () => {
    setActiveFile(null);
    if (lastActiveIndexRef.current !== null) {
      cardRefs.current[lastActiveIndexRef.current]?.focus();
    }
  };

  return (
    <section
      id="case-board"
      aria-label="Case Files: Solved - Investigative Evidence Board"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Anchor alias for old links to #lineup */}
      <span id="lineup" className="sr-only" aria-hidden="true" />

      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F4B]/8 border border-[#0B1F4B]/15 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#FFD21F] animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs font-bold tracking-widest text-[#0B1F4B] uppercase">
            CASE FILES
          </span>
        </div>

        {/* Headline (condensed, uppercase) */}
        <h2 className="font-['Barlow_Condensed',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#0B1F4B] drop-shadow-sm">
          CASE FILES: SOLVED
        </h2>

        {/* Subtext */}
        <p className="mt-3 text-sm sm:text-base text-[#0B1F4B]/80 max-w-2xl mx-auto font-medium leading-relaxed">
          Five areas of work, each investigated, built, and delivered. Open a file to see the evidence.
        </p>
      </div>

      {/* Detective Evidence Board Container */}
      <div
        ref={boardRef}
        className={cn(
          "relative rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden",
          "bg-[#091530] text-white",
          "border border-[#1A3A7A]/60 shadow-[0_24px_50px_-12px_rgba(11,31,75,0.45)]",
        )}
      >
        {/* Dark Navy Slate Ambient Texture (No cork, no collage mess) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(79, 195, 247, 0.25), transparent 70%), linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 32px 32px, 32px 32px",
          }}
          aria-hidden="true"
        />

        {/* Board Header Badge */}
        <div className="relative z-10 flex items-center justify-between pb-6 mb-4 sm:mb-8 border-b border-white/10 text-xs font-mono text-white/60">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span className="tracking-wider uppercase">ALL 05 DOSSIERS RESOLVED</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-white/40">
            <span>SEC: INVESTIGATION WALL</span>
            <span>ASWIN A / PRINCIPAL ENGINEER</span>
          </div>
        </div>

        {/* Dynamic Connecting Red String Overlay */}
        <CaseStrings
          boardRef={boardRef}
          pinRefs={pinRefs}
          hoveredFileId={hoveredFileId}
          caseCount={caseFiles.length}
        />

        {/* Cards Grid / Row:
            - Desktop: 5 cards in a slightly staggered single row
            - Tablet: 2-row layout (3 top, 2 bottom centered)
            - Mobile: single vertical stack */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-5 lg:gap-4 items-stretch">
          {caseFiles.map((file, idx) => {
            const isActive = activeFile?.id === file.id;
            const isHovered = hoveredFileId === file.id;

            return (
              <CaseCard
                key={file.id}
                cardIndex={idx}
                file={file}
                isActive={isActive}
                isHovered={isHovered}
                onHover={(hovered) => setHoveredFileId(hovered ? file.id : null)}
                onSelect={(selected) => handleSelectFile(selected, idx)}
                ref={(el) => (cardRefs.current[idx] = el)}
                pinRef={(el) => (pinRefs.current[idx] = el)}
              />
            );
          })}
        </div>
      </div>

      {/* Expanded Case File Modal / Dialog */}
      <CaseFileDialog
        file={activeFile}
        isOpen={Boolean(activeFile)}
        onClose={handleCloseDialog}
      />
    </section>
  );
}
