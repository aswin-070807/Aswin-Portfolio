import { useEffect, useRef } from "react";

interface MistPuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  startSize: number;
  endSize: number;
  currentSize: number;
  rotation: number;
  rotSpeed: number;
  maxAlpha: number;
  currentAlpha: number;
  age: number;
  lifespan: number;
  wobblePhase: number;
  wobbleSpeed: number;
  isAmbient: boolean;
}

const MAX_PUFFS = 60;
const AMBIENT_COUNT = 4;

function createMistSprite(): HTMLCanvasElement {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const center = size / 2;
  const radius = size / 2;
  const grad = ctx.createRadialGradient(center, center, 0, center, center, radius);

  // Soft mist gradient: white center with a faint cool sky-blue tint, fading smoothly with zero hard edge
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.22, "rgba(240, 249, 255, 0.82)");
  grad.addColorStop(0.48, "rgba(225, 245, 254, 0.46)");
  grad.addColorStop(0.72, "rgba(225, 245, 254, 0.18)");
  grad.addColorStop(0.88, "rgba(225, 245, 254, 0.04)");
  grad.addColorStop(1, "rgba(225, 245, 254, 0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

export function CursorFog() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceQuery.matches) return;

    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprite = createMistSprite();
    const puffs: MistPuff[] = [];

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Helper to spawn an ambient drifting mist patch
    const spawnAmbientPuff = (): MistPuff => {
      const startSize = 240 + Math.random() * 120;
      const endSize = startSize + 80 + Math.random() * 80;
      return {
        x: Math.random() * width,
        y: Math.random() * (height * 0.85),
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 4,
        startSize,
        endSize,
        currentSize: startSize,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        maxAlpha: 0.035 + Math.random() * 0.03, // faint ambient opacity under 0.08
        currentAlpha: 0,
        age: 0,
        lifespan: 8 + Math.random() * 6,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.4 + Math.random() * 0.4,
        isAmbient: true,
      };
    };

    // Initialize 3-4 ambient mist patches
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const p = spawnAmbientPuff();
      // Stagger initial ages so they don't all appear/fade together
      p.age = Math.random() * p.lifespan * 0.75;
      puffs.push(p);
    }

    let lastMouseX = -1;
    let lastMouseY = -1;
    let lastTime = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      if (isTouch) return;

      const now = performance.now();
      const dt = Math.max(0.001, (now - lastTime) / 1000);
      lastTime = now;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (lastMouseX < 0) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        return;
      }

      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      const dist = Math.hypot(dx, dy);

      if (dist > 6) {
        // Interpolate along movement vector so fast mouse moves have NO gaps
        const count = Math.min(3, Math.max(1, Math.floor(dist / 32)));
        const speed = dist / dt;

        for (let i = 1; i <= count; i++) {
          if (puffs.length >= MAX_PUFFS) {
            // Drop oldest non-ambient puff if capacity reached
            const oldestIdx = puffs.findIndex((p) => !p.isAmbient);
            if (oldestIdx >= 0) puffs.splice(oldestIdx, 1);
          }

          const t = i / count;
          const px = lastMouseX + dx * t + (Math.random() - 0.5) * 18;
          const py = lastMouseY + dy * t + (Math.random() - 0.5) * 18;

          // Drag velocity in direction of cursor movement (air being pushed)
          const pushStrength = Math.min(24, speed * 0.04);
          const pushX = (dx / dist) * pushStrength;
          const pushY = (dy / dist) * pushStrength;

          // 2-3 puff size tiers for natural depth (starts 90-140px, grows to 220-320px)
          const tier = Math.random();
          const startSize = tier < 0.35 ? 90 + Math.random() * 20 : tier < 0.75 ? 110 + Math.random() * 25 : 130 + Math.random() * 20;
          const endSize = startSize + 120 + Math.random() * 60;

          puffs.push({
            x: px,
            y: py,
            vx: pushX + (Math.random() - 0.5) * 8,
            vy: pushY + (Math.random() - 0.5) * 8,
            startSize,
            endSize,
            currentSize: startSize,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.12,
            maxAlpha: 0.08 + Math.random() * 0.03, // capped at ~0.10 so it never obscures content
            currentAlpha: 0,
            age: 0,
            lifespan: 2.6 + Math.random() * 0.8, // 2.5 to 3.4 seconds life
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.8 + Math.random() * 0.6,
            isAmbient: false,
          });
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let animationFrameId: number;
    let prevFrameTime = performance.now();

    const loop = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(loop);

      if (document.hidden) {
        prevFrameTime = currentTime;
        return;
      }

      const deltaSec = Math.min(0.1, (currentTime - prevFrameTime) / 1000);
      prevFrameTime = currentTime;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      let ambientActiveCount = 0;

      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i]!;
        p.age += deltaSec;

        if (p.age >= p.lifespan) {
          if (p.isAmbient) {
            // Respawn ambient puff smoothly
            puffs[i] = spawnAmbientPuff();
          } else {
            puffs.splice(i, 1);
          }
          continue;
        }

        if (p.isAmbient) ambientActiveCount++;

        const progress = p.age / p.lifespan;

        // Smooth size expansion (starts 90-140px, grows to 220-320px)
        const sizeEase = 1 - Math.pow(1 - progress, 2);
        p.currentSize = p.startSize + (p.endSize - p.startSize) * sizeEase;

        // Smooth fade curve
        if (p.isAmbient) {
          // Ambient puffs fade in gently, drift, and fade out
          const fadeIn = Math.min(1, progress * 4);
          const fadeOut = Math.max(0, 1 - Math.pow(progress, 1.5));
          p.currentAlpha = p.maxAlpha * fadeIn * fadeOut;
        } else {
          // Cursor puffs start with soft quick onset then ease out smoothly to 0
          const fadeIn = Math.min(1, p.age / 0.18);
          const fadeOut = Math.pow(1 - progress, 1.4);
          p.currentAlpha = p.maxAlpha * fadeIn * fadeOut;
        }

        // Drifting motion with gentle sine/noise turbulence wobble
        const turbulence = Math.sin(p.wobblePhase + currentTime * 0.001 * p.wobbleSpeed) * 3.5;
        p.x += (p.vx + turbulence) * deltaSec;
        p.y += p.vy * deltaSec;
        p.rotation += p.rotSpeed * deltaSec;

        // Draw scaled sprite from offscreen canvas
        if (p.currentAlpha > 0.002) {
          ctx.globalAlpha = p.currentAlpha;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          const half = p.currentSize / 2;
          ctx.drawImage(sprite, -half, -half, p.currentSize, p.currentSize);
          ctx.restore();
        }
      }

      // Ensure 3-4 ambient patches remain on non-mobile/desktop
      if (!isTouch && ambientActiveCount < AMBIENT_COUNT && puffs.length < MAX_PUFFS) {
        puffs.push(spawnAmbientPuff());
      }

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[25]"
      aria-hidden="true"
    />
  );
}
