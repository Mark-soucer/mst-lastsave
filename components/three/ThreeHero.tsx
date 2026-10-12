'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { isMobile, prefersReducedMotion } from '@/lib/utils';

// Part of @react-three/fiber's type augmentation for JSX intrinsic elements.

/** Automotive-inspired abstract disc (brake disc / rotor) */
function BrakeDisc({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const reduced = prefersReducedMotion();

  useFrame((_, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += delta * 0.25;
  });

  return (
    <group position={position} ref={group}>
      {/* Disc body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.22, 64, 1, true]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Hat */}
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.5, 48]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Grooves */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * 1.1;
        const z = Math.sin(angle) * 1.1;
        return (
          <mesh key={i} position={[x, 0.14, z]} rotation={[Math.PI / 2, 0, -angle]}>
            <boxGeometry args={[2.2, 0.02, 0.08]} />
            <meshStandardMaterial color="#111" metalness={0.5} roughness={0.7} />
          </mesh>
        );
      })}
      {/* Red accent ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.02, 8, 64]} />
        <meshStandardMaterial
          color="#FF1A1A"
          emissive="#D50000"
          emissiveIntensity={1.4}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      {/* Center bolts */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2 + Math.PI / 2;
        const x = Math.cos(angle) * 0.32;
        const z = Math.sin(angle) * 0.32;
        return (
          <mesh key={i} position={[x, 0.29, z]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
            <meshStandardMaterial color="#555" metalness={1} roughness={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Floating particles */
function Particles() {
  const count = isMobile() ? 400 : 1000;
  const reduced = prefersReducedMotion();
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!points.current || reduced) return;
    points.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#FF1A1A"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Mouse-reactive lights */
function MouseLights() {
  const light = useRef<THREE.PointLight>(null);
  const reduced = prefersReducedMotion();

  useFrame((state) => {
    if (!light.current || reduced) return;
    const x = state.pointer.x * 2;
    const y = state.pointer.y * 2;
    light.current.position.set(x * 3, y * 3 + 1, 3);
  });

  return (
    <pointLight
      ref={light}
      position={[0, 1, 3]}
      intensity={6}
      color="#FF1A1A"
      distance={8}
      decay={2}
    />
  );
}

export default function ThreeHero() {
  const [, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Canvas
      dpr={isMobile() ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 1.5, 6.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="!pointer-events-none"
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 3]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-4, 2, -2]} intensity={0.4} color="#FF1A1A" />
      <MouseLights />

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <BrakeDisc position={[0, 0.4, 0]} />
      </Float>
      <Particles />

      <ContactShadows position={[0, -1.6, 0]} opacity={0.5} scale={10} blur={2.5} far={3} color="#000" />

      <Environment resolution={256}>
        <Lightformer intensity={2} position={[2, 3, 4]} scale={[3, 3, 1]} />
        <Lightformer intensity={1.2} position={[-3, 1, 2]} scale={[2, 4, 1]} color="#FF1A1A" />
        <Lightformer intensity={0.8} position={[0, -2, 3]} scale={[4, 2, 1]} />
      </Environment>
    </Canvas>
  );
}
