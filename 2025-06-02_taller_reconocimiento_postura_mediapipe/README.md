# 🧪 Taller - Reconocimiento de Acciones Simples con Detección de Postura

## 📅 Fecha

`2025-06-20` – Fecha de realización

---
## 🎯 Objetivo del Taller

Implementar el reconocimiento de acciones simples como levantar los brazos, sentarse o caminar frente a cámara, usando la librería MediaPipe Pose para detectar landmarks corporales. La aplicación responde con retroalimentación visual y sonora.

---

## 🧠 Conceptos Aprendidos

¿Qué es el reconocimiento de acciones con detección de postura?
El reconocimiento de acciones humanas consiste en analizar la postura corporal en tiempo real para identificar gestos o comportamientos específicos, como levantar los brazos, sentarse o caminar. Usar landmarks corporales permite traducir posiciones físicas a reglas lógicas que pueden ser procesadas por un sistema.

Este taller me permitió aplicar y consolidar varios conceptos clave de visión por computadora y lógica de comportamiento:

-[x] MediaPipe Pose: para detectar en tiempo real 33 puntos clave del cuerpo humano (muñecas, caderas, rodillas, tobillos, etc.) a partir de una imagen de video.

-[x] Landmarks y coordenadas relativas: el sistema representa cada punto como una coordenada normalizada (x, y, z) y se transforma en coordenadas absolutas del frame para su análisis.

-[x] Condiciones lógicas basadas en anatomía: como muñecas < nariz para brazos arriba, o caderas > rodillas para determinar si la persona está sentada.

-[x] Reconocimiento temporal de movimiento: especialmente en la acción de caminar, que requiere analizar el cambio de posición alternante de los tobillos a lo largo del tiempo.

-[x] Retroalimentación multimodal: al incluir tanto una señal visual (texto en pantalla) como una respuesta sonora con pygame, se logró una experiencia más interactiva y clara para el usuario.

-[x] Control de ruido y falsos positivos: se implementaron buffers de persistencia (como el contador de caminata) para evitar cambios erróneos en la detección por movimientos súbitos o casuales.

-[x] Procesamiento en tiempo real con OpenCV: para capturar, transformar, analizar y visualizar cada frame sin interrupciones, mostrando tanto la postura como la acción reconocida.

Este enfoque me permitió entender cómo diseñar un sistema interactivo basado en lenguaje corporal, integrando lógica, visión por computadora y retroalimentación en un flujo continuo.

---

## 🔧 Herramientas y Entornos

- Python 3.10
- OpenCV
- MediaPipe
- pygame (para sonido)
- VSCode / Jupyter Notebooks

---

## 📁 Estructura del Proyecto

```text
2025-06-20_taller_reconocimiento_postura_mediapipe/
├── python/
│ ├── taller_reconocimiento_postura.ipynb
│ └── beep.wav
├── results/
│ ├── result_posture.gif
├── README.md
```
---

## 🧪 Implementación

### 🧠 Acciones Reconocidas

- **Brazos arriba**: ambos brazos están por encima de la cabeza.
- **Sentado**: la cadera está por debajo de las rodillas.
- **Caminando**: alternancia vertical en la posición de los tobillos.

Se muestra la acción detectada en pantalla y se reproduce un sonido si se levantan ambos brazos.

### 🎥 Captura y Detección de Postura

Se usa OpenCV para capturar video desde la webcam, y se inicializa el modelo Pose de MediaPipe para detectar los 33 puntos clave (landmarks) del cuerpo por cada frame.

```python
cap = cv2.VideoCapture(0)
pose = mp_pose.Pose()
```

El frame es convertido a RGB, procesado por MediaPipe y los puntos clave son extraídos:

```python
frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
resultados = pose.process(frame_rgb)
```

### 🧠 Reglas para Reconocimiento de Acciones

-[x] Levantar brazos

Se verifica si ambas muñecas (`LEFT_WRIST`, `RIGHT_WRIST`) están por encima de la nariz (`NOSE`) en el eje Y (menor valor en píxeles → más arriba):

