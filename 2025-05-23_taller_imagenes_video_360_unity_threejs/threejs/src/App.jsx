import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Componente para mostrar una imagen 360
function PanoramaImage({ url }) {
  // Carga la textura de la imagen panorámica
  const texture = useTexture(url);
  return (
    <mesh scale={[-1, 1, 1]}>
      {/* Esfera invertida para que la textura se vea desde dentro */}
      <sphereGeometry args={[10, 60, 40]} />
      {/* Material básico con la textura y renderizado por la parte trasera */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Componente para mostrar un video 360
function PanoramaVideo({ url }) {
  // Crea y reproduce el elemento de video HTML
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = url;
    vid.crossOrigin = 'Anonymous'; // Importante para texturas de video
    vid.loop = true;
    vid.muted = true; // El video debe estar silenciado para la reproducción automática en muchos navegadores
    vid.play();
    return vid;
  });

  // Crea una textura de Three.js a partir del elemento de video
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter; // O THREE.NearestFilter
  videoTexture.magFilter = THREE.LinearFilter; // O THREE.NearestFilter

  return (
    <mesh scale={[-1, 1, 1]}>
      {/* Esfera invertida para que el video se vea desde dentro */}
      <sphereGeometry args={[10, 60, 40]} />
      {/* Material básico con la textura de video y renderizado por la parte trasera */}
      <meshBasicMaterial map={videoTexture} side={THREE.BackSide} />
    </mesh>
  );
}

// Componente principal de la aplicación
export default function App() {
  const [sceneType, setSceneType] = useState('image'); // 'image' o 'video'
  const orbitControlsRef = useRef();

  // Función para resetear la cámara cuando se cambia de escena
  const resetCamera = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  return (
    // Contenedor principal: ocupa toda la pantalla, organiza en columna y añade padding general
    <div className="w-full h-screen flex flex-col bg-gray-100 font-inter p-4">
      {/* Contenedor del visor: ocupa el espacio disponible, se centra y tiene tamaño fijo */}
      {/* Eliminamos flex-grow de aquí para que no intente expandirse */}
      {/* mx-auto para centrar horizontalmente */}
      {/* mb-4 para un margen inferior que lo separe de los botones */}
      <div
        className="mx-auto rounded-lg overflow-hidden shadow-xl bg-black mb-4"
        style={{ width: '1280px', height: '720px' }} // Dimensiones fijas de 1280x720
      >
        <Canvas className="w-full h-full"> {/* El Canvas sigue ocupando el 100% de su padre fijo */}
          {/* Cámara por defecto */}
          <perspectiveCamera makeDefault position={[0, 0, 0.1]} />
          {/* Controles de órbita para navegar por la escena */}
          <OrbitControls ref={orbitControlsRef} enableZoom={false} enablePan={false} />
          {/* Suspense para manejar la carga de texturas/videos */}
          <Suspense fallback={null}>
            {sceneType === 'image' ? (
              <PanoramaImage url="/panorama.jpg" />
            ) : (
              <PanoramaVideo url="/video360.mp4" />
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* Controles de la interfaz de usuario: centrado horizontalmente y empujado hacia abajo */}
      {/* mt-auto empuja este div hacia la parte inferior del contenedor flex-col */}
      <div className="flex justify-center space-x-4 py-4 px-8 bg-white rounded-lg shadow-md mt-auto">
        <button
          onClick={() => {
            setSceneType('image');
            resetCamera();
          }}
          className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out
            ${sceneType === 'image' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-blue-100'}
            focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105`}
        >
          Ver Imagen 360°
        </button>
        <button
          onClick={() => {
            setSceneType('video');
            resetCamera();
          }}
          className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out
            ${sceneType === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-blue-100'}
            focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105`}
        >
          Ver Video 360°
        </button>
      </div>
    </div>
  );
}

