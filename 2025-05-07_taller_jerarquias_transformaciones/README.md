# Three.js Transform Hierarchy Demo

Este proyecto demuestra el uso de jerarquías de transformación en Three.js utilizando React Three Fiber. Muestra cómo las transformaciones de los objetos padres afectan a sus hijos en una escena 3D.

## 🎯 Características

- Estructura jerárquica de tres niveles (padre → hijo → nieto)
- Controles interactivos para rotación y posición
- Visualización en tiempo real de las transformaciones
- Interfaz de usuario con sliders usando Leva

## 🎨 Elementos de la Escena

1. **Cubo Padre (Rosa)**
   - Objeto base que controla toda la jerarquía
   - Transformaciones afectan a todos los objetos hijos

2. **Esfera Hijo (Azul Claro)**
   - Posicionada a 2 unidades del padre
   - Hereda las transformaciones del cubo padre

3. **Toro Nieto (Verde Claro)**
   - Posicionado a 1 unidad del hijo
   - Hereda las transformaciones de ambos padres

## 🎮 Controles

- **Rotación**: Controla la rotación del cubo padre alrededor del eje Y
- **Posición**: Mueve el cubo padre a lo largo del eje X
- **Cámara**: 
  - Click izquierdo + arrastrar: Orbitar
  - Click derecho + arrastrar: Pan
  - Rueda del mouse: Zoom

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🛠️ Tecnologías

- React
- Three.js
- React Three Fiber
- React Three Drei
- Leva (para controles UI)
- Vite
- TypeScript 