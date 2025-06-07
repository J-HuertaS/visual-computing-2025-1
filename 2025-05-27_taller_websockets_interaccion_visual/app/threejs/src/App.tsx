import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type MessageData = {
  x: number;
  color: string;
};

const Sphere = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
      (meshRef.current.material as THREE.MeshStandardMaterial).color.set(color);
    }
  }, [position, color]);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default function App() {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [color, setColor] = useState("#ff0000");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");

    socket.onmessage = (event) => {
      try {
        const data: MessageData = JSON.parse(event.data);
        setPosition([data.x, 0, 0]);
        setColor(data.color);
      } catch (err) {
        console.error("Error parsing message", err);
      }
    };

    socket.onopen = () => console.log("WebSocket conectado");
    socket.onerror = (err) => console.error("WebSocket error", err);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Sphere position={position} color={color} />
      <OrbitControls />
    </Canvas>
  );
}
