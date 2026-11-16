import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { profile } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon } from "./chrome";
import { ResumeButton } from "./ResumeButton";
import { cn } from "@/lib/utils";

const CONTACT_CONFIG = {
  TARGET_EMAIL: "aswinacse787@gmail.com",
  ENDPOINT: "https://formsubmit.co/ajax/aswinacse787@gmail.com",
  TIMEOUT_MS: 10000,
  COOLDOWN_SECONDS: 30,
} as const;

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type ContactStatus = "idle" | "sending" | "success" | "error";

// Siren Beacon Component on top of the Console
function SirenBeacon({ isSpinning }: { isSpinning: boolean }) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="relative flex flex-col items-center select-none"
      aria-hidden="true"
    >
      {/* Glass Dome with Red & Blue Halves */}
      <div
        className={cn(
          "relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-700/60 overflow-hidden shadow-md flex",
          isSpinning && !prefersReduced
            ? "animate-spin [animation-duration:0.6s]"
            : "opacity-80 animate-pulse [animation-duration:3s]"
        )}
      >
        {/* Left half: Red */}
        <div
          className={cn(
            "w-1/2 h-full bg-red-600 transition-all",
            isSpinning && "shadow-[0_0_15px_rgba(239,68,68,0.9)]"
          )}
        />
        {/* Right half: Blue */}
        <div
          className={cn(
            "w-1/2 h-full bg-blue-600 transition-all",
            isSpinning && "shadow-[0_0_15px_rgba(59,130,246,0.9)]"
          )}
        />
        {/* Highlight sheen across dome */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/35 pointer-events-none" />
      </div>

      {/* Machined Metal Base */}
      <div className="w-11 sm:w-12 h-2.5 rounded-b bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border border-slate-600 shadow-sm" />
    </div>
  );
}

