import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Car3D } from "./Car3D";
import {
  createHazardTexture,
  createCrimeTapeTexture,
  createAsphaltTexture,
} from "./ProceduralTextures";

interface Scene3DProps {
  checkpointId: number;
  isTriggered: boolean;
  isFinale?: boolean;
}

// ─── 1. POLICE HELICOPTER IN UPPER SKY ───
function PoliceHelicopter() {
  const heliRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Mesh>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rotorRef.current) rotorRef.current.rotation.y += 0.6;
    if (heliRef.current) {
      heliRef.current.position.x = 2 + Math.sin(t * 0.4) * 3;
      heliRef.current.position.y = 5.5 + Math.cos(t * 0.6) * 0.3;
    }
    if (spotLightRef.current) {
      spotLightRef.current.target.position.x = Math.sin(t * 0.8) * 4;
      spotLightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <group ref={heliRef} position={[2, 5.5, -4]}>
      {/* Fuselage */}
      <mesh>
        <boxGeometry args={[1.6, 0.6, 0.7]} />
        <meshStandardMaterial color="#08101e" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Tail Boom */}
      <mesh position={[-1.4, 0.1, 0]}>
        <boxGeometry args={[1.5, 0.14, 0.14]} />
        <meshStandardMaterial color="#08101e" />
      </mesh>
      {/* Main Rotor */}
      <mesh ref={rotorRef} position={[0, 0.4, 0]}>
        <boxGeometry args={[3.4, 0.02, 0.12]} />
        <meshStandardMaterial color="#64748b" transparent opacity={0.7} />
      </mesh>
      {/* Searchlight Cone Sweeping Downward */}
      <spotLight
        ref={spotLightRef}
        position={[0.2, -0.2, 0]}
        color="#38bdf8"
        intensity={5}
        distance={24}
        angle={0.35}
        penumbra={0.7}
      />
    </group>
  );
}

