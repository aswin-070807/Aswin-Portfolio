import React from "react";
import { SkillsPursuitDesktop } from "./SkillsPursuitDesktop";
import { SkillsPursuitMobile } from "./SkillsPursuitMobile";

export function SkillsPursuit() {
  return (
    <section
      id="skills"
      className="relative w-full bg-transparent overflow-hidden"
      aria-label="Field Kit Skills Section"
    >
      {/* 1. SECTION HEADER */}
      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 text-center">
        {/* Eyebrow in letter-spaced monospace */}
        <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#0B1F4B]/70 mb-2">
          FIELD KIT · THE PURSUIT
        </p>

        {/* Heading: "My toolkit" with yellow underline */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
          My{" "}
          <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
            toolkit
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base font-semibold text-[#1A3A7A] leading-relaxed max-w-2xl mx-auto">
          Tech stack used in my projects: React.js, Node.js, Python.
        </p>
      </div>

      {/* 2. DESKTOP LAYOUT (Sticky 400vh Scroll-Driven Night Chase) */}
      <div className="hidden md:block">
        <SkillsPursuitDesktop />
      </div>

      {/* 3. MOBILE & TABLET LAYOUT (Stacked Checkpoint Cards) */}
      <div className="md:hidden block max-w-[1100px] mx-auto px-4 sm:px-6 pb-16">
        <SkillsPursuitMobile />
      </div>
    </section>
  );
}

// Named alias for backward compatibility
export const ToolkitSurveillance = SkillsPursuit;
export default SkillsPursuit;
