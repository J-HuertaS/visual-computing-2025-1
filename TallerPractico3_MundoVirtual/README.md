# Taller práctico 3 - Mundo Estilo Minecraft en Three.js

 **Estudiantes que desarrollaron la práctica :**  Juan Esteban Cardenas, Juan David Ardila, Gabriela Guzmán y Gabriela Gallegos.

## **Objetivo**
Construir un mundo 3D tipo Minecraft usando Three.js, con bloques y otras formas primitivas (cubos, cilindros, conos, esferas), aplicando materiales PBR, iluminación simple y generación de contenido procedural como árboles, rocas o criaturas.

## **Temas Aplicados**

- **Modelado Procedural:** creación de terreno y objetos con código.
- **Mapeo UV y Materiales PBR:** aplicar texturas físicas (albedo, normal, rugosidad).
- **Shaders Simples:** realce de efectos visuales y texturizado.
- **Luces:** iluminación básica para ambientar la escena.
- **Síntesis Visual:** diseño inmersivo con elementos naturales y criaturas simples.

# **Mundos**
  
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

## **Panorama Japonés - Juan Esteban Cardenas**

- **Captura del mundo creado**

## **Funciones Usadas a destacar**

- **`useFrame`**:
  Utilizado para animaciones en tiempo real:
  ```tsx
  // Animaciones suaves
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (streetRef.current) {
      // Animar nubes (movimiento lento y variado)
      streetRef.current.traverse((child) => {
        if (child.userData.isCloud) {
          child.position.x +=
            Math.sin(time * 0.1 + child.position.z * 0.01) * 0.002;
          child.position.z +=
            Math.cos(time * 0.08 + child.position.x * 0.01) * 0.001;
          child.rotation.y += 0.0005;
        }
      });

      // Movimiento sutil de gatos (respiración)
      streetRef.current.traverse((child) => {
        if (child.userData.isCat) {
          child.scale.y = 1 + Math.sin(time * 2 + child.position.x) * 0.02;
        }
      });
    }
  });
  ```

- **`useMemo`**:
  Optimiza la creación del material del agua en `CentralFountainPBR` para evitar recalcularlo:
  ```tsx
  // Materiales japoneses tradicionales
  const materials = useMemo(() => {
    const {
      grassTexture,
      woodTexture,
      waterTexture,
      rockColorMap,
      rockNormalMap,
    } = textures;
    return {
      // Arquitectura
      woodDark: new THREE.MeshStandardMaterial({
        color: 0x4a3728,
        map: textures.woodTexture,
        roughness: 0.8,
      }),

      // Paredes limpias sin ruido
      woodLight: new THREE.MeshStandardMaterial({
        color: 0xa0845c,
        roughness: 0.7,
      }),

      redRoof: new THREE.MeshStandardMaterial({
        color: 0xcc4125,
        roughness: 0.6,
      }),
  ...
  ```

## **Organización del mundo y elementos**

El mundo representa un sereno **panorama japonés**, construido de forma modular y procedural utilizando React y Three.js. La escena se organiza de la siguiente manera:

-   **Canvas**: El contenedor principal de la escena 3D, que incluye la cámara, los controles de órbita (`OrbitControls`) y el entorno (`Environment` con `preset="sunset"`).
-   **JapaneseStreet (Componente principal)**: Agrupa todos los elementos del mundo.
-   **Elementos Clave**:
  -   **Terreno**: Un plano que utiliza una **textura de pasto generada proceduralmente** (`grassGround` con `THREE.CanvasTexture`) para un aspecto natural.
  -   **Arquitectura Japonesa**: Varias **casas tradicionales** (`createJapaneseHouse`) y un **Torii Gate** (`createTorii`), construidos con geometrías básicas y materiales que simulan madera oscura, paredes claras y techos rojos.
  -   **Naturaleza**:
      -   **Cerezos**: Dos tipos, `createCherryTree` (cerezo normal) y `createWildCherryTree` (cerezo silvestre), ambos con **numerosas flores y pétalos cayendo** para un efecto de "sakura".
      -   **Bambú**: Grupos de bambú (`createBamboo`) que añaden vegetación característica.
      -   **Cascada**: Una estructura de cascada (`createWaterfall`) con agua cayendo y una piscina inferior, rodeada de rocas con texturas PBR.
      -   **Estanque Koi**: Un estanque de agua (`createKoiPond`) con un borde de piedra, diseñado para simular un ambiente tranquilo.
      -   **Flores y pasto 3D**: Pequeñas `createFlower` y `createGrassBlade` que añaden detalles al suelo.
  -   **Fauna**: Diversos **gatos** (`createCat`) en diferentes poses (sentado, acostado, de pie) con colores variados, añadiendo vida a la escena.
  -   **Iluminación**: Un sistema de **luces cálidas japonesas** (`lights`) que incluye una luz direccional (simulando un atardecer) y una luz ambiental, complementado por **linternas** (`createLantern`) con luces puntuales para un ambiente acogedor.
  -   **Nubes**: Múltiples nubes (`createCloud`) animadas y con diferentes opacidades, generando un cielo dinámico.

