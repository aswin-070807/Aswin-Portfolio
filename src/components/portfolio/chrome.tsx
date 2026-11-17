import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navLinks, profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { ResumeButton } from "./ResumeButton";

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
    </svg>
  );
}

export function Navbar() {
  const [active, setActive] = useState("home");
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const activeRef = useRef("home");

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }

      if (!ticking) {
        requestAnimationFrame(() => {
          if (progressBarRef.current) {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
            progressBarRef.current.style.transform = `scaleX(${progress})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id && e.target.id !== activeRef.current) {
            activeRef.current = e.target.id;
            setActive(e.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    document.querySelectorAll("section[id]").forEach((s) => obs.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={progressBarRef}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[#FFD21F] shadow-[0_0_10px_rgba(255,210,31,0.8)] pointer-events-none will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "sticky top-0 z-50 h-[72px] transition-all duration-300",
          scrolled
            ? "bg-white/96 border-b border-[#0B1F4B]/10 shadow-[0_4px_24px_rgba(11,31,75,0.05)]"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <nav
          className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8"
          aria-label="Main"
        >
          <a
            href="#home"
            className="group flex items-center gap-2.5 font-display text-lg font-bold"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0B1F4B] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              A
            </span>
            <span className="tracking-tight text-[#0B1F4B] transition-colors whitespace-nowrap">
              {profile.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
            {navLinks.map((l) => {
              const isCurrent = active === l.id;
              const isHover = hovered === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onMouseEnter={() => setHovered(l.id)}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200",
                      isCurrent
                        ? "text-[#0B1F4B]"
                        : "text-[#0B1F4B]/70 hover:text-[#0B1F4B]",
                    )}
                  >
                    {l.label}
                    {/* Yellow active-link underline */}
                    {isCurrent && (
                      <span
                        className="absolute inset-x-2.5 bottom-0 h-[3px] rounded-full bg-[#FFD21F] transition-opacity duration-200"
                      />
                    )}
                    {/* Hover indicator when not active */}
                    {isHover && !isCurrent && (
                      <span
                        className="absolute inset-x-2.5 bottom-0 h-[2px] rounded-full bg-[#FFD21F]/50 transition-opacity duration-150"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Resume Download Button */}
            <ResumeButton className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0B1F4B] bg-white/90 border border-[#0B1F4B]/20 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#E1F5FE] hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,210,31,0.4)] active:translate-y-0 cursor-pointer shadow-xs">
              Resume ↓
            </ResumeButton>

            {/* Quick Contact CTA on navbar */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B1F4B] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,210,31,0.5)] active:translate-y-0"
            >
              Get in touch
            </a>

            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-[#0B1F4B]/15 text-[#0B1F4B] lg:hidden transition-colors hover:bg-[#E1F5FE]"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-5 mt-3 overflow-hidden rounded-2xl border border-[#0B1F4B]/10 bg-white/95 backdrop-blur-xl lg:hidden shadow-xl"
            >
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-5 py-3 text-sm font-semibold transition-colors border-l-4",
                      active === l.id
                        ? "border-[#FFD21F] bg-[#E1F5FE]/60 text-[#0B1F4B]"
                        : "border-transparent text-[#0B1F4B]/80 hover:bg-[#E1F5FE]/30 hover:text-[#0B1F4B]",
                    )}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="p-3 border-t border-[#0B1F4B]/10">
                <ResumeButton
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#0B1F4B] bg-[#E1F5FE]/70 border border-[#0B1F4B]/15 hover:bg-[#FFD21F] transition-all flex items-center justify-center cursor-pointer"
                >
                  Resume ↓
                </ResumeButton>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

export function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="grid-bg absolute inset-0" />
      <motion.div
        className="orb absolute -left-32 top-10 h-[28rem] w-[28rem] bg-[#81D4FA]"
        animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb absolute -right-32 top-1/3 h-[26rem] w-[26rem] bg-[#4FC3F7]"
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb absolute -bottom-32 left-1/3 h-[24rem] w-[24rem] bg-[#FFD21F]/15"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useSpring(0, { stiffness: 300, damping: 40 });
  const y = useSpring(0, { stiffness: 300, damping: 40 });
  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 200);
      y.set(e.clientY - 200);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[400px] w-[400px] rounded-full bg-[#4FC3F7] opacity-[0.06] blur-3xl"
      style={{ x, y }}
    />
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#0B1F4B] text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,210,31,0.55)] cursor-pointer"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
