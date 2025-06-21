# 🧪 Taller - Introducción a Realidad Aumentada Web: Marcadores con AR.js

## 📅 Fecha
`2025-06-20`

---

## 🎯 Objetivo del Taller

Implementar una experiencia básica de realidad aumentada basada en marcadores directamente desde el navegador, usando AR.js y Three.js. El taller permite visualizar modelos 3D sobre un marcador físico y activar interacciones o animaciones cuando este es detectado, todo sin necesidad de instalar aplicaciones móviles.

---

## 🧠 Conceptos Aprendidos

Lista los principales conceptos aplicados:

- [x] Generación de escenas utilizando AR.js y la cámara
- [x] Carga de modelos en una escena AR.js
- [x] Personalización de marcadores
- [x] Adición de sonidos asociados a la personalización de marcadores

---

## 🔧 Herramientas y Entornos

Especifica los entornos usados:

- AR.js (v3 o superior)
- Three.js
- Navegador moderno con acceso a cámara

---

## 📁 Estructura del Proyecto

```
2025-06-20_taller_arjs_realidad_aumentada_marcadores_web/
├── markers/               
├── models/                
├── resultados/
├── app.js
├── index.html
├── sound.mp3            
├── README.md
```

---

## 🧪 Implementación

### 🔹 Etapas realizadas
1. Configuración Inicial del Proyecto:
    - Se creó una carpeta principal para el proyecto.
    - Se estableció la estructura base con un archivo index.html (el archivo principal de la aplicación web).
2. Inclusión de Dependencias Esenciales:
    - Se enlazaron las librerías de A-Frame (framework para VR/AR en la web) y AR.js (la librería de Realidad Aumentada) en el <head> del index.html.
3. Implementación de la Escena AR Básica:
    - Se configuró el contenedor de la escena de Realidad Aumentada con <a-scene embedded arjs>.
    - Se añadió un marcador predefinido (<a-marker preset="hiro">) y un objeto 3D básico (una caja roja <a-box>) para verificar la funcionalidad inicial.
    - Se incluyó la cámara necesaria para la escena (<a-entity camera>).
4. Ejecución y Depuración del Entorno:
    - Para garantizar el correcto acceso a la cámara y la carga de recursos, se utilizó un servidor web local (como la extensión Live Server de VS Code).
    - Se depuraron problemas comunes como la denegación de permisos de la cámara y los errores de carga de librerías (Failed to fetch).
5. Personalización con Modelos 3D y Animaciones:
    - Se reemplazó el objeto 3D básico por modelos GLB personalizados (<a-entity gltf-model="url(modelo.glb)">).
    - Se añadieron animaciones básicas (rotación, escala) a los modelos 3D utilizando los atributos de animación de A-Frame.
6. Interacciones y Detección de Marcadores:
    - Se implementó un script JavaScript (app.js) para manejar eventos de detección de marcadores (markerFound, markerLost), permitiendo activar acciones cuando el marcador es visible o se pierde.
    - Se añadió funcionalidad extra, como la reproducción de un sonido al detectar el marcador.
7. Uso de Marcadores Personalizados:
    - Se empleó el AR.js Marker Generator para crear patrones de marcadores únicos (.patt) a partir de imágenes propias.
    - Se configuraron múltiples <a-marker> con type="pattern" y la URL de los archivos .patt personalizados, permitiendo mostrar diferentes modelos 3D según el marcador detectado.

### 🔹 Código relevante

```html
<a-scene embedded arjs="sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 3x3;">
        <a-marker preset="hiro">
            <a-entity
            gltf-model="url(models/modelo.glb)"
            scale="8 8 8"
            position="0 0 0"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 5000"
            ></a-entity>
        </a-marker>

        <a-marker type="pattern" url="markers/mimarcador.patt">
            <a-entity
            gltf-model="url(models/modelo2.glb)"
            scale="8 8 8"
            position="0 0 0"
            animation="property: rotation; to: 0 360 0; loop: true; dir: reverse; dur: 7000"
            ></a-entity>
        </a-marker>

        <a-entity camera></a-entity>
        <audio id="markerSound" src="sound.mp3" preload="auto"></audio>
    </a-scene>
```

---

## 📊 Resultados Visuales

![deteccion](./resultados/visualizacion_modelo_arjs.gif)
![deteccion](./resultados/visualizacion_modelo_arjs_2.gif)

---

## 🧩 Prompts Usados

Enumera los prompts utilizados:

```text
"Crea un marker personalizado para una escena de AR.js"
```

---

## 💬 Reflexión Final

En este taller se aprendió cómo se pueden utilizar las herramientas de AR.js y Three.js para mostrar modelos de realidad aumentada a partir de la cámara del navegador, sólamente utilizando una estructura html básica, ya que AR se encarga de lo demás, viendo además que es posible personalizar los markers y las figuras a renderizar, que pueden ser figuras básicas o modelos más complejos importados. Una dificultad del taller es el escáneo de los markers, ya que algunos factores cómo la calidad de la imagen, el brillo de la pantalla, el reflejo, y demás, afectan cómo se identifica el patrón.

---

## ✅ Checklist de Entrega

- [x] Carpeta `YYYY-MM-DD_nombre_taller`
- [x] Código limpio y funcional
- [x] GIF incluido con nombre descriptivo (si el taller lo requiere)
- [x] Visualizaciones o métricas exportadas
- [x] README completo y claro
- [x] Commits descriptivos en inglés

---