## Ejemplo de material PBR

Tu implementación utiliza **materiales PBR (Physically Based Rendering)** tanto con texturas cargadas externamente como con propiedades intrínsecas de `MeshStandardMaterial` de Three.js para simular el comportamiento de la luz de forma realista.

### **Rocas (`stone`)**

1.  El material `stone` para las rocas de la cascada y el estanque utiliza texturas externas PBR para una gran fidelidad visual:

  ```
  const rockColorMap = textureLoader.load("/textures/rocky_terrain_diff_1k.jpg");
  const rockNormalMap = textureLoader.load("/textures/rocky_terrain_disp_1k.jpg");

  // ...

  stone: new THREE.MeshStandardMaterial({
    map: rockColorMap,
    normalMap: rockNormalMap,
    roughness: 0.7,
    metalness: 0.2,
  }),
  ```

  -   **`map: rockColorMap`**: Aplica la textura base de color de la roca, dando su patrón y tonalidad general.
  -   **`normalMap: rockNormalMap`**: Introduce detalles de la superficie (como grietas y protuberancias) sin aumentar la complejidad de la geometría, lo que hace que la roca parezca más áspera y tridimensional bajo la luz.
  -   **`roughness: 0.7`**: Indica una superficie relativamente rugosa, dispersando la luz en lugar de reflejarla de manera nítida, típico de las rocas.
  -   **`metalness: 0.2`**: Una baja metalicidad, confirmando que el material no es metálico.
  -   **`wrapS` y `wrapT`: `THREE.RepeatWrapping` con `repeat.set(2, 2)`**: Asegura que las texturas se repitan sobre superficies más grandes, creando un patrón continuo y evitando estiramientos indeseados.

### **Agua (en estanque y cascada)**

2.  El material del agua (`water` y `waterfall`) también aprovecha las propiedades PBR y texturas procedurales para simular realismo:

  ```
  // Textura de agua con ondas generada proceduralmente
  const waterCanvas = document.createElement("canvas");
  // ... lógica para dibujar ondas ...
  const waterTexture = new THREE.CanvasTexture(waterCanvas);
  waterTexture.wrapS = THREE.RepeatWrapping;
  waterTexture.wrapT = THREE.RepeatWrapping;
  waterTexture.repeat.set(4, 4);

  // ...

  water: new THREE.MeshStandardMaterial({
    map: waterTexture,
    color: 0x4682b4,
    roughness: 0.0,
    metalness: 0.0,
    transparent: true,
    opacity: 0.3,
    envMapIntensity: 1.0,
  }),
  waterfall: new THREE.MeshStandardMaterial({
    color: 0x87ceeb,
    roughness: 0.0,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6,
  }),
  ```

  -   **`map: waterTexture`**: Utiliza una textura generada en Canvas para simular el patrón de ondas en la superficie.
  -   **`color`**: Define el tono azul del agua.
  -   **`roughness: 0.0`**: Una rugosidad muy baja, creando una superficie lisa que permite reflejos claros.
  -   **`metalness: 0.0` o `0.1`**: Indica un material no metálico.
  -   **`transparent: true` y `opacity`**: Permite la translucidez, haciendo que el agua sea parcialmente visible.
  -   **`envMapIntensity: 1.0`**: Controla la influencia del mapa de entorno (generado por `Environment preset="sunset"`) en los reflejos, haciendo que el agua refleje el cielo y el entorno.

