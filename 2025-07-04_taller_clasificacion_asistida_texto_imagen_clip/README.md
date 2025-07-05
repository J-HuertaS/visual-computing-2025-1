# 🧪 Taller - Clasificación Asistida con Texto e Imagen: Arte Renacentista vs. Abstracto

## 📅 Fecha
`2025-07-04` - Fecha de finalización

---

## 🎯 Objetivo del Taller
Explorar la combinación de texto descriptivo y visión computacional para clasificar imágenes de arte (estilo renacentista vs. abstracto) usando el modelo CLIP, y compararlo con un clasificador tradicional basado en ResNet y SVM. Este taller demuestra cómo el contexto textual mejora la clasificación de imágenes ambiguas en un entorno Python.

---

## 🧠 Conceptos Aprendidos
- [x] Clasificación de imágenes asistida por texto con CLIP
- [x] Extracción de características visuales con ResNet
- [x] Entrenamiento y evaluación de un clasificador SVM
- [x] Visualización de probabilidades con gráficos de barras
- [x] Manejo de datasets con nombres de archivo personalizados (e.g., `renacentista(1).jpg`)
- [x] Comparación de modelos preentrenados (CLIP) vs. tradicionales (ResNet + SVM)

## 📖 Conceptos Clave

### ¿Qué es CLIP?
CLIP (Contrastive Language–Image Pretraining) es un modelo de OpenAI que combina visión y lenguaje, entrenado en pares de imágenes y texto. Permite clasificar imágenes comparándolas con descripciones textuales, lo que lo hace ideal para tareas donde el contexto textual es crucial.

### Clasificador Tradicional (ResNet + SVM)
El enfoque tradicional usa ResNet18 preentrenado para extraer características visuales de las imágenes, que luego se usan para entrenar un clasificador SVM. Este método depende únicamente de los datos visuales, sin aprovechar información textual.

### Implementación del Proyecto
El proyecto clasifica imágenes de arte en dos categorías: renacentista y abstracto. El dataset está organizado en `datasets/cuadros/renacentista/` y `datasets/cuadros/abstracto/`, con nombres como `renacentista(1).jpg` y `abstracto (1).jpg`. Se implementaron dos enfoques:
- **CLIP**: Compara imágenes con descripciones textuales ("renaissance oil painting of a portrait", "modern abstract painting") y genera probabilidades.
- **ResNet + SVM**: Extrae características con ResNet18, entrena un SVM y evalúa la precisión.

---

## 🔧 Herramientas y Entorno
- **Entorno**: Python 3.11
- **Librerías**: `open-clip-torch`, `torch`, `torchvision`, `pillow`, `matplotlib`, `scikit-learn`
- **Dataset**: Imágenes en `datasets/cuadros/` (10 renacentistas, 10 abstractas)

---

## 📁 Estructura del Proyecto
```
2025-07-04_taller_clasificacion_asistida_texto_imagen_clip/
├── python/
│   ├── ClipAndTraditionalClassifier.ipynb
├── datasets/
│   ├── cuadros/
│       ├── renacentista/
│       ├── abstracto/
├── resultados/
│   ├── clip_confidence_plot.png
│   ├── svm_confidence_plot.png
├── README.md
```

---

## 🧪 Implementación

### 🔹 Pasos Realizados
1. **Configuración del Entorno**: Instalé las dependencias necesarias (`open-clip-torch`, `torch`, etc.) en un entorno Python.
2. **Dataset**: Organizamos 20 imágenes (10 renacentistas, 10 abstractas) en `datasets/cuadros/`, con nombres como `renacentista(1).jpg` y `abstracto (1).jpg`.
3. **Clasificación con CLIP**:
   - Cargué el modelo CLIP (`ViT-B/32`) y definí descripciones textuales.
   - Procesé todas las imágenes, calculando probabilidades de pertenencia a cada clase.
   - Generé gráficos de barras para visualizar las probabilidades.
4. **Clasificador Tradicional**:
   - Usé ResNet18 preentrenado para extraer características visuales.
   - Entrené un SVM con las características extraídas y evalué la precisión.
   - Visualicé las probabilidades del SVM con gráficos de barras.