// ─── 2. CHECKPOINT 1: ROADBLOCK PROPS (3D) ───
function Roadblock3D() {
  const hazardTex = useMemo(() => createHazardTexture(), []);

  return (
    <group position={[4.5, 0, 0]}>
      {/* Striped Barrier 1 */}
      <mesh position={[0, 0.5, 1.2]} castShadow>
        <boxGeometry args={[0.2, 0.8, 2.2]} />
        <meshStandardMaterial map={hazardTex} roughness={0.4} />
      </mesh>
      {/* Barrier Legs */}
      <mesh position={[0, 0.25, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 0.25, 2.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Traffic Cones */}
      {[0.5, 1.5, -0.8].map((z, i) => (
        <mesh key={i} position={[-0.8, 0.3, z]}>
          <coneGeometry args={[0.18, 0.6, 12]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} />
        </mesh>
      ))}

      {/* Spike Strip across road shoulder */}
      <mesh position={[-0.4, 0.04, -1.2]}>
        <boxGeometry args={[0.25, 0.06, 1.8]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>

      {/* Parked Police Cruiser */}
      <Car3D type="police" position={[2.0, 0, -2.4]} rotation={[0, 0.25, 0]} speed={0} />
    </group>
  );
}

// ─── 3. CHECKPOINT 2: CRASH SITE PROPS (3D) ───
function CrashSite3D() {
  const tapeTex = useMemo(() => createCrimeTapeTexture(), []);

  return (
    <group position={[3.5, 0, 0]}>
      {/* Wrecked Car 1 */}
      <Car3D
        type="wrecked"
        paintColor="#1e293b"
        position={[-0.6, 0, 1.2]}
        rotation={[0, -0.4, 0]}
        speed={0}
      />
      {/* Wrecked Car 2 */}
      <Car3D
        type="wrecked"
        paintColor="#0d233a"
        position={[1.4, 0, -1.1]}
        rotation={[0, 2.8, 0]}
        speed={0}
      />

      {/* Yellow Crime Scene Tape stretched across the road */}
      <mesh position={[0.2, 0.9, 0]}>
        <boxGeometry args={[0.02, 0.25, 6.5]} />
        <meshStandardMaterial map={tapeTex} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ─── 4. CHECKPOINT 3: TRAFFIC CAMERA & SCAN CONE (3D) ───
function TrafficCamera3D() {
  const scanConeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (scanConeRef.current) {
      scanConeRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.25;
    }
  });

  return (
    <group position={[3.0, 0, -2.2]}>
      {/* Camera Pole */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 5, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      {/* Gantry Arm Extending Over Road */}
      <mesh position={[-1.2, 4.8, 1.2]}>
        <boxGeometry args={[0.1, 0.1, 3.2]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      {/* Camera Housing */}
      <mesh position={[-1.2, 4.6, 2.2]}>
        <boxGeometry args={[0.3, 0.25, 0.5]} />
        <meshStandardMaterial color="#0b1728" emissive="#0284c7" emissiveIntensity={0.8} />
      </mesh>

      {/* Sweeping Cyan Biometric Scan Cone */}
      <group ref={scanConeRef} position={[-1.2, 4.5, 2.2]}>
        <spotLight
          color="#22d3ee"
          intensity={6}
          distance={16}
          angle={0.42}
          penumbra={0.5}
          target-position={[0, -4.5, 0]}
        />
        <mesh position={[0, -2.2, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[1.8, 4.2, 16, 1, true]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 5. CHECKPOINT 4: INTERROGATION BUILDING & POLYGRAPH (3D) ───
function InterrogationBuilding3D() {
  return (
    <group position={[4.0, 0, -3.2]}>
      {/* Building Facade */}
      <mesh position={[0, 3.5, 0]} receiveShadow>
        <boxGeometry args={[6.5, 7, 0.4]} />
        <meshStandardMaterial color="#071220" roughness={0.8} />
      </mesh>

      {/* Lit Interrogation Window */}
      <mesh position={[-0.4, 2.8, 0.22]}>
        <planeGeometry args={[2.8, 1.8]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Window Silhouettes */}
      <group position={[-0.4, 2.6, 0.24]}>
        {/* Silhouette 1 */}
        <mesh position={[-0.7, 0, 0]}>
          <boxGeometry args={[0.4, 0.7, 0.05]} />
          <meshBasicMaterial color="#050b14" />
        </mesh>
        {/* Silhouette 2 */}
        <mesh position={[0.7, 0, 0]}>
          <boxGeometry args={[0.4, 0.7, 0.05]} />
          <meshBasicMaterial color="#050b14" />
        </mesh>
      </group>

      {/* Hanging Lamp Light casting outward */}
      <pointLight position={[-0.4, 3.2, 0.6]} color="#fef08a" intensity={3} distance={9} />
    </group>
  );
}

// ─── MAIN 3D SCENE CONTENT ───
function SceneContent({ checkpointId, isTriggered, isFinale = false }: Scene3DProps) {
  const asphaltTex = useMemo(() => createAsphaltTexture(), []);
  const roadDashesRef = useRef<THREE.Group>(null);

  // Scrolling dashed lines in useFrame
  useFrame((_, delta) => {
    if (roadDashesRef.current && !isFinale) {
      roadDashesRef.current.position.x -= delta * 12;
      if (roadDashesRef.current.position.x < -8) {
        roadDashesRef.current.position.x = 0;
      }
    }
  });

  const isStopped = isFinale || (checkpointId === 4 && isFinale);

  return (
    <>
      {/* Ambient Night-Sky Lighting */}
      <ambientLight color="#0b1a30" intensity={0.9} />
      <directionalLight position={[-6, 12, 6]} color="#38bdf8" intensity={0.65} castShadow />

      {/* Police Helicopter in upper airspace */}
      <PoliceHelicopter />

      {/* Distant Moon */}
      <mesh position={[12, 9, -15]}>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>

      {/* ─── WET-ASPHALT ROAD WITH REFLECTIONS ─── */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 10]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mirror={0.45}
          mixBlur={0.85}
          mixStrength={1.5}
          roughness={0.5}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#08101e"
          metalness={0.6}
        />
      </mesh>

      {/* Scrolling Yellow Dashed Lane Lines */}
      <group ref={roadDashesRef} position={[0, 0.015, 0]}>
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={i} position={[-20 + i * 4, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.8, 0.12]} />
            <meshBasicMaterial color="#FFD21F" />
          </mesh>
        ))}
      </group>

      {/* Road Concrete Kerbs */}
      <mesh position={[0, 0.06, 4.2]}>
        <boxGeometry args={[70, 0.12, 0.4]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.06, -4.2]}>
        <boxGeometry args={[70, 0.12, 0.4]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* ─── CHECKPOINT PROPS ─── */}
      {checkpointId === 1 && <Roadblock3D />}
      {checkpointId === 2 && <CrashSite3D />}
      {checkpointId === 3 && <TrafficCamera3D />}
      {checkpointId === 4 && <InterrogationBuilding3D />}

      {/* ─── GETAWAY CAR (Lead) ─── */}
      <Car3D
        type="getaway"
        paintColor="#0b172a"
        position={[0.8, 0, 0.4]}
        rotation={[0, 0, 0]}
        speed={isStopped ? 0 : 1.2}
        isBraking={isStopped || (checkpointId === 1 && isTriggered)}
        swerving={checkpointId === 1 || checkpointId === 2}
      />

      {/* ─── POLICE CRUISER (Chasing behind) ─── */}
      <Car3D
        type="police"
        position={[-3.6, 0, 0.4]}
        rotation={[0, 0, 0]}
        speed={isStopped ? 0 : 1.2}
        isBraking={isStopped}
      />
    </>
  );
}

export function Scene3D({ checkpointId, isTriggered, isFinale = false }: Scene3DProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={{ position: [0, 2.2, 6.8], fov: 45 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <SceneContent checkpointId={checkpointId} isTriggered={isTriggered} isFinale={isFinale} />
    </Canvas>
  );
}

export default Scene3D;
