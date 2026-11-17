import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface GaugeProps {
  level: number;
  skillName: string;
  isTriggered?: boolean;
}

export function SpeedometerGauge({ level, skillName, isTriggered = true }: GaugeProps) {
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(reduceMotion ? level : 0);

  // Target needle angle: 0% is -90deg, 100% is +90deg
  const targetAngle = -90 + (level / 100) * 180;
  const currentAngle = reduceMotion ? targetAngle : isTriggered ? targetAngle : -90;

  useEffect(() => {
    if (reduceMotion || !isTriggered) {
      setDisplayValue(level);
      return;
    }

    const start = 0;
    const duration = 850;
    const startTime = performance.now();

    const animateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (level - start) * eased));

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayValue(level);
      }
    };

    const reqId = requestAnimationFrame(animateNumber);
    return () => cancelAnimationFrame(reqId);
  }, [level, isTriggered, reduceMotion]);

  // Semicircle circumference: radius = 24 -> C_half = pi * 24 ≈ 75.4
  const radius = 24;
  const strokeDash = Math.PI * radius;
  const activeOffset = strokeDash - (displayValue / 100) * strokeDash;

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
        <svg viewBox="0 0 64 36" className="w-full h-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="60%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="1.5"
                floodColor="#22d3ee"
                floodOpacity="0.6"
              />
            </filter>
          </defs>

          {/* Semicircle Track */}
          <path
            d="M 8,32 A 24,24 0 0,1 56,32"
            fill="none"
            stroke="#0a192e"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Active Progress Arc */}
          <path
            d="M 8,32 A 24,24 0 0,1 56,32"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={strokeDash}
            strokeDashoffset={reduceMotion ? strokeDash - (level / 100) * strokeDash : activeOffset}
            filter="url(#gaugeGlow)"
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
            {/* Center Pivot Hub */}
            <circle cx="0" cy="0" r="3.5" fill="#081422" stroke="#22d3ee" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="1.5" fill="#FFD21F" />
          </g>
        </svg>
      </div>

      {/* Accessible numeric percentage readout */}
      <span className="font-mono text-xs sm:text-[13px] font-bold text-cyan-300 mt-0.5 tracking-wider">
        {displayValue}%
      </span>
    </div>
  );
}
