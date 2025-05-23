# 🧪 **Taller Proyecciones 3D: Cómo ve una Cámara Virtual**

### 📅 Fecha
`2025-05-23` 

### 🎯 Objetivo del Taller
El objetivo de este taller es explorar cómo una cámara virtual genera una escena tridimensional mediante proyecciones perspectiva y ortográfica. Se busca entender cómo los parámetros de la cámara (como `fov`, `aspect`, `near`, `far` para perspectiva, y `left`, `right`, `top`, `bottom` para ortográfica) afectan la visualización en pantalla. Usamos React Three Fiber y Three.js para crear una escena con flores 3D, alternar entre cámaras, manipularlas con `OrbitControls`, y mostrar la transformación de coordenadas 3D a 2D.

### 🧠 Conceptos Aprendidos
- [x] Transformaciones geométricas (escala, rotación, traslación): Posicionamiento de elementos en diferentes distancias y uso de `group` para transformaciones colectivas.
- [x] Proyecciones 3D: Diferencias entre proyección perspectiva y ortográfica.
- [x] Manipulación de cámaras: Uso de `OrbitControls` para interactuar con la escena.
- [x] Transformación de coordenadas: Uso de `Vector3.project(camera)` para mapear puntos 3D a 2D.

### 🔧 Herramientas y Entornos
- Three.js / React Three Fiber: Para renderizado 3D y gestión declarativa de la escena.
- TypeScript: Para tipado estático en el proyecto React.
- Dependencias instaladas para evitar errores:
  ```bash
  npm install three @react-three/fiber @react-three/drei 
  ```

📌 Las herramientas se instalaron siguiendo la guía oficial de React y React Three Fiber.

### 📁 Estructura del Proyecto
```
2025-05-23_taller_proyecciones_camara_virtual
├── threejs/ 
│   ├── public/                
│     ├── index.html
│   ├── src/                   
│     ├── App.tsx           # Configuración de la escena
│     ├── App.css
│     ├── App.test.tsx                      
│     ├── index.tsx
│     ├── index.css
│     ├── react-app-env.d.ts
│     ├── reportWebVitals.ts
│     ├── setupTests.ts
├── resultados/            
│     ├── Perspective_view.gif    
│     ├── Orthographic_view.gif
│     ├── Interaction_view.gif
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
```

📎 La estructura sigue las indicaciones de la guía de entregas.

### 🧪 Implementación
### 🔹 Etapas realizadas
1. **Preparación de la escena**:
   - Se decide realizar una escena donde existan varias flores y esten distribuidas en diferentes posiciones.
   - Se crea un componente `Flower` con tallo (`<Box />`), pétalos y centro (`<Sphere />`).
   - Se deben configurar las cámaras (`PerspectiveCamera` y `OrthographicCamera`) con parámetros iniciales para obtener dichas vistas.

2. **Aplicación de interacción**:
   - Creación de un botón para alternar entre cámaras.
   - Se implementó un  `OrbitControls` para manipulación en tiempo real.
   - La información en tiempo real se configura con `<Text>` sobre el tipo de cámara y sus parámetros.

3. **Visualización**:
   - Se configura el `<Canvas>` para que ocupe toda la pantalla con estilos CSS (`width: '100vw', height: '100vh'`).
   - El bonus fue transformar un punto 3D `(2, 0, 10)` a 2D con `Vector3.project(camera)`.

### 🔹 Código relevante

**Componente Flower**

```typescript
const Flower: React.FC<FlowerProps> = ({ position = [0, 0, 0] }) => {
  const stemHeight = 4;
  const stem = (
    <mesh position={[0, -stemHeight / 2, 0]}>
      <boxGeometry args={[0.2, stemHeight, 0.2]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
  const center = (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
  const petalRadius = 0.3;
  const petalDistance = 0.8;
  const numPetals = 6;
  const petals = [];
  for (let i = 0; i < numPetals; i++) {
    const angle = (i / numPetals) * Math.PI * 2;
    const x = petalDistance * Math.cos(angle);
    const z = petalDistance * Math.sin(angle);
    petals.push(
      <mesh key={i} position={[x, 0, z]}>
        <sphereGeometry args={[petalRadius, 32, 32]} />
        <meshStandardMaterial color="pink" />
      </mesh>
    );
  }
  return (
    <group position={position}>
      {stem}
      {center}
      {petals}
    </group>
  );
};
```
**Bonus - Transformación de 3D a 2D**

```typescript
const ProjectionDemo = () => {
  const { camera, gl } = useThree();
  const [projectedCoords, setProjectedCoords] = useState<[number, number]>([0, 0]);
  useFrame(() => {
    const vector = new THREE.Vector3(2, 0, 10);
    vector.project(camera);
    const x = ((vector.x + 1) / 2) * gl.domElement.width;
    const y = ((-vector.y + 1) / 2) * gl.domElement.height;
    setProjectedCoords([x, y]);
  });
  return (
    <Text position={[0, -4, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
      Punto 3D (2, 0, 10) proyectado a 2D: ({projectedCoords[0].toFixed(2)}, {projectedCoords[1].toFixed(2)})
    </Text>
  );
};
```

### 📊 Resultados Visuales
📌 Este taller requiere explícitamente un GIF animado:

- **Proyecciones de las Flores - Vista Perspectiva**
  
<img src="./resultados/perspective_view.gif" alt="deteccion" width="650">

- **Proyecciones de las Flores - Vista Ortográfica**
  
<img src="./resultados/orthographic_view.gif" alt="deteccion" width="650">

- **Movimiento de la cámara con `OrbitControls`**.
<img src="./resultados/Interactive.gif" alt="deteccion" width="650">

### 🧩 Prompts Usados
- "Show how to transform a 3D point to 2D coordinates using Vector3.project(camera) in React Three Fiber."


### 💬 Reflexión Final
Este taller nos permitió profundizar en el uso de cámaras virtuales y proyecciones 3D, conceptos fundamentales para gráficos por computadora. Se puso en práctica cómo las vistas de perspectiva y ortográfica afectan la percepción de profundidad: la perspectiva es más realista para escenas naturales, mientras que la ortográfica es ideal para vistas técnicas sin distorsión. También mediante la práctica se refuerzan los conceptos de transformaciones geométricas al posicionar las flores y usar OrbitControls para interactuar con la escena. La transformación de coordenadas 3D a 2D fue un aspecto interesante, ya que me ayudó a visualizar cómo los puntos se mapean en la pantalla.

La parte más compleja fue manejar los errores de dependencias hasta que se identificaron, además el ajuste del `Canvas` ocupara toda la pantalla, lo que requirió ajustes en los estilos CSS. También se puede destacar la interactividad, lo que es interesante al experimentar con OrbitControls para explorar la escena desde diferentes ángulos. Para futuros proyectos se pueden hacer escenas más complejas y detalladas.

## ✅ Checklist de Entrega

- [x] Carpeta `2025-05-23_taller_proyecciones_camara_virtual`
- [x] Código limpio y funcional
- [x] GIFs incluidos con nombres descriptivos (`perspective_view.gif`, `orthographic_view.gif`, `Interactive.gif`)
- [x] Visualizaciones exportadas a `resultados/`
- [x] README completo y claro
- [x] Commits descriptivos en inglés
