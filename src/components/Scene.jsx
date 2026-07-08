import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Preload } from '@react-three/drei';
import * as THREE from 'three';

const ParticleSystem = () => {
  const pointsRef = useRef();
  
  // Create a massive field of particles
  const count = 5000;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const r = 20 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      // Neon colors mixed
      const isBlue = Math.random() > 0.5;
      color.set(isBlue ? '#06b6d4' : '#8b5cf6');
      
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
      
      // Interactive effect based on pointer
      const targetX = state.pointer.x * 2;
      const targetY = state.pointer.y * 2;
      
      pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.02;
      pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default function Scene() {
  const group = useRef();

  useFrame(() => {
    const scrollY = window.scrollY;
    // Map scroll position to camera path effect
    if (group.current) {
      group.current.position.y = scrollY * 0.005;
      group.current.position.z = scrollY * 0.002;
    }
  });

  return (
    <group ref={group}>
      <ParticleSystem />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#3b82f6" />
      <directionalLight position={[-10, -10, -5]} intensity={2} color="#8b5cf6" />
      
      <Preload all />
    </group>
  );
}
