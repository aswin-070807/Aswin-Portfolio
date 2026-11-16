import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  AlertTriangle,
  Compass,
  ExternalLink,
  FileCheck2,
  Maximize2,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type CertificateItem,
  type CertRoomGroup,
  DEFAULT_CERTS_CSV_URL,
  getRelativeTimeLabel,
  SHEET_ID,
  SHEET_TAB,
  useLiveCertificates,
} from "@/lib/certificationsData";
import { cn } from "@/lib/utils";

// Yellow Crime Scene Marker SVG (A-frame evidence tent with shadow & number)
export function EvidenceTentSVG({
  number,
  isHovered,
  isSelected,
  isFresh,
  className,
}: {
  number: number;
  isHovered?: boolean;
  isSelected?: boolean;
  isFresh?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center select-none transition-transform duration-200",
        isHovered && "-translate-y-1.5",
        isSelected && "scale-110",
        className
      )}
    >
      {/* Fresh Badge for recent certificates */}
      {isFresh && (
        <span className="absolute -top-3 px-1 py-0.2 rounded bg-rose-600 text-white font-mono text-[7.5px] font-black uppercase tracking-wider shadow-sm z-20 animate-pulse">
          FRESH
        </span>
      )}

      {/* A-frame forensic tent */}
      <svg
        viewBox="0 0 46 38"
        className="w-10 h-8 sm:w-11 sm:h-9 drop-shadow-[0_4px_6px_rgba(11,31,75,0.22)]"
        aria-hidden="true"
      >
        {/* Soft floor shadow */}
        <ellipse
          cx="23"
          cy="34"
          rx="19"
          ry="3.5"
          fill="rgba(11, 31, 75, 0.2)"
        />

        {/* Tent left crease/shadow facet */}
        <polygon
          points="4,32 19,5 24,5 9,32"
          fill={isSelected ? "#E6A800" : "#E6B800"}
          stroke="#0B1F4B"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Tent front bright yellow face */}
        <polygon
          points="9,32 24,5 41,32"
          fill={isSelected ? "#FFE04D" : "#FFD21F"}
          stroke="#0B1F4B"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* Floor baseline contact */}
        <line
          x1="3"
          y1="32"
          x2="42"
          y2="32"
          stroke="#0B1F4B"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Center fold crease line */}
        <line
          x1="24"
          y1="5"
          x2="25"
          y2="32"
          stroke="#D4A700"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />

        {/* Black evidence marker number */}
        <text
          x="25.5"
          y="23.5"
          textAnchor="middle"
          fill="#0B1F4B"
          fontSize="13"
          fontWeight="900"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        >
          {number}
        </text>
      </svg>
    </div>
  );
}

