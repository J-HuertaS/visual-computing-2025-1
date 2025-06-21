# 🧪 Taller - Cámara en Vivo: Captura y Procesamiento de Video en Tiempo Real con YOLO

## 📅 Fecha
`2025-06-20` – Fecha de realización

---
## 🎯 Objetivo del Taller

Conectar la cámara web del PC y procesar el video en tiempo real usando Python, OpenCV y YOLO para aplicar filtros visuales y realizar detección de objetos en vivo. Este taller combina técnicas de visión artificial clásica con modelos de detección basados en aprendizaje profundo.

---
## 🧠 Conceptos Aprendidos

- [x] Captura de video en tiempo real con cv2.VideoCapture.

- [x] Aplicación de filtros clásicos: escala de grises, binarización, bordes.

- [x] Uso de modelos YOLOv8 para detección de objetos.

- [x] Dibujar cajas, etiquetas y confianza sobre el video en vivo.

- [x] Controles con teclado para manipular la visualización.

- [x] Gestión de múltiples ventanas sincronizadas en OpenCV.

- [x] Grabación condicional de imágenes y clips de video.

- [x] Lógica condicional basada en los objetos detectados (conteo y respuesta).
---

## 🔧 Herramientas y Entornos

Especifica los entornos usados:

- Python (`ultralytics`, `opencv-python`, `numpy`)
- Visual Studio Code con soporte para Python

---

## 📁 Estructura del Proyecto

```
2025-06-20_taller_camara_en_vivo_yolo_opencv/
├── python/
├── README.md
```

---

## 🧪 Implementación

### 🎥 Captura y Procesamiento en Tiempo Real con YOLO

El sistema abre la cámara web del PC usando OpenCV y procesa cada frame en vivo. Se integró YOLOv8 a través de la librería `ultralytics` para realizar detección de objetos en tiempo real.

### 🧰 Flujo General

1. Se inicializa el modelo YOLO y se abre la webcam con cv2.VideoCapture(0).

2. Cada frame es procesado por YOLOv8 para detectar objetos.

3. Se aplican filtros visuales clásicos: escala de grises, binarización y detección de bordes.

4. Se muestran en ventanas paralelas:

   * La detección con cajas y etiquetas.

   * El filtro aplicado.

5. Se permite controlar la aplicación con el teclado:

   * Cambiar filtros (f).

   * Pausar (p).

   * Guardar una imagen (s) o grabar video (v).

6. **Bonus implementado:** Si YOLO detecta un celular, el filtro se cambia automáticamente.

### 🧠 Lógica del Bonus

En el bucle principal se revisa si alguno de los objetos detectados es un "cell phone". Si es así, se cambia el filtro automáticamente con `filtro_actual = (filtro_actual + 1) % 4`.

Esto permite una respuesta reactiva del sistema a objetos detectados, combinando visión artificial con lógica condicional.

### 🧩 Fragmento de código clave

```python
# Detectar si hay un celular en escena
celular_detectado = False

for r in resultados.boxes:
    cls = model.names[int(r.cls[0])]
    if cls.lower() in ["cell phone", "mobile phone", "telefono celular"]:
        celular_detectado = True

# Cambiar filtro si se detecta celular
if celular_detectado:
    filtro_actual = (filtro_actual + 1) % 4
```

Esta lógica se integra al pipeline general, justo después del procesamiento de detección con YOLO.
---

## 📊 Resultados Visuales

### Demostración práctica

![alt text](python/results_yolo_filters.gif)

---

## 🧩 Prompts Usados

```text
Estoy usando YOLOv8 con Python y OpenCV. ¿Cómo puedo capturar video en tiempo real y aplicar detección de objetos sobre cada frame?
```

```text
¿Cómo aplico filtros clásicos (escala de grises, binarización, bordes) con OpenCV y muestro cada resultado en una ventana separada?
```

```text
Quiero controlar la reproducción de video en OpenCV con el teclado: pausar, cambiar filtros y guardar capturas. ¿Cómo implemento eso?
```

```text
¿Cómo uso ultralytics YOLOv8 en Python para detectar objetos y dibujar cajas y etiquetas en tiempo real?
```

```text
Quiero que el sistema detecte un objeto específico (por ejemplo, un celular) y ejecute una acción, como cambiar el filtro visual. ¿Cómo hago eso con YOLO y OpenCV?
```

---

## 💬 Reflexión Final

Este taller fue una excelente introducción práctica a la visión artificial en tiempo real, combinando detección de objetos con redes neuronales (YOLOv8) y procesamiento clásico de imágenes (OpenCV). Me permitió comprender cómo se puede capturar video desde la webcam, procesarlo frame a frame y aplicar detección visual eficiente usando modelos preentrenados de Deep Learning.

Uno de los aspectos más interesantes fue la modularidad del sistema: cada parte (captura, filtro, detección, visualización, grabación) puede controlarse de forma independiente, pero también se integra armoniosamente en una aplicación fluida.

Además, se exploró un comportamiento reactivo mediante una condición condicional: si se detecta un celular en escena, el sistema cambia automáticamente el filtro visual aplicado. Esta lógica abre la puerta a sistemas más inteligentes, donde la detección no solo sirve para visualizar, sino que desencadena acciones dentro del flujo del programa, simulando cierto nivel de decisión.

YOLOv8 resultó bastante eficiente para tareas en tiempo real, detectando objetos comunes como personas, celulares, sillas y monitores con buena precisión incluso en un equipo estándar. No obstante, la velocidad y calidad dependen del modelo usado (`yolov8n.pt` fue elegido por su rapidez).

En conclusión, esta práctica fortaleció mis habilidades en visión por computadora, modelado de interacciones en tiempo real, y me dejó con ideas claras sobre cómo construir sistemas inteligentes más complejos en futuras implementaciones.
