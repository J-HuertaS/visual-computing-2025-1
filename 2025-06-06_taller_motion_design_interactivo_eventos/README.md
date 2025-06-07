# 🧪 Taller - Motion Design Interactivo: Acciones Visuales según Eventos del Usuario

## 📅 Fecha

`2025-06-06` – Fecha de realización

---

## 🎯 Objetivo del Taller

Crear animaciones reactivas donde un modelo 3D animado responde a eventos del usuario (clics, teclas, movimientos del cursor) usando Three.js con React Three Fiber. El objetivo es introducir los fundamentos del motion design aplicado a personajes, integrando eventos y lógica de interacción con animaciones esqueléticas.

---

## 🧠 Conceptos Aprendidos

- [x] Uso de React Three Fiber y `@react-three/drei` para cargar y animar modelos 3D.
- [x] Manejo de eventos del usuario (clic, teclado, hover) para disparar animaciones.
- [x] Creación de un modelo 3D personalizado con animaciones simuladas.
- [x] Implementación de transiciones fluidas entre animaciones.
- [x] Uso de Context API para gestionar estados de animación.
- [x] Creación de una interfaz de control interactiva con botones en React.
- [x] Debugging de animaciones y manejo de fallbacks.

### ¿Por qué no usé un modelo de Mixamo?

Intenté utilizar modelos de Mixamo en formato .GLTF con animaciones embebidas, pero enfrenté problemas con Blender en mi computadora. A pesar de múltiples intentos para instalar y configurar Blender correctamente, no logré hacer que funcionara debido a errores de compatibilidad y rendimiento. Por ello, opté por crear un modelo humanoide personalizado en código usando geometrías básicas (`boxGeometry`, `capsuleGeometry`, `sphereGeometry`) con articulaciones definidas, simulando animaciones esqueléticas mediante rotaciones y movimientos programados en el componente `FallbackCharacter`.

---

## 🔧 Herramientas y Entornos

- **React Three Fiber**: Para renderizar la escena 3D.
- **@react-three/drei**: Para cargar modelos (`useGLTF`, `useAnimations`) y utilidades (`OrbitControls`, `Environment`).
- **Three.js**: Motor gráfico para animaciones y renderizado.
- **React**: Para la interfaz de control y gestión de estados.
- **Tailwind CSS**: Para estilizar el panel de control y la interfaz.
- **TypeScript**: Para tipado seguro en el proyecto.
- **Vite**: Como herramienta de construcción.

---

## 📁 Estructura del Proyecto

```
2025-06-06_taller_motion_design_interactivo_eventos/
├── threejs/
│   ├── components/
│   │   ├── animated-character.tsx
│   │   ├── control-panel.tsx
│   │   ├── ...
│   ├── contexts/
│   │   ├── animation-context.tsx
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── ...
│   ├── styles/
│   │   ├── globals.css
│   ├── public/
│   │   ├── models/
│   │   │   ├── character.glb
├── README.md
```

---

## 🧪 Implementación

### 🔹 Modelo 3D Utilizado

Debido a los problemas con Blender y Mixamo, creé un modelo humanoide personalizado en el componente `FallbackCharacter` utilizando geometrías básicas de Three.js. El modelo incluye:

- **Torso**: Compuesto por pecho, abdomen y pelvis, con proporciones humanas.
- **Cabeza**: Incluye ojos, nariz y boca para mayor realismo.
- **Brazos**: Articulados con hombros, codos y puños.
- **Piernas**: Articuladas con caderas, rodillas y pies.
- **Animaciones simuladas**:
  - **Idle**: Respiración sutil con ligero movimiento de brazos y torso.
  - **Wave**: Brazo derecho levantado completamente hacia arriba (como para parar un bus) con movimiento rápido de la mano, cuerpo inclinado y cabeza girada.
  - **Run**: Movimiento alternado intenso de brazos y piernas, cuerpo inclinado hacia adelante, con un leve movimiento vertical.
  - **Jump**: Salto dramático con 2.5 unidades de altura, brazos hacia arriba y piernas flexionadas.
  - **Alert**: Postura de boxeo profesional con guardia alta, pierna izquierda adelante, barbilla abajo, puños cerca de la cara, y un aura roja de combate.

### 🔹 Etapas realizadas

