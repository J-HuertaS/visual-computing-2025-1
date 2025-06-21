import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text } from '@react-three/drei';
import './index.css';

const WebSocketManager = ({ children }) => {
  const [data, setData] = useState({ num_people: 0, object_position: { x: 0, y: 0, z: 0 } });
  const wsRef = useRef(null); 

  useEffect(() => {
    const connectWebSocket = () => {
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket('ws://localhost:8080'); 

      ws.onopen = () => {
        console.log('Conectado al WebSocket Server.');
        wsRef.current = ws; 
      };

      ws.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data);
          setData(receivedData);

        } catch (e) {
          console.error("Error parseando datos WebSocket:", e, "Datos brutos:", event.data);
        }
      };

      ws.onclose = () => {
        console.log('Desconectado del WebSocket Server. Intentando reconectar en 3 segundos...');
        wsRef.current = null; 
        setTimeout(connectWebSocket, 3000); 
      };

      ws.onerror = (error) => {
        console.error('Error en WebSocket:', error);
      };
    };

    connectWebSocket(); 

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); 

  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { data });
    }
    return child;
  });
};


const ReactiveBox = ({ data }) => {
  const meshRef = useRef();
  
  const colors = [
    '#0000FF', 
    '#2020E0',
    '#4040C0',
    '#6060A0',
    '#808080', 
    '#A06060',
    '#C04040',
    '#E02020',
    '#FF0000'  
  ];


  useFrame(() => {
    if (meshRef.current) {
      const numPeople = data.num_people || 0;
      const targetScaleY = 1 + numPeople * 0.2; 
      meshRef.current.scale.y += (targetScaleY - meshRef.current.scale.y) * 0.05; 
      
      const colorIndex = Math.min(Math.floor(numPeople / 10 * (colors.length - 1)), colors.length - 1);
      meshRef.current.material.color.set(colors[colorIndex]);
    }
  });

  return (
    <Box ref={meshRef} position={[-2, 0, 0]}>
      <meshStandardMaterial color="hotpink" /> 
    </Box>
  );
};


const ReactiveSphere = ({ data }) => {
  const meshRef = useRef();
  const position = data.object_position || { x: 0, y: 0, z: 0 };

  useFrame(() => {
    if (meshRef.current) {
      
      const scaleFactor = 0.1; 
      const targetX = position.x * scaleFactor;
      const targetY = position.y * scaleFactor; 
      const targetZ = position.z * scaleFactor; 

      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.1;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
      meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.5, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color="orange" />
    </Sphere>
  );
};

const ReactiveText = ({ data }) => {
  const textRef = useRef();
  const numPeople = data.num_people || 0;
  const objectPos = data.object_position || { x: 0, y: 0, z: 0 };

  useFrame(() => {
    if (textRef.current) {
      textRef.current.text = `Personas: ${numPeople}\nObj Pos: (${objectPos.x.toFixed(1)}, ${objectPos.y.toFixed(1)})`;
    }
  });

  return (
    <Text
      ref={textRef}
      position={[0, 2, -3]} 
      fontSize={0.4}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      Cargando datos...
    </Text>
  );
};


function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls /> 

        <WebSocketManager>
          <ReactiveBox />
          <ReactiveSphere />
          <ReactiveText />
        </WebSocketManager>

      </Canvas>
    </div>
  );
}

export default App;