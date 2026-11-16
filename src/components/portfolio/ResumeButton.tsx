import { useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import React from "react";
import { useLatestResume } from "@/lib/resume";
import { cn } from "@/lib/utils";

interface ResumeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  onDownloaded?: () => void;
}

export function ResumeButton({
  children,
  className,
  onClick,
  onDownloaded,
  ...props
}: ResumeButtonProps) {
  const { status, errorMessage, downloadResume } = useLatestResume();
  const prefersReduced = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      void downloadResume().then(() => {
        onDownloaded?.();
      });
    }
  };

  const isPreparing = status === "preparing";
  const isDownloaded = status === "downloaded";
  const isError = status === "error";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPreparing}
      aria-label="Download resume as PDF"
      className={cn(className, isPreparing && "cursor-wait opacity-80")}
      {...props}
    >
      {isPreparing ? (
        <span className="inline-flex items-center gap-1.5">
          <Loader2
            className={cn("h-3.5 w-3.5 shrink-0", !prefersReduced && "animate-spin")}
            aria-hidden="true"
          />
          <span aria-live="polite">Preparing…</span>
        </span>
      ) : isDownloaded ? (
        <span className="inline-flex items-center gap-1.5 text-emerald-700">
          <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span aria-live="polite">Downloaded ✓</span>
        </span>
      ) : isError ? (
        <span className="inline-flex items-center gap-1.5 text-rose-600 text-[11px] leading-tight">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span aria-live="polite">{errorMessage || "Couldn't download right now, please try again"}</span>
        </span>
      ) : (
        children || "Resume"
      )}
    </button>
  );
}
