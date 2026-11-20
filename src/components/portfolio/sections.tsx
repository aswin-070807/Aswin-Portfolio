import {
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  Flag,
  Globe,
  GraduationCap,
  Layers,
  MapPin,
  MessageCircle,
  Palette,
  Search,
  Sparkles,
  Trophy,
  Users,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  about,
  achievements,
  certifications,
  education,
  experience,
  highlights,
  marqueeTech,
  profile,
  projectFilters,
  projects,
  projectStack,
  services,
  skillGroups,
  stats,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { AboutDossier } from "./AboutDossier";
import { AchievementsCaseFiles } from "./AchievementsCaseFiles";
import { EducationAcademicForm } from "./EducationAcademicForm";
import { ExperienceServiceRecord } from "./ExperienceServiceRecord";
import { ProjectsEvidenceLocker } from "./ProjectsEvidenceLocker";
import { SkillsPursuit } from "./SkillsPursuit/SkillsPursuit";
import { CaseBoard as CaseBoardComponent } from "./CaseBoard/CaseBoard";
import { CertificationsFloorPlan } from "./CertificationsFloorPlan";
import { ServicesAgencyDoor } from "./ServicesAgencyDoor";
import { CaseConclusionFindings } from "./CaseConclusionFindings";
import { GithubIcon } from "./chrome";
import { Counter, Reveal, Section, TiltCard } from "./primitives";

const icons: Record<string, LucideIcon> = {
  code: Code2,
  layers: Layers,
  sparkles: Sparkles,
  users: Users,
  globe: Globe,
  bot: Bot,
  palette: Palette,
  wand: Wand2,
  chart: BarChart3,
  trophy: Trophy,
  zap: Zap,
  message: MessageCircle,
  flag: Flag,
};

export function SkyWaveDivider({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none relative w-full overflow-hidden leading-none select-none py-1",
        flip ? "rotate-180" : "",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 64"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-12 opacity-35"
      >
        <path
          d="M0,28 C280,56 560,8 840,36 C1120,64 1320,18 1440,32 L1440,64 L0,64 Z"
          fill="rgba(255, 255, 255, 0.45)"
        />
        <path
          d="M0,42 C340,16 680,54 1020,30 C1240,14 1360,48 1440,38 L1440,64 L0,64 Z"
          fill="rgba(129, 212, 250, 0.6)"
        />
      </svg>
    </div>
  );
}

function IconBadge({
  icon: Icon,
  className,
  highlight = false,
}: {
  icon: LucideIcon;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <span
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-300",
        highlight
          ? "bg-[#FFD21F] text-[#0B1F4B] shadow-[0_0_15px_rgba(255,210,31,0.5)]"
          : "bg-[#E1F5FE] text-[#0B1F4B] border border-[#0B1F4B]/10",
        className,
      )}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATS SECTION (Removed - Replaced by Evidence Tags in About)
   ───────────────────────────────────────────────────────────── */
export function Stats() {
  return null;
}

/* ─────────────────────────────────────────────────────────────
   ABOUT SECTION (Subject Dossier Component)
   ───────────────────────────────────────────────────────────── */
export function About() {
  return <AboutDossier />;
}

/* ─────────────────────────────────────────────────────────────
   SKILLS SECTION (The Pursuit - Scroll-Driven Night Chase)
   ───────────────────────────────────────────────────────────── */
export function Skills() {
  return (
    <div className="relative w-full bg-transparent">
      <SkyWaveDivider className="mb-4" />
      <SkillsPursuit />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CASE BOARD (Case Files: Solved)
   ───────────────────────────────────────────────────────────── */
export function CaseBoard() {
  return <CaseBoardComponent />;
}

// Legacy alias to maintain compatibility
export function PersonsOfInterest() {
  return <CaseBoardComponent />;
}

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENTS / HACKATHONS (Case Files Design Powered by Live Google Sheet)
   ───────────────────────────────────────────────────────────── */
export function Achievements() {
  return (
    <div id="achievements" className="relative w-full bg-transparent">
      <SkyWaveDivider flip className="mb-2" />
      <AchievementsCaseFiles />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROJECTS SECTION (Evidence Locker Design Powered by Live Google Sheet)
   ───────────────────────────────────────────────────────────── */
export function Projects() {
  return (
    <div id="projects" className="relative w-full bg-transparent">
      <SkyWaveDivider className="mb-2" />
      <ProjectsEvidenceLocker />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TIMELINE (Experience & Education)
   ───────────────────────────────────────────────────────────── */
function Timeline({
  items,
}: {
  items: {
    title: string;
    sub: string;
    period: string;
    extra?: string;
    points?: string[];
    icon: LucideIcon;
  }[];
}) {
  return (
    <ol className="relative ml-4 border-l-2 border-[#0B1F4B]/30 md:ml-6">
      {items.map((it, i) => (
        <Reveal
          key={it.title + it.period}
          delay={i * 0.1}
          className="relative pb-10 pl-10 last:pb-0"
        >
          <li>
            <span className="absolute -left-[1.35rem] top-0 grid h-10 w-10 place-items-center rounded-full border-2 border-[#0B1F4B] bg-white text-[#0B1F4B] shadow-sm">
              <it.icon className="h-4 w-4" />
            </span>
            <div className="rounded-2xl p-6 bg-white/95 border border-white/80 shadow-[0_8px_30px_rgba(11,31,75,0.07)]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-[#0B1F4B]">{it.title}</h3>
                <span className="rounded-full bg-[#E1F5FE] px-3 py-1 text-xs font-bold text-[#0B1F4B]">
                  {it.period}
                </span>
              </div>
              <p className="mt-1 font-semibold text-[#1A3A7A]">{it.sub}</p>
              {it.extra && (
                <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1F4B]">
                  {it.extra}
                </p>
              )}
              {it.points && (
                <ul className="mt-3 space-y-1.5 text-sm text-[#0B1F4B]/85 font-medium">
                  {it.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="text-[#FFD21F] font-bold mt-0.5">●</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

export function Experience() {
  return <ExperienceServiceRecord />;
}

export function Education() {
  return <EducationAcademicForm />;
}

/* ─────────────────────────────────────────────────────────────
   CERTIFICATIONS (Crime Scene Floor Plan & Live Sheet Sync)
   ───────────────────────────────────────────────────────────── */
export function Certifications() {
  return (
    <div className="relative w-full bg-transparent">
      <SkyWaveDivider className="mb-4" />
      <CertificationsFloorPlan />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SERVICES SECTION (The Detective Agency Door)
   ───────────────────────────────────────────────────────────── */
export function Services() {
  return (
    <div className="relative w-full bg-transparent">
      <ServicesAgencyDoor />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HIGHLIGHTS / CASE CONCLUSION (Findings Index Cards & Case Closed)
   ───────────────────────────────────────────────────────────── */
export function Highlights() {
  return <CaseConclusionFindings />;
}

export { MapPin, profile };
