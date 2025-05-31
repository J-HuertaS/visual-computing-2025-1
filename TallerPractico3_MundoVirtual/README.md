# Taller práctico 3 - Mundo Estilo Minecraft en Three.js

 **Estudiantes que desarrollaron la práctica :**  Juan Esteban Cardenas, Juan David Ardila, Gabriela Guzmán y Gabriela Gallegos.

## **Objetivo**
Construir un mundo 3D tipo Minecraft usando Three.js, con bloques y otras formas primitivas (cubos, cilindros, conos, esferas), aplicando materiales PBR, iluminación simple y generación de contenido procedural como árboles, rocas o criaturas.

## **Temas Aplicados**

- **Modelado Procedural:** creación de terreno y objetos con código.
- **Mapeo UV y Materiales PBR:** aplicar texturas físicas (albedo, normal, rugosidad).
- **Shaders Simples:** realce de efectos visuales y texturizado.
- **Luces:*+ iluminación básica para ambientar la escena.
- **Síntesis Visual:** diseño inmersivo con elementos naturales y criaturas simples.

  # **Mundos**
  ---
  
  ## **Jardines de Versalles - Gabriela Gallegos**

- **Captura del mundo creado**
  
https://github.com/user-attachments/assets/6b2303c7-b8ef-4c9e-b4c9-c15c165c48f6

## **Funciones Usadas a destacar**

- **`useFrame`**:
  Utilizado para animaciones en tiempo real, como en `AnimatedCloud`, donde se actualizan posiciones de nubes basadas en el tiempo:
  ```tsx
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.1 + index) * 5;
      cloudRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.05 + index) * 2;
    }
  });
  ```

- **`useLoader`**:
  Carga texturas, como la de césped en `GardenBoundaries`:
  ```tsx
  const grassTexture = useLoader(THREE.TextureLoader, "/textures/grass.jpg");
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(60, 60);
  ```

- **`useMemo`**:
  Optimiza la creación del material del agua en `CentralFountainPBR` para evitar recalcularlo:
  ```tsx
  const waterMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#1e90ff",
      transparent: true,
      opacity: 0.85,
      roughness: 0.05,
      metalness: 0.02,
      envMapIntensity: 1.5,
    });
  }, []);
  ```

## **Organización del mundo y elementos**

El mundo recrea los jardines de Versalles con una estructura modular usando React y Three.js:
- **Canvas**: Contenedor principal con cámara y controles (`OrbitControls`).
- **Scene**: Agrupa componentes como `Lighting`, `CloudSystem`, `GardenBoundaries`, `MainTerrace`, `CentralFountainPBR`, `ElaborateParterres`, `GrandStaircase`, `DetailedStatues`, `LushVegetation`, `StonePaths`, `SimplifiedOrnamentalTrees`, `FlowerBeds`, `Bushes`, y `GrassSpirals`.
- **Elementos**:
  - Terrenos (césped (PBR Texture), caminos de piedra).
  - Vegetación (flores, arbustos, árboles).
  - Estructuras (terraza, escalera, estatuas, fuente (PBR Texture)).
  - Nubes animadas y sistema de iluminación (luces direccionales, ambiental, puntual).

## Ejemplo de material PBR

### **Agua en la fuente central**

1. En `CentralFountainPBR`, el agua usa un material PBR para realismo:
```tsx
const waterMaterial = useMemo(() => {
  return new THREE.MeshStandardMaterial({
    color: "#1e90ff",
    transparent: true,
    opacity: 0.85,
    roughness: 0.05,
    metalness: 0.02,
    envMapIntensity: 1.5,
  });
}, []);
```
- **Propiedades**:
  - `color: "#1e90ff"`: Tono azul para el agua.
  - `transparent: true`, `opacity: 0.85`: Translucidez para simular agua.
  - `roughness: 0.05`: Superficie lisa para reflejos.
  - `metalness: 0.02`: Baja metalicidad para un look no metálico.
  - `envMapIntensity: 1.5`: Intensifica reflejos ambientales.
 
### **Césped en GardenBoundaries**

2. El césped utiliza un material PBR con una textura cargada desde un modelo externo:
```tsx
const grassTexture = useLoader(THREE.TextureLoader, "/textures/grass.jpg");
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(60, 60);

<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
  <planeGeometry args={[140, 140]} />
  <meshStandardMaterial map={grassTexture} />
</mesh>
```

- **Propiedades**:
- map: grassTexture: Aplica la textura de césped cargada desde "/textures/grass.jpg".
- wrapS y wrapT: THREE.RepeatWrapping: Repite la textura en ambas direcciones.
- repeat.set(60, 60): Escala la textura para cubrir un área grande.
- El material `meshStandardMaterial` usa la textura para simular césped realista con iluminación PBR, aprovechando reflejos ambientales y sombras.

## **Reflexión sobre personalización y formas primitivas**

- **Personalización**:
  - El uso de componentes modulares (`DetailedFlower`, `SimplifiedTree`) permite personalizar posiciones, escalas y tipos (e.g., estatuas de "apollo", "venus").
  - Texturas (como césped) y materiales PBR añaden realismo, ajustables para diferentes estilos visuales.
  - Animaciones dinámicas (nubes, agua) ofrecen interactividad.

- **Formas primitivas**:
  - Se usan geometrías básicas (`sphereGeometry`, `cylinderGeometry`, `boxGeometry`) para construir elementos complejos (flores, estatuas, árboles).
  - Combinaciones y transformaciones (rotaciones, escalas) crean detalles como pétalos o relieves, optimizando rendimiento al evitar modelos 3D pesados.
  - Ejemplo: En `DetailedFlower`, pétalos se crean con esferas posicionadas circularmente:
    ```tsx
    <sphereGeometry args={[petalRadius, 8, 8]} />
    ```
  ---
