import * as THREE from "three";

// 1. Hazard Barrier Stripes Texture (Black & Yellow)
export function createHazardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#FFD21F";
    ctx.fillRect(0, 0, 256, 64);
    ctx.fillStyle = "#0a1120";
    ctx.lineWidth = 24;
    for (let x = -64; x < 320; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 48, 64);
      ctx.lineTo(x + 24, 64);
      ctx.lineTo(x - 24, 0);
      ctx.closePath();
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Police Door Livery Texture ("POLICE" + Star Shield)
export function createPoliceDoorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#e2e8f0"; // White police door panel
    ctx.fillRect(0, 0, 256, 128);

    // Blue stripe
    ctx.fillStyle = "#1e3a8a";
    ctx.fillRect(0, 88, 256, 16);
    ctx.fillStyle = "#eab308";
    ctx.fillRect(0, 104, 256, 6);

    // "POLICE" Text
    ctx.fillStyle = "#0a1120";
    ctx.font = "bold 36px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "4px";
    ctx.fillText("POLICE", 128, 50);

    // Small Gold Star Emblem
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(42, 48, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 3. Crime Scene Yellow Tape Texture
export function createCrimeTapeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#FFD21F";
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = "#080e1a";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "6px";
    ctx.fillText("/// CAUTION · CRIME SCENE · DO NOT CROSS ///", 256, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 4. Procedural Wet Asphalt Bump Texture
export function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, 128, 128);
    // Noise speckles
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const gray = Math.floor(Math.random() * 60) + 15;
      ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}