// Marker Popup Detail Card (Desktop floating anchored card & Mobile bottom sheet)
function MarkerPopupCard({
  cert,
  onClose,
  anchorRef,
}: {
  cert: CertificateItem;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(e.target as Node) &&
        (!anchorRef?.current || !anchorRef.current.contains(e.target as Node))
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose, anchorRef]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Evidence Marker ${cert.markerNumber} Details`}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-md bg-[#FFFDF8] rounded-xl border-2 border-[#0B1F4B] shadow-[0_20px_50px_rgba(11,31,75,0.35)] overflow-hidden flex flex-col"
      >
        {/* Top crime report tag header */}
        <div className="bg-[#FFD21F] border-b-2 border-[#0B1F4B] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#0B1F4B] text-[#FFD21F] font-mono font-black text-xs flex items-center justify-center">
              {cert.markerNumber}
            </span>
            <span className="font-mono text-xs font-bold text-[#0B1F4B] tracking-wider uppercase">
              EVIDENCE MARKER #{cert.markerNumber.toString().padStart(2, "0")}
            </span>
            {cert.isFresh && (
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-black uppercase">
                FRESH
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close popup"
            className="w-7 h-7 rounded-md hover:bg-[#0B1F4B]/10 active:bg-[#0B1F4B]/20 flex items-center justify-center text-[#0B1F4B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          {/* Optional Drive Thumbnail Preview */}
          {cert.thumbnailUrl && !imgError && (
            <div className="relative w-full h-40 sm:h-44 bg-slate-100 rounded-lg border border-[#0B1F4B]/20 overflow-hidden flex items-center justify-center group">
              <img
                src={cert.thumbnailUrl}
                alt={cert.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-2"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#0B1F4B]/80 text-white font-mono text-[9px] font-bold tracking-wider">
                DRIVE PREVIEW
              </div>
            </div>
          )}

          <div>
            <h4 className="text-base sm:text-lg font-bold text-[#0B1F4B] leading-snug">
              {cert.name}
            </h4>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#1A3A7A] uppercase tracking-wide">
                ISSUED BY:{" "}
                <strong className="text-[#0B1F4B]">{cert.issuer}</strong>
              </span>
              {cert.dateStr && (
                <span className="font-mono text-xs text-slate-500">
                  · {cert.dateStr}
                </span>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
            {!cert.linkUnavailable ? (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B1F4B] hover:bg-[#16336f] text-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors shadow-md cursor-pointer"
              >
                <span>VIEW CERTIFICATE</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="flex-1 text-center py-2 px-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-500 font-mono text-xs font-bold uppercase tracking-wider">
                LINK UNAVAILABLE
              </div>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-mono text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Single Blueprint Room
function BlueprintRoom({
  room,
  isDimmed,
  isFocused,
  searchQuery,
  selectedCertId,
  hoveredCertId,
  onSelectCert,
  onHoverCert,
  onToggleFocusRoom,
}: {
  room: CertRoomGroup;
  isDimmed: boolean;
  isFocused: boolean;
  searchQuery: string;
  selectedCertId: string | null;
  hoveredCertId: string | null;
  onSelectCert: (cert: CertificateItem) => void;
  onHoverCert: (certId: string | null) => void;
  onToggleFocusRoom: (roomId: string) => void;
}) {
  const markerCount = room.markers.length;

  // Responsive CSS grid column span:
  // 1 col for up to 2 markers, 2 cols for 3 to 8, full width above 8
  const spanClass = useMemo(() => {
    if (markerCount > 8) {
      return "col-span-1 md:col-span-2 lg:col-span-4";
    }
    if (markerCount >= 3) {
      return "col-span-1 md:col-span-2 lg:col-span-2";
    }
    return "col-span-1";
  }, [markerCount]);

  // Pseudo-architectural dimension tick label
  const dimensionTick = useMemo(() => {
    const meters = (markerCount * 0.9 + 2.4).toFixed(1);
    return `${meters}m`;
  }, [markerCount]);

  return (
    <div
      style={{
        transform: `rotate(${room.rotationDeg}deg)`,
      }}
      className={cn(
        "relative rounded-md border-2 border-[#0B1F4B] bg-[#E8EFF7]/60 transition-all duration-300 flex flex-col p-3 sm:p-4",
        spanClass,
        isDimmed && "opacity-25 grayscale-[40%] pointer-events-none",
        isFocused && "ring-4 ring-[#FFD21F] bg-[#E8EFF7] shadow-lg z-10"
      )}
    >
      {/* Side dimension tick */}
      <div
        className="absolute -left-3.5 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center select-none pointer-events-none text-[#0B1F4B]/60 font-mono text-[7px]"
        aria-hidden="true"
      >
        <span>┬</span>
        <span className="font-bold my-0.5">{dimensionTick}</span>
        <span>┴</span>
      </div>

      {/* Door gap indicator on bottom wall */}
      <div
        className="absolute -bottom-2.5 right-6 flex items-center gap-1 bg-[#E8EFF7] px-1 z-10 select-none pointer-events-none"
        aria-hidden="true"
      >
        <svg
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          className="text-[#0B1F4B]"
        >
          <path
            d="M2 10 Q 10 2, 18 10"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            fill="none"
          />
          <line
            x1="2"
            y1="10"
            x2="2"
            y2="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="font-mono text-[7.5px] font-bold text-[#0B1F4B]/70 tracking-wider">
          DOOR
        </span>
      </div>

      {/* Room header / door-sign label */}
      <div className="flex items-start justify-between gap-2 mb-3 pb-1.5 border-b border-[#0B1F4B]/20">
        <button
          type="button"
          onClick={() => onToggleFocusRoom(room.roomId)}
          title={`Click to focus ${room.issuer} room`}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <div className="font-mono text-[10px] sm:text-xs font-black text-[#0B1F4B] tracking-wider uppercase group-hover:text-[#1A3A7A] transition-colors line-clamp-1">
            {room.roomCode} · {room.issuer}
          </div>
          <div className="font-mono text-[8.5px] font-bold text-[#0B1F4B]/60 tracking-widest uppercase">
            {isFocused ? "CLICK TO UNFOCUS" : "CLICK TO FOCUS ROOM"}
          </div>
        </button>

        <span className="px-1.5 py-0.5 rounded bg-[#0B1F4B]/10 border border-[#0B1F4B]/20 font-mono text-[9px] font-bold text-[#0B1F4B] whitespace-nowrap">
          {markerCount.toString().padStart(2, "0")} MARKERS
        </span>
      </div>

      {/* Evidence Markers inside this room */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-1 sm:p-2 min-h-[50px]">
        {room.markers.map((cert) => {
          const isSelected = selectedCertId === cert.id;
          const isHovered = hoveredCertId === cert.id;
          const matchesSearch =
            searchQuery.trim().length > 0 &&
            (cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()));

          return (
            <div key={cert.id} className="relative group/tent">
              <button
                type="button"
                onClick={() => onSelectCert(cert)}
                onMouseEnter={() => onHoverCert(cert.id)}
                onMouseLeave={() => onHoverCert(null)}
                onFocus={() => onHoverCert(cert.id)}
                onBlur={() => onHoverCert(null)}
                aria-label={`Marker ${cert.markerNumber}: ${cert.name}`}
                className={cn(
                  "p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#0B1F4B] cursor-pointer transition-all",
                  matchesSearch && "animate-bounce"
                )}
              >
                <EvidenceTentSVG
                  number={cert.markerNumber}
                  isHovered={isHovered}
                  isSelected={isSelected}
                  isFresh={cert.isFresh}
                />
              </button>

              {/* Hover Tooltip */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden sm:group-hover/tent:block pointer-events-none z-30 w-max max-w-[220px] px-2 py-1 rounded bg-[#0B1F4B] text-white text-[11px] font-semibold leading-tight text-center shadow-lg"
                role="tooltip"
              >
                #{cert.markerNumber} · {cert.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Companion Evidence Log (Table on Desktop / Card List on Mobile)
function EvidenceLog({
  items,
  selectedCertId,
  hoveredCertId,
  onSelectCert,
  onHoverCert,
}: {
  items: CertificateItem[];
  selectedCertId: string | null;
  hoveredCertId: string | null;
  onSelectCert: (cert: CertificateItem) => void;
  onHoverCert: (certId: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Scroll active row into view when marker selected
  useEffect(() => {
    if (selectedCertId && rowRefs.current.has(selectedCertId)) {
      const el = rowRefs.current.get(selectedCertId);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedCertId]);

  return (
    <div className="flex flex-col h-full bg-[#FFFDF8] rounded-xl border-2 border-[#0B1F4B] shadow-[0_8px_30px_rgba(11,31,75,0.08)] overflow-hidden">
      {/* Table Header Strip */}
      <div className="bg-[#E8EFF7] border-b-2 border-[#0B1F4B] px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-[#0B1F4B]" />
          <span className="font-mono text-xs font-black text-[#0B1F4B] tracking-wider uppercase">
            EVIDENCE LOG ({items.length})
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#1A3A7A] font-bold">
          FORENSIC LEDGER
        </span>
      </div>

      {/* Scrollable Container with max height ~520px */}
      <div
        ref={containerRef}
        className="flex-1 max-h-[520px] overflow-y-auto divide-y divide-slate-200"
      >
        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            NO EVIDENCE LOGGED
          </div>
        ) : (
          <table className="w-full text-left border-collapse hidden sm:table">
            <thead className="sticky top-0 bg-[#FFFDF8] z-10 border-b border-slate-300 font-mono text-[10px] font-bold text-[#0B1F4B]/80 uppercase tracking-wider">
              <tr>
                <th className="py-2 px-3 w-12 text-center">NO.</th>
                <th className="py-2 px-3">CERTIFICATE</th>
                <th className="py-2 px-3 w-32">ISSUED BY</th>
                <th className="py-2 px-3 w-16 text-center">VIEW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-sans text-xs">
              {items.map((cert) => {
                const isSelected = selectedCertId === cert.id;
                const isHovered = hoveredCertId === cert.id;

                return (
                  <tr
                    key={cert.id}
                    ref={(node) => {
                      if (node) rowRefs.current.set(cert.id, node);
                      else rowRefs.current.delete(cert.id);
                    }}
                    onClick={() => onSelectCert(cert)}
                    onMouseEnter={() => onHoverCert(cert.id)}
                    onMouseLeave={() => onHoverCert(null)}
                    className={cn(
                      "transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[#FFD21F]/25 font-bold"
                        : isHovered
                        ? "bg-[#E8EFF7]"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-[#0B1F4B]">
                      <span className="inline-block w-6 text-center py-0.5 rounded bg-[#0B1F4B]/10">
                        {cert.markerNumber}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#0B1F4B] leading-tight">
                      {cert.name}
                      {cert.isFresh && (
                        <span className="ml-1.5 px-1 py-0.2 rounded bg-rose-600 text-white font-mono text-[8px] font-black uppercase">
                          FRESH
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#1A3A7A]">
                      {cert.issuer}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {!cert.linkUnavailable ? (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Open certificate in new tab"
                          className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-[#0B1F4B] hover:text-white text-[#0B1F4B] border border-[#0B1F4B]/30 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span
                          className="font-mono text-[9px] text-slate-400"
                          title="Link unavailable"
                        >
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Mobile View: Tappable cards */}
        <div className="sm:hidden divide-y divide-slate-200">
          {items.map((cert) => {
            const isSelected = selectedCertId === cert.id;
            return (
              <div
                key={cert.id}
                ref={(node) => {
                  if (node) rowRefs.current.set(cert.id, node);
                  else rowRefs.current.delete(cert.id);
                }}
                onClick={() => onSelectCert(cert)}
                className={cn(
                  "p-3 flex items-start justify-between gap-3 min-h-[44px] cursor-pointer transition-colors",
                  isSelected ? "bg-[#FFD21F]/30" : "active:bg-slate-100"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 shrink-0 rounded bg-[#0B1F4B] text-[#FFD21F] font-mono font-bold text-xs flex items-center justify-center">
                    {cert.markerNumber}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-[#0B1F4B] leading-snug">
                      {cert.name}
                    </h5>
                    <p className="font-mono text-[10px] text-[#1A3A7A] mt-0.5">
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                {!cert.linkUnavailable && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`View certificate for ${cert.name}`}
                    className="shrink-0 w-9 h-9 rounded-lg bg-[#0B1F4B]/10 hover:bg-[#0B1F4B] text-[#0B1F4B] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// MAIN COMPONENT: CertificationsFloorPlan
export function CertificationsFloorPlan() {
  const { items, rooms, isLoading, isError, lastSyncTime, refetch } =
    useLiveCertificates();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [hoveredCertId, setHoveredCertId] = useState<string | null>(null);
  const [focusedRoomId, setFocusedRoomId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const prefersReduced = useReducedMotion();

  // Dynamic heading count: rounded down to nearest multiple of 5 (e.g. 22 -> 20+)
  // If count < 5, show exact number without "+"
  const totalCount = items.length;
  const countDisplay = useMemo(() => {
    if (totalCount < 5) return totalCount.toString();
    const rounded = Math.floor(totalCount / 5) * 5;
    return `${rounded}+`;
  }, [totalCount]);

  // Relative time for report bar
  const relativeTime = useMemo(
    () => getRelativeTimeLabel(lastSyncTime),
    [lastSyncTime]
  );

  // Filtered items and rooms based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const matchingRoomIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const matched = new Set<string>();
    for (const room of rooms) {
      if (
        room.markers.some(
          (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.issuer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        matched.add(room.roomId);
      }
    }
    return matched;
  }, [rooms, searchQuery]);

  const toggleFocusRoom = useCallback((roomId: string) => {
    setFocusedRoomId((prev) => (prev === roomId ? null : roomId));
  }, []);

  return (
    <div
      id="certifications"
      ref={containerRef}
      className="relative w-full bg-transparent py-12 sm:py-16 scene-plan"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#0B1F4B]/70 mb-2">
            CERTIFICATIONS
          </p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            <span className="text-[#0B1F4B] underline decoration-[#FFD21F] decoration-4 underline-offset-4">
              {countDisplay}
            </span>{" "}
            global certifications
          </h2>
        </div>

        {/* 2. SCENE REPORT BAR (Crime Scene Tape Strip) */}
        <div className="mb-6 rounded-md border-2 border-[#0B1F4B] bg-[#FFD21F] text-[#0B1F4B] shadow-md overflow-hidden">
          <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,#0B1F4B,#0B1F4B_8px,#FFD21F_8px,#FFD21F_16px)]" />
          <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B1F4B] animate-pulse" />
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase">
                {isLoading && items.length === 0
                  ? "SURVEYING THE SCENE..."
                  : `SCENE REPORT · ${totalCount} EVIDENCE MARKERS · ${rooms.length} ROOMS`}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] sm:text-xs font-bold text-[#0B1F4B]/80">
              <span>LAST SYNC: {relativeTime}</span>
              <button
                type="button"
                onClick={() => refetch()}
                title="Refresh from Google Sheet"
                aria-label="Refresh certifications"
                className="hover:text-[#0B1F4B] hover:rotate-180 transition-transform duration-300 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,#0B1F4B,#0B1F4B_8px,#FFD21F_8px,#FFD21F_16px)]" />
        </div>

        {/* 3. SEARCH SLIP (Detective's Note Slip) */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative bg-[#FFFDF8] rounded-lg border-2 border-[#0B1F4B] p-2 sm:p-2.5 shadow-[0_6px_20px_rgba(11,31,75,0.08)]">
            {/* Small yellow scotch-tape top pin */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#FFD21F]/80 border-b border-black/20 shadow-xs transform -rotate-1 select-none pointer-events-none"
              aria-hidden="true"
            />

            <label className="relative flex items-center gap-2">
              <Search className="w-4 h-4 text-[#0B1F4B] shrink-0 ml-1.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the scene"
                className="w-full bg-transparent font-mono text-xs sm:text-sm font-bold text-[#0B1F4B] placeholder:text-[#0B1F4B]/50 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-[10px] font-mono font-bold text-[#0B1F4B] uppercase tracking-wider cursor-pointer"
                >
                  Clear
                </button>
              )}
            </label>
          </div>
        </div>

        {/* MAIN WORKSPACE: FLOOR PLAN (Left ~65%) & EVIDENCE LOG (Right ~35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 4. THE FLOOR PLAN (Main Visual) */}
          <div className="lg:col-span-8 relative bg-[#E8EFF7] rounded-2xl border-2 border-[#0B1F4B] shadow-[0_12px_40px_rgba(11,31,75,0.12)] p-4 sm:p-6 overflow-hidden min-h-[480px]">
            {/* Blueprint Grid Lines Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 [background-image:linear-gradient(to_right,#0B1F4B_1px,transparent_1px),linear-gradient(to_bottom,#0B1F4B_1px,transparent_1px)] [background-size:24px_24px]"
              aria-hidden="true"
            />

            {/* Architectural ENTRY Symbol at top-left */}
            <div
              className="relative inline-flex items-center gap-2 bg-[#E8EFF7]/90 px-2.5 py-1 rounded border border-[#0B1F4B]/40 select-none z-10 shadow-xs mb-4"
              aria-hidden="true"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0B1F4B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span className="font-mono text-[9.5px] font-black text-[#0B1F4B] tracking-widest uppercase">
                ENTRY ▾
              </span>
            </div>

            {/* Corner Compass Arrow at top-right */}
            <div
              className="absolute top-4 right-4 flex flex-col items-center select-none z-10 pointer-events-none opacity-85"
              aria-hidden="true"
            >
              <div className="relative w-8 h-8 rounded-full border border-[#0B1F4B]/50 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[12px] border-b-[#0B1F4B] -mt-1" />
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[12px] border-t-[#0B1F4B]/40 -mb-1" />
              </div>
              <span className="font-mono text-[9px] font-black text-[#0B1F4B] tracking-wider mt-0.5">
                N
              </span>
            </div>

            {/* Scale Mark at bottom-left */}
            <div
              className="absolute bottom-3 left-4 hidden sm:flex items-center gap-2 font-mono text-[9px] font-bold text-[#0B1F4B]/80 select-none z-10 pointer-events-none"
              aria-hidden="true"
            >
              <span>SCALE 1:50</span>
              <div className="flex h-1.5 border border-[#0B1F4B]">
                <div className="w-3 bg-[#0B1F4B]" />
                <div className="w-3 bg-transparent" />
                <div className="w-3 bg-[#0B1F4B]" />
                <div className="w-3 bg-transparent" />
              </div>
              <span className="text-[8px]">2m</span>
            </div>

            {/* ERROR STATE: Crime-scene tape across plan */}
            {isError && items.length === 0 && (
              <div className="relative z-20 my-16 p-6 rounded-lg bg-[#FFD21F] border-2 border-[#0B1F4B] shadow-xl text-center max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 text-[#0B1F4B] mb-2 font-mono font-black text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>SCENE UNAVAILABLE · TRY AGAIN LATER</span>
                </div>
                <p className="text-xs font-semibold text-[#0B1F4B]/80 mb-4">
                  Unable to connect to Google Sheets records.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-4 py-2 rounded bg-[#0B1F4B] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#16336f] transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* LOADING STATE (No cache yet): 3 empty dashed rooms */}
            {isLoading && items.length === 0 && !isError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-8">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-44 rounded-md border-2 border-dashed border-[#0B1F4B]/40 bg-white/30 flex items-center justify-center font-mono text-xs text-[#0B1F4B]/60 animate-pulse"
                  >
                    SURVEYING ROOM {n.toString().padStart(2, "0")}...
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && items.length === 0 && !isError && (
              <div className="my-16 p-8 rounded-lg border-2 border-dashed border-[#0B1F4B]/40 bg-white/40 text-center font-mono text-xs text-[#0B1F4B]">
                NO EVIDENCE LOGGED YET
              </div>
            )}

            {/* SEARCH NO MATCHES */}
            {searchQuery && filteredItems.length === 0 && items.length > 0 && (
              <div className="relative z-20 my-12 p-6 rounded-lg bg-[#FFFDF8] border-2 border-[#0B1F4B] text-center max-w-sm mx-auto shadow-md">
                <p className="font-mono text-xs font-black text-[#0B1F4B] uppercase tracking-wider mb-2">
                  NO MATCHING EVIDENCE
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-3 py-1.5 rounded bg-[#0B1F4B] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#16336f] transition-colors cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* THE ROOMS GRID */}
            {rooms.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pb-6">
                {rooms.map((room) => {
                  const isDimmed =
                    (searchQuery.trim().length > 0 &&
                      !matchingRoomIds.has(room.roomId)) ||
                    (focusedRoomId !== null && focusedRoomId !== room.roomId);
                  const isFocused = focusedRoomId === room.roomId;

                  return (
                    <BlueprintRoom
                      key={room.roomId}
                      room={room}
                      isDimmed={isDimmed}
                      isFocused={isFocused}
                      searchQuery={searchQuery}
                      selectedCertId={selectedCert?.id ?? null}
                      hoveredCertId={hoveredCertId}
                      onSelectCert={(cert) => setSelectedCert(cert)}
                      onHoverCert={(id) => setHoveredCertId(id)}
                      onToggleFocusRoom={toggleFocusRoom}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. EVIDENCE LOG COMPANION TABLE (Right ~35% on desktop, below on mobile) */}
          <div className="lg:col-span-4 w-full">
            <EvidenceLog
              items={filteredItems}
              selectedCertId={selectedCert?.id ?? null}
              hoveredCertId={hoveredCertId}
              onSelectCert={(cert) => setSelectedCert(cert)}
              onHoverCert={(id) => setHoveredCertId(id)}
            />
          </div>
        </div>

        {/* 6. POPUP DIALOG ANCHORED / MODAL */}
        <AnimatePresence>
          {selectedCert && (
            <MarkerPopupCard
              cert={selectedCert}
              onClose={() => setSelectedCert(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
