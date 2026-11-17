import React from "react";

interface HeightWallProps {
  activeHeight: number | null;
  activeFtIn: string | null;
  isLocked: boolean;
}

export const HeightWall: React.FC<HeightWallProps> = ({
  activeHeight,
  activeFtIn,
  isLocked,
}) => {
  // Height mapping: 0 cm is at y=440, each cm = 1.85px.
  // 150 cm -> y = 162.5, 200 cm -> y = 70
  const getLineY = (cm: number) => 440 - cm * 1.85;

  const majorMarks = [
    { cm: 200, imperial: "6'7\"" },
    { cm: 190, imperial: "6'3\"" },
    { cm: 180, imperial: "5'11\"" },
    { cm: 170, imperial: "5'7\"" },
    { cm: 160, imperial: "5'3\"" },
    { cm: 150, imperial: "4'11\"" },
  ];

  const minorTicks: number[] = [];
  for (let cm = 148; cm <= 202; cm += 2) {
    if (cm % 10 !== 0) minorTicks.push(cm);
  }

  const activeY = activeHeight ? getLineY(activeHeight) : null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 480"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E6F2FA" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#DFEDF7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D5E6F2" stopOpacity="0.95" />
          </linearGradient>

          <pattern id="brickTexture" width="40" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 0 10 L 40 10 M 20 0 L 20 10 M 40 10 L 40 20 M 0 10 L 0 20"
              stroke="#0B1F4B"
              strokeWidth="0.5"
              strokeOpacity="0.04"
              fill="none"
            />
          </pattern>

          <filter id="laserGlow" x="-20%" y="-100%" width="140%" height="300%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#EF4444" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Wall Background */}
        <rect width="1000" height="440" fill="url(#wallGradient)" />
        <rect width="1000" height="440" fill="url(#brickTexture)" />

        {/* Minor Ticks */}
        {minorTicks.map((cm) => {
          const y = getLineY(cm);
          const isMid = cm % 10 === 5;
          return (
            <g key={cm}>
              {/* Left tick */}
              <line
                x1="60"
                y1={y}
                x2={isMid ? "105" : "90"}
                y2={y}
                stroke="#0B1F4B"
                strokeWidth={isMid ? 1.5 : 0.9}
                strokeOpacity={isMid ? 0.35 : 0.2}
              />
              {/* Right tick */}
              <line
                x1={isMid ? "895" : "910"}
                y1={y}
                x2="940"
                y2={y}
                stroke="#0B1F4B"
                strokeWidth={isMid ? 1.5 : 0.9}
                strokeOpacity={isMid ? 0.35 : 0.2}
              />
            </g>
          );
        })}

        {/* Major Horizontal Lines & Labels */}
        {majorMarks.map((mark) => {
          const y = getLineY(mark.cm);
          return (
            <g key={mark.cm}>
              {/* Full horizontal line */}
              <line
                x1="60"
                y1={y}
                x2="940"
                y2={y}
                stroke="#0B1F4B"
                strokeWidth="1.8"
                strokeOpacity="0.32"
                strokeDasharray="6 3"
              />
              {/* Metric label left */}
              <text
                x="52"
                y={y + 4}
                textAnchor="end"
                fontFamily="monospace"
                fontSize="12"
                fontWeight="700"
                fill="#0B1F4B"
                fillOpacity="0.75"
              >
                {mark.cm} CM
              </text>
              {/* Imperial label right */}
              <text
                x="948"
                y={y + 4}
                textAnchor="start"
                fontFamily="monospace"
                fontSize="12"
                fontWeight="700"
                fill="#0B1F4B"
                fillOpacity="0.75"
              >
                {mark.imperial}
              </text>
            </g>
          );
        })}

        {/* Floor Line */}
        <rect x="0" y="440" width="1000" height="40" fill="#0B1F4B" fillOpacity="0.12" />
        <line x1="0" y1="440" x2="1000" y2="440" stroke="#0B1F4B" strokeWidth="3" strokeOpacity="0.6" />

        {/* Active Red Laser Measurement Line */}
        {activeY !== null && isLocked && (
          <g filter="url(#laserGlow)" className="transition-all duration-300">
            <line
              x1="20"
              y1={activeY}
              x2="980"
              y2={activeY}
              stroke="#EF4444"
              strokeWidth="2.5"
            />
            {/* Center target lock badge */}
            <rect
              x="440"
              y={activeY - 14}
              width="120"
              height="28"
              rx="4"
              fill="#EF4444"
            />
            <text
              x="500"
              y={activeY + 4}
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="11"
              fontWeight="900"
              fill="#FFFFFF"
              letterSpacing="0.08em"
            >
              {activeHeight} CM · {activeFtIn}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
