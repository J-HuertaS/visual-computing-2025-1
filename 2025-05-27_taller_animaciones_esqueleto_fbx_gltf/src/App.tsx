import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Define the type for the animation map
interface AnimationMap {
  [key: string]: THREE.AnimationClip;
}

// Componente para el modelo animado
const AnimatedModel: React.FC<{ onAnimationChange: (animationName: string) => void }> = ({ onAnimationChange }) => {
  const groupRef = useRef<THREE.Group>(null!);

  // Cargar el modelo combinado con todas las animaciones
  const gltf = useGLTF('/models/completeCharacter.glb');
  const { scene, animations } = gltf;

  // Mapear animaciones basadas en los nombres reales del archivo glTF
  const animationMap: AnimationMap = {};
  animations.forEach((anim, index) => {
    console.log(`Animation ${index} - Full Name: "${anim.name}"`);
    // Mapeo ajustado a los nombres reales: "1", "2", "3", "4"
    if (anim.name === '1') animationMap['Dance'] = anim;
    if (anim.name === '2') animationMap['Jump'] = anim;
    if (anim.name === '3') animationMap['Idle'] = anim;
    if (anim.name === '4') animationMap['Run'] = anim;
    if (!Object.values(animationMap).includes(anim)) {
      console.warn(`Animation "${anim.name}" not mapped to any action.`);
    }
  });

  // Crear nuevas animaciones con nombres personalizados
  const renamedAnimations = Object.entries(animationMap).map(([name, clip]) => {
    const newClip = clip.clone();
    newClip.name = name;
    return newClip;
  });

  const { actions, names } = useAnimations(renamedAnimations, groupRef);

  // Lista de animaciones para el ciclo automático
  const animationCycle = ['Dance', 'Jump', 'Idle', 'Run'];
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

  // Verificar animaciones disponibles y reproducir la primera
  useEffect(() => {
    console.log('Loaded GLTF:', gltf);
    console.log('Mapped animation names:', names);
    console.log('Available actions:', Object.keys(actions));
    console.log('Raw animation names:', animations.map((a) => a.name));
    if (animations.length === 0) {
      console.error('No animations found in the .glb file. Please check the model.');
    }
    if (names.length === 0) {
      console.error('No mapped animations available. Check the animation names in the .glb file.');
    }

    // Animación por defecto (primera del ciclo)
    const defaultAction = actions[animationCycle[currentAnimationIndex]];
    if (defaultAction) {
      console.log(`Playing initial animation: ${animationCycle[currentAnimationIndex]}`);
      defaultAction.reset().fadeIn(0.5).play();
      onAnimationChange(animationCycle[currentAnimationIndex]);
    } else {
      console.error(`Initial animation "${animationCycle[currentAnimationIndex]}" not found. Available:`, names);
    }
  }, [actions, names, onAnimationChange, gltf, animations, animationCycle, currentAnimationIndex]);

  // Función para cambiar animación con transiciones suaves
  const handleAnimationChange = useCallback((animationName: string) => {
    const currentAction = Object.values(actions).find((action) => action && action.isRunning());
    const nextAction = actions[animationName];

    if (!nextAction) {
      console.error(`Animation '${animationName}' not found. Available animations:`, names);
      return;
    }

    console.log(`Switching to: ${animationName}`);
    if (currentAction && currentAction !== nextAction) {
      currentAction.fadeOut(0.5);
    }
    nextAction.reset().fadeIn(0.5).play();
    onAnimationChange(animationName);
  }, [actions, names, onAnimationChange]);

  // Ciclo automático de animaciones
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimationIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % animationCycle.length;
        const nextAnimation = animationCycle[nextIndex];
        handleAnimationChange(nextAnimation);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [animationCycle, handleAnimationChange]);

  // Control de animaciones con teclas
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case '1':
          handleAnimationChange('Dance');
          setCurrentAnimationIndex(0);
          break;
        case '2':
          handleAnimationChange('Jump');
          setCurrentAnimationIndex(1);
          break;
        case '3':
          handleAnimationChange('Idle');
          setCurrentAnimationIndex(2);
          break;
        case '4':
          handleAnimationChange('Run');
          setCurrentAnimationIndex(3);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnimationChange]);

  // Ajustar la cámara para apuntar al personaje
  useFrame(({ camera }) => {
    if (groupRef.current) {
      camera.lookAt(groupRef.current.position);
    }
  });

  // Buscar el SkinnedMesh en el modelo
  let skinnedMesh: THREE.SkinnedMesh | undefined;
  scene.traverse((child) => {
    if (child instanceof THREE.SkinnedMesh) {
      skinnedMesh = child;
    }
  });

  if (!skinnedMesh) {
    console.error('No SkinnedMesh found in the model. Check the structure of your .glb file.');
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <primitive object={scene} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[5, 5, 2]} />
        <meshStandardMaterial color="#d3d3d3" />
      </mesh>
      <OrbitControls target={[0, 0, 0]} />
      <spotLight position={[2.5, 2.5, 2.5]} angle={Math.PI / 4} penumbra={0.3} intensity={2.0} castShadow target={groupRef.current || undefined} />
      <spotLight position={[-2.5, 2.5, 2.5]} angle={Math.PI / 4} penumbra={0.3} intensity={2.0} castShadow target={groupRef.current || undefined} />
      <spotLight position={[2.5, 2.5, -2.5]} angle={Math.PI / 4} penumbra={0.3} intensity={2.0} castShadow target={groupRef.current || undefined} />
      <spotLight position={[-2.5, 2.5, -2.5]} angle={Math.PI / 4} penumbra={0.3} intensity={2.0} castShadow target={groupRef.current || undefined} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1.0} castShadow />
    </group>
  );
};

// Componente principal con título dinámico
const App: React.FC = () => {
  const [currentAnimation, setCurrentAnimation] = useState('Idle');

  const handleAnimationChange = (animationName: string) => {
    setCurrentAnimation(animationName);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        style={{ background: '#f5f5dc' }}
        shadows
        camera={{ position: [0, 2, 10], fov: 60 }}
      >
        <AnimatedModel onAnimationChange={handleAnimationChange} />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '10px 20px',
          borderRadius: '5px',
        }}
      >
        {currentAnimation}
      </div>
    </div>
  );
};

// Pre-cargar el modelo combinado
useGLTF.preload('/models/completeCharacter.glb');

export default App;