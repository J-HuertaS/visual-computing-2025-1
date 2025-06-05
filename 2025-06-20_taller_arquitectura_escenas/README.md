# 🏗️ Taller Arquitectura de Juego, Escenas y Navegación en  Three.js

#### 📅 **Fecha**
`2025-06-05` – Fecha de realización

## 🎯 **Objetivo del Taller**

Diseñar una estructura escalable para una aplicación interactiva con múltiples escenas (pantallas) que permita moverse entre menús, niveles o etapas. Este taller enseña cómo organizar el código y los recursos visuales para lograr una navegación fluida y lógica, utilizando Three.js y React para crear una experiencia 3D interactiva con rutas claras y componentes modulares.

---

## 🧠 **Conceptos Aprendidos**

Lista los principales conceptos aplicados:

- [x] Transformaciones geométricas (escala, rotación, traslación)
- [x] Shaders y efectos visuales
- [x] Navegación modular con React Router y diseño de UI

---

## 🔧 **Herramientas y Entornos**

Especifica los entornos usados:

- Three.js / React Three Fiber
- Librerías: `react-router-dom`, `@react-three/fiber`, `@react-three/drei`
- Entorno: Vite (bundler y servidor de desarrollo)

---
## 📁 **Estructura del Proyecto**
```
2025-06-20_taller_arquitectura_escenas/
├── threejs/               
│   ├── src/
│   │   ├── components/
│   │   │   ├── Menu.jsx
│   │   │   ├── Juego.jsx
│   │   │   └── Creditos.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── public/
│   │   └── models/
│   │       ├── portal-2.glb
│   │       ├── baked-02.jpeg
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
├── resultados/            
│   ├── navegacion.gif
├── README.md
```

---

## 🧪 **Implementación**

### 🔹 Explicación de la Arquitectura de Escenas Implementada

La arquitectura de este proyecto se basa en un diseño modular utilizando React y React Router para manejar la navegación entre tres escenas principales: **Menú Principal**, **Juego**, y **Créditos**. Cada escena está encapsulada en un componente separado dentro de `src/components/`, lo que permite una organización clara y escalable. El componente `App.jsx` actúa como el contenedor principal, integrando un menú lateral fijo y un área de contenido dinámico que cambia según la ruta. Los recursos visuales (modelos 3D y texturas) se gestionan desde la carpeta `public/models/`, asegurando que sean accesibles durante el desarrollo y la producción.

### 🔹 Etapas Realizadas

1. **Preparación de datos o escena**:
   - Se configuró un entorno de desarrollo utilizando Vite como bundler, creando una estructura base con `src/` para el código fuente y `public/` para los recursos estáticos. Se instalaron las dependencias clave: `react-router-dom` para la navegación, `@react-three/fiber` y `@react-three/drei` para el renderizado 3D, y otras como `vite-plugin-glsl` para manejar shaders. Los archivos `portal-2.glb` (modelo 3D del portal) y `baked-02.jpeg` (textura) se colocaron en `public/models/` para su uso en la escena del juego. Además, se configuró `vite.config.js` para soportar shaders GLSL y optimizar la carga de dependencias.

2. **Aplicación de modelo o algoritmo**:
   - En el componente `Juego.jsx`, se implementó una escena 3D con un portal animado. Se utilizó `shaderMaterial` para crear un efecto visual dinámico en el portal, aplicando ruido perlin (`glsl-noise`) para simular distorsión y un gradiente de color (de `hotpink` a `white`). Se añadieron partículas con `Sparkles` para un efecto visual adicional, y se aplicaron transformaciones geométricas como rotación (`rotation={[-Math.PI / 2, 0, 0]}`) y traslación (`position={[0, 0.78, 1.6]}`) al modelo 3D. También se integraron `OrbitControls` para permitir al usuario interactuar con la escena rotando y acercando la cámara.

3. **Visualización o interacción**:
   - La navegación se implementó con React Router en `App.jsx`, definiendo rutas para `/`, `/juego`, y `/creditos`, que cargan los componentes `Menu.jsx`, `Juego.jsx`, y `Creditos.jsx` respectivamente. Se diseñó un menú lateral fijo con enlaces (`Link`) a cada ruta, mejorando la usabilidad con iconos de Font Awesome (`fa-home`, `fa-gamepad`, `fa-info-circle`) y la tipografía "Roboto" de Google Fonts. Cada escena tiene un fondo azul oscuro (`#1a2a44`) para consistencia visual, y el menú guía al usuario de manera clara. La interfaz se optimizó para ser intuitiva, con un diseño limpio y elementos visuales que facilitan la navegación.

4. **Guardado de resultados**:
   - Se generó un GIF animado (`portal_animado_3d_2025-06-05.gif`) utilizando ScreenToGif, capturando la interacción con la escena del portal (rotación con `OrbitControls` y animación de partículas). También se tomaron capturas de pantalla de cada escena (`captura_menu.png`, `captura_juego.png`, `captura_creditos.png`) para documentar el flujo de navegación. Todos estos archivos se guardaron en la carpeta `resultados/`, organizados para facilitar la evaluación del proyecto.

### 🔹 Código de Navegación Comentado

A continuación, se presenta el código de navegación implementado en `App.jsx`, con comentarios que explican su funcionalidad:

```jsx
import { Routes, Route, Link } from 'react-router-dom';
import Menu from './components/Menu';
import Juego from './components/Juego';
import Creditos from './components/Creditos';

function App() {
  return (
    // Contenedor principal con diseño flexible y tipografía Roboto
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Roboto, sans-serif' }}>
      {/* Menú lateral fijo con fondo oscuro y sombra */}
      <nav style={{
        width: '200px',
        background: '#2c3e50',
        color: 'white',
        padding: '20px',
        position: 'fixed',
        height: '100vh',
        boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
        zIndex: 1000
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#ecf0f1', fontWeight: 700 }}>Navegación</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {/* Enlace a la ruta raíz, con ícono de casa */}
          <li style={{ marginBottom: '15px' }}>
            <Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', padding: '10px', display: 'block', borderRadius: '5px' }}>
              <i className="fas fa-home"></i> Menú Principal
            </Link>
          </li>
          {/* Enlace a la escena del juego, con ícono de gamepad */}
          <li style={{ marginBottom: '15px' }}>
            <Link to="/juego" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', padding: '10px', display: 'block', borderRadius: '5px' }}>
              <i className="fas fa-gamepad"></i> Juego
            </Link>
          </li>
          {/* Enlace a los créditos, con ícono de información */}
          <li>
            <Link to="/creditos" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', padding: '10px', display: 'block', borderRadius: '5px' }}>
              <i className="fas fa-info-circle"></i> Créditos
            </Link>
          </li>
        </ul>
      </nav>

      {/* Área de contenido dinámico que cambia según la ruta */}
      <div style={{ marginLeft: '200px', width: 'calc(100% - 200px)', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          {/* Ruta raíz carga el componente Menú */}
          <Route path="/" element={<Menu />} />
          {/* Ruta /juego carga la escena 3D del portal */}
          <Route path="/juego" element={<Juego />} />
          {/* Ruta /creditos carga los créditos */}
          <Route path="/creditos" element={<Creditos />} />}
        </Routes>
      </div>
    </div>
  );
}

export default App;
```
## 📊 **Resultados Visuales**
![deteccion](./resultados/navegacion.gif)

### Justificación del Flujo y Diseño Modular

- **Flujo de Navegación:** El menú lateral fijo permite al usuario cambiar entre escenas de manera intuitiva, con títulos que indican claramente el propósito de cada sección. La disposición fija del menú asegura que el usuario siempre tenga acceso a la navegación, sin interrupciones en la experiencia.


- **Diseño Modular:** Cada escena (Menu.jsx, Juego.jsx, Creditos.jsx) es un componente independiente, lo que facilita añadir nuevas escenas en el futuro. Los recursos 3D están organizados en public/models/, y los estilos (como el fondo azul oscuro y la tipografía "Roboto") se aplican de forma consistente para una experiencia cohesiva.

 ## 🧩 **Prompts Usados**

Enumera los prompts utilizados:
```
"No prompts utilizados, desarrollo manual con Three.js y React Three Fiber"
```

## 💬 **Reflexión Final**

Este taller nos permitió aprender a diseñar una arquitectura escalable para aplicaciones interactivas, utilizando React Router para gestionar la navegación y React Three Fiber para renderizar escenas 3D. Se reforzaron los conceptos de diseño modular, asegurándome de que cada escena fuera independiente y reutilizable, lo que facilita la escalabilidad del proyecto. También mediante la práctica se mejoró la comprensión de cómo integrar elementos de UI (como menús con iconos y tipografía personalizada) con gráficos 3D, creando una experiencia de usuario fluida y visualmente atractiva.

La parte más compleja fue resolver problemas de compatibilidad con las dependencias, como babel-plugin-glsl/macro, que inicialmente causaron errores en el entorno de Vite. Sin embargo, esta dificultad resultó ser la más interesante, ya que nos llevó a explorar alternativas como vite-plugin-glsl y a profundizar en la configuración de proyectos web 3D. En futuros proyectos, optimizaría el rendimiento de la escena o garegar aún más modelos en simultanéo y añadiría transiciones animadas entre rutas para mejorar la experiencia de navegación.

##  **Criterios de Evaluación Cumplidos**

✅ Navegación funcional entre escenas/pantallas: Implementada con React Router (/, /juego, /creditos).

✅ Código modular y organizado: Estructura clara con componentes separados en src/components/.

✅ Implementación de al menos 3 escenas por entorno: Menu.jsx, Juego.jsx, Creditos.jsx.

✅ Interfaz clara que guíe al usuario: Menú lateral con iconos y tipografía moderna.

✅ Documentación en README.md clara y visual: Incluye capturas, GIF, código comentado y justificación.

✅ GIFs o capturas que muestren el comportamiento: GIF animado y capturas de pantalla.



## 📚 **Recursos Complementarios Utilizados**

- React Router Dom
- React Three Fiber Docs


## ✅ **Conclusión**

Este taller cumplió con su objetivo de diseñar una arquitectura escalable y modular para una aplicación interactiva, logrando una navegación fluida entre escenas con Three.js y React. La práctica nos preparó para desarrollar proyectos más complejos, manteniendo el código organizado y ofreciendo una interfaz intuitiva para el usuario.
