// src/App.tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SphereWithWebSocket } from './SphereWithWebSocket';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#333' }}> {/* Cambié el fondo para que el brillo sea visible */}
      <Canvas>
        {/* LUCES: */}
        {/* Luz Ambiental: Ilumina toda la escena de manera uniforme, sin sombras. */}
        {/* Es como la luz general que evita que las cosas se vean completamente negras. */}
        <ambientLight intensity={0.5} />

        {/* Luz Direccional: Simula la luz del sol (rayos paralelos). */}
        {/* Es buena para crear sombras definidas y resaltar la forma. */}
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow /> {/* castShadow activado */}

        {/* Luz de Punto (Opcional): Simula una bombilla. */}
        {/* Útil para añadir un punto de luz específico o reflejos brillantes. */}
        <pointLight position={[-5, -5, 5]} intensity={0.8} />

        {/* CÁMARA (Opcional, si quieres una posición inicial diferente) */}
        {/* <perspectiveCamera makeDefault position={[0, 0, 10]} /> */}

        {/* Tu componente de esfera */}
        <SphereWithWebSocket />

        {/* Controles para interactuar con la escena */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;