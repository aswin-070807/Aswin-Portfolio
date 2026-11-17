import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface CarProps {
  isStopped?: boolean;
  isVisible?: boolean;
  className?: string;
}

export function GetawayCar({
  isStopped = false,
  isVisible = true,
  className = "",
}: CarProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion && !isStopped && isVisible;

  return (
    <motion.div
      animate={shouldAnimate ? { y: [-1.2, 1.2, -1.2] } : { y: 0 }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative select-none pointer-events-none will-change-transform ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 140 44"
        className="w-28 sm:w-34 md:w-40 h-auto overflow-visible"
      >
        <defs>
          <filter
            id="taillightGlow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="getawayBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a1424" />
            <stop offset="40%" stopColor="#13243d" />
            <stop offset="100%" stopColor="#081220" />
          </linearGradient>
          <linearGradient id="headlightBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(254, 240, 138, 0.45)" />
            <stop offset="100%" stopColor="rgba(254, 240, 138, 0)" />
          </linearGradient>
        </defs>

        {/* Headlight Beam Casting Forward (facing right) */}
        <polygon
          points="132,24 210,14 210,38 132,32"
          fill="url(#headlightBeam)"
          className="opacity-70"
        />

        {/* Rear Taillight Red Streak/Aura */}
        <ellipse
          cx="6"
          cy="23"
          rx="10"
          ry="5"
          fill="#ef4444"
          opacity="0.45"
          filter="url(#taillightGlow)"
        />

        {/* Getaway Sports Car Body Silhouette */}
        <path
          d="M 6,24 C 6,20 12,18 22,17 L 46,14 C 54,9 66,7 86,7 L 108,12 C 120,13 134,18 137,24 C 138,27 136,31 130,32 L 12,32 C 7,32 6,28 6,24 Z"
          fill="url(#getawayBody)"
          stroke="#38bdf8"
          strokeWidth="1.2"
        />

        {/* Windows / Cabin Glass */}
        <path
          d="M 50,14 L 84,9 C 94,9 104,13 107,17 L 50,17 Z"
          fill="#050b14"
          stroke="#0284c7"
          strokeWidth="0.8"
        />

        {/* Glowing Red Taillights (Rear) */}
        <rect
          x="5"
          y="21"
          width="3.5"
          height="5"
          rx="1"
          fill="#ef4444"
          filter="url(#taillightGlow)"
        />
        <rect x="4" y="22" width="2" height="3" rx="0.5" fill="#fca5a5" />

        {/* Front Headlights */}
        <polygon points="134,22 138,24 135,27" fill="#fef08a" />

        {/* Wheels */}
        <g>
          <circle
            cx="30"
            cy="32"
            r="8.5"
            fill="#060c16"
            stroke="#475569"
            strokeWidth="2"
          />
          <circle cx="30" cy="32" r="4.5" fill="#1e293b" />
          <circle cx="30" cy="32" r="1.5" fill="#94a3b8" />
          <circle
            cx="114"
            cy="32"
            r="8.5"
            fill="#060c16"
            stroke="#475569"
            strokeWidth="2"
          />
          <circle cx="114" cy="32" r="4.5" fill="#1e293b" />
          <circle cx="114" cy="32" r="1.5" fill="#94a3b8" />
        </g>
      </svg>
    </motion.div>
  );
}

export function PoliceCar({
  isStopped = false,
  isVisible = true,
  className = "",
}: CarProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion && !isStopped && isVisible;

  return (
    <motion.div
      animate={shouldAnimate ? { y: [1.2, -1.2, 1.2] } : { y: 0 }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.15,
      }}
      className={`relative select-none pointer-events-none will-change-transform ${className}`}
      aria-hidden="true"
    >
      {/* Red & Blue Siren Ambient Floor Glow (opacity only!) */}
      <motion.div
        animate={
          shouldAnimate
            ? { opacity: [0.2, 0.7, 0.25, 0.8, 0.2] }
            : { opacity: 0.3 }
        }
        transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -left-6 w-32 h-20 rounded-full bg-red-500/25 blur-lg pointer-events-none"
      />
      <motion.div
        animate={
          shouldAnimate
            ? { opacity: [0.7, 0.2, 0.8, 0.25, 0.7] }
            : { opacity: 0.3 }
        }
        transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 left-12 w-32 h-20 rounded-full bg-blue-500/30 blur-lg pointer-events-none"
      />

      <svg
        viewBox="0 0 145 46"
        className="w-28 sm:w-34 md:w-40 h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="policeBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#08101e" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="65%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#08101e" />
          </linearGradient>
          <linearGradient id="policeBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {/* Headlight Beam (facing right) */}
        <polygon
          points="136,26 210,16 210,40 136,34"
          fill="url(#policeBeam)"
          className="opacity-70"
        />

        {/* Police Cruiser Main Body */}
        <path
          d="M 8,26 C 8,22 14,19 24,18 L 48,16 C 54,11 68,9 88,9 L 112,14 C 124,15 136,19 139,26 C 140,29 138,33 132,34 L 14,34 C 9,34 8,30 8,26 Z"
          fill="url(#policeBody)"
          stroke="#475569"
          strokeWidth="1.2"
        />

        {/* Windows */}
        <path
          d="M 50,16 L 86,11 C 96,11 106,14 110,18 L 50,18 Z"
          fill="#060c16"
          stroke="#1e293b"
          strokeWidth="0.8"
        />

        {/* Push Bar / Nudge Bumper (Front) */}
        <rect
          x="139"
          y="24"
          width="3"
          height="11"
          rx="1"
          fill="#475569"
        />

        {/* Roof Siren Lightbar Bar */}
        <rect
          x="74"
          y="6"
          width="16"
          height="3.5"
          rx="1"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="0.5"
        />

        {/* Red Flashing Light (Left side of lightbar) */}
        <motion.rect
          x="75"
          y="4.5"
          width="6.5"
          height="4.5"
          rx="1"
          fill="#ef4444"
          animate={shouldAnimate ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.9 }}
          transition={{ duration: 0.28, repeat: Infinity }}
        />

        {/* Blue Flashing Light (Right side of lightbar) */}
        <motion.rect
          x="82.5"
          y="4.5"
          width="6.5"
          height="4.5"
          rx="1"
          fill="#3b82f6"
          animate={shouldAnimate ? { opacity: [1, 0.3, 1] } : { opacity: 0.9 }}
          transition={{ duration: 0.28, repeat: Infinity }}
        />

        {/* Headlights */}
        <polygon points="137,24 140,26 137,29" fill="#ffffff" />

        {/* Taillights */}
        <rect x="6" y="23" width="3" height="5" rx="0.5" fill="#ef4444" />

        {/* Wheels */}
        <g>
          <circle
            cx="32"
            cy="34"
            r="8.5"
            fill="#060c16"
            stroke="#64748b"
            strokeWidth="2"
          />
          <circle cx="32" cy="34" r="4.5" fill="#1e293b" />
          <circle cx="32" cy="34" r="1.5" fill="#cbd5e1" />
          <circle
            cx="116"
            cy="34"
            r="8.5"
            fill="#060c16"
            stroke="#64748b"
            strokeWidth="2"
          />
          <circle cx="116" cy="34" r="4.5" fill="#1e293b" />
          <circle cx="116" cy="34" r="1.5" fill="#cbd5e1" />
        </g>
      </svg>
    </motion.div>
  );
}
