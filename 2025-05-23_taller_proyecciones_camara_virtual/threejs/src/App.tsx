import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, OrthographicCamera, Text } from '@react-three/drei';
import * as THREE from 'three';

// Interfaz para las props de Flower
interface FlowerProps {
  position?: [number, number, number];
}

// Componente para la flor 3D
const Flower: React.FC<FlowerProps> = ({ position = [0, 0, 0] }) => {
  // Tallo (Box)
  const stemHeight = 4;
  const stem = (
    <mesh position={[0, -stemHeight / 2, 0]}>
      <boxGeometry args={[0.2, stemHeight, 0.2]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );

  // Centro de la flor (Sphere)
  const center = (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );

  // Pétalos (Spheres)
  const petalRadius = 0.3;
  const petalDistance = 0.8; // Distancia del centro
  const numPetals = 6; // Número de pétalos
  const petals = [];
  for (let i = 0; i < numPetals; i++) {
    const angle = (i / numPetals) * Math.PI * 2;
    const x = petalDistance * Math.cos(angle);
    const z = petalDistance * Math.sin(angle);
    petals.push(
      <mesh key={i} position={[x, 0, z]}>
        <sphereGeometry args={[petalRadius, 32, 32]} />
        <meshStandardMaterial color="pink" />
      </mesh>
    );
  }

  return (
    <group position={position}>
      {stem}
      {center}
      {petals}
    </group>
  );
};

// Componente para los objetos 3D (incluye varias flores a diferentes distancias)
const SceneObjects = () => {
  return (
    <>
      {/* Flor cercana */}
      <Flower position={[0, 0, 5]} />
      {/* Flor media */}
      <Flower position={[2, 0, 10]} />
      {/* Flor lejana */}
      <Flower position={[4, 0, 15]} />
      {/* Flor cercana (otro lado) */}
      <Flower position={[-2, 0, 5]} />
      {/* Flor lejana (otro lado) */}
      <Flower position={[-4, 0, 15]} />
    </>
  );
};

// Componente para mostrar información de la cámara
const CameraInfo = () => {
  const { camera } = useThree();

  // Aseguramos que los parámetros sean seguros
  const getCameraParams = () => {
    if ('fov' in camera) {
      const persCamera = camera as THREE.PerspectiveCamera;
      return {
        type: 'Perspective',
        fov: persCamera.fov,
        aspect: persCamera.aspect,
        near: persCamera.near,
        far: persCamera.far,
      };
    } else if ('left' in camera) {
      const orthoCamera = camera as THREE.OrthographicCamera;
      return {
        type: 'Orthographic',
        left: orthoCamera.left,
        right: orthoCamera.right,
        top: orthoCamera.top,
        bottom: orthoCamera.bottom,
      };
    }
    return { type: 'Unknown' } as any; // Fallback en caso de error
  };

  const cameraParams = getCameraParams();

  return (
    <Text
      position={[0, 4, 0]}
      fontSize={0.5}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      Cámara: {cameraParams.type}
      {'\n'}
      {cameraParams.type === 'Perspective'
        ? `FOV: ${cameraParams.fov?.toFixed(2) || 'N/A'}° | Aspect: ${cameraParams.aspect?.toFixed(2) || 'N/A'} | Near: ${cameraParams.near?.toFixed(2) || 'N/A'} | Far: ${cameraParams.far?.toFixed(2) || 'N/A'}`
        : cameraParams.type === 'Orthographic'
        ? `Left: ${cameraParams.left?.toFixed(2) || 'N/A'} | Right: ${cameraParams.right?.toFixed(2) || 'N/A'} | Top: ${cameraParams.top?.toFixed(2) || 'N/A'} | Bottom: ${cameraParams.bottom?.toFixed(2) || 'N/A'}`
        : 'Parámetros no disponibles'}
    </Text>
  );
};

// Componente para el bonus: transformación 3D a 2D
const ProjectionDemo = () => {
  const { camera, gl } = useThree();
  const [projectedCoords, setProjectedCoords] = useState<[number, number]>([0, 0]);

  useFrame(() => {
    const vector = new THREE.Vector3(2, 0, 10); // Punto 3D a proyectar (centro de la flor media)
    vector.project(camera);
    const x = ((vector.x + 1) / 2) * gl.domElement.width;
    const y = ((-vector.y + 1) / 2) * gl.domElement.height;
    setProjectedCoords([x, y]);
  });

  return (
    <Text
      position={[0, -4, 0]}
      fontSize={0.5}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      Punto 3D (2, 0, 10) proyectado a 2D: ({projectedCoords[0].toFixed(2)}, {projectedCoords[1].toFixed(2)})
    </Text>
  );
};

// Componente principal
const App: React.FC = () => {
  const [isPerspective, setIsPerspective] = useState(true);

  const toggleCamera = () => {
    setIsPerspective(!isPerspective);
  };

  return (
    <>
      <button
        onClick={toggleCamera}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px',
          fontSize: '16px',
          zIndex: 10, 
        }}
      >
        Cambiar a {isPerspective ? 'Ortográfica' : 'Perspectiva'}
      </button>
      <Canvas
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {isPerspective ? (
          <PerspectiveCamera makeDefault fov={75} aspect={window.innerWidth / window.innerHeight} near={0.1} far={1000} position={[0, 5, 15]} />
        ) : (
          <OrthographicCamera makeDefault left={-5} right={5} top={5} bottom={-5} near={0.1} far={1000} position={[0, 5, 15]} />
        )}
        <SceneObjects />
        <OrbitControls />
        <CameraInfo />
        <ProjectionDemo />
      </Canvas>
    </>
  );
};

export default App;