1. Configuré un proyecto con React Three Fiber y TypeScript, integrando `@react-three/drei` para facilitar el manejo de modelos y animaciones.
2. Implementé un componente `AnimatedCharacter` que intenta cargar un modelo .GLTF y, en caso de fallo, usa un modelo de fallback con animaciones programadas.
3. Creé un `AnimationContext` para gestionar el estado global de las animaciones y evitar conflictos.
4. Asocié eventos del usuario a animaciones:
   - **Clic**: Dispara la animación de saludo (`wave`).
   - **Hover**: Cambia a postura de boxeo (`alert`).
   - **Teclado (Espacio)**: Activa el salto (`jump`).
   - **Teclado (W/A/S/D)**: Activa la carrera (`run`).
5. Añadí un panel de control (`ControlPanel`) con botones para disparar manualmente cada animación.
6. Implementé transiciones fluidas usando `.fadeIn(0.3)` y `.fadeOut(0.3)` para el modelo .GLTF, y rotaciones/posiciones animadas para el modelo de fallback.
7. Agregué feedback visual: indicadores de estado, efectos como aura roja en `alert`, y un círculo amarillo en `jump`.
8. Incluí un modo debug para diagnosticar problemas con las animaciones.

### 🔹 Enfoque de Motion Design

El enfoque de motion design se centró en crear una experiencia interactiva inmersiva:
- **Feedback inmediato**: Cada evento del usuario (clic, tecla, hover) produce una respuesta visual clara, como el movimiento dramático del brazo en `wave` o la postura tensa de boxeo en `alert`.
- **Realismo en animaciones**: Las animaciones del modelo de fallback usan movimientos articulados (brazos, piernas, cabeza) para simular un rig esquelético, con proporciones humanas y articulaciones visibles.
- **Transiciones fluidas**: Las animaciones cambian con suavidad (usando `fadeIn`/`fadeOut` o interpolaciones en el fallback) para evitar cortes bruscos.
- **Interfaz intuitiva**: El panel de control y las instrucciones en pantalla hacen que el usuario entienda cómo interactuar con el modelo.
- **Expresividad**: Detalles como ojos, aura de combate, y movimientos sutiles (respiración en `idle`, balanceo en `alert`) añaden personalidad al personaje.

### 🔹 Código Relevante

#### Carga del Modelo y Animaciones (animated-character.tsx)
```tsx
const { scene, animations } = useGLTF(MODEL_PATH);
const { actions, mixer } = useAnimations(animations, group);

useEffect(() => {
  if (actions && Object.keys(actions).length > 0) {
    const idleAction = actions["idle"] || actions["Idle"] || actions[Object.keys(actions)[0]];
    if (idleAction) {
      idleAction.play();
      setCurrentAnimation("idle");
    }
  } else {
    setLocalDebugMode(true); // Activa el fallback si no hay animaciones
  }
}, [actions, setCurrentAnimation]);
```

#### Manejo de Eventos (animated-character.tsx)
```tsx
const handleClick = () => {
  setCurrentAnimation("wave");
};

const handlePointerOver = () => {
  setIsHovered(true);
  if (currentAnimation === "idle") {
    setCurrentAnimation("alert");
  }
};

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "Space":
        event.preventDefault();
        setCurrentAnimation("jump");
        break;
      case "KeyW":
      case "KeyA":
      case "KeyS":
      case "KeyD":
        if (!isMoving) {
          setCurrentAnimation("run");
          setIsMoving(true);
        }
        break;
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isMoving, setCurrentAnimation]);
```

#### Animación de Saludo (FallbackCharacter en animated-character.tsx)
```tsx
case "wave":
  if (rightArmRef.current && rightForearmRef.current) {
    rightArmRef.current.rotation.z = -Math.PI / 2; // Brazo horizontal
    rightArmRef.current.rotation.x = -Math.PI / 2; // Brazo hacia arriba
    rightForearmRef.current.rotation.x = -Math.PI / 6 + Math.sin(time * 12) * 0.4; // Movimiento de mano
    rightForearmRef.current.rotation.y = Math.sin(time * 8) * 0.6; // Movimiento lateral
  }
  if (bodyRef.current) {
    bodyRef.current.rotation.z = -0.1 + Math.sin(time * 4) * 0.05; // Cuerpo inclinado
  }
  if (headRef.current) {
    headRef.current.rotation.y = 0.3 + Math.sin(time * 6) * 0.2; // Cabeza girada
    headRef.current.rotation.x = -0.1; // Mirando arriba
  }
  break;
```

