import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span className={cn("inline-flex flex-wrap gap-x-1.5", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: delay + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28", className)}
    >
      <Reveal className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#1A3A7A]">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-extrabold text-[#0B1F4B] sm:text-4xl md:text-5xl font-display">
          {title}
        </h2>
        {subtitle && <p className="mt-4 text-[#0B1F4B]/80 font-medium">{subtitle}</p>}
      </Reveal>
      {children}
    </section>
  );
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const rippleX = e.clientX - r.left;
    const rippleY = e.clientY - r.top;
    const newRipple = { x: rippleX, y: rippleY, id: Date.now() };
    setRipples((prev) => [...prev.slice(-3), newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== newRipple.id));
    }, 600);
  };

  return (
    <motion.div
      ref={ref}
      onClick={handleClick}
      className={cn("relative inline-block overflow-hidden rounded-full", className)}
      style={{ x, y }}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
      {ripples.map((rip) => (
        <span
          key={rip.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 animate-ping"
          style={{
            left: rip.x,
            top: rip.y,
            width: 90,
            height: 90,
          }}
        />
      ))}
    </motion.div>
  );
}

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 150, damping: 15 });
  const ry = useSpring(0, { stiffness: 150, damping: 15 });
  return (
    <motion.div
      className={cn(
        "surface rounded-2xl transition-all duration-300 hover:shadow-glow hover:border-primary/40",
        className,
      )}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={reduce ? {} : { y: -6 }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 160, damping: 18 });
  const ry = useSpring(0, { stiffness: 160, damping: 18 });
  const [coords, setCoords] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setCoords({ x, y, opacity: 1 });
    if (!reduce) {
      ry.set((x / r.width - 0.5) * 10);
      rx.set(-(y / r.height - 0.5) * 10);
    }
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, opacity: 0 }));
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "surface relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-glow hover:border-primary/50",
        className,
      )}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1000,
      }}
      whileHover={reduce ? {} : { y: -6 }}
    >
      {/* Spotlight follower */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: coords.opacity,
          background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, rgba(79, 195, 247, 0.2), transparent 70%)`,
        }}
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

export function Typewriter({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[i % words.length];
    const t = setTimeout(() => {
      if (!del) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) setTimeout(() => setDel(true), 1400);
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (!next) {
          setDel(false);
          setI((n) => n + 1);
        }
      }
    }, del ? 40 : 85);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return (
    <span className="text-gradient" aria-live="polite">
      {text}
      <span
        className="ml-0.5 inline-block w-[3px] animate-pulse bg-primary align-middle"
        style={{ height: "0.9em" }}
        aria-hidden
      />
    </span>
  );
}
