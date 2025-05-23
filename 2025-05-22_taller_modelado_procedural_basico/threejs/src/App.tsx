import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, CanvasProps } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Componente para generar una cuadrícula de cajas
const GridOfBoxes = () => {
  const groupRef = useRef<THREE.Group>(null!);

  const boxes = [];
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      boxes.push(
        <mesh key={`${i}-${j}`} position={[i * 2, j * 2, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      );
    }
  }

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.01;
      groupRef.current.rotation.y += 0.01;
    }
  });

  return <group ref={groupRef} position={[-10, 0, 0]}>{boxes}</group>;
};

// Componente para generar una espiral de esferas
const SpiralOfSpheres = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const originalPositions = useRef<Float32Array | null>(null);
  const [visibleSpheres, setVisibleSpheres] = useState(0);

  // Animar la aparición de esferas una por una
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSpheres((prev) => {
        if (prev < 10) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500); // Cada esfera aparece cada 500ms
    return () => clearInterval(interval);
  }, []);

  const spheres = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const radius = 5;
    const x = radius * Math.cos(angle);
    const y = i * 0.5;
    const z = radius * Math.sin(angle);
    if (i <= visibleSpheres - 1) {
      spheres.push(
        <mesh
          key={i}
          ref={i === 0 ? meshRef : undefined}
          position={[x, y, z]}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="pink" />
        </mesh>
      );
    }
  }

  // Guardar las posiciones originales de los vértices
  useEffect(() => {
    if (meshRef.current && meshRef.current.geometry) {
      const positions = meshRef.current.geometry.attributes.position.array;
      originalPositions.current = new Float32Array(positions.length);
      originalPositions.current.set(positions);
    }
  }, []);

  // Animar los vértices basados en las posiciones originales
  useFrame(() => {
    if (
      meshRef.current &&
      meshRef.current.geometry &&
      meshRef.current.geometry.attributes.position &&
      originalPositions.current
    ) {
      const positions = meshRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const originalZ = originalPositions.current[i + 2];
        positions[i + 2] = originalZ + Math.sin(Date.now() * 0.001 + i) * 0.05;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return <group position={[10, 0, 0]}>{spheres}</group>;
};

// Componente para un árbol fractal básico
const FractalTree = ({ position = [0, 0, 0], angle = 0, depth = 5 }: { position: [number, number, number]; angle: number; depth: number }) => {
  if (depth <= 0) return null;

  const length = depth * 0.5;
  const newX = position[0] + Math.cos(angle) * length;
  const newY = position[1] + Math.sin(angle) * length;

  return (
    <>
      <mesh position={position}>
        <boxGeometry args={[0.1, length, 0.1]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
      <FractalTree position={[newX, newY, 0]} angle={angle - 0.3} depth={depth - 1} />
      <FractalTree position={[newX, newY, 0]} angle={angle + 0.3} depth={depth - 1} />
    </>
  );
};

// Componente principal
const App: React.FC = () => {
  const canvasProps: CanvasProps = {
    style: { height: '100vh' },
    camera: { position: [0, 5, 30], fov: 90 },
    children: (
      <>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, 10]} />
        <GridOfBoxes />
        <SpiralOfSpheres />
        <group position={[0, -10, 0]}>
          <FractalTree position={[0, 0, 0]} angle={0} depth={7} />
        </group>
        <OrbitControls />
      </>
    ),
  };

  return <Canvas {...canvasProps} />;
};

export default App;