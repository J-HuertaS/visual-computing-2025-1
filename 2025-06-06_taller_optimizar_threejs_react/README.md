# 🧪 Taller 27 - Optimización Visual en Three.js y React Three Fiber

## 📅 Fecha
`2025-06-06` - Fecha de finalización

---

## 🎯 Objetivo del Taller

Aprender y aplicar técnicas de optimización gráfica para lograr un mejor rendimiento, menor consumo de memoria y carga más rápida en escenas 3D utilizando Three.js y React Three Fiber, con un enfoque en mejorar la experiencia en dispositivos con recursos limitados.

---

## 🧠 Conceptos Aprendidos

Los principales conceptos aplicados en este taller fueron:

- [x] Uso de LOD (Level of Detail) para optimizar modelos según la distancia
- [x] Uso eficiente de luces para reducir cálculos de iluminación
- [x] Gestión de sombras y materiales para mejorar el rendimiento
- [x] Frustum Culling para evitar renderizar objetos fuera de cámara
- [x] Implementación de un panel de control interactivo para probar optimizaciones
- [ ] Simplificación de geometría (Low Poly)
- [ ] Baking de texturas e iluminación
- [ ] Compresión de imágenes y texturas

## 📖 Descripción Breve de las Técnicas Implementadas

### Uso de LOD (Level of Detail)

El sistema LOD renderiza modelos con diferentes niveles de detalle según la distancia a la cámara. Se implementaron tres niveles:
- **Cercano (0-8m)**: Modelo completo con texturas y sombras originales.
- **Medio (8-15m)**: Mantiene geometría pero elimina sombras proyectadas.
- **Lejano (15m+)**: Simplifica materiales preservando colores originales, eliminando sombras.

**Ubicación**: `components/OptimizedKitchen.tsx` (líneas 45-80)

### Uso Eficiente de Luces

Se implementó un sistema de iluminación optimizado que reduce el número de luces dinámicas:
- **Modo optimizado**: 1 luz ambiental y 1 direccional (2 luces).
- **Modo sin optimizar**: 1 ambiental, 2 puntuales y 1 spotlight (4 luces).

**Ubicación**: `app/page.tsx` (líneas 45-65)

### Gestión de Sombras y Materiales

Las sombras se desactivan dinámicamente para mejorar el rendimiento, y los materiales originales del modelo GLB se preservan en niveles cercanos, mientras que en niveles lejanos se simplifican a materiales básicos (`MeshStandardMaterial` con `flatShading`).

**Ubicación**: `components/OptimizedKitchen.tsx` (líneas 25-35)

### Frustum Culling

Se activa el frustum culling para evitar renderizar objetos fuera del campo de visión de la cámara, reduciendo los cálculos de renderizado.

**Ubicación**: `components/OptimizedKitchen.tsx` (línea 34)

---

## 🔧 Herramientas y Entorno

Para este taller, se utilizaron las siguientes herramientas:
- **React Three Fiber** y **Three.js** para renderizado 3D.
- **Next.js** como framework para la aplicación web.
- **@react-three/drei** para componentes adicionales (OrbitControls, Environment, Stats).
- Modelo GLB optimizado (`/models/Kitchen.glb`).

---

## 📁 Estructura del Proyecto

```
2025-06-06_taller_optimizar_threejs_react/
├── threejs/
├── ├── components/
│   ├── ├── OptimizedKitchen.tsx
│   ├── ├── OptimizationControls.tsx
│   ├── ├── LoadingFallback.tsx
├── ├── app/
│   ├── ├── page.tsx
│   ├── ├── layout.tsx
├── ├── public/
├── ├── ├── models/
│   └── ├── ├── Kitchen.glb
├── README.md
```

---

## 🧪 Implementación

El proceso de implementación se centró en crear una escena 3D interactiva con un modelo de cocina, aplicando técnicas de optimización en tiempo real. Se incluyó un panel de control para activar/desactivar optimizaciones y un panel de estadísticas (Stats) para medir FPS.

### 🔹 Pasos Realizados
1. Configurar el entorno de Next.js y React Three Fiber.
2. Cargar el modelo GLB de la cocina y aplicar optimizaciones dinámicas.
3. Implementar LOD con tres niveles de detalle.
4. Configurar iluminación optimizada con control dinámico.
5. Activar/desactivar sombras y frustum culling según configuración.
6. Añadir un panel de control interactivo para probar optimizaciones.
7. Medir FPS con `Stats` de `@react-three/drei`.

### 🔹 Código Clave

```tsx
// components/OptimizedKitchen.tsx
const lodSystem = useMemo(() => {
  if (!optimizations.lod) return null;
  const lod = new LOD();
  lod.addLevel(detailedKitchen, 0); // Alta calidad
  lod.addLevel(mediumKitchen, 8); // Media calidad, sin sombras proyectadas
  lod.addLevel(farKitchen, 15); // Baja calidad, materiales simplificados
  return lod;
}, [optimizedKitchen, optimizations.lod, optimizations.shadows]);

useFrame(() => {
  if (lodSystem && groupRef.current) {
    lodSystem.update(camera);
  }
});
```