// Waveform Component that responds while typing or transmitting
function AudioWaveform({ isTransmitting }: { isTransmitting: boolean }) {
  const prefersReduced = useReducedMotion();
  const [bars, setBars] = useState<number[]>([
    25, 45, 65, 30, 80, 50, 70, 40, 90, 60, 35, 75, 45, 85, 55, 30, 65, 40, 70, 25,
  ]);

  useEffect(() => {
    if (!isTransmitting || prefersReduced) return;
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => Math.floor(Math.random() * 65) + 25)
      );
    }, 120);
    return () => clearInterval(interval);
  }, [isTransmitting, prefersReduced]);

  return (
    <div
      className="flex items-center justify-center gap-1 h-6 py-1 px-2 rounded bg-slate-100 border border-[#0B1F4B]/15"
      aria-hidden="true"
    >
      <span className="font-mono text-[9px] font-bold text-[#0B1F4B]/60 mr-2 uppercase tracking-wider">
        AUDIO FEED
      </span>
      <div className="flex items-center gap-1 h-full">
        {bars.map((height, i) => (
          <span
            key={i}
            style={{
              height: isTransmitting && !prefersReduced ? `${height}%` : "18%",
              transition: "height 0.12s ease-in-out",
            }}
            className="w-1 rounded-full bg-[#0B1F4B]/80"
          />
        ))}
      </div>
    </div>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [showStamp, setShowStamp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [focused, setFocused] = useState<string | null>(null);

  // LCD text state & copy notification
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sirenSpinning, setSirenSpinning] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stampTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const prefersReduced = useReducedMotion();

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Clean up all timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (stampTimeoutRef.current) clearTimeout(stampTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  // Handle typing debounce for waveform
  const handleInputChange = (field: "name" | "email" | "message", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const copy = async (v: string, label: string) => {
    await navigator.clipboard.writeText(v);
    toast.success(`${label} copied to clipboard`);
    setCopiedNotification(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedNotification(false);
    }, 2000);
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      newErrors.name = "Please enter your name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      newErrors.message = "Please enter a message (at least 10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Block repeat sends or if currently transmitting
    if (status === "sending" || cooldown > 0) return;

    if (!validate()) return;

    // Honeypot check: if filled, silently show success and do not send
    if (honey.trim() !== "") {
      setForm({ name: "", email: "", message: "" });
      setHoney("");
      setErrors({});
      setStatus("success");
      setShowStamp(true);
      setSirenSpinning(!prefersReduced);
      setCooldown(CONTACT_CONFIG.COOLDOWN_SECONDS);

      if (stampTimeoutRef.current) clearTimeout(stampTimeoutRef.current);
      stampTimeoutRef.current = setTimeout(() => {
        setShowStamp(false);
        setSirenSpinning(false);
      }, 3000);

      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = setTimeout(() => {
        setStatus("idle");
      }, 6000);
      return;
    }

    setStatus("sending");
    setErrors({});
    setSirenSpinning(!prefersReduced);

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONTACT_CONFIG.TIMEOUT_MS);

    try {
      const res = await fetch(CONTACT_CONFIG.ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          _subject: `New portfolio message from ${trimmedName}`,
          _template: "table",
          _captcha: "false",
          _honey: "",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json().catch(() => null);
      const isSuccess = data?.success === true || data?.success === "true";

      if (!isSuccess) {
        throw new Error("Submission not successful");
      }

      // Success state
      setStatus("success");
      setShowStamp(true);
      setForm({ name: "", email: "", message: "" });
      setCooldown(CONTACT_CONFIG.COOLDOWN_SECONDS);
      toast.success("Message received! I'll reply soon.");

      if (stampTimeoutRef.current) clearTimeout(stampTimeoutRef.current);
      stampTimeoutRef.current = setTimeout(() => {
        setShowStamp(false);
        setSirenSpinning(false);
      }, 3000);

      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = setTimeout(() => {
        setStatus("idle");
      }, 6000);
    } catch {
      clearTimeout(timeoutId);
      setStatus("error");
      setSirenSpinning(false);
      toast.error("Transmission failed. Please try again or email directly.");
    }
  };

  // Determine current LCD display message
  const lcdText = (() => {
    if (copiedNotification) return "COPIED";
    if (status === "sending") return "TRANSMITTING...";
    if (status === "success") return "MESSAGE RECEIVED ✓";
    if (status === "error") return "TRANSMISSION FAILED · TRY AGAIN";
    if (focused) return "RECEIVING...";
    if (hoveredItem) return hoveredItem;
    return "STANDING BY...";
  })();

  return (
    <div
      id="contact"
      ref={containerRef}
      className="relative w-full bg-transparent pt-12 pb-24 tip-line"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. SECTION HEADER (Outside the Console) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#0B1F4B]/70 mb-2">
            CONTACT
          </p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Let's build something{" "}
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              great
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base font-semibold text-[#1A3A7A] leading-relaxed">
            Recruiting, collaborating or hiring for a project? My inbox is open.
          </p>
        </div>

        {/* 2. THE CONSOLE (Light Enamel-Steel Desk Unit) */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          animate={isInView || prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-[24px] bg-gradient-to-b from-[#e9eff6] to-[#d9e3ee] border-2 border-[#0B1F4B] shadow-[0_20px_60px_rgba(11,31,75,0.18)] p-4 sm:p-7 md:p-9 overflow-hidden"
        >
          {/* Subtle brushed-metal texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 [background:repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.3)_2px,rgba(255,255,255,0.3)_4px)]"
            aria-hidden="true"
          />

          {/* Yellow-and-black diagonal hazard stripe along top edge (about 10px tall) */}
          <div
            className="absolute top-0 inset-x-0 h-2.5 bg-[repeating-linear-gradient(45deg,#0B1F4B,#0B1F4B_8px,#FFD21F_8px,#FFD21F_16px)] border-b border-[#0B1F4B]/40"
            aria-hidden="true"
          />

          {/* Centered Engraved Plate on Top Edge: "TIP LINE · INBOX OPEN" */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-20 px-3.5 py-0.5 rounded-b-md bg-[#0B1F4B] text-[#FFD21F] font-mono text-[9.5px] sm:text-[10px] font-black tracking-widest uppercase shadow-sm select-none border-x border-b border-[#FFD21F]/40"
            aria-hidden="true"
          >
            TIP LINE · INBOX OPEN
          </div>

          {/* SIREN BEACON on Top-Right Corner */}
          <div className="absolute top-3 right-4 sm:right-6 z-20">
            <SirenBeacon isSpinning={sirenSpinning} />
          </div>

          {/* Rivets at 4 corners */}
          <div
            className="absolute top-5 left-5 w-3 h-3 rounded-full bg-slate-400 border border-slate-600 flex items-center justify-center shadow-inner opacity-80"
            aria-hidden="true"
          >
            <div className="w-1.5 h-0.5 bg-slate-700 transform rotate-45" />
          </div>
          <div
            className="absolute bottom-5 left-5 w-3 h-3 rounded-full bg-slate-400 border border-slate-600 flex items-center justify-center shadow-inner opacity-80"
            aria-hidden="true"
          >
            <div className="w-1.5 h-0.5 bg-slate-700 transform -rotate-45" />
          </div>
          <div
            className="absolute bottom-5 right-5 w-3 h-3 rounded-full bg-slate-400 border border-slate-600 flex items-center justify-center shadow-inner opacity-80"
            aria-hidden="true"
          >
            <div className="w-1.5 h-0.5 bg-slate-700 transform rotate-45" />
          </div>

          {/* TWO COLUMNS (Left about 42%, Right about 58%) */}
          <div className="mt-8 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 3. LEFT COLUMN: THE SWITCHBOARD (No numbered "LINE" tags anywhere) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              {/* Top LCD Display Screen */}
              <div
                className={cn(
                  "relative rounded-lg border-2 p-3 shadow-inner overflow-hidden select-none transition-colors duration-300",
                  status === "success"
                    ? "bg-[#07190d] border-emerald-900/80"
                    : status === "error"
                    ? "bg-[#1f0d0a] border-rose-900/80"
                    : "bg-[#07140b] border-[#19331f]"
                )}
                aria-hidden="true"
              >
                {/* Horizontal scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-30 [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.4)_2px,rgba(0,0,0,0.4)_4px)]" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        status === "success"
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                          : status === "error"
                          ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]"
                          : "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                      )}
                    />
                    <span
                      aria-live="polite"
                      className={cn(
                        "font-mono text-xs font-bold tracking-widest uppercase transition-colors",
                        status === "success"
                          ? "text-emerald-400"
                          : status === "error"
                          ? "text-rose-400"
                          : "text-[#FFB300]"
                      )}
                    >
                      {lcdText}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-[9px] tracking-wider",
                      status === "success"
                        ? "text-emerald-400/60"
                        : status === "error"
                        ? "text-rose-400/60"
                        : "text-[#FFB300]/60"
                    )}
                  >
                    TIP-LINE v2
                  </span>
                </div>
              </div>

              {/* Accessible Live Region for Screen Readers */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {lcdText}
              </div>

              {/* Email Row (Enamel Key) */}
              <div
                onMouseEnter={() => setHoveredItem("EMAIL")}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setHoveredItem("EMAIL")}
                onBlur={() => setHoveredItem(null)}
                className="group relative rounded-xl bg-white border border-[#0B1F4B]/25 p-3.5 flex items-center justify-between gap-3 shadow-sm hover:ring-2 hover:ring-[#FFB300]/60 active:translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-[#0B1F4B] shadow-inner">
                    <Mail className="w-5 h-5" />
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-bold text-sm text-[#0B1F4B] hover:text-[#1A3A7A] transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => copy(profile.email, "Email")}
                  aria-label="Copy Email"
                  className="w-8 h-8 shrink-0 rounded-md bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 hover:bg-slate-300 text-[#0B1F4B] flex items-center justify-center shadow-xs cursor-pointer active:translate-y-0.5"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Phone Row (Enamel Key) */}
              <div
                onMouseEnter={() => setHoveredItem("PHONE")}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setHoveredItem("PHONE")}
                onBlur={() => setHoveredItem(null)}
                className="group relative rounded-xl bg-white border border-[#0B1F4B]/25 p-3.5 flex items-center justify-between gap-3 shadow-sm hover:ring-2 hover:ring-[#FFD21F]/60 active:translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-[#0B1F4B] shadow-inner">
                    <Phone className="w-5 h-5" />
                  </span>
                  <a
                    href={profile.phoneHref}
                    className="font-bold text-sm text-[#0B1F4B] hover:text-[#1A3A7A] transition-colors break-all"
                  >
                    {profile.phone}
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => copy(profile.phone, "Phone")}
                  aria-label="Copy Phone"
                  className="w-8 h-8 shrink-0 rounded-md bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 hover:bg-slate-300 text-[#0B1F4B] flex items-center justify-center shadow-xs cursor-pointer active:translate-y-0.5"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* LinkedIn & GitHub Large Square Logo Buttons Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                {/* LinkedIn Button */}
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  title="LinkedIn profile"
                  onMouseEnter={() =>
                    setHoveredItem(`LINKEDIN · ${profile.linkedinLabel}`)
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() =>
                    setHoveredItem(`LINKEDIN · ${profile.linkedinLabel}`)
                  }
                  onBlur={() => setHoveredItem(null)}
                  className="group h-24 sm:h-28 rounded-xl bg-white border border-[#0B1F4B]/25 flex items-center justify-center shadow-sm hover:ring-2 hover:ring-[#FFB300]/60 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <LinkedinIcon className="w-10 h-10 text-[#0B1F4B] group-hover:scale-110 transition-transform" />
                </a>

                {/* GitHub Button */}
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  title="GitHub profile"
                  onMouseEnter={() =>
                    setHoveredItem(`GITHUB · ${profile.githubLabel}`)
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() =>
                    setHoveredItem(`GITHUB · ${profile.githubLabel}`)
                  }
                  onBlur={() => setHoveredItem(null)}
                  className="group h-24 sm:h-28 rounded-xl bg-white border border-[#0B1F4B]/25 flex items-center justify-center shadow-sm hover:ring-2 hover:ring-[#FFB300]/60 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <GithubIcon className="w-10 h-10 text-[#0B1F4B] group-hover:scale-110 transition-transform" />
                </a>
              </div>

              {/* Location Plate below Logo Buttons */}
              <div
                onMouseEnter={() => setHoveredItem("LOCATION")}
                onMouseLeave={() => setHoveredItem(null)}
                className="rounded-lg bg-slate-200/80 border border-slate-300 px-3.5 py-2.5 flex items-center gap-2.5 text-[#0B1F4B] select-none shadow-inner"
              >
                <MapPin className="w-4 h-4 text-[#0B1F4B] shrink-0" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B1F4B]">
                  {profile.location}
                </span>
              </div>

              {/* Resume Button in Switchboard */}
              <ResumeButton className="w-full rounded-xl bg-white border border-[#0B1F4B]/25 p-3 flex items-center justify-center gap-2 shadow-sm font-bold text-xs text-[#0B1F4B] hover:ring-2 hover:ring-[#FFB300]/60 hover:bg-[#E1F5FE]/40 active:translate-y-0.5 transition-all cursor-pointer">
                Download Resume (PDF)
              </ResumeButton>
            </div>

            {/* 4. RIGHT COLUMN: THE TRANSMISSION PANEL */}
            <div className="lg:col-span-7 relative flex flex-col justify-between rounded-xl bg-white/80 border border-[#0B1F4B]/25 p-5 sm:p-6 shadow-sm overflow-hidden">
              {/* RECEIVED Rubber Stamp overlay */}
              <AnimatePresence>
                {showStamp && (
                  <motion.div
                    initial={prefersReduced ? { opacity: 1 } : { scale: 1.5, opacity: 0, rotate: -8 }}
                    animate={prefersReduced ? { opacity: 1 } : { scale: 1, opacity: 1, rotate: -6 }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    transition={{ duration: 0.25, ease: "backOut" }}
                    className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[1px]"
                    aria-hidden="true"
                  >
                    <div className="px-6 py-2.5 rounded-lg border-4 border-dashed border-emerald-600 bg-emerald-950/20 text-emerald-700 font-mono text-2xl sm:text-3xl font-black tracking-widest uppercase shadow-xl transform -rotate-6 select-none">
                      RECEIVED ✓
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B1F4B]/15">
                <span className="font-mono text-xs font-black text-[#0B1F4B] tracking-wider uppercase">
                  TRANSMIT A MESSAGE
                </span>
                <span
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    status === "sending"
                      ? "bg-amber-400 animate-ping"
                      : status === "success"
                      ? "bg-emerald-500 animate-pulse"
                      : status === "error"
                      ? "bg-rose-500 animate-pulse"
                      : "bg-emerald-500 animate-pulse"
                  )}
                />
              </div>

              <form onSubmit={onSubmit} noValidate className="space-y-4">
                {/* Hidden honeypot field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="_honey">Leave this field blank</label>
                  <input
                    id="_honey"
                    type="text"
                    name="_honey"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honey}
                    onChange={(e) => setHoney(e.target.value)}
                  />
                </div>

                {/* Your Name */}
                <div>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      disabled={status === "sending"}
                      value={form.name}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      onFocus={() => {
                        setFocused("name");
                        setHoveredItem("RECEIVING...");
                      }}
                      onBlur={() => {
                        setFocused(null);
                        setHoveredItem(null);
                      }}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={cn(
                        "w-full rounded-lg bg-white border border-[#0B1F4B]/30 px-4 pt-5 pb-1.5 text-sm font-semibold text-[#0B1F4B] shadow-[inset_0_2px_4px_rgba(11,31,75,0.06)] focus:outline-none focus:ring-2 focus:ring-[#FFD21F] focus:border-[#0B1F4B] transition-all disabled:opacity-60 disabled:cursor-not-allowed",
                        errors.name && "border-rose-500 animate-shake"
                      )}
                      maxLength={60}
                    />
                    <label
                      htmlFor="name"
                      className={cn(
                        "pointer-events-none absolute left-4 text-xs font-bold transition-all duration-150",
                        focused === "name" || form.name
                          ? "top-1 text-[#0B1F4B]"
                          : "top-3.5 text-[#1A3A7A]"
                      )}
                    >
                      Your Name
                    </label>
                  </div>
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-1 font-mono text-xs text-rose-600 font-semibold">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled={status === "sending"}
                      value={form.email}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      onFocus={() => {
                        setFocused("email");
                        setHoveredItem("RECEIVING...");
                      }}
                      onBlur={() => {
                        setFocused(null);
                        setHoveredItem(null);
                      }}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={cn(
                        "w-full rounded-lg bg-white border border-[#0B1F4B]/30 px-4 pt-5 pb-1.5 text-sm font-semibold text-[#0B1F4B] shadow-[inset_0_2px_4px_rgba(11,31,75,0.06)] focus:outline-none focus:ring-2 focus:ring-[#FFD21F] focus:border-[#0B1F4B] transition-all disabled:opacity-60 disabled:cursor-not-allowed",
                        errors.email && "border-rose-500 animate-shake"
                      )}
                      maxLength={255}
                    />
                    <label
                      htmlFor="email"
                      className={cn(
                        "pointer-events-none absolute left-4 text-xs font-bold transition-all duration-150",
                        focused === "email" || form.email
                          ? "top-1 text-[#0B1F4B]"
                          : "top-3.5 text-[#1A3A7A]"
                      )}
                    >
                      Your Email Address
                    </label>
                  </div>
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-1 font-mono text-xs text-rose-600 font-semibold">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Your Message */}
                <div>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      disabled={status === "sending"}
                      value={form.message}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      onFocus={() => {
                        setFocused("message");
                        setHoveredItem("RECEIVING...");
                      }}
                      onBlur={() => {
                        setFocused(null);
                        setHoveredItem(null);
                      }}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className={cn(
                        "w-full rounded-lg bg-white border border-[#0B1F4B]/30 px-4 pt-5 pb-5 text-sm font-semibold text-[#0B1F4B] shadow-[inset_0_2px_4px_rgba(11,31,75,0.06)] focus:outline-none focus:ring-2 focus:ring-[#FFD21F] focus:border-[#0B1F4B] resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed",
                        errors.message && "border-rose-500 animate-shake"
                      )}
                      maxLength={1000}
                    />
                    <label
                      htmlFor="message"
                      className={cn(
                        "pointer-events-none absolute left-4 text-xs font-bold transition-all duration-150",
                        focused === "message" || form.message
                          ? "top-1 text-[#0B1F4B]"
                          : "top-3.5 text-[#1A3A7A]"
                      )}
                    >
                      Your Message
                    </label>
                    {/* Typed character counter in the bottom corner */}
                    <span className="pointer-events-none absolute bottom-1.5 right-3 font-mono text-[10px] text-[#0B1F4B]/50 font-semibold select-none">
                      {form.message.length}/1000
                    </span>
                  </div>
                  {errors.message && (
                    <p id="message-error" role="alert" className="mt-1 font-mono text-xs text-rose-600 font-semibold">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Thin Audio Waveform Strip below Message */}
                <div className="py-1">
                  <AudioWaveform isTransmitting={isTyping || status === "sending"} />
                </div>

                {/* Send Message Button (Wide navy key with red/green LED) */}
                <button
                  type="submit"
                  disabled={status === "sending" || status === "success" || cooldown > 0}
                  className={cn(
                    "group relative w-full rounded-lg bg-[#0B1F4B] hover:bg-[#16336f] text-white py-3.5 px-6 font-bold text-sm flex items-center justify-center gap-2.5 shadow-md active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FFD21F]",
                    status === "success" && "bg-emerald-700 hover:bg-emerald-700"
                  )}
                >
                  {/* Status LED */}
                  <span
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all",
                      status === "sending"
                        ? "bg-amber-400 animate-ping"
                        : status === "success"
                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                        : "bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.9)] group-hover:brightness-125"
                    )}
                  />

                  <span>
                    {status === "sending"
                      ? "Transmitting…"
                      : status === "success"
                      ? "Sent ✓"
                      : cooldown > 0
                      ? `Cooldown (${cooldown}s)`
                      : "Send message"}
                  </span>

                  {status === "sending" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>

              {/* Error fallback line */}
              {status === "error" && (
                <div className="mt-3 text-center">
                  <p className="font-mono text-xs text-rose-600 font-semibold">
                    Or email me directly at{" "}
                    <a
                      href={`mailto:${CONTACT_CONFIG.TARGET_EMAIL}`}
                      className="underline text-[#0B1F4B] hover:text-[#1A3A7A] transition-colors"
                    >
                      {CONTACT_CONFIG.TARGET_EMAIL}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER (The Case Closed Stamp, Status Line, Crime Tape & Navy Base)
   ───────────────────────────────────────────────────────────── */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });
  const prefersReduced = useReducedMotion();

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#0B1F4B] text-white overflow-hidden site-footer"
    >
      {/* Wave transition from the sky blue above into the deep navy footer */}
      <div
        className="pointer-events-none absolute -top-10 sm:-top-14 inset-x-0 overflow-hidden leading-none select-none z-10"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 70"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 text-[#0B1F4B] fill-current block"
        >
          <path
            d="M0,28 C280,60 620,10 960,36 C1200,54 1340,20 1440,28 L1440,70 L0,70 Z"
            fill="#0B1F4B"
            opacity="0.3"
          />
          <path d="M0,42 C360,16 720,56 1080,32 C1260,18 1380,42 1440,36 L1440,70 L0,70 Z" />
        </svg>
      </div>

      {/* 1. CRIME-SCENE TAPE: thin yellow-and-black diagonal tape strip (about 14px tall) */}
      <div
        className="relative w-[105%] -left-[2.5%] h-3.5 my-2 transform -rotate-[0.6deg] bg-[repeating-linear-gradient(45deg,#0B1F4B,#0B1F4B_8px,#FFD21F_8px,#FFD21F_16px)] shadow-md flex items-center justify-around select-none z-10"
        aria-hidden="true"
      >
        <div className="flex w-full justify-around font-mono text-[8px] font-black tracking-widest text-[#0B1F4B] bg-[#FFD21F]/90 px-1 py-0.2">
          <span>CASE FILE · DO NOT CROSS</span>
          <span className="hidden sm:inline">CASE FILE · DO NOT CROSS</span>
          <span className="hidden md:inline">CASE FILE · DO NOT CROSS</span>
          <span>CASE FILE · DO NOT CROSS</span>
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-6xl px-5 pt-8 pb-12 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Column: Status Line, Copyright, and Rubber Stamp */}
          <div className="flex flex-col items-center md:items-start gap-2.5 text-center md:text-left">
            {/* 3. STATUS LINE: Glowing green dot + "STATUS: OPEN TO NEW CASES" */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="font-mono text-xs font-bold text-emerald-300 tracking-wider uppercase">
                STATUS: OPEN TO NEW CASES
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Copyright Text */}
              <p className="text-sm font-medium text-white/80">
                Thanks for stopping by — let's create something meaningful. © 2026 Aswin A
              </p>

              {/* 2. CASE CLOSED STAMP: Red rubber stamp reading "CASE CLOSED... FOR NOW" */}
              <motion.div
                initial={prefersReduced ? { scale: 1, opacity: 1 } : { scale: 1.8, opacity: 0 }}
                animate={isInView || prefersReduced ? { scale: 1, opacity: 1 } : { scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.35, delay: prefersReduced ? 0 : 0.3, ease: "backOut" }}
                className="transform -rotate-6 px-2.5 py-1 rounded border-2 border-dashed border-red-500 bg-red-950/40 text-red-400 font-mono text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-md select-none"
                aria-hidden="true"
              >
                CASE CLOSED... FOR NOW
              </motion.div>
            </div>
          </div>

          {/* Right Column: Resume, Back to Top & Social Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Resume button */}
            <ResumeButton className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:border-[#FFD21F] hover:text-[#FFD21F] hover:bg-white/15 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFD21F]">
              Resume ↓
            </ResumeButton>

            {/* Back to top button */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:border-[#FFD21F] hover:text-[#FFD21F] hover:bg-white/15 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFD21F]"
            >
              <RotateCcw className="h-3 w-3 text-[#FFD21F] transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span>Back to top</span>
            </a>

            {/* Three Icon Buttons (GitHub, LinkedIn, Email) with Yellow Glow on Hover */}
            <div className="flex gap-2.5">
              {[
                { i: GithubIcon, h: profile.github, l: "GitHub" },
                { i: LinkedinIcon, h: profile.linkedin, l: "LinkedIn" },
                { i: Mail, h: `mailto:${profile.email}`, l: "Email" },
              ].map(({ i: I, h, l }) => (
                <a
                  key={l}
                  href={h}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={l}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-200 hover:bg-[#FFD21F] hover:text-[#0B1F4B] hover:border-[#FFD21F] hover:scale-110 hover:shadow-[0_0_14px_rgba(255,210,31,0.6)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFD21F]"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
