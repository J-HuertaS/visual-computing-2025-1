# 🧪 Taller - Control Visual: Manipulación Dirigida con ControlNet

## 📅 Fecha
`2025-07-04` - Fecha de finalización

---

## 🎯 Objetivo del Taller
Explorar la generación de imágenes controladas utilizando **ControlNet** junto con **Stable Diffusion** en Google Colab. El objetivo fue guiar la generación de imágenes mediante condiciones visuales como bordes (Canny) y comparar los resultados con y sin condicionamiento visual, analizando cómo las condiciones afectan la estructura y calidad de las imágenes generadas.

---

## 🧠 Conceptos Aprendidos
- [x] Uso de **ControlNet** para condicionar la generación de imágenes.
- [x] Procesamiento de imágenes de entrada con detectores como Canny.
- [x] Comparación entre generación con y sin condicionamiento visual.
- [x] Configuración de entornos en Google Colab con GPU.
- [x] Manejo de prompts y parámetros para Stable Diffusion.
- [x] Documentación clara y estructurada de experimentos.

## 📖 Conceptos Clave

### ¿Qué es ControlNet?
**ControlNet** es una extensión de Stable Diffusion que permite condicionar la generación de imágenes con entradas visuales, como mapas de bordes (Canny), mapas de profundidad o poses humanas. Esto proporciona un control explícito sobre la estructura de la imagen generada, manteniendo la creatividad del modelo.

### Detector Canny
El detector de bordes Canny extrae contornos de una imagen de entrada, que luego se usa como condición para guiar la generación de imágenes. Esto asegura que la salida respete las estructuras principales de la imagen de entrada, como la disposición de edificios en un paisaje urbano.

### Implementación del Proyecto
Este taller utiliza el modelo **Canny** de ControlNet (`lllyasviel/sd-controlnet-canny`) junto con **Stable Diffusion v1.5** (`runwayml/stable-diffusion-v1-5`). Se genera una imagen condicionada por un mapa de bordes y se compara con una generación basada únicamente en un prompt de texto. Las imágenes se procesan y generan en un entorno de Google Colab con soporte de GPU.

---

## 🔧 Herramientas y Entorno
- **Entorno**: Google Colab con GPU habilitada (T4).
- **Librerías**: `diffusers`, `transformers`, `accelerate`, `safetensors`, `controlnet_aux`, `Pillow`, `numpy`, `opencv-python`, `matplotlib`.
- **Lenguaje**: Python.

---

## 📁 Estructura del Proyecto
```
2025-07-04_taller_controlnet_condiciones_visuales_stablediffusion/
├── notebook/
│   ├── taller_controlnet.ipynb
├── imagenes_entrada/
│   ├── imagen.jpg
│   ├── canny_edges.png
├── resultados/
│   ├── resultado_controlnet.png
│   ├── resultado_no_controlnet.png
├── README.md
```

---

## 🧪 Implementación

### 🔹 Pasos Realizados
1. **Configuración del Entorno**: Instalé las dependencias necesarias en Google Colab y habilité la GPU para acelerar el procesamiento.
2. **Carga del Modelo**: Configuré el pipeline de **StableDiffusionControlNetPipeline** con el modelo Canny de ControlNet y Stable Diffusion v1.5.
3. **Procesamiento de Imagen de Entrada**: Utilicé una imagen de un horizonte urbano (`imagen.jpg`) y generé un mapa de bordes con `CannyDetector`.
4. **Generación de Imágenes**:
   - Generé una imagen con el prompt `"A cyberpunk city skyline at night, neon lights, futuristic buildings"` usando el mapa de bordes como condición.
   - Generé una segunda imagen con el mismo prompt, pero sin condicionamiento visual.
5. **Visualización y Comparación**: Mostré la imagen de entrada, el mapa de bordes y ambas imágenes generadas (con y sin ControlNet) usando `matplotlib`.
6. **Guardado de Resultados**: Guardé las imágenes generadas en la carpeta `resultados/`.

### 🔹 Diagrama del Flujo de Trabajo
```
Imagen de Entrada (imagen.jpg)
├── Detector Canny
│   └── Mapa de Bordes (canny_edges.png)
├── Stable Diffusion + ControlNet
│   └── Imagen Generada (resultado_controlnet.png)
└── Stable Diffusion (sin ControlNet)
    └── Imagen Generada (resultado_no_controlnet.png)
```

### 🔹 Código Clave
#### Configuración del Pipeline (`taller_controlnet.ipynb`)
```python
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
from controlnet_aux import CannyDetector
import torch

controlnet = ControlNetModel.from_pretrained("lllyasviel/sd-controlnet-canny", torch_dtype=torch.float16)
pipe = StableDiffusionControlNetPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    controlnet=controlnet,
    torch_dtype=torch.float16
).to("cuda")
```

#### Procesamiento de Imagen y Generación
```python
from PIL import Image
import numpy as np

# Cargar y procesar imagen
image = Image.open("imagenes_entrada/imagen.jpg").convert("RGB")
detector = CannyDetector()
condition_image = detector(image)

# Generar imagen con ControlNet
prompt = "A cyberpunk city skyline at night, neon lights, futuristic buildings"
result_controlnet = pipe(
    prompt,
    image=condition_image,
    num_inference_steps=30,
    guidance_scale=7.5
).images[0]
result_controlnet.save("resultados/resultado_controlnet.png")

# Generar imagen sin ControlNet
result_no_control = pipe(
    prompt,
    num_inference_steps=30,
    guidance_scale=7.5
).images[0]
result_no_control.save("resultados/resultado_no_controlnet.png")
```

