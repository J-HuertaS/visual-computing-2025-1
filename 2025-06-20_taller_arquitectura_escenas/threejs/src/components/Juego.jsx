import { useRef } from 'react';
import { Color, AdditiveBlending } from 'three';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, shaderMaterial, useGLTF, useTexture } from '@react-three/drei';

const PortalMaterial = shaderMaterial(
  { uTime: 0, uColorStart: new Color('hotpink'), uColorEnd: new Color('white') },
  `
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }
  `,
  `
    #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl)
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;
    void main() {
      vec2 displacedUv = vUv + cnoise3(vec3(vUv * 7.0, uTime * 0.1));
      float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));
      float outerGlow = distance(vUv, vec2(0.5)) * 4.0 - 1.4;
      strength += outerGlow;
      strength += step(-0.2, strength) * 0.8;
      strength = clamp(strength, 0.0, 1.0);
      vec3 color = mix(uColorStart, uColorEnd, strength);
      gl_FragColor = vec4(color, 1.0);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
  `
);

extend({ PortalMaterial });

function Model(props) {
  const portalMaterial = useRef();
  const bakedTexture = useTexture('/models/baked-02.jpeg');
  const { nodes } = useGLTF('/models/portal-2.glb');
  useFrame((state, delta) => (portalMaterial.current.uTime += delta));

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.portalCircle.geometry} position={[0, 0.78, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <portalMaterial ref={portalMaterial} blending={AdditiveBlending} uColorStart="hotpink" uColorEnd="white" />
      </mesh>
      <mesh geometry={nodes.lampLightL.geometry} material-color="#f0bf94" position={[0.89, 1.07, -0.14]} scale={[0.07, 0.11, 0.07]} />
      <mesh geometry={nodes.lampLightR.geometry} material-color="#f0bf94" position={[-0.98, 1.07, -0.14]} scale={[-0.07, 0.11, 0.07]} />
      <mesh geometry={nodes.baked.geometry} position={[0.9, 0.34, -1.47]} rotation={[0, 0.14, 0]}>
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>
    </group>
  );
}

function Juego() {
  const scale = Array.from({ length: 50 }, () => 0.5 + Math.random() * 4);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', background: '#1a2a44', fontFamily: 'Roboto, sans-serif' }}>
      <h1 style={{ textAlign: 'center', padding: '20px', color: '#ecf0f1', position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10, background: 'rgba(26, 42, 68, 0.8)' }}>
        Escena de Juego
      </h1>
      <Canvas camera={{ fov: 45, position: [-4, 2, -4] }}>
        <Sparkles count={scale.length} size={scale} position={[0, 0.9, 0]} scale={[4, 1.5, 4]} speed={0.3} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Juego;