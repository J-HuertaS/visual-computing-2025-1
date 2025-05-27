import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Torus } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// Hook para obtener el renderer
const useRenderer = () => {
  const { gl } = useThree();
  return gl;
};

// Interfaz para los controles
interface Controls {
  scale: number;
  materialColor: string;
  textureOption: 'basic' | 'blue_metal' | 'metal_plate_02' | 'metal_plate';
  rotate: boolean;
  lightIntensity: number;
  lightColor: string;
  lightPositionX: number;
  lightPositionY: number;
  lightPositionZ: number;
  ambientIntensity: number;
  directionalIntensity: number;
  directionalColor: string;
  directionalPositionX: number;
  directionalPositionY: number;
  directionalPositionZ: number;
}

// Componente para el objeto 3D controlado
const ControlledObject = () => {
  const torusRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const renderer = useRenderer();

  // Cargar textura de entorno HDR
  useEffect(() => {
    if (!renderer) return;
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    new RGBELoader().load('/textures/environment.hdr', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      if (materialRef.current) {
        materialRef.current.envMap = envMap;
        materialRef.current.envMapIntensity = 1;
        materialRef.current.needsUpdate = true;
      }
      texture.dispose();
      pmremGenerator.dispose();
    });
  }, [renderer]);

  // Configurar controles con leva
  const {
    scale,
    materialColor,
    textureOption,
    rotate,
    lightIntensity,
    lightColor,
    lightPositionX,
    lightPositionY,
    lightPositionZ,
    ambientIntensity,
    directionalIntensity,
    directionalColor,
    directionalPositionX,
    directionalPositionY,
    directionalPositionZ,
  } = useControls({
    scale: { value: 1, min: 0.1, max: 3, step: 0.1, label: 'Scale' },
    materialColor: { value: '#ff0000', label: 'Material Color' },
    textureOption: {
      value: 'basic',
      options: {
        Basic: 'basic',
        'Blue Metal Plate': 'blue_metal',
        'Metal Plate 02': 'metal_plate_02',
        'Metal Plate': 'metal_plate',
      },
      label: 'Texture',
    },
    rotate: { value: false, label: 'Auto Rotate' },
    lightIntensity: { value: 1.5, min: 0, max: 2, step: 0.1, label: 'Point Light Intensity' },
    lightColor: { value: '#ffffff', label: 'Point Light Color' },
    lightPositionX: { value: 5, min: -10, max: 10, step: 0.5, label: 'Point Light X' },
    lightPositionY: { value: 5, min: -10, max: 10, step: 0.5, label: 'Point Light Y' },
    lightPositionZ: { value: 5, min: -10, max: 10, step: 0.5, label: 'Point Light Z' },
    ambientIntensity: { value: 0.5, min: 0, max: 1, step: 0.1, label: 'Ambient Light Intensity' },
    directionalIntensity: { value: 1.5, min: 0, max: 2, step: 0.1, label: 'Directional Light Intensity' },
    directionalColor: { value: '#ffffff', label: 'Directional Light Color' },
    directionalPositionX: { value: -5, min: -10, max: 10, step: 0.5, label: 'Directional Light X' },
    directionalPositionY: { value: 5, min: -10, max: 10, step: 0.5, label: 'Directional Light Y' },
    directionalPositionZ: { value: 5, min: -10, max: 10, step: 0.5, label: 'Directional Light Z' },
  });

  // Rotación automática si el botón está activo
  useEffect(() => {
    let animationFrameId: number;
    if (rotate) {
      const animate = () => {
        if (torusRef.current) {
          torusRef.current.rotation.y += 0.02;
        }
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [rotate]);

  // Seleccionar material basado en la opción de textura
  const material =
    textureOption === 'blue_metal' ? (
      <meshPhysicalMaterial
        ref={materialRef}
        color={materialColor}
        map={new THREE.TextureLoader().load('/textures/blue_metal_plate_diff_1k.jpg')}
      />
    ) : textureOption === 'metal_plate_02' ? (
      <meshPhysicalMaterial
        ref={materialRef}
        color={materialColor}
        map={new THREE.TextureLoader().load('/textures/metal_plate_02_diff_1k.jpg')}
      />
    ) : textureOption === 'metal_plate' ? (
      <meshPhysicalMaterial
        ref={materialRef}
        color={materialColor}
        map={new THREE.TextureLoader().load('/textures/metal_plate_diff_1k.jpg')}
      />
    ) : (
      <meshStandardMaterial color={materialColor} />
    );

  return (
    <mesh ref={torusRef} scale={scale}>
      <Torus args={[1, 0.4, 16, 100]}>{material}</Torus>
    </mesh>
  );
};

// Componente para las luces controladas
const ControlledLights = ({
  lightIntensity,
  lightColor,
  lightPositionX,
  lightPositionY,
  lightPositionZ,
  ambientIntensity,
  directionalIntensity,
  directionalColor,
  directionalPositionX,
  directionalPositionY,
  directionalPositionZ,
}: {
  lightIntensity: number;
  lightColor: string;
  lightPositionX: number;
  lightPositionY: number;
  lightPositionZ: number;
  ambientIntensity: number;
  directionalIntensity: number;
  directionalColor: string;
  directionalPositionX: number;
  directionalPositionY: number;
  directionalPositionZ: number;
}) => {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <pointLight
        position={[lightPositionX, lightPositionY, lightPositionZ]}
        intensity={lightIntensity}
        color={lightColor}
      />
      <directionalLight
        position={[directionalPositionX, directionalPositionY, directionalPositionZ]}
        intensity={directionalIntensity}
        color={directionalColor}
      />
    </>
  );
};

// Componente principal
const App: React.FC = () => {
  const {
    scale,
    materialColor,
    textureOption,
    rotate,
    lightIntensity,
    lightColor,
    lightPositionX,
    lightPositionY,
    lightPositionZ,
    ambientIntensity,
    directionalIntensity,
    directionalColor,
    directionalPositionX,
    directionalPositionY,
    directionalPositionZ,
  } = useControls({
    scale: { value: 1, min: 0.1, max: 3, step: 0.1, label: 'Scale' },
    materialColor: { value: '#ff0000', label: 'Material Color' },
    textureOption: {
      value: 'basic',
      options: {
        Basic: 'basic',
        'Blue Metal Plate': 'blue_metal',
        'Metal Plate 02': 'metal_plate_02',
        'Metal Plate': 'metal_plate',
      },
      label: 'Texture',
    },
    rotate: { value: false, label: 'Auto Rotate' },
    lightIntensity: { value: 1.5, min: 0, max: 2, step: 0.1, label: 'Point Light Intensity' },
    lightColor: { value: '#ffffff', label: 'Point Light Color' },
    lightPositionX: { value: 5, min: -10, max: 10, step: 0.5, label: 'Point Light X' },
    lightPositionY: { value: 5, min: -10, max: 10, step: 0.5, label: 'Point Light Y' },
    lightPositionZ: { value: 5, min: -10, max: 10, step: 0.5, label: 'Point Light Z' },
    ambientIntensity: { value: 0.5, min: 0, max: 1, step: 0.1, label: 'Ambient Light Intensity' },
    directionalIntensity: { value: 1.5, min: 0, max: 2, step: 0.1, label: 'Dir Light Intensity' },
    directionalColor: { value: '#ffffff', label: 'Dir Light Color' },
    directionalPositionX: { value: -5, min: -10, max: 10, step: 0.5, label: 'Dir Light X' },
    directionalPositionY: { value: 5, min: -10, max: 10, step: 0.5, label: 'Dir Light Y' },
    directionalPositionZ: { value: 5, min: -10, max: 10, step: 0.5, label: 'Dir Light Z' },
  });

  return (
    <Canvas style={{ width: '100vw', height: '100vh', backgroundColor: '#1a1a1a' }}>
      <ControlledLights
        lightIntensity={lightIntensity}
        lightColor={lightColor}
        lightPositionX={lightPositionX}
        lightPositionY={lightPositionY}
        lightPositionZ={lightPositionZ}
        ambientIntensity={ambientIntensity}
        directionalIntensity={directionalIntensity}
        directionalColor={directionalColor}
        directionalPositionX={directionalPositionX}
        directionalPositionY={directionalPositionY}
        directionalPositionZ={directionalPositionZ}
      />
      <ControlledObject />
      <OrbitControls />
    </Canvas>
  );
};

export default App;