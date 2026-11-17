import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface GaugeProps {
  level: number;
  skillName: string;
  isTriggered?: boolean;
}

export function SpeedometerGauge({
  level,
  skillName,
  isTriggered = true,
}: GaugeProps) {
  const reduceMotion = useReducedMotion();
  const textRef = useRef<HTMLSpanElement>(null);

  // Target needle angle: 0% is -90deg, 100% is +90deg
  const targetAngle = -90 + (level / 100) * 180;
  const currentAngle = reduceMotion || isTriggered ? targetAngle : -90;

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    if (reduceMotion || !isTriggered) {
      el.textContent = `${level}%`;
      return;
    }

    const duration = 750;
    let startTime: number | null = null;
    let rafId: number;

    const animateNumber = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(level * ease);
      if (textRef.current) {
        textRef.current.textContent = `${current}%`;
      }
      if (progress < 1) {
        rafId = requestAnimationFrame(animateNumber);
      }
    };

    rafId = requestAnimationFrame(animateNumber);
    return () => cancelAnimationFrame(rafId);
  }, [level, isTriggered, reduceMotion]);

  // Semicircle circumference: radius = 24 -> C_half = pi * 24 ≈ 75.4
  const radius = 24;
  const strokeDash = Math.PI * radius;
  const activeOffset = strokeDash - (level / 100) * strokeDash;

  return (
    <div
      className="flex flex-col items-center justify-center select-none"
      role="meter"
      aria-label={`${skillName} ${level} percent`}
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="relative w-16 h-9 sm:w-18 sm:h-10 flex items-end justify-center">
        <svg
          viewBox="0 0 64 36"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="60%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Semicircle Track */}
          <path
            d="M 8,32 A 24,24 0 0,1 56,32"
            fill="none"
            stroke="#0a192e"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Active Progress Arc (CSS Transition on strokeDashoffset) */}
          <path
            d="M 8,32 A 24,24 0 0,1 56,32"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={strokeDash}
            strokeDashoffset={
              reduceMotion || isTriggered ? activeOffset : strokeDash
            }
            style={{
              transition: reduceMotion
                ? "none"
                : "stroke-dashoffset 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Needle - Sweeps to angle (transform rotate only) */}
          <g transform="translate(32, 32)">
            <motion.line
              x1="0"
              y1="0"
              x2="0"
              y2="-21"
              stroke="#FFD21F"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ rotate: -90 }}
              animate={{ rotate: currentAngle }}
              transition={{
                duration: reduceMotion ? 0 : 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                transformOrigin: "0 0",
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="3.5"
              fill="#081422"
              stroke="#22d3ee"
              strokeWidth="1.5"
            />
            <circle cx="0" cy="0" r="1.5" fill="#FFD21F" />
          </g>
        </svg>
      </div>

      <span
        ref={textRef}
        className="font-mono text-xs sm:text-[13px] font-bold text-cyan-300 mt-0.5 tracking-wider"
      >
        {reduceMotion || !isTriggered ? `${level}%` : "0%"}
      </span>
    </div>
  );
}
