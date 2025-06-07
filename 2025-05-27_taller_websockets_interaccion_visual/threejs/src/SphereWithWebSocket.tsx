// src/SphereWithWebSocket.tsx
import * as THREE from 'three';
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

interface WebSocketData {
  x: number;
  y: number;
  color: string; // El código hexadecimal del color
}

export function SphereWithWebSocket() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [wsData, setWsData] = useState<WebSocketData>({ x: 0, y: 0, color: '#0000ff' });

  // Efecto para manejar la conexión y los mensajes del WebSocket
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");

    socket.onopen = () => {
      console.log("Conexión WebSocket establecida.");
    };

    socket.onmessage = (event) => {
      try {
        const data: WebSocketData = JSON.parse(event.data);
        setWsData(data);
      } catch (error) {
        console.error("Error al parsear el mensaje WebSocket:", error);
      }
    };

    socket.onclose = () => {
      console.log("Conexión WebSocket cerrada.");
    };

    socket.onerror = (error) => {
      console.error("Error en el WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = wsData.x;
      meshRef.current.position.y = wsData.y;

      // Aseguramos que el material sea de tipo MeshStandardMaterial
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.color.set(wsData.color);
      }
    }
  });

  return (
    <Sphere args={[1, 32, 32]} ref={meshRef}>
      {/* ¡CAMBIAMOS EL MATERIAL AQUÍ! */}
      {/* Usamos meshStandardMaterial para que reaccione a la luz */}
      {/* Puedes ajustar 'roughness' (aspereza) y 'metalness' (metalicidad) para diferentes apariencias */}
      <meshStandardMaterial color={wsData.color} roughness={0.5} metalness={0.1} />
    </Sphere>
  );
}