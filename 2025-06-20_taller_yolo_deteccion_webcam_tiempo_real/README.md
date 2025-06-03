# 🧪 Taller - Detección de Objetos en Tiempo Real con YOLOv8 y Webcam

## 📅 Fecha
`2025-06-03` – Fecha de entrega o realización

---
## 🎯 Objetivo del Taller

Implementar un sistema de detección de objetos en tiempo real utilizando el modelo preentrenado YOLOv8 (`yolov8n.pt`) y capturando video desde la webcam. El objetivo es explorar la eficiencia del modelo (midiendo FPS), su precisión al detectar clases específicas como personas, botellas, bolígrafos y vasos, y visualizar los resultados en una interfaz interactiva.

---
## 🧠 Conceptos Aprendidos

Lista los principales conceptos aplicados:

- [x] Detección de objetos en tiempo real
- [x] Procesamiento de video con OpenCV
- [x] Uso de modelos preentrenados (YOLOv8)
- [x] Medición de rendimiento (FPS)
---

## 🔧 Herramientas y Entornos

Especifica los entornos usados:

- Python (`ultralytics`, `opencv-python`, `torch`, `numpy`)
- Visual Studio Code con soporte para Python

---

## 📁 Estructura del Proyecto

```
2025-06-03_taller_deteccion_yolo_webcam/
├── python/               
│   ├── identifier.py     
│   ├── yolov8n.pt        
├── resultados/          
│   ├── deteccion.gif
├── README.md
```

---

## 🧪 Implementación

Explica el proceso:

### 🔹 Etapas realizadas
1. **Preparación del entorno y datos**:
   - Se configura un entorno virtual en Python y seleccioné el intérprete correcto en Visual Studio Code.
   - Se instalan las dependencias necesarias (`ultralytics`, `opencv-python`, `torch`, `numpy`) usando un espejo de PyPI para evitar problemas de conexión.
   - Descargué manualmente el modelo `yolov8n.pt` desde el repositorio oficial de Ultralytics y lo coloqué en el directorio del proyecto.
   - Verifiqué que la webcam estuviera activa y funcional.

2. **Aplicación del modelo YOLOv8**:
   - Cargué el modelo preentrenado con `YOLO('yolov8n.pt')` utilizando la librería `ultralytics`.
   - Se configura un bucle para capturar video en tiempo real con `cv2.VideoCapture(0)`.
   - Se implementa la detección de objetos en cada frame con `model.predict()`, filtrando clases específicas como "person","cell phone", "bottle" y "cup".

3. **Visualización e interacción**:
   - Dibujé rectángulos y etiquetas en azul alrededor de los objetos detectados usando `cv2.rectangle` y `cv2.putText`.
   - Mostré los FPS en la esquina superior izquierda del frame para evaluar el rendimiento en tiempo real.
   - Permití la interacción cerrando el programa con la tecla 'q' o el botón 'X' de la ventana.

4. **Guardado de resultados**:
   - Generé un GIF animado (`deteccion.gif`) para mostrar las detecciones en acción.
   - Registré métricas como FPS promedio en la consola y capturé los resultados en el README.

### 🔹 Código relevante

Fragmento que muestra la detección y visualización de objetos:

```python
# Capturar video desde la webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: No se puede acceder a la webcam.")
    exit()

# Clases específicas a detectar 
target_classes = ["person", "bottle","cup", "cell phone"]
```

```python
# Detección y visualización en cada frame
results = model.predict(source=frame, stream=True)
for result in results:
    for box in result.boxes:
        cls = int(box.cls[0])
        class_name = model.names[cls]
        confidence = float(box.conf[0])
        if class_name not in target_classes:
            continue
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
        label = f"{class_name}: {confidence:.2f}"
        cv2.putText(annotated_frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2, cv2.LINE_AA)
```
---

## 📊 Resultados Visuales

- Se captura la detección de personas, botellas, bolígrafos y vasos en tiempo real.


```markdown
![deteccion](./resultados/deteccion.gif)
```

---

## 🧩 Prompts Usados

Enumera los prompts utilizados:

```text
"Cómo medir FPS en un script de OpenCV para procesamiento de video"
```

---

## 💬 Reflexión Final

Este taller nos permitió aprender cómo aplicar modelos preentrenados de visión por computadora como YOLOv8 para detectar objetos en tiempo real, un proceso que combina conceptos de procesamiento de imágenes y aprendizaje profundo. Fue muy interesante configurar el entorno en Python y resolver problemas de instalación de dependencias, como el uso de espejos de PyPI para superar errores de conexión. También se puso en práctica el uso de la biblioteca OpenCV para manejar video y dibujar anotaciones, además de aprender a medir el rendimiento en términos de FPS, lo que me dio una perspectiva práctica sobre la eficiencia de los modelos de IA.

La parte más compleja fue asegurar que todas las dependencias (`torch`, `ultralytics`) funcionaran correctamente en mi sistema, ya que enfrenté errores de conexión y problemas con el reconocimiento del entorno virtual en Visual Studio Code. Sin embargo, una vez resuelto, disfruté ver cómo el modelo detectaba objetos cotidianos como celulares, botellas y vasos con alta precisión. Lo más interesante fue ajustar las etiquetas para que se mostraran en azul, mejorando la visibilidad de las detecciones. En futuros proyectos, me gustaría explorar el entrenamiento de modelos personalizados más complejos para detectar objetos específicos de mi interés, como herramientas de trabajo, y optimizar aún más el rendimiento para lograr FPS más altos en hardware limitado.

---

## ✅ Checklist de Entrega

- [x] Carpeta `2025-06-03_taller_deteccion_yolo_webcam`
- [x] Código limpio y funcional
- [x] GIF incluido con nombre descriptivo (`deteccion.gif`)
- [x] Visualizaciones o métricas exportadas (FPS en consola y GIF)
- [x] README completo y claro
- [x] Commits descriptivos en inglés