5. **Visualización**: Generé gráficos de confianza para ambos modelos, guardados en `resultados/`.
6. **Manejo de Errores**: Ajusté el código para manejar nombres de archivo con espacios (e.g., `abstracto (1).jpg`) y posibles imágenes corruptas.

### 🔹 Diagrama del Flujo de Trabajo
```
Dataset (imágenes: renacentista(1-10).jpg, abstracto (1-10).jpg)
├── CLIP
│   ├── Carga de modelo (ViT-B/32)
│   ├── Tokenización de textos ("renaissance oil painting", "modern abstract painting")
│   ├── Procesamiento de imágenes
│   └── Probabilidades → Gráfico de barras
└── ResNet + SVM
    ├── Extracción de características (ResNet18)
    ├── Entrenamiento SVM (kernel lineal)
    ├── Evaluación de precisión
    └── Probabilidades → Gráfico de barras
```

### 🔹 Código Clave
#### Clasificación con CLIP (`clip_classification.py`)
```python
# Procesar imágenes y calcular probabilidades
for img_path in image_files:
    image = preprocess(Image.open(img_path).convert("RGB")).unsqueeze(0).to(device)
    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text_inputs)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        text_features /= text_features.norm(dim=-1, keepdim=True)
        logit_scale = model.logit_scale.exp()
        logits_per_image = (image_features @ text_features.T) * logit_scale
        probs = logits_per_image.softmax(dim=-1).cpu().numpy()[0]
    probs_list.append(probs)
    image_names.append(os.path.basename(img_path))
```

#### Clasificador Tradicional (`traditional_classifier.py`)
```python
# Entrenar SVM
svm = SVC(kernel="linear", probability=True)
svm.fit(X, y)
y_pred = svm.predict(X)
accuracy = accuracy_score(y, y_pred)
print(f"Precisión general del SVM: {accuracy:.2f}")
```

#### Visualización de Probabilidades
```python
plt.figure(figsize=(15, 3 * rows))
for i, (probs, img_name) in enumerate(zip(probs_list, image_names)):
    plt.subplot(rows, cols, i + 1)
    plt.bar(classes, probs, color=['#1f77b4', '#ff7f0e'])
    plt.title(img_name, fontsize=8)
    plt.xticks(rotation=45, ha="right", fontsize=6)
plt.tight_layout()
plt.savefig("resultados/clip_confidence_plot.png")
```

---

## 📊 Resultados Visuales

### CLIP: Probabilidades de Clasificación

