import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { TextureLoader } from 'three';

function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // Fondo dinámico (gradiente día/noche)
    let dayTime = 0;
    const updateBackground = () => {
      dayTime += 0.001;
      const skyColor = new THREE.Color().lerpColors(new THREE.Color(0x87ceeb), new THREE.Color(0x1a2a44), Math.sin(dayTime) * 0.5 + 0.5);
      scene.background = skyColor;
    };

    // Luces
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(5, 10, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Terreno con textura de pasto
    const textureLoader = new TextureLoader();
    const grassTexture = textureLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
    const grassNormal = textureLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big-nm.jpg');
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassNormal.wrapS = grassNormal.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(20, 20);
    grassNormal.repeat.set(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: grassTexture,
      normalMap: grassNormal,
      roughness: 0.8
    });
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Árboles
    const treeGeometry = new THREE.ConeGeometry(1, 3, 8);
    const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    for (let i = 0; i < 30; i++) {
      const tree = new THREE.Mesh(treeGeometry, treeMaterial);
      tree.position.set(Math.random() * 80 - 40, 1.5, Math.random() * 80 - 40);
      tree.castShadow = true;
      scene.add(tree);
    }

    // Rocas
    const rockGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    for (let i = 0; i < 20; i++) {
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(Math.random() * 80 - 40, 0.5, Math.random() * 80 - 40);
      rock.castShadow = true;
      scene.add(rock);
    }

    // Controles inmersivos
    const controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 10;
    controls.lookSpeed = 0.1;

    // Animación
    function animate() {
      requestAnimationFrame(animate);
      updateBackground(); // Actualiza el fondo dinámico
      controls.update(0.016);
      renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Limpieza
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
}

export default App;