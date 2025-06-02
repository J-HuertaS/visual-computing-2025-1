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
2025-05-27_taller_animaciones_esqueleto_fbx_gltf/

├── threejs/ 
│   ├── public/                
│     ├── index.html
│     ├── models/                
│       ├── completeCharacter.glb
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
1. Importación y ajuste de modelos .FBX desde Mixamo en Blender, se revisaron varios tutoriales para lograr entender como se pasaban las animaciones sin skin al caracter principal y se llamaron las animaciones (`1`, `2`, `3`, `4`), exportándolos como un solo .GLTF con todas las animaciones.
2. Configuración del proyecto Three.js con React Three Fiber, usando `useGLTF()` y `useAnimations()` para cargar y controlar animaciones.
3. Corrección del mapeo de animaciones para que coincidieran con los nombres reales del archivo .GLTF (`1`, `2`, `3`, `4`), asignándolos a nombres descriptivos (`Dance`, `Jump`, `Idle`, `Run`).
4. Implementación de transiciones suaves con `fadeIn()` y `fadeOut()`, y sincronización con eventos (ej. mover modelo al correr).
5. Adición de interactividad mediante teclas (`1`, `2`, `3`, `4`) para cambiar entre animaciones manualmente.
6. Implementación de un ciclo automático para que las animaciones se reproduzcan de forma secuencial cada 5 segundos.
7. Generación de GIFs para mostrar transiciones e interacciones.

### 🔹 Código relevante

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

// Mapeo y ciclo automático de animaciones
const AnimatedModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const gltf = useGLTF('/models/completeCharacter.glb');
  const { scene, animations } = gltf;

  const animationMap: AnimationMap = {};
  animations.forEach((anim, index) => {
    if (anim.name === '1') animationMap['Dance'] = anim;
    if (anim.name === '2') animationMap['Jump'] = anim;
    if (anim.name === '3') animationMap['Idle'] = anim;
    if (anim.name === '4') animationMap['Run'] = anim;
  });

  const renamedAnimations = Object.entries(animationMap).map(([name, clip]) => {
    const newClip = clip.clone();
    newClip.name = name;
    return newClip;
  });

  const { actions, names } = useAnimations(renamedAnimations, groupRef);
  const animationCycle = ['Dance', 'Jump', 'Idle', 'Run'];
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

  const handleAnimationChange = useCallback((animationName: string) => {
    const currentAction = Object.values(actions).find((action) => action && action.isRunning());
    const nextAction = actions[animationName];
    if (currentAction && currentAction !== nextAction) {
      currentAction.fadeOut(0.5);
    }
    nextAction.reset().fadeIn(0.5).play();
  }, [actions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimationIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % animationCycle.length;
        handleAnimationChange(animationCycle[nextIndex]);
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [animationCycle, handleAnimationChange]);
};
```

---

## 📊 Resultados Visuales

- **Animación  de la chica bailando, saltando, en pose inactiva y corriendo**
  ![20250602-2142-37 5775790](https://github.com/user-attachments/assets/6c7e1320-69bc-4deb-81d5-b83412c5e9c3)

---

## 🧩 Prompts Usados

```text
"Cómo importar y controlar animaciones .GLTF en Three.js con React Three Fiber"
"Cómo combinar múltiples animaciones .FBX en un solo .GLTF en Blender"
```

---

## 💬 Reflexión Final

Este taller nos permite dominar el control de animaciones esqueléticas, desde el ajuste de rigs en Blender hasta su integración en Three.js con React Three Fiber. Bastante del tiempo dispuesto al taller fue aplicado en el aprendizaje de la herramienta Blender para lograr asignar la animación del esqueleto sin skin a la animación del caracter principal.  Aprendí a usar useAnimations() para gestionar clips, implementar transiciones suaves con fadeIn() y fadeOut(), y añadir interactividad mediante teclas y un ciclo automático que cambia animaciones cada 5 segundos. También fue valioso depurar el mapeo de animaciones, ya que los nombres del archivo .GLTF (1, 2, 3, 4) requirieron ajustes para coincidir con los esperados (Dance, Jump, Idle, Run).

El mayor desafío fue ajustar el rigging en Blender, un proceso complejo que me enseñó la importancia de verificar los datos del modelo. Sincronizar la animación "Run" con movimiento y añadir un título dinámico para mostrar el nombre de cada animación fueron aspectos destacados que enriquecieron la escena. Estos elementos me ayudaron a entender mejor cómo combinar animaciones con interactividad y elementos visuales en una aplicación web 3D.

En el futuro, planeo explorar animaciones más complejas, como las que responden a entradas dinámicas del usuario, y optimizar modelos para mejor rendimiento. También me interesa integrar efectos de sonido sincronizados y experimentar con animaciones procedurales en proyectos como videojuegos o experiencias de realidad aumentada, donde la sincronización y la inmersión son clave.

---

## ✅ Checklist de Entrega

- [x] Carpeta `2025-05-27_taller_animaciones_esqueleto_fbx_gltf`
- [x] Código limpio y funcional
- [x] GIF incluido
- [x] README completo y claro
- [x] Commits descriptivos en inglés
