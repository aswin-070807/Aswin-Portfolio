import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  BarChart3,
  Bell,
  Bot,
  ChevronRight,
  Globe,
  Palette,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ServiceItem {
  caseType: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    caseType: "CASE TYPE 01",
    icon: Globe,
    title: "Web & Full-Stack Development",
    description:
      "Fast, responsive websites and web apps built with React, Node.js and clean, maintainable code.",
  },
  {
    caseType: "CASE TYPE 02",
    icon: Bot,
    title: "AI-Powered App Development",
    description:
      "Products that put generative AI to work — assistants, study tools and smart workflows.",
  },
  {
    caseType: "CASE TYPE 03",
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Clear, modern interfaces designed around your users, from wireframe to polished screens.",
  },
  {
    caseType: "CASE TYPE 04",
    icon: Wand2,
    title: "Prompt Engineering & AI Workflows",
    description:
      "Prompt strategies and AI pipelines that make your team faster and output more reliable.",
  },
  {
    caseType: "CASE TYPE 05",
    icon: BarChart3,
    title: "SEO & Analytics Basics",
    description:
      "Search-friendly setup and Google Analytics tracking so you know what's working.",
  },
];

// Inline SVG Silhouette of Noir Detective (Fedora & Trench Coat)
function DetectiveSilhouetteSVG() {
  return (
    <svg
      viewBox="0 0 100 160"
      className="w-24 h-40 fill-[#0B1F4B] opacity-100"
      aria-hidden="true"
    >
      {/* Fedora brim & crown */}
      <path d="M 12 42 Q 50 32 88 42 Q 95 44 80 47 Q 50 43 20 47 Q 5 44 12 42 Z" />
      <path d="M 28 42 C 30 24 38 16 50 16 C 62 16 70 24 72 42 Z" />
      {/* Head / Collar silhouette */}
      <path d="M 38 44 L 62 44 L 60 54 L 40 54 Z" />
      {/* Trench coat with wide upturned collar and coat hem */}
      <path d="M 40 54 L 18 72 L 14 135 L 32 158 L 48 158 L 48 105 L 52 105 L 52 158 L 68 158 L 86 135 L 82 72 L 60 54 Z" />
      {/* Lapels */}
      <path d="M 40 54 L 50 80 L 34 88 Z" fill="#0B1F4B" />
      <path d="M 60 54 L 50 80 L 66 88 Z" fill="#0B1F4B" />
    </svg>
  );
}

// Brass Doorbell Button with Ring Animation
function BrassDoorbell({ isRinging }: { isRinging: boolean }) {
  return (
    <div
      className={cn(
        "relative w-12 h-12 rounded-full p-1 bg-gradient-to-br from-[#f3e5ab] via-[#caa048] to-[#6d4d14] border-2 border-[#5c4010] shadow-[0_4px_10px_rgba(0,0,0,0.35)] flex items-center justify-center transition-transform",
        isRinging && "scale-90"
      )}
      aria-hidden="true"
    >
      {/* Screws on bezel */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4a340a]" />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4a340a]" />

      {/* Center Push Pearl Button */}
      <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#fffff8] to-[#ded5be] border border-[#8a681c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] flex items-center justify-center">
        <Bell className="w-3 h-3 text-[#5c4010]" />
      </div>
    </div>
  );
}