### **Césped (`grassGround`)**

3.  El césped es otro ejemplo de textura PBR generada proceduralmente:

  ```
  const grassCanvas = document.createElement("canvas");
  // ... lógica para dibujar briznas de pasto ...
  const grassTexture = new THREE.CanvasTexture(grassCanvas);
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(12, 12);

  // ...

  grassGround: new THREE.MeshStandardMaterial({
    map: textures.grassTexture,
    roughness: 0.8,
  }),
  ```

  -   **`map: textures.grassTexture`**: Aplica la textura de pasto generada en el canvas, con briznas y variaciones de color simuladas.
  -   **`roughness: 0.8`**: Una rugosidad alta, apropiada para el pasto que no refleja la luz de forma especular.
  -   **`wrapS` y `wrapT`: `THREE.RepeatWrapping` con `repeat.set(12, 12)`**: Escala y repite la textura para cubrir amplias áreas de terreno.

## **Reflexión sobre personalización y formas primitivas**

- **Personalización**:
  -   La escena es altamente personalizable gracias a la **modularidad de los componentes**. Cada elemento (casas, árboles, gatos, linternas) es una función que encapsula su creación, permitiendo reutilización y fácil ajuste de sus parámetros (posición, escala, color, incluso la pose de los gatos).
  -   La **generación procedural de texturas** para el pasto y el agua ofrece un control fino sobre el aspecto visual sin depender de assets externos predefinidos.
  -   La capacidad de asignar diferentes **materiales PBR** a diversos elementos (madera, roca, agua, tela, piel de gato) permite una personalización profunda del acabado y la respuesta a la iluminación de cada objeto.
  -   Las **animaciones simples** (como el movimiento de nubes y pétalos) añaden un toque dinámico y personal al ambiente, evocando la naturaleza efímera de la belleza japonesa.

- **Formas primitivas**:
  -   El proyecto es un excelente ejemplo de **modelado procedural usando exclusivamente geometrías primitivas** de Three.js (BoxGeometry, SphereGeometry, CylinderGeometry, ConeGeometry, PlaneGeometry, TorusGeometry).
  -   Cada elemento complejo en la escena, desde las **casas japonesas** y los **Torii gates** hasta los **árboles de cerezo** y los **gatos detallados**, se construye a partir de combinaciones inteligentes y transformaciones (escalado, rotación, posicionamiento) de estas formas básicas.
  -   Esto demuestra la **eficiencia en rendimiento** al evitar la carga de modelos 3D complejos, manteniendo la escena ligera y fácil de renderizar.
  -   Por ejemplo, los **gatos** son creados con esferas (cuerpo, cabeza), conos (orejas) y cilindros/torus (patas, cola), combinados y posicionados para formar una criatura reconocible. Las **flores de cerezo** son pequeñas esferas, mientras que las **linternas** usan cilindros y esferas. Esta aproximación resalta la versatilidad de las formas primitivas en la creación de mundos detallados y estilizados.
  ---

## **Mundo Minimalista - Juan David Ardila Diaz**

- **Captura del mundo creado**
  
![deteccion](./mundo_minimalista.gif)

## Funciones Usadas a destacar

- `useEffect`: Ejecuta lógica después de que el componente se monta, ideal para agregar y limpiar objetos de la escena.

```js
useEffect(() => {
  // Agrega objeto a la escena
  return () => {
    // Limpieza del objeto
  };

}, [dependencias]);
```

- `useRef`: Referencia a objetos persistentes como Meshes, permitiendo modificarlos o eliminarlos después.

```js
const lakeMeshRef = useRef();
lakeMeshRef.current = lakeMesh;
```

- `setState`: Controla el estado de React, en este caso sceneReady para montar elementos solo cuando la escena esté lista.

```js
const [sceneReady, setSceneReady] = useState(false);
setSceneReady(true);
```

- `new THREE.Mesh(...)`: Crea un objeto renderizable combinando geometría y material.

```js
const mesh = new THREE.Mesh(geometry, material);
```