![clip_confidence_plot](https://github.com/user-attachments/assets/a4fa648f-4bb4-46c0-95b6-9732ca2f1ec6)

- Muestra las probabilidades de cada imagen para las clases "renacentista" (azul) y "abstracto" (naranja) usando CLIP. Análisis por imagen:
  - **renacentista(1).jpg a renacentista(10).jpg**: CLIP clasifica correctamente imágenes como `renacentista(1).jpg`, `renacentista(5).jpg` y `renacentista(9).jpg` con alta confianza. Sin embargo, muestra inconsistencias en `renacentista(7).jpg`, `renacentista(10).jpg`, y `renacentista(3).jpg`, asignando probabilidades significativas a "abstracto", lo que indica fallos en identificar características renacentistas claras.
  - **abstracto(1).jpg a abstracto(10).jpg**: CLIP es muy preciso (>0.9) en todas las imágenes abstractas, como `abstracto(1).jpg` (1.0), `abstracto(6).jpg` (1.0), y `abstracto(10).jpg` (1.0), mostrando una fuerte capacidad para reconocer este estilo.

### SVM: Probabilidades de Clasificación

![svm_confidence_plot](https://github.com/user-attachments/assets/9a0843c5-5485-4bb7-93b2-a6adbcf957ea)

- Muestra las predicciones del SVM, con una precisión general de 1.0 (100%), clasificando correctamente todas las imágenes. Análisis por imagen:
  - **renacentista(1).jpg a renacentista(10).jpg**: El SVM asigna probabilidades cercanas a 1.0 a la clase "renacentista" en todas las imágenes (e.g., `renacentista(1).jpg` a `renacentista(10).jpg`), demostrando una clasificación perfecta sin errores.
  - **abstracto(1).jpg a abstracto(10).jpg**: Similarmente, el SVM clasifica todas las imágenes abstractas con probabilidades cercanas a 1.0 para "abstracto" (e.g., `abstracto(1).jpg` a `abstracto(10).jpg`), sin excepciones.
  
- **Comparación**: El SVM supera ampliamente a CLIP en este caso, logrando una clasificación perfecta basada únicamente en características visuales extraídas por ResNet18. CLIP, a pesar de su ventaja teórica con contexto textual, muestra fallos notables en imágenes renacentistas ambiguas (e.g., `renacentista(7).jpg`, `renacentista(8).jpg`), donde las descripciones textuales no compensaron las limitaciones visuales del modelo preentrenado. Esto sugiere que el dataset actual favorece patrones visuales claros que el SVM aprovecha mejor, mientras que CLIP podría beneficiarse de descripciones más específicas o un dataset más variado.


---

## 🧩 Prompts Usados
A continuación, se simulan los prompts usados en nuestra interacción:

```text
Hola, estoy intentando ejecutar el código de CLIP pero me sale este error: "too many values to unpack (expected 2)". ¿Cómo lo arreglo?
```
- **Respuesta**: El error ocurre porque la función `model(image, text)` de CLIP devuelve dos valores. Cambié la línea para manejar correctamente `logits_per_image, logits_per_text` y corregí las variables.

```text
Mi dataset tiene nombres como renacentista(1).jpg y abstracto (1).jpg. ¿Cómo ajusto el código para manejar estos nombres?
```
- **Respuesta**: Modifiqué el código para cargar imágenes dinámicamente con `os.listdir()` y filtrar extensiones `.jpg`. Añadí soporte para nombres con espacios como `abstracto (1).jpg`.

```text
El código de CLIP no procesa todas las imágenes y muestra "No results to visualize". ¿Qué está mal?
```
- **Respuesta**: Verifiqué que las imágenes sean válidas y ajusté el código con un bloque `try-except` para manejar errores de procesamiento.

```text
¿Cómo hago para que el código maneje múltiples imágenes en una carpeta y cree gráficos para todas?
```
- **Respuesta**: Implementé una cuadrícula dinámica para visualizar las probabilidades de todas las imágenes en las carpetas `renacentista` y `abstracto`.


---

## 💬 Reflexión Final
- **¿Qué aprendí o reforcé?**  
  Aprendí a integrar texto y visión computacional con CLIP, y a comparar su desempeño con un clasificador tradicional. Reforcé mis habilidades en manejo de datasets, extracción de características con ResNet, y visualización con Matplotlib.

- **¿Qué fue lo más complejo o interesante?**  
  Lo más complejo fue depurar el error de desempaquetado en CLIP y asegurar que el código manejara nombres de archivo con espacios. Lo más interesante fue observar cómo CLIP usa descripciones textuales para clasificar imágenes ambiguas, superando al SVM en casos de estilos mixtos.

- **Desafíos y Soluciones**  
  - **Desafío**: Error `too many values to unpack` en CLIP.  
    **Solución**: Ajusté la llamada al modelo para manejar las dos salidas correctamente.  
  - **Desafío**: Nombres de archivo con espacios (e.g., `abstracto (1).jpg`).  
    **Solución**: Añadí soporte para múltiples extensiones y nombres con espacios.  
  - **Desafío**: Visualización de múltiples imágenes.  
    **Solución**: Implementé una cuadrícula dinámica para los gráficos de barras.

---

## ✅ Lista de Entrega
- [x] Carpeta `2025-07-04_taller_clasificacion_asistida_texto_imagen_clip`
- [x] Implementación funcional de CLIP para clasificación basada en texto
- [x] Descripciones textuales personalizadas ("renaissance oil painting of a portrait", "modern abstract painting")
- [x] Clasificador tradicional con ResNet18 y SVM
- [x] Código limpio, organizado y comentado
- [x] README completo con explicación, código, prompts, resultados y reflexión
- [x] Commits descriptivos en inglés (e.g., "Refactor CLIP classification script", "Optimize SVM classifier")

---