// Flipping OPEN / CLOSED Sign on Brass Chain
function FlippingOpenSign({ isInView }: { isInView: boolean }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative flex flex-col items-center select-none" aria-hidden="true">
      {/* Hanging Brass Chains */}
      <div className="flex justify-between w-20 px-2 mb-[-2px]">
        <div className="w-0.5 h-3.5 bg-gradient-to-b from-[#f3e5ab] to-[#caa048] border-x border-[#5c4010]/60" />
        <div className="w-0.5 h-3.5 bg-gradient-to-b from-[#f3e5ab] to-[#caa048] border-x border-[#5c4010]/60" />
      </div>

      {/* 3D Flip Sign Board */}
      <div className="w-36 sm:w-40 h-8 sm:h-9 [perspective:800px]">
        <motion.div
          initial={prefersReduced ? { rotateY: 180 } : { rotateY: 0 }}
          animate={isInView || prefersReduced ? { rotateY: 180 } : { rotateY: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: "easeInOut" }}
          className="relative w-full h-full [transform-style:preserve-3d] shadow-[0_6px_16px_rgba(0,0,0,0.35)] rounded-md"
        >
          {/* Front: CLOSED */}
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-md bg-[#16264f] border-2 border-[#caa048] p-1 flex items-center justify-center">
            <span className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-[#FFD21F] uppercase">
              CLOSED
            </span>
          </div>

          {/* Back: OPEN · ACCEPTING CLIENTS */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-md bg-[#FFFDF8] border-2 border-[#caa048] px-2 py-1 flex items-center justify-center gap-1.5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[10px] font-black tracking-wider text-[#0B1F4B] uppercase whitespace-nowrap">
              OPEN · ACCEPTING CLIENTS
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// MAIN COMPONENT: ServicesAgencyDoor
export function ServicesAgencyDoor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const prefersReduced = useReducedMotion();
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  return (
    <div
      id="services"
      ref={containerRef}
      className="relative w-full bg-transparent py-12 sm:py-16 agency-door"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. SECTION HEADER (Outside the Door) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Eyebrow */}
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#0B1F4B]/70 mb-2">
            SERVICES
          </p>

          {/* Heading with yellow underline on "for you" */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            What I can do{" "}
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              for you
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-sm sm:text-base font-semibold text-[#1A3A7A] leading-relaxed">
            Available for freelance projects and internships.
          </p>
        </div>

        {/* 2. THE DOOR FRAME (Deep navy wood with brass trim) */}
        <div className="relative rounded-[20px] bg-gradient-to-b from-[#0f1b3d] to-[#16264f] p-4 sm:p-7 md:p-9 shadow-[0_25px_60px_rgba(11,31,75,0.35),0_0_0_1px_rgba(255,255,255,0.08)] border-2 border-[#1e346b] overflow-hidden">
          {/* Subtle wood-grain gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 [background:repeating-linear-gradient(90deg,transparent,transparent_3px,rgba(255,255,255,0.03)_3px,rgba(255,255,255,0.03)_6px)]"
            aria-hidden="true"
          />

          {/* Thin brass trim line running along inside edge */}
          <div
            className="absolute inset-2 sm:inset-3 rounded-[16px] border border-[#c9a24a]/60 pointer-events-none shadow-[inset_0_0_8px_rgba(201,162,74,0.15)]"
            aria-hidden="true"
          />

          {/* Left Edge Brass Hinges (decorative) */}
          <div
            className="absolute -left-1.5 top-14 w-2.5 h-8 rounded-sm bg-gradient-to-r from-[#f3e5ab] via-[#caa048] to-[#7a5815] border border-[#5c4010] shadow-sm hidden md:block"
            aria-hidden="true"
          />
          <div
            className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-8 rounded-sm bg-gradient-to-r from-[#f3e5ab] via-[#caa048] to-[#7a5815] border border-[#5c4010] shadow-sm hidden md:block"
            aria-hidden="true"
          />
          <div
            className="absolute -left-1.5 bottom-14 w-2.5 h-8 rounded-sm bg-gradient-to-r from-[#f3e5ab] via-[#caa048] to-[#7a5815] border border-[#5c4010] shadow-sm hidden md:block"
            aria-hidden="true"
          />

          {/* Door Top Header: Centered Brass Nameplate & Hanging OPEN Sign */}
          <div className="relative mb-6 sm:mb-8 pt-1 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Empty balance spacer for desktop */}
            <div className="hidden sm:block w-36" aria-hidden="true" />

            {/* Brass Nameplate Centered on Top Frame */}
            <div className="relative px-5 sm:px-7 py-1.5 rounded-sm bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] border-2 border-[#5c4010] shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex items-center gap-3 select-none">
              {/* Left/Right screw rivets */}
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#4a340a] shadow-inner"
                aria-hidden="true"
              />
              <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-[#2c1d06] uppercase">
                SUITE 01 · OPEN FOR CASES
              </span>
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#4a340a] shadow-inner"
                aria-hidden="true"
              />
            </div>

            {/* The Flipping OPEN Sign on Right */}
            <FlippingOpenSign isInView={isInView} />
          </div>

          {/* 5. THE DETECTIVE SILHOUETTE (Walks across once behind the glass panes) */}
          {!prefersReduced && (
            <motion.div
              initial={{ x: "-20%", opacity: 0 }}
              animate={
                isInView
                  ? {
                      x: ["0%", "45%", "95%", "110%"],
                      opacity: [0, 0.12, 0.12, 0],
                    }
                  : { opacity: 0 }
              }
              transition={{ duration: 4.8, ease: "easeInOut" }}
              className="absolute top-24 pointer-events-none select-none z-0 hidden lg:block"
              aria-hidden="true"
            >
              <DetectiveSilhouetteSVG />
            </motion.div>
          )}

          {/* 3. THE SIX GLASS PANES (3 cols x 2 rows on desktop) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {SERVICES_DATA.map((service, index) => {
              const IconComp = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={
                    prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }
                  }
                  animate={
                    isInView || prefersReduced
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  transition={{
                    duration: 0.45,
                    delay: prefersReduced ? 0 : index * 0.09,
                    ease: "easeOut",
                  }}
                  className="group relative rounded-[14px] bg-white/85 hover:bg-white/95 backdrop-blur-md border border-[#c9a24a]/60 hover:border-[#f3e5ab] p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(201,162,74,0.22)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
                >
                  {/* Frosted Glass Corner Reflection Streak */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-30 [background:linear-gradient(135deg,rgba(255,255,255,0.7)_0%,transparent_35%,transparent_100%)]"
                    aria-hidden="true"
                  />

                  {/* Top: Small typewriter Case Type Tag */}
                  <div className="relative z-10 mb-4 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#0B1F4B] font-mono text-[9.5px] font-bold text-[#f3e5ab] tracking-wider uppercase shadow-xs">
                      {service.caseType}
                    </span>

                    {/* Small round brass-rimmed badge with icon */}
                    <div className="w-10 h-10 rounded-full bg-[#E1F5FE] border-2 border-[#c9a24a] text-[#0B1F4B] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <IconComp className="w-5 h-5 text-[#0B1F4B]" />
                    </div>
                  </div>

                  {/* Service Title & Description (Highly readable navy text) */}
                  <div className="relative z-10">
                    <h3 className="font-display text-lg font-bold text-[#0B1F4B] leading-snug">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-sm font-medium leading-relaxed text-[#0B1F4B]/90">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Pane 6: The Call-To-Action Pane (Dark navy wood with Doorbell button) */}
            <motion.div
              initial={
                prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }
              }
              animate={
                isInView || prefersReduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 15 }
              }
              transition={{
                duration: 0.45,
                delay: prefersReduced ? 0 : 5 * 0.09,
                ease: "easeOut",
              }}
              className="relative md:col-span-2 lg:col-span-1 rounded-[14px] bg-[#142244] border border-[#c9a24a]/80 hover:border-[#FFD21F] shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <a
                href="#contact"
                onMouseEnter={() => setIsCtaHovered(true)}
                onMouseLeave={() => setIsCtaHovered(false)}
                onFocus={() => setIsCtaHovered(true)}
                onBlur={() => setIsCtaHovered(false)}
                className="group flex flex-col justify-between h-full p-5 sm:p-6 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFD21F] rounded-[14px]"
              >
                {/* Subtle wood texture in CTA pane */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25 [background:radial-gradient(circle_at_top_right,rgba(201,162,74,0.15),transparent_70%)]"
                  aria-hidden="true"
                />

                <div className="relative z-10 mb-4">
                  <span className="px-2 py-0.5 rounded bg-[#FFD21F] font-mono text-[9.5px] font-black text-[#0B1F4B] tracking-wider uppercase shadow-xs">
                    DOORBELL · CONSULTATION
                  </span>
                  <h3 className="mt-3 text-xl sm:text-2xl font-bold font-display text-white">
                    Have a project in mind?
                  </h3>
                </div>

                {/* Bottom interactive area: Doorbell & "Let's talk ›" */}
                <div className="relative z-10 pt-4 border-t border-[#c9a24a]/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <BrassDoorbell isRinging={isCtaHovered} />
                    <span className="font-mono text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                      RING FOR SERVICE
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 font-bold text-base text-[#FFD21F] group-hover:underline">
                    <span>Let's talk</span>
                    <ChevronRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
