"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface HeroChipSceneProps {
  active: boolean;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  onReady: () => void;
}

interface TracePath {
  points: THREE.Vector3[];
  color: string;
  offset: number;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/games";
const logoSrc = `${basePath}/Teknogame_logo_only.png`;

function createTracePaths(): TracePath[] {
  const paths: TracePath[] = [];
  const offsets = [-0.5, -0.25, 0, 0.25, 0.5];

  offsets.forEach((offset, index) => {
    const bend = (index - 2) * 0.1;
    const horizontal = [
      [0.82, offset, 0.02],
      [1.12, offset, 0.02],
      [1.38, offset + bend, 0.02],
      [2.32, offset + bend, 0.02],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const vertical = horizontal.map(
      (point) => new THREE.Vector3(point.y, point.x, point.z)
    );

    paths.push(
      { points: horizontal, color: "#255dce", offset: index / offsets.length },
      {
        points: horizontal.map((point) => new THREE.Vector3(-point.x, point.y, point.z)),
        color: "#660033",
        offset: (index + 0.3) / offsets.length,
      },
      { points: vertical, color: "#255dce", offset: (index + 0.5) / offsets.length },
      {
        points: vertical.map((point) => new THREE.Vector3(point.x, -point.y, point.z)),
        color: "#8a0045",
        offset: (index + 0.8) / offsets.length,
      }
    );
  });

  return paths;
}

function DataPulse({
  path,
  pointer,
}: {
  path: TracePath;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(path.offset);
  const segmentLengths = useMemo(
    () =>
      path.points.slice(1).map((point, index) =>
        point.distanceTo(path.points[index])
      ),
    [path.points]
  );
  const totalLength = useMemo(
    () => segmentLengths.reduce((total, length) => total + length, 0),
    [segmentLengths]
  );

  useFrame((_, delta) => {
    if (!pulseRef.current || totalLength === 0) return;

    const pointerX = pointer.current.x * 2.5;
    const pointerY = pointer.current.y * 1.4;
    const distance = Math.hypot(
      pulseRef.current.position.x - pointerX,
      pulseRef.current.position.y - pointerY
    );
    const cursorBoost = Math.max(0, 1 - distance / 1.4) * 0.6;
    phaseRef.current = (phaseRef.current + delta * (0.26 + cursorBoost)) % 1;

    let remaining = phaseRef.current * totalLength;
    let segment = 0;
    while (segment < segmentLengths.length - 1 && remaining > segmentLengths[segment]) {
      remaining -= segmentLengths[segment];
      segment += 1;
    }

    const length = segmentLengths[segment] || 1;
    const progress = remaining / length;
    pulseRef.current.position.lerpVectors(
      path.points[segment],
      path.points[segment + 1],
      progress
    );
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color={path.color} toneMapped={false} />
    </mesh>
  );
}

function CircuitChip({ pointer }: Pick<HeroChipSceneProps, "pointer">) {
  const chipRef = useRef<THREE.Group>(null);
  const logo = useTexture(logoSrc);
  const paths = useMemo(() => createTracePaths(), []);

  useFrame(({ clock }, delta) => {
    if (!chipRef.current) return;
    const targetX = pointer.current.y * 0.16 + Math.sin(clock.elapsedTime * 0.35) * 0.025;
    const targetY =
      pointer.current.x * 0.2 + Math.sin(clock.elapsedTime * 0.22) * 0.06;
    chipRef.current.rotation.x += (targetX - chipRef.current.rotation.x) * Math.min(delta * 2.5, 1);
    chipRef.current.rotation.y += (targetY - chipRef.current.rotation.y) * Math.min(delta * 2.5, 1);
  });

  return (
    <group ref={chipRef}>
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          <Line
            points={path.points}
            color={path.color}
            lineWidth={1.2}
            transparent
            opacity={0.7}
          />
          <DataPulse path={path} pointer={pointer} />
        </React.Fragment>
      ))}

      <RoundedBox
        args={[1.72, 1.72, 0.34]}
        radius={0.13}
        smoothness={3}
        position={[0, 0, 0.08]}
      >
        <meshStandardMaterial
          color="#151b29"
          metalness={0.9}
          roughness={0.28}
          emissive="#021861"
          emissiveIntensity={0.55}
        />
      </RoundedBox>

      <RoundedBox
        args={[1.44, 1.44, 0.08]}
        radius={0.09}
        smoothness={3}
        position={[0, 0, 0.3]}
      >
        <meshStandardMaterial
          color="#0b0e17"
          metalness={0.72}
          roughness={0.35}
          emissive="#255dce"
          emissiveIntensity={0.2}
        />
      </RoundedBox>

      <mesh position={[0, 0, 0.35]}>
        <planeGeometry args={[1.18, 1.18]} />
        <meshBasicMaterial
          map={logo}
          transparent
          alphaTest={0.04}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function HeroChipScene({
  active,
  pointer,
  onReady,
}: HeroChipSceneProps) {
  return (
    <Canvas
      className="hero-chip-canvas"
      camera={{ position: [0, 0, 6.7], fov: 36 }}
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        onReady();
      }}
    >
      <ambientLight intensity={0.85} />
      <pointLight position={[2.8, 2.4, 4]} intensity={1.7} color="#255dce" />
      <pointLight position={[-2.8, -2, 2]} intensity={1.1} color="#8a0045" />
      <CircuitChip pointer={pointer} />
    </Canvas>
  );
}
