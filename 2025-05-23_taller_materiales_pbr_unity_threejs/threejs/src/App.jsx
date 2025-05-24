import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import SceneInit from './lib/SceneInit';
import { useControls } from 'leva';

function App() {
  const pbrMaterialRef = useRef(null);

  // Creamos controles de leva para roughness y metalness con rango 0 a 1
  const { roughness, metalness } = useControls({
    roughness: { value: 1, min: 0, max: 1, step: 0.01 },
    metalness: { value: 1, min: 0, max: 1, step: 0.01 },
  });

  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.renderer.setSize(window.innerWidth, window.innerHeight);
    test.renderer.shadowMap.enabled = true;
    test.directionalLight.castShadow = true;

    test.animate();

    const textureLoader = new THREE.TextureLoader();
    const texturePaths = {
      map: '/metal_texturas/Metal055A_1K-JPG_Color.jpg',
      roughnessMap: '/metal_texturas/Metal055A_1K-JPG_Roughness.jpg',
      metalnessMap: '/metal_texturas/Metal055A_1K-JPG_Metalness.jpg',
      normalMap: '/metal_texturas/Metal055A_1K-JPG_NormalDX.jpg',
      displacementMap: '/metal_texturas/Metal055A_1K-JPG_Displacement.jpg',
    };

    Promise.all([
      textureLoader.loadAsync(texturePaths.map),
      textureLoader.loadAsync(texturePaths.roughnessMap),
      textureLoader.loadAsync(texturePaths.metalnessMap),
      textureLoader.loadAsync(texturePaths.normalMap),
      textureLoader.loadAsync(texturePaths.displacementMap),
    ])
      .then(([map, roughnessMap, metalnessMap, normalMap, displacementMap]) => {
        console.log('Texturas cargadas OK');

        const pbrMaterial = new THREE.MeshStandardMaterial({
          map,
          roughnessMap,
          metalnessMap,
          normalMap,
          displacementMap,
          roughness: 1.0,
          metalness: 1.0,
          displacementScale: 1.0,
        });

        pbrMaterialRef.current = pbrMaterial;

        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

        const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
        const sphereGeometry = new THREE.SphereGeometry(8, 32, 32);

        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        const sphereMesh = new THREE.Mesh(sphereGeometry, pbrMaterial);
        sphereMesh.castShadow = true;

        boxMesh.position.x = -12;
        sphereMesh.position.x = 12;

        test.scene.add(boxMesh);
        test.scene.add(sphereMesh);

        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotation.x = -Math.PI / 2;
        planeMesh.position.y = -8;
        planeMesh.receiveShadow = true;

        test.scene.add(planeMesh);
      })
      .catch((err) => {
        console.error('Error cargando texturas:', err);
      });

    // Limpieza al desmontar (opcional)
    return () => {
      if (test.renderer) {
        test.renderer.dispose();
      }
    };
  }, []);

  // Cada vez que roughness o metalness cambian, actualizamos el material
  useEffect(() => {
    if (pbrMaterialRef.current) {
      pbrMaterialRef.current.roughness = roughness;
      pbrMaterialRef.current.metalness = metalness;
      pbrMaterialRef.current.needsUpdate = true; // Forzar actualización del material
    }
  }, [roughness, metalness]);

  return (
    <div>
      <canvas
        id="myThreeJsCanvas"
        style={{ display: 'block', width: '100vw', height: '100vh' }}
      />
    </div>
  );
}

export default App;