```python
if lw_y < nose_y and rw_y < nose_y:
    accion = "¡Ambos brazos arriba!"
    if accion != accion_anterior:
        sound.play()  # feedback sonoro
```

-[x] Caminando

La caminata se detecta con una lógica que analiza la alternancia vertical entre los tobillos (`LEFT_ANKLE`, `RIGHT_ANKLE`). Se considera que hay un paso si:

* Cambia la dirección del movimiento (signo del delta).

* Hay una diferencia vertical considerable entre los tobillos.

* Esa diferencia es distinta a la anterior (evita duplicados por oscilación).

Si se cumple, se activa un contador que mantiene la acción de “Caminando” por algunos frames consecutivos:

```python
diff_pies = lankle_y - rankle_y
cambio_signo = paso_anterior is not None and (diff_pies * paso_anterior) < 0
diferencia_suficiente = paso_anterior is not None and abs(diff_pies - paso_anterior) > 30
tobillos_no_juntos = abs(diff_pies) > 20

if cambio_signo and diferencia_suficiente and tobillos_no_juntos:
    alternancia += 1
    contador_caminata = DURACION_CAMINATA

paso_anterior = diff_pies

if contador_caminata > 0:
    accion = "Caminando"
    contador_caminata -= 1
```

Esto evita falsos positivos y permite que la postura “Caminando” se mantenga unos segundos mientras continúa el movimiento alternante.

-[x] Sentado

Se considera que la persona está sentada si ambas caderas (`LEFT_HIP`, `RIGHT_HIP`) están por debajo de las rodillas (`LEFT_KNEE`, `RIGHT_KNEE`):

```python
elif lhip_y > lknee_y and rhip_y > rknee_y:
    accion = "Sentado"
```

### 🔊 Retroalimentación visual y sonora

* **Visual:** se muestra el nombre de la acción con cv2.putText.

* **Sonora:** se reproduce un sonido (ding.wav) al detectar brazos arriba:

```python
cv2.putText(frame, accion, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
sound = pygame.mixer.Sound("ding.wav")  # cargado previamente
```

### 🌀 Dibujo de landmarks

MediaPipe permite visualizar la estructura del cuerpo usando `draw_landmarks`:

```python
drawing.draw_landmarks(frame, resultados.pose_landmarks, mp_pose.POSE_CONNECTIONS)
```

### ⌨️ Control por teclado

Presionando q, el sistema se cierra>:

```python
if cv2.waitKey(1) & 0xFF == ord('q'):
    break
```


## 📊 Resultados Visuales

### Demostración práctica del taller

![alt text](results/result_posture.gif)

---

## 🧩 Prompts Usados

Se realizan las siguientes consultas a la IA ChatGPT durante el desarrollo:

```text
¿Cómo puedo usar MediaPipe Pose para obtener las coordenadas de hombros, cadera y rodillas en tiempo real?
```

```text
Quiero detectar si una persona está sentada basándome en la altura de las caderas con respecto a las rodillas. ¿Cómo puedo expresarlo en código?
```

```text
¿Cómo detecto si una persona levanta ambos brazos por encima de la cabeza usando MediaPipe y OpenCV?
```

```text
¿Puedo reproducir un sonido con pygame en Python cuando una acción se detecta?
```

---

## 💬 Reflexión Final

Este taller me permitió aplicar técnicas de visión por computadora para reconocer acciones humanas simples en tiempo real, usando MediaPipe Pose y lógica basada en landmarks.

La acción más fácil de detectar fue levantar ambos brazos, gracias a la claridad y estabilidad de los puntos de muñecas y nariz. La condición fue simple y generó muy pocos falsos positivos.

En contraste, caminar fue la más difícil de detectar, ya que requiere interpretar el movimiento alternado de los tobillos a lo largo del tiempo. A pesar de implementar una lógica con memoria y persistencia, se presentaron algunos falsos positivos cuando la persona estaba de pie con movimientos leves.

Integrar retroalimentación sonora con pygame mejoró la experiencia, haciendo más clara la detección de acciones.

En resumen, este ejercicio reforzó cómo traducir geometría corporal en decisiones lógicas y resaltó la importancia de incorporar análisis temporal para detectar acciones dinámicas de forma más robusta.