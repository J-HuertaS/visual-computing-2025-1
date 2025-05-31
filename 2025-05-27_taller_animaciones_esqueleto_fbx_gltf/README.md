# 🧪 Taller - Animaciones por Esqueleto: Importando y Reproduciendo Animaciones

## 📅 Fecha
`2025-05-27` 

## 🎯 Objetivo del Taller

Trabajar con animaciones basadas en huesos (esqueleto) y reproducirlas desde archivos externos como .FBX o .GLTF. El objetivo es comprender cómo funcionan las animaciones esqueléticas, cómo importarlas correctamente y cómo integrarlas en escenas interactivas.

---

## 🧠 Conceptos Aprendidos

Lista los principales conceptos aplicados en la práctica son:

- [x] Transformaciones geométricas (escala, rotación, traslación)
- [x] Animaciones esqueléticas, rigging, control de clips y transiciones
- [x] Uso de animaciones en Blender
- [x] Fluidez en las animaciones
- [x] Sincronización con eventos interactivos
- [x] Optimización de modelos 3D
- [x] Interactividad en escenas 3D

---

## 🔧 Herramientas y Entornos

Especifica los entornos usados:

- Blender (versión 3.6 o superior) para ajustes de rigging y exportación a .GLTF
- Three.js / React Three Fiber (con @react-three/drei)
- Node.js para desarrollo del entorno

---

## 📁 Estructura del Proyecto

```
2025-05-31_taller_animaciones_esqueleto_fbx_gltf/

├── threejs/ 
│   ├── public/                
│     ├── index.html
│     ├── models/                
│       ├── .glb
│       ├── .glb
│       ├── .glb
│   ├── src/                   
│     ├── App.tsx         
│     ├── App.css
│     ├── App.test.tsx                      
│     ├── index.tsx
│     ├── index.css
│     ├── react-app-env.d.ts
│     ├── reportWebVitals.ts
│     ├── setupTests.ts
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
├── README.md
```

---

## 🧪 Implementación

Explica el proceso:

### 🔹 Etapas realizadas
1. Importación y ajuste de modelos .FBX desde Mixamo en Blender, exportándolos como un solo .GLTF con todas las animaciones.
2. Configuración del proyecto Three.js con React Three Fiber, usando `useGLTF()` y `useAnimations()` para cargar y controlar animaciones.
3. Implementación de transiciones suaves con `fadeIn()` y `fadeOut()`, y sincronización con eventos (ej. mover modelo al correr).
4. Generación de GIFs para mostrar transiciones e interacciones.

### 🔹 Código relevante

```jsx
import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';

function Model({ onAnimationChange }) {
  const { scene, animations } = useGLTF('/models/goodCharacterAllAnimations.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    actions['Idle'].play().fadeIn(0.5);
    onAnimationChange('Idle');
  }, [actions, onAnimationChange]);

  return <primitive object={scene} />;
}
```

---

## 📊 Resultados Visuales

- **Animación bailando la Macarena**
  - `transicion_idle_dance_2025_05_31.gif` (muestra transición de Idle a Dance)
  - 
- **Animación bailando la Macarena**
  - `run_with_movement_2025_05_31.gif` (muestra animación Run con movimiento)
  - 
- **Animación bailando la Macarena**
  - `transicion_idle_dance_2025_05_31.gif` (muestra transición de Idle a Dance)
  - 
- **Animación bailando la Macarena**
  - `run_with_movement_2025_05_31.gif` (muestra animación Run con movimiento)

---

## 🧩 Prompts Usados

```text
"Cómo importar y controlar animaciones .GLTF en Three.js con React Three Fiber"
"Cómo combinar múltiples animaciones .FBX en un solo .GLTF en Blender"
```
---

## 💬 Reflexión Final

Este taller nos permite  dominar el control de animaciones esqueléticas, desde el ajuste de rigs en Blender hasta su integración en Three.js con React Three Fiber. Bastante del tiempo dispuesto al taller fue aplicado en el aprendizaje de la herramienta Blender para lograr asignar la animación del esqueleto sin skin a la animación del caracter principal. Aprendí a usar `useAnimations()` para gestionar clips y a implementar transiciones suaves, lo que mejoró la fluidez de las animaciones.



Lo más interesante fue sincronizar la animación "Run" con un movimiento del modelo, cumpliendo el bonus del taller, aunque ajustar el rigging inicial en Blender fue desafiante. En futuros proyectos, exploraré animaciones más complejas y controles dinámicos basados en entradas del usuario.

---

## 👥 Contribuciones Grupales (si aplica)

Trabajé de manera individual, mis contribuciones incluyeron:

```markdown
- Ajusté el rigging y combiné animaciones en Blender
- Desarrollé el código React Three Fiber con transiciones y eventos
- Generé los GIFs y documenté el README
```

---

## ✅ Checklist de Entrega

- [x] Carpeta `2025-05-31_taller_animaciones_esqueleto_fbx_gltf`
- [x] Código limpio y funcional
- [x] GIF incluido
- [x] README completo y claro
- [x] Commits descriptivos en inglés
