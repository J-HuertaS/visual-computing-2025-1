import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { set, get, ref as dbRef } from 'firebase/database';
import { db } from './firebase';

function PersistentCube() {
  const meshRef = useRef();
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    const posRef = dbRef(db, 'objects/cube1/pos');
    get(posRef).then(snapshot => {
      if (snapshot.exists()) {
        const { x, y, z } = snapshot.val();
        meshRef.current.position.set(x, y, z);
      }
      setInitialLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!initialLoaded) return;

    const interval = setInterval(() => {
      const { x, y, z } = meshRef.current.position;
      set(dbRef(db, 'objects/cube1/pos'), { x, y, z });
    }, 3000);

    return () => clearInterval(interval);
  }, [initialLoaded]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.x = Math.sin(Date.now() * 0.001) * 2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Scene() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <PersistentCube />
    </Canvas>
  );
}
