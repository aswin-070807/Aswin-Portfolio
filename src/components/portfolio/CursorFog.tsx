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

const MAX_PUFFS = 18;
const AMBIENT_COUNT = 2;

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

    if (isTouch) return;

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
      const startSize = 220 + Math.random() * 100;
      const endSize = startSize + 80 + Math.random() * 60;
      return {
        x: Math.random() * width,
        y: Math.random() * (height * 0.75),
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 3,
        startSize,
        endSize,
        currentSize: startSize,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        maxAlpha: 0.035 + Math.random() * 0.025,
        currentAlpha: 0,
        age: 0,
        lifespan: 7 + Math.random() * 5,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.4 + Math.random() * 0.4,
        isAmbient: true,
      };
    };

    let isHeroVisible = true;
    let animationFrameId: number = 0;
    let isRunning = false;
    let prevFrameTime = performance.now();

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      prevFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (!isRunning) return;
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, width, height);
    };

    const heroEl = document.getElementById("home") || document.getElementById("hero");
    let heroObserver: IntersectionObserver | null = null;

    if (heroEl) {
      heroObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isHeroVisible = entry ? entry.isIntersecting : false;
          if (isHeroVisible) {
            startLoop();
          } else {
            puffs.length = 0;
            stopLoop();
          }
        },
        { threshold: 0 }
      );
      heroObserver.observe(heroEl);
    } else {
      startLoop();
    }

    let lastMouseX = -1;
    let lastMouseY = -1;
    let lastTime = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      if (!isHeroVisible) return;

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

      if (dist > 8) {
        const count = Math.min(2, Math.max(1, Math.floor(dist / 40)));
        const speed = dist / dt;

        for (let i = 1; i <= count; i++) {
          if (puffs.length >= MAX_PUFFS) {
            const oldestIdx = puffs.findIndex((p) => !p.isAmbient);
            if (oldestIdx >= 0) {
              puffs.splice(oldestIdx, 1);
            } else {
              break;
            }
          }

          const t = i / count;
          const px = lastMouseX + dx * t + (Math.random() - 0.5) * 16;
          const py = lastMouseY + dy * t + (Math.random() - 0.5) * 16;

          const pushStrength = Math.min(20, speed * 0.035);
          const pushX = (dx / dist) * pushStrength;
          const pushY = (dy / dist) * pushStrength;

          const startSize = 95 + Math.random() * 30;
          const endSize = startSize + 110 + Math.random() * 50;

          puffs.push({
            x: px,
            y: py,
            vx: pushX + (Math.random() - 0.5) * 6,
            vy: pushY + (Math.random() - 0.5) * 6,
            startSize,
            endSize,
            currentSize: startSize,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.1,
            maxAlpha: 0.08 + Math.random() * 0.03,
            currentAlpha: 0,
            age: 0,
            lifespan: 2.2 + Math.random() * 0.6,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.8 + Math.random() * 0.5,
            isAmbient: false,
          });
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;

        if (!isRunning && isHeroVisible) {
          startLoop();
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const loop = (currentTime: number) => {
      if (!isHeroVisible || document.hidden) {
        isRunning = false;
        return;
      }

      animationFrameId = requestAnimationFrame(loop);

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
            puffs[i] = spawnAmbientPuff();
          } else {
            puffs.splice(i, 1);
          }
          continue;
        }

        if (p.isAmbient) ambientActiveCount++;

        const progress = p.age / p.lifespan;
        const sizeEase = 1 - Math.pow(1 - progress, 2);
        p.currentSize = p.startSize + (p.endSize - p.startSize) * sizeEase;

        if (p.isAmbient) {
          const fadeIn = Math.min(1, progress * 4);
          const fadeOut = Math.max(0, 1 - Math.pow(progress, 1.5));
          p.currentAlpha = p.maxAlpha * fadeIn * fadeOut;
        } else {
          const fadeIn = Math.min(1, p.age / 0.18);
          const fadeOut = Math.pow(1 - progress, 1.4);
          p.currentAlpha = p.maxAlpha * fadeIn * fadeOut;
        }

        const turbulence = Math.sin(p.wobblePhase + currentTime * 0.001 * p.wobbleSpeed) * 3;
        p.x += (p.vx + turbulence) * deltaSec;
        p.y += p.vy * deltaSec;
        p.rotation += p.rotSpeed * deltaSec;

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

      if (ambientActiveCount < AMBIENT_COUNT && puffs.length < MAX_PUFFS) {
        puffs.push(spawnAmbientPuff());
      }

      ctx.restore();
    };

    startLoop();

    return () => {
      stopLoop();
      if (heroObserver) heroObserver.disconnect();
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
