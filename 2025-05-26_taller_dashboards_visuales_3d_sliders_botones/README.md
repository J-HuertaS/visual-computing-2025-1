# 🧪 Taller - Dashboards Visuales 3D: Sliders y Botones para Controlar Escenas

### 📅 Fecha
`2025-05-26` 

---
### 🎯 Objetivo del Taller

El objetivo de este taller es construir un dashboard visual 3D interactivo utilizando React y Three.js (a través de `@react-three/fiber`). La aplicación permite controlar un toro 3D mediante sliders y botones, ajustando propiedades como escala, color, textura, rotación y parámetros de iluminación (intensidad, color y posición de luces puntuales y direccionales). Se implementa un fondo oscuro para resaltar los efectos de luz y se cargan texturas metálicas para mejorar el realismo visual.

---

### 🧠 Conceptos Aprendidos

Lista los principales conceptos aplicados:

- [x] Transformaciones geométricas (escala, rotación, traslación)
- [ ] Segmentación de imágenes
- [x] Shaders y efectos visuales
- [ ] Entrenamiento de modelos IA
- [ ] Comunicación por gestos o voz
- [x] Otro: Materiales PBR y control dinámico de escenas 3D

---

### 🔧 Herramientas y Entornos

Especifica los entornos usados:

- Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- React (`react`, `react-dom`)
- Leva (`leva`) para controles interactivos

📌 Usa las herramientas según la [guía de instalación oficial](./guia_instalacion_entornos_visual.md)

---

### 📁 Estructura del Proyecto

```
2025-05-27_dashboards_visuales
├── threejs/ 
│   ├── public/                
│     ├── index.html
│     ├── textures/                
│       ├── blue_metal_plate_diff_1k.jpg
│       ├── metal_plate_02_diff_1k.jpg
│       ├── metal_plate_diff_1k.jpg
│   ├── src/                   
│     ├── App.tsx           # Configuración de la escena
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

### 🧪 Implementación

Explica el proceso:

### 🔹 Etapas realizadas
1. **Preparación de datos o escena**:
   - Configuré un proyecto React con `@react-three/fiber` y `@react-three/drei`.
   - Añadí un toro 3D y controles interactivos con `leva`.
   - Descargué texturas metálicas (`blue_metal_plate_diff_1k.jpg`, `metal_plate_02_diff_1k.jpg`, `metal_plate_diff_1k.jpg`) en la página Poly Haven.

2. **Aplicación de modelo o algoritmo**:
   - Implementé un material PBR (`meshPhysicalMaterial`) para el toroide, cargando texturas seleccionables.
   - Configuré luces (ambiental, puntual y direccional) con parámetros ajustables.

3. **Visualización o interacción**:
   - Agregué controles para escala, color, textura, rotación y parámetros de luz.
   - Establecí un fondo oscuro (`#1a1a1a`) para resaltar los efectos de luz.

4. **Guardado de resultados**:
   - Generé dos GIFs: uno mostrando los controles del toro y otro los efectos de luz.

### 🔹 Código relevante

Incluye un fragmento que resuma el corazón del taller:

**Selección de texturas en ControlledObject**
```typescript
const material =
  textureOption === 'blue_metal' ? (
    <meshPhysicalMaterial
      ref={materialRef}
      color={materialColor}
      map={new THREE.TextureLoader().load('/textures/blue_metal_plate_diff_1k.jpg')}
    />
  ) : textureOption === 'metal_plate_02' ? (
    <meshPhysicalMaterial
      ref={materialRef}
      color={materialColor}
      map={new THREE.TextureLoader().load('/textures/metal_plate_02_diff_1k.jpg')}
    />
  ) : textureOption === 'metal_plate' ? (
    <meshPhysicalMaterial
      ref={materialRef}
      color={materialColor}
      map={new THREE.TextureLoader().load('/textures/metal_plate_diff_1k.jpg')}
    />
  ) : (
    <meshStandardMaterial color={materialColor} />
  );
```
### **Imágenes de texturas**
- **Blue metal plate**
<img src="https://github.com/user-attachments/assets/699ceaa7-6125-411d-a925-236de38fb527" width="250">

- **Metal plate 02**
<img src="https://github.com/user-attachments/assets/916f1748-f533-4ff3-ac57-6c3bdf8e4902" width="250">

- **Metal plate**
<img src="https://github.com/user-attachments/assets/8c7bdbb3-beb7-4195-aa59-a770941eeea1" width="250">
---

### 📊 Resultados Visuales
Los resultados obtenidos se pueden ver a continuación: 

- **Panel de control**
<img src="https://github.com/user-attachments/assets/4ccb3a12-fac3-4880-b247-f893b97a850f" width="650">

- **Efectos**
<img src="https://github.com/user-attachments/assets/9654dfef-db6b-4459-9ae6-9fb21f596d52" width="650">



---

### 🧩 Prompts Usados

Se realiza la siguiente consulta a la IA Grok:

```text
"Ajusta el código de App.tsx para permitir la selección de texturas metálicas (blue_metal_plate_diff_1k.jpg, metal_plate_02_diff_1k.jpg, metal_plate_diff_1k.jpg) en un toro 3D usando React Three Fiber y Leva"
```

---

### 💬 Reflexión Final

Este taller nos permite profundizar en el uso de React Three Fiber para crear escenas 3D interactivas que se puedan manejar mediante sliders. Además se puso en práctica el poder integrar materiales PBR con texturas (en  este caso metalicas, que se descargaron en Poly Haven), lo que mejoró significativamente el aspecto visual del toroide. También se reforzó la alicación de transformaciones geométricas y cómo manipular luces dinámicamente para lograr efectos visuales en un fondo oscuro que permite resaltar las iluminaciones.

La parte más interesante fue experimentar con los controles de `leva` para ajustar propiedades en tiempo real, ya que esto hizo la interacción mucho más dinámica y práctica. Sin embargo, lo más complejo fue manejar correctamente las texturas, ya que inicialmente tuvimos errores de compilación y problemas de carga de recursos. En futuros proyectos, me gustaría incorporar mapas PBR completos (roughness, metalness, normal) para cada textura y explorar animaciones más avanzadas, como transiciones suaves entre texturas o efectos de luz más elaborados. Los controles más utiles resultan ser el control de color de fondo, las texturas y luces ambientales, aunque en realidad todos son valiosos porque permiten ajustar de forma personalizada la escena, tambi[en como mejora a futuro se podría agregar unos botones donde se pueda cambiar de figura o agregar varias a la vez en la escena.

---

## ✅ Checklist de Entrega

- [x] Carpeta `2025-05-26_dashboards_visuales`
- [x] Código limpio y funcional
- [x] GIF incluido con nombre descriptivo (panel_de_control.gif, efectos.gif, texturas.gif)
- [x] Visualizaciones o métricas exportadas
- [x] README completo y claro
- [x] Commits descriptivos en inglés