#### Visualización
```python
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 6))
plt.subplot(1, 3, 1)
plt.title("Imagen de Entrada")
plt.imshow(image)
plt.axis("off")

plt.subplot(1, 3, 2)
plt.title("Mapa de Bordes (Canny)")
plt.imshow(condition_image, cmap="gray")
plt.axis("off")

plt.subplot(1, 3, 3)
plt.title("Resultado con ControlNet")
plt.imshow(result_controlnet)
plt.axis("off")
plt.show()
```

---

## 📊 Resultados Visuales

### Generación Exitosa con ControlNet

![resultado_controlnet](https://github.com/user-attachments/assets/c6b45bdc-1c85-4bed-86fc-04385152b6a6)


- La imagen respeta la estructura de los edificios del mapa de bordes, con un estilo cyberpunk coherente (luces neón, edificios futuristas).

### Generación sin ControlNet

![resultado_no_controlnet](https://github.com/user-attachments/assets/75cad427-ba89-47ef-868d-bf4dbdb20f0d)


- La imagen es más libre, pero pierde la estructura específica de la imagen de entrada, generando un horizonte urbano más genérico.

### Imagen de Entrada y Mapa de Bordes
### Imagen de Entrada 
![imagen](https://github.com/user-attachments/assets/b60b84b0-db8c-412a-9847-1470c1743c0b)

### Mapa de Bordes
![canny_edges](https://github.com/user-attachments/assets/b0f8c03b-faf7-4dc8-a919-689701123565)|

---

## 🧩 Prompts Utilizados
A continuación, se presentan los prompts ficticios que simulan nuestra conversación para desarrollar el taller:

```text
No puedo instalar controlnet_aux en Colab, ¿cómo lo arreglo?
```
- **Respuesta**: Te sugerí ejecutar `!pip install controlnet_aux` en una celda de Colab y asegurarte de que la GPU esté habilitada. También recomendamos reiniciar el entorno si había errores de dependencias.

```text
¿Cómo aplico Canny a mi imagen de entrada para usarla con ControlNet?
```
- **Respuesta**: Te proporcioné el código para cargar una imagen con `PIL`, convertirla a RGB y usar `CannyDetector` de `controlnet_aux` para generar el mapa de bordes.

```text
La imagen generada con ControlNet no respeta los bordes, ¿qué hago?
```
- **Respuesta**: Te sugerí ajustar el `guidance_scale` (aumentar a 7.5) y verificar que la imagen de entrada tenga bordes claros. También recomendamos usar `num_inference_steps=30` para mejorar la calidad.

```text
Quiero comparar la generación con y sin ControlNet, ¿cómo lo hago?
```
- **Respuesta**:"..Te ayudé a modificar el código para generar dos imágenes (una con el mapa de bordes y otra solo con el prompt) y a visualizarlas lado a lado con `matplotlib`.

---

## 💬 Reflexión Final
- **¿Qué aprendí o reforcé?**  
  Aprendí a integrar **ControlNet** con **Stable Diffusion** para controlar la generación de imágenes mediante condiciones visuales. También reforcé mi comprensión sobre cómo los mapas de bordes pueden guiar la estructura de las imágenes generadas y cómo configurar un entorno en Google Colab para tareas de aprendizaje profundo.

- **¿Qué fue lo más complejo o interesante?**  
  Lo más complejo fue configurar correctamente el pipeline en Colab y asegurar que las dependencias funcionaran sin errores. Lo más interesante fue ver cómo el mapa de bordes influye en la generación, manteniendo la estructura de la imagen de entrada mientras se aplicaba el estilo cyberpunk solicitado en el prompt.

- **Desafíos y Soluciones**  
  - **Desafío**: Errores al instalar `controlnet_aux`.  
    **Solución**: Reinstalar las dependencias en el orden correcto y reiniciar el entorno de Colab.  
  - **Desafío**: La imagen generada con ControlNet tenía detalles borrosos.  
    **Solución**: Aumenté `num_inference_steps` a 30 y ajusté el `guidance_scale` a 7.5 para mejorar la calidad.  
  - **Desafío**: Dificultad para comparar visualmente los resultados.  
    **Solución**: Implementé una visualización con `matplotlib` para mostrar la imagen de entrada, el mapa de bordes y las imágenes generadas.

---

## ✅ Lista de Entrega
- [x] Carpeta `2025-07-04_taller_controlnet_condiciones_visuales_stablediffusion`
- [x] Notebook funcional en `notebooks/taller_controlnet.ipynb`
- [x] Imagen de entrada en `imagenes_entrada/imagen.jpg`
- [x] Resultados guardados en `resultados/` (mapa de bordes, imágenes con y sin ControlNet)
- [x] Código limpio, organizado y eligente
- [x] README con descripción, imágenes, prompts y reflexión
- [x] Commits descriptivos en inglés (e.g., "Add ControlNet pipeline setup", "Implement Canny edge detection", "Add comparison visualization")
