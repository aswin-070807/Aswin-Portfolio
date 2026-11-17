import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createPoliceDoorTexture } from "./ProceduralTextures";

export interface CarProps {
  type?: "getaway" | "police" | "wrecked";
  paintColor?: string;
  speed?: number;
  isBraking?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  swerving?: boolean;
}

export function Car3D({
  type = "getaway",
  paintColor = "#081324",
  speed = 1.0,
  isBraking = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  swerving = false,
}: CarProps) {
  const carGroupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const sirenLightRedRef = useRef<THREE.PointLight>(null);
  const sirenLightBlueRef = useRef<THREE.PointLight>(null);
  const hazardLightRef = useRef<THREE.PointLight>(null);
  const smokeParticlesRef = useRef<THREE.Points>(null);

  // 1. Procedural Side-Profile Extruded Car Body
  const { bodyGeometry, cabinGeometry } = useMemo(() => {
    const shape = new THREE.Shape();
    // Start at front splitter (facing +X)
    shape.moveTo(2.35, 0.12);
    shape.lineTo(2.35, 0.32);
    shape.quadraticCurveTo(2.1, 0.52, 1.4, 0.58); // Low sleek hood
    shape.lineTo(0.55, 0.98); // Sloped windshield
    shape.lineTo(-0.6, 1.0); // Aerodynamic roof
    shape.quadraticCurveTo(-1.3, 0.92, -1.8, 0.62); // Fastback rear glass
    shape.lineTo(-2.25, 0.58); // Trunk / spoiler
    shape.lineTo(-2.35, 0.2); // Rear bumper
    shape.lineTo(-1.9, 0.18);
    // Rear wheel arch cutout
    shape.absarc(-1.4, 0.22, 0.42, 0, Math.PI, false);
    shape.lineTo(0.8, 0.18);
    // Front wheel arch cutout
    shape.absarc(1.4, 0.22, 0.42, 0, Math.PI, false);
    shape.lineTo(2.35, 0.12);

    const extrudeSettings = {
      depth: 1.5,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center(); // Center around origin

    // Separate Glass Cabin Geometry
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(0.5, 0.6);
    cabinShape.lineTo(0.48, 0.92);
    cabinShape.lineTo(-0.55, 0.94);
    cabinShape.lineTo(-1.45, 0.62);
    cabinShape.closePath();

    const cabinExtrude = new THREE.ExtrudeGeometry(cabinShape, {
      depth: 1.42,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    cabinExtrude.center();

    return { bodyGeometry: geom, cabinGeometry: cabinExtrude };
  }, []);

  // 2. Door Livery Texture for Police Cruiser
  const policeDoorTexture = useMemo(() => {
    if (type === "police") return createPoliceDoorTexture();
    return null;
  }, [type]);

  // 3. Smoke Particles for Wrecked Cars
  const smokeGeo = useMemo(() => {
    if (type !== "wrecked") return null;
    const count = 35;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 1.2 + (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = 0.5 + Math.random() * 0.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [type]);

  // 4. Animation Frame: Wheels spinning, siren lights strobe, suspension bob
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // Wheel spin
    if (type !== "wrecked") {
      wheelsRef.current.forEach((w) => {
        if (w) w.rotation.z -= speed * delta * 12;
      });
    }

    // Suspension bob & roll
    if (carGroupRef.current) {
      if (type !== "wrecked") {
        const bob = Math.sin(time * 10 * speed) * 0.015;
        const roll = swerving ? Math.sin(time * 3) * 0.06 : 0;
        carGroupRef.current.position.y = (position[1] || 0) + bob;
        carGroupRef.current.rotation.x = roll;
      } else {
        // Wrecked car is slightly tilted
        carGroupRef.current.rotation.z = -0.12;
        carGroupRef.current.rotation.x = 0.08;
      }
    }

    // Police roof sirens strobe
    if (type === "police") {
      const flash = Math.sin(time * 16);
      if (sirenLightRedRef.current) {
        sirenLightRedRef.current.intensity = flash > 0 ? 3.5 : 0.2;
      }
      if (sirenLightBlueRef.current) {
        sirenLightBlueRef.current.intensity = flash <= 0 ? 3.5 : 0.2;
      }
    }

    // Hazard light blink for wrecked cars
    if (type === "wrecked" && hazardLightRef.current) {
      const hazard = Math.sin(time * 6);
      hazardLightRef.current.intensity = hazard > 0 ? 2.5 : 0.1;
    }

    // Smoke animation
    if (type === "wrecked" && smokeParticlesRef.current) {
      const positions = smokeParticlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += delta * 0.4;
        if (positions[i * 3 + 1] > 1.8) {
          positions[i * 3 + 1] = 0.5;
        }
      }
      smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const isPolice = type === "police";
  const isWrecked = type === "wrecked";

  return (
    <group ref={carGroupRef} position={position} rotation={rotation} scale={scale}>
      {/* ─── CAR BODY ─── */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow position={[0, 0.42, 0]}>
        <meshPhysicalMaterial
          color={isPolice ? "#0a1120" : isWrecked ? "#1e293b" : paintColor}
          metalness={isWrecked ? 0.3 : 0.85}
          roughness={isWrecked ? 0.7 : 0.2}
          clearcoat={isWrecked ? 0 : 0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Police White Two-Tone Door Panels */}
      {isPolice && (
        <>
          {/* Right Side Door */}
          <mesh position={[0.1, 0.55, 0.78]}>
            <planeGeometry args={[1.5, 0.55]} />
            <meshStandardMaterial
              map={policeDoorTexture || undefined}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
          {/* Left Side Door */}
          <mesh position={[0.1, 0.55, -0.78]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.5, 0.55]} />
            <meshStandardMaterial
              map={policeDoorTexture || undefined}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        </>
      )}

      {/* ─── GLASS CABIN ─── */}
      <mesh geometry={cabinGeometry} position={[0, 0.76, 0]}>
        <meshPhysicalMaterial
          color="#060c18"
          roughness={0.1}
          metalness={0.9}
          transmission={0.4}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* ─── FRONT PUSH BAR (Police only) ─── */}
      {isPolice && (
        <group position={[2.42, 0.36, 0]}>
          <mesh>
            <boxGeometry args={[0.12, 0.36, 1.2]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.16, 0.08, 0.9]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* ─── HEADLIGHTS (Emissive + Real Spotlights) ─── */}
      <group position={[2.36, 0.42, 0]}>
        {/* Right Headlight */}
        <mesh position={[0, 0, 0.52]}>
          <boxGeometry args={[0.06, 0.12, 0.22]} />
          <meshStandardMaterial
            emissive="#fef08a"
            emissiveIntensity={isWrecked ? 1 : 4}
            color="#fef08a"
          />
        </mesh>
        {/* Left Headlight */}
        <mesh position={[0, 0, -0.52]}>
          <boxGeometry args={[0.06, 0.12, 0.22]} />
          <meshStandardMaterial
            emissive="#fef08a"
            emissiveIntensity={isWrecked ? 0.4 : 4}
            color="#fef08a"
          />
        </mesh>

        {/* SpotLights casting light beams onto road */}
        {!isWrecked && (
          <>
            <spotLight
              position={[0.2, 0, 0.52]}
              target-position={[8, -0.4, 0.52]}
              color="#fef08a"
              intensity={4.5}
              distance={18}
              angle={0.45}
              penumbra={0.6}
            />
            <spotLight
              position={[0.2, 0, -0.52]}
              target-position={[8, -0.4, -0.52]}
              color="#fef08a"
              intensity={4.5}
              distance={18}
              angle={0.45}
              penumbra={0.6}
            />
          </>
        )}
      </group>

      {/* ─── TAILLIGHTS (Glowing Red with Bloom) ─── */}
      <group position={[-2.36, 0.46, 0]}>
        {/* Right Taillight */}
        <mesh position={[0, 0, 0.54]}>
          <boxGeometry args={[0.06, 0.1, 0.26]} />
          <meshStandardMaterial
            emissive="#ef4444"
            emissiveIntensity={isBraking ? 6 : 2.5}
            color="#ef4444"
          />
        </mesh>
        {/* Left Taillight */}
        <mesh position={[0, 0, -0.54]}>
          <boxGeometry args={[0.06, 0.1, 0.26]} />
          <meshStandardMaterial
            emissive="#ef4444"
            emissiveIntensity={isBraking ? 6 : 2.5}
            color="#ef4444"
          />
        </mesh>
      </group>

      {/* ─── POLICE ROOF LIGHT BAR ─── */}
      {isPolice && (
        <group position={[-0.15, 1.05, 0]}>
          {/* Base Mount */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.18, 0.05, 0.8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Red Strobe Lens (Left) */}
          <mesh position={[0, 0.06, 0.24]}>
            <boxGeometry args={[0.14, 0.08, 0.32]} />
            <meshStandardMaterial emissive="#ef4444" emissiveIntensity={4} color="#ef4444" />
          </mesh>
          {/* Blue Strobe Lens (Right) */}
          <mesh position={[0, 0.06, -0.24]}>
            <boxGeometry args={[0.14, 0.08, 0.32]} />
            <meshStandardMaterial emissive="#3b82f6" emissiveIntensity={4} color="#3b82f6" />
          </mesh>
          {/* Flashing PointLights */}
          <pointLight
            ref={sirenLightRedRef}
            position={[0, 0.3, 0.5]}
            color="#ef4444"
            distance={12}
          />
          <pointLight
            ref={sirenLightBlueRef}
            position={[0, 0.3, -0.5]}
            color="#3b82f6"
            distance={12}
          />
        </group>
      )}

      {/* ─── WRECKED HAZARD LIGHT ─── */}
      {isWrecked && (
        <pointLight ref={hazardLightRef} position={[0, 0.6, 0]} color="#f59e0b" distance={6} />
      )}

      {/* ─── SMOKE PARTICLES (Wrecked only) ─── */}
      {isWrecked && smokeGeo && (
        <points ref={smokeParticlesRef} geometry={smokeGeo}>
          <pointsMaterial color="#94a3b8" size={0.12} transparent opacity={0.45} />
        </points>
      )}

      {/* ─── 4 PROCEDURAL WHEELS WITH RIMS & BRAKES ─── */}
      {[
        { x: 1.42, z: 0.82, id: 0 },
        { x: 1.42, z: -0.82, id: 1 },
        { x: -1.42, z: 0.82, id: 2 },
        { x: -1.42, z: -0.82, id: 3 },
      ].map((pos, idx) => {
        // If wrecked, one wheel is missing/detached
        if (isWrecked && idx === 1) return null;

        return (
          <group
            key={idx}
            position={[pos.x, 0.35, pos.z]}
            ref={(el) => {
              if (el) wheelsRef.current[idx] = el;
            }}
          >
            {/* Tyre (Dark Rubber) */}
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.22, 20]} />
              <meshStandardMaterial color="#0b121e" roughness={0.9} />
            </mesh>

            {/* Multi-Spoke Alloy Rim */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.23, 10]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Brake Caliper (Red/Cyan Accent) */}
            <mesh position={[0.1, 0.1, 0]}>
              <boxGeometry args={[0.12, 0.08, 0.16]} />
              <meshStandardMaterial color={isPolice ? "#3b82f6" : "#ef4444"} />
            </mesh>
          </group>
        );
      })}

      {/* ─── SOFT CONTACT SHADOW ON ROAD ─── */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 2.0]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}