```tsx
// app/page.tsx
{optimizations.lighting ? (
  <>
    <ambientLight intensity={0.5} />
    <directionalLight
      position={[10, 10, 5]}
      intensity={1}
      castShadow={optimizations.shadows}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  </>
) : (
  <>
    <ambientLight intensity={0.2} />
    <pointLight position={[2, 4, 2]} intensity={0.8} castShadow={optimizations.shadows} />
    <pointLight position={[-2, 4, -2]} intensity={0.6} castShadow={optimizations.shadows} />
    <spotLight position={[0, 6, 0]} intensity={1} castShadow={optimizations.shadows} />
  </>
)}
```

---

## 📊 Resultados Visuales


https://github.com/user-attachments/assets/1564d2b3-05d8-4649-ac63-0df353912c30


- **Escena optimizada (LOD, sombras desactivadas, frustum culling)**:  
  Mayor FPS y menor consumo de recursos, con transiciones suaves entre niveles de detalle.


https://github.com/user-attachments/assets/117cac93-22a0-45cd-8b83-f6d30270701f


- **Escena sin optimizar**:  
  Menor FPS debido a múltiples luces dinámicas, sombras completas y renderizado de todos los objetos.
  


https://github.com/user-attachments/assets/fc1fb2ca-33c4-4d89-ad8e-c7c2abf8ddf6



- **Panel de estadísticas**:  
  Muestra FPS, tiempo de frame y uso de memoria, con indicadores visuales para evaluar el rendimiento.


---

## 🧩 Prompts Utilizados


```text
"Estoy realizando esta optimizacion a este modelo, pero al usar la maxima optimizacion mira como se ve naranaja y cuando me alejo se ve solo un cuadrado naranja, sabes por que?"
```

```text
"Ahora optimizado se ve de este color y cuando me alejo solo se ven algunos objetos"
```


---

## 💬 Reflexión Final

Este taller permitió profundizar en técnicas de optimización gráfica esenciales para proyectos 3D interactivos. La implementación de LOD, uso eficiente de luces, gestión de sombras y frustum culling mejoró significativamente el rendimiento de la escena, logrando un aumento notable en FPS (medido con `Stats`). Aunque técnicas como low poly, baking de texturas y compresión de imágenes no se implementaron debido a que requieren preprocesamiento en herramientas externas, las optimizaciones en tiempo real aplicadas cumplieron con los objetivos del taller.

El desarrollo presentó desafíos, como problemas iniciales con colores incorrectos en el LOD y posicionamiento de indicadores en pantalla, que se resolvieron ajustando materiales, transiciones de LOD y el uso de `Html` de `@react-three/drei`. El panel de control interactivo fue una herramienta clave para comparar el impacto de cada técnica en tiempo real.

En términos de aprendizaje, el taller reforzó la importancia de equilibrar calidad visual y rendimiento, especialmente en dispositivos con recursos limitados. La experiencia con React Three Fiber y Three.js fue enriquecedora, aunque la configuración inicial y la depuración de errores (como el uso incorrecto de hooks) requirieron tiempo adicional.

### Tabla de Comparación de Técnicas

| Técnica                | Estado         | Impacto en Rendimiento | Notas                                               |
|------------------------|----------------|------------------------|-----------------------------------------------------|
| LOD                   | ✅ Implementado | Alto                  | Reduce polígonos y sombras a distancia              |
| Luces Eficientes      | ✅ Implementado | Medio                 | Minimiza cálculos de iluminación                    |
| Sombras y Materiales  | ✅ Implementado | Alto                  | Desactiva sombras y simplifica materiales           |
| Frustum Culling       | ✅ Implementado | Medio                 | Evita renderizar objetos fuera de cámara            |
| Low Poly             | ❌ No implementado | Alto               | Requiere assets preprocesados                      |
| Baking de Texturas    | ❌ No implementado | Medio              | Requiere preprocesamiento en Blender                |
| Compresión de Texturas | ❌ No implementado | Bajo               | Requiere herramientas externas (TinyPNG, Squoosh)   |

---

## ✅ Lista de Entrega

- [x] Carpeta `2025-04-XX_taller_optimizar_threejs_react`
- [x] Implementación funcional de la escena con al menos 3 técnicas de optimización
- [x] Comparación de FPS mediante el panel `Stats`
- [x] Escena navegable con OrbitControls
- [x] Código limpio y reutilizable
- [x] README con explicación de técnicas y resultados
- [ ] Imágenes comprimidas (no implementado por falta de preprocesamiento)