- `scene.add(...)`: Agrega cualquier objeto 3D a la escena.

```js
scene.add(mesh);
```

- `scene.remove(...)`: Elimina objetos de la escena, importante para evitar memoria innecesaria.

```js
scene.remove(mesh);
```

- `geometry.dispose()` y `material.dispose()`: Libera la memoria cuando ya no se necesita una geometría o material.

```js
mesh.geometry.dispose();
mesh.material.dispose();
```

## **Organización del mundo y elementos**
 
`SceneInit`: Es una clase personalizada que centraliza toda la configuración inicial de la escena. Se encarga de:
- Crear la cámara, escena y renderizador.
- Agregar luces (ambiental, direccional y spotlight).
- Configurar sombras.
- Manejar controles de órbita (OrbitControls).
- Ajustar el renderizador al tamaño de la ventana.
- Iniciar la animación y renderizado con animate().
- Todo esto permite tener una escena 3D lista para renderizar objetos.

`Canvas`: Es el elemento HTML <canvas id="myThreeJsCanvas" /> sobre el cual Three.js renderiza la escena 3D. Es el punto de salida visual.

`Scene`: Es el contenedor principal donde se agregan todos los objetos 3D. Se instancia dentro de SceneInit y se pasa como prop a los componentes React que crean geometrías.

`Elementos`
- `Terreno`: Plano con texturas PBR aplicadas, actúa como base del mundo.
- `Lago`: Círculo semitransparente azul, representa el agua.
- `Piedra`: Esferas grises colocadas en distintas posiciones.
- `Arbol`: Se mencionan distintos árboles con tipos "normal" y "pino" (no se muestra su código aquí).
- `Casa`: Elemento central del mundo (no se mostró su código).
- `Fruta`: Objeto con forma y color distintos (no se mostró su código).
- `Animal`: Elemento animado o decorativo del mundo (no se mostró su código).
- `DirectionalLight`: Luz blanca como el sol, que proyecta sombras.
- `AmbientLight`: Luz general de baja intensidad.
- `AxesHelper`: Ayuda visual para orientación (ejes X, Y, Z).

## **Ejemplo de material PBR**
Caso en que se usa: Terreno
Se utiliza THREE.MeshStandardMaterial, que permite texturas físicas realistas como color, rugosidad, desplazamiento, oclusión ambiental y normales.

```js
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0,
  roughness: 1,
  displacementScale: 5,
  displacementBias: 0,
  aoMapIntensity: 1,
});
```

Además, se le aplican texturas cargadas con THREE.TextureLoader, con parámetros para repetición y codificación de color.

```js
loadAndApplyTexture(colorTexturePath, "map", planeMaterial, true, false);
loadAndApplyTexture(roughnessTexturePath, "roughnessMap", planeMaterial);
loadAndApplyTexture(displacementTexturePath, "displacementMap", planeMaterial);
loadAndApplyTexture(aoTexturePath, "aoMap", planeMaterial);
loadAndApplyTexture(normalTexturePath, "normalMap", planeMaterial, false, true);
```

## **Reflexión sobre personalización y formas primitivas**
### Personalización

- Texturas PBR en el terreno para dar realismo al suelo.
- Color y transparencia en el lago para simular agua.
- Sombras activadas para mejorar la percepción de profundidad y realismo.
- Posiciones precisas de los elementos como piedras, árboles y lago.
- Animación continua con animate() en SceneInit.

Todo esto fue posible porque el diseño separa la lógica de escena (SceneInit) de los objetos individuales (componentes React), facilitando la reutilización y extensión.

### Formas primitivas usadas
- PlaneGeometry: Usada en el Terreno. Permite aplicar texturas fácilmente y desplazar la superficie.
- CircleGeometry: Usada en el Lago. Sencilla y eficaz para representar cuerpos de agua.
- SphereGeometry: Usada en Piedra. Ideal para simular rocas sin detalles excesivos.
- AxesHelper: Ayuda visual, aunque no es una forma como tal.

### Beneficios:
- Permiten crear prototipos rápidos.
- Bajo costo computacional.
- Combinables para estructuras más complejas (como en árboles o casas).
- Fáciles de manipular en cuanto a tamaño, rotación y posición.

