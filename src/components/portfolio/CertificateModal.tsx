import { useState } from "react";
import { ExternalLink, Award, Building2, Sparkles, Loader2, FileCheck } from "lucide-react";
import type { HackathonItem } from "@/lib/hackathons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface CertificateModalItem {
  eventName: string;
  position?: string | undefined;
  host?: string | undefined;
  level?: string | undefined;
  certificateLink: string;
  previewUrl: string;
}

interface CertificateModalProps {
  item: CertificateModalItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ item, isOpen, onClose }: CertificateModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  if (!item) return null;

  const isGoogleDrive =
    item.certificateLink.includes("drive.google.com") ||
    item.previewUrl.includes("drive.google.com");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-4 sm:p-6 bg-background/95 backdrop-blur-xl border-border/80 shadow-2xl rounded-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="space-y-2 pb-3 border-b border-border text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
              <Sparkles className="h-3 w-3" />
              {item.position || "Certificate"}
            </span>
            {item.level && (
              <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {item.level}
              </span>
            )}
          </div>

          <DialogTitle className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {item.eventName}
          </DialogTitle>

          {item.host && (
            <DialogDescription className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0 text-primary" />
              <span>
                {item.host.toLowerCase().includes("host")
                  ? item.host
                  : `Issuer / Category: ${item.host}`}
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Certificate Display Area */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[460px] w-full my-3 overflow-hidden rounded-xl border border-border bg-muted/30">
          {isGoogleDrive ? (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-background/80">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  <p className="text-sm font-medium">Loading certificate preview...</p>
                </div>
              )}
              <iframe
                src={item.previewUrl}
                title={`Certificate for ${item.eventName}`}
                className="w-full h-full min-h-[340px] sm:min-h-[460px] rounded-xl border-0"
                allow="autoplay"
                onLoad={() => setIframeLoaded(true)}
              />
            </>
          ) : (
            <div className="flex h-full min-h-[340px] flex-col items-center justify-center p-8 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary mb-4">
                <FileCheck className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold">Certificate Document Link</h4>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Click below to open the certificate link for {item.eventName}.
              </p>
              <a
                href={item.certificateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition-opacity"
              >
                <ExternalLink className="h-4 w-4" />
                Open Certificate
              </a>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/60">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            {isGoogleDrive
              ? "Having trouble viewing the preview? Use the direct Google Drive link."
              : "Certificate link opens in a secure new tab."}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={item.certificateLink || item.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition-opacity"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {isGoogleDrive ? "Open in Google Drive" : "Open Certificate"}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