#### Animación de Alerta (Postura de Boxeo)
```tsx
case "alert":
  if (bodyRef.current) {
    bodyRef.current.rotation.x = 0.1;
    bodyRef.current.rotation.y = Math.sin(time * 3) * 0.1; // Balanceo
    bodyRef.current.position.y = Math.sin(time * 8) * 0.02; // Tensión
  }
  if (headRef.current) {
    headRef.current.rotation.x = -0.2; // Barbilla abajo
    headRef.current.rotation.y = Math.sin(time * 4) * 0.15; // Mirando alrededor
  }
  if (leftArmRef.current && rightArmRef.current) {
    leftArmRef.current.rotation.z = Math.PI / 3 + Math.sin(time * 6) * 0.05; // Guardia izquierda
    rightArmRef.current.rotation.z = -Math.PI / 3 - Math.sin(time * 6) * 0.05; // Guardia derecha
  }
  break;
```

#### Panel de Control (control-panel.tsx)
```tsx
const animationButtons = [
  { id: "idle", label: "Idle", icon: <Activity className="w-4 h-4" />, color: "bg-blue-500 hover:bg-blue-600", description: "Estado de reposo" },
  { id: "wave", label: "Wave", icon: <Hand className="w-4 h-4" />, color: "bg-green-500 hover:bg-green-600", description: "Saludo con la mano" },
  { id: "run", label: "Run", icon: <Play className="w-4 h-4" />, color: "bg-orange-500 hover:bg-orange-600", description: "Correr en el lugar" },
  { id: "jump", label: "Jump", icon: <Zap className="w-4 h-4" />, color: "bg-purple-500 hover:bg-purple-600", description: "Salto vertical" },
  { id: "alert", label: "Alert", icon: <AlertTriangle className="w-4 h-4" />, color: "bg-red-500 hover:bg-red-600", description: "Estado de alerta" },
];

<Button
  onClick={() => setCurrentAnimation(button.id)}
  className={`${button.color} text-white border-0 transition-all duration-200 ${activeAnimation === button.id ? "ring-2 ring-white scale-105" : ""}`}
  size="sm"
  title={button.description}
>
  {button.icon}
  <span className="ml-2">{button.label}</span>
</Button>
```

---

## 📊 Resultados Visuales

Los resultados obtenidos se pueden ver a continuación:

### Interacciones Disparadas por Eventos



https://github.com/user-attachments/assets/c62a1652-9e9a-48df-9110-2bdbb1ddd633



---

## 🧩 Prompts Usados

Los siguientes prompts fueron utilizados para guiar el desarrollo del taller:


1. **Corrección de animaciones**:
   ```text
   Hay un problema con las animaciones del modelo no estoy logrando hacer que el personaje realmente salude, salte y se ponga en alerta como se espera.
   ```

2. **Mejora de animaciones**:
   ```text
   Me sale un error de que no encuentra la animacion  y por lo tanto sigue sin animar correctamente el salto, ni el saludo, ni alert, el correr funciona pero corre durante muy poco tiempo casi no se ve.
   ```


3. **Ajuste del personaje**:
   ```text
   Como puedo hacer que el persona se vea más realista?
   ```

---

## 💬 Reflexión Final

Este taller ha sido una experiencia reveladora sobre cómo las interacciones del usuario pueden transformar una escena 3D en una experiencia dinámica y envolvente. Aunque no pude usar un modelo de Mixamo debido a problemas técnicos con Blender, crear un modelo personalizado con animaciones simuladas me permitió explorar a fondo el motion design desde cero. Este desafío técnico me obligó a entender mejor cómo programar movimientos articulados para imitar animaciones esqueléticas, lo que resultó en un aprendizaje profundo sobre Three.js y animación procedural.

La vinculación de eventos del usuario (clics, teclas, hover) con animaciones específicas creó una experiencia visualmente rica. Por ejemplo, el movimiento del brazo en la animación de saludo (`wave`), mientras que la postura de boxeo en `alert` añade un toque de tensión. Las transiciones fluidas entre estados, junto con el feedback visual (como el aura roja en `alert` o el círculo amarillo en `jump`), refuerzan la sensación de control y dinamismo para el usuario.

Los mayores desafíos fueron asegurar que las animaciones fueran visibles y expresivas, y depurar el sistema de fallback para manejar la ausencia de un modelo .GLTF. Sin embargo, estos obstáculos me enseñaron la importancia de un diseño robusto y la necesidad de sistemas de respaldo. La interfaz de control y las instrucciones en pantalla hicieron que la interacción fuera intuitiva, lo que mejoró significativamente la experiencia del usuario.

En resumen, este taller me mostró cómo el motion design interactivo puede dar vida a un personaje 3D, haciendo que cada acción del usuario tenga un impacto visual inmediato. Las posibilidades de aplicar estas técnicas en juegos, simulaciones, o interfaces interactivas son emocionantes, y este proyecto me ha dado una base sólida para seguir explorando el potencial del motion design en entornos 3D.
