# 🧪 Taller - Embeddings Visuales: Proyectando Significados con CLIP y PCA

## 📅 Fecha
`2025-07-04` - Fecha de finalización

---

## 🎯 Objetivo del Taller
Visualizar y analizar relaciones semánticas entre imágenes usando embeddings generados por CLIP y técnicas de reducción de dimensionalidad como PCA o t-SNE. El objetivo es explorar cómo las representaciones latentes agrupan imágenes con características similares, sin utilizar etiquetas explícitas (unsupervised learning).

---

## 🧠 Conceptos Aprendidos
- [x] Generación de embeddings de imágenes con CLIP
- [x] Reducción de dimensionalidad con PCA y t-SNE
- [x] Agrupamiento no supervisado con KMeans
- [x] Visualización de relaciones semánticas en 2D con miniaturas
- [x] Integración de embeddings de texto y imágenes
- [x] Creación de animaciones GIF para transiciones de proyecciones

## 📖 Conceptos Clave

### ¿Qué son los Embeddings con CLIP?
CLIP (Contrastive Language–Image Pretraining) de OpenAI genera representaciones vectoriales de 512 dimensiones que capturan tanto características visuales como semánticas de imágenes, basándose en su entrenamiento con pares imagen-texto. Estos embeddings permiten comparar similitudes sin etiquetas explícitas.

### Reducción de Dimensionalidad (PCA y t-SNE)
- **PCA**: Proyección lineal que reduce la dimensionalidad preservando la varianza máxima, ideal para visualización inicial.
- **t-SNE**: Técnica no lineal que enfatiza la estructura local de los datos, útil para revelar agrupamientos complejos.

### Implementación del Proyecto
El proyecto utiliza CLIP para generar embeddings de imágenes de "cat", "dog" y "tree" obtenidas de Unsplash, reduce su dimensionalidad con PCA y t-SNE, y aplica KMeans para identificar clústeres. También incluye una comparación con embeddings de texto y una animación GIF que transita de t-SNE a PCA.

---

## 🔧 Herramientas y Entorno
- **Entorno**: Google Colab
- **Librerías**: `clip`, `torch`, `numpy`, `Pillow`, `matplotlib`, `scikit-learn`, `imageio`, `requests`
- **Dataset**: Imágenes descargadas de Unsplash (15 imágenes: 5 de "cat", 5 de "dog", 5 de "tree")

---

## 📁 Estructura del Proyecto
```
2025-07-04_taller_embeddings_visuales_clip_pca/
├── python/
├── images/               # Imágenes de Unsplash (cat_0.jpg a tree_4.jpg)
├── graficos/             # Resultados: pca_projection.png, tsne_projection.png, combined_projection.png, tsne_to_pca_transition.gif
├── README.md
```

---

## 🧪 Implementación

### 🔹 Pasos Realizados
1. **Configuración del Entorno**: Instalé las dependencias (`clip`, `torch`, etc.) en Colab y configuré el acceso a la API de Unsplash.
2. **Obtención de Imágenes**: Descargué 15 imágenes (5 por categoría: "cat", "dog", "tree") desde Unsplash usando una clave API.
3. **Generación de Embeddings**:
   - Cargué el modelo CLIP (`ViT-B/32`) y preprocesé las imágenes.
   - Generé embeddings de 512 dimensiones para cada imagen con `model.encode_image()`.
4. **Reducción de Dimensionalidad**:
   - Aplicé PCA y t-SNE para reducir los embeddings a 2D.
   - Usé KMeans para agrupar los datos en 3 clústeres.
5. **Visualización**:
   - Grafiqué las proyecciones PCA y t-SNE con miniaturas de las imágenes.
   - Creé un gráfico combinado de imágenes y embeddings de texto ("cat", "dog", "tree").
   - Generé un GIF animado que muestra la transición de t-SNE a PCA.
6. **Manejo de Errores**: Implementé validaciones para manejar fallos en la descarga o procesamiento de imágenes.

### 🔹 Diagrama del Flujo de Trabajo
```
Dataset (imágenes: cat_0.jpg a tree_4.jpg)
├── CLIP
│   ├── Carga del modelo (ViT-B/32)
│   ├── Preprocesamiento de imágenes
│   └── Embeddings (512D)
├── Reducción de Dimensionalidad
│   ├── PCA (2D)
│   └── t-SNE (2D)
├── Clustering
│   └── KMeans (3 clústeres)
└── Visualización
    ├── PCA y t-SNE con miniaturas
    ├── Imágenes + Texto combinados
    └── GIF de transición
```

### 🔹 Código Clave
#### Generación de Embeddings (`embeddings_visuales_clip_pca.ipynb`)
```python
# Carga y preprocesamiento
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Obtención de imágenes
image_paths = fetch_unsplash_images("cat", count=5)
image_paths.extend(fetch_unsplash_images("dog", count=5))
image_paths.extend(fetch_unsplash_images("tree", count=5))
images = [preprocess(Image.open(p).convert("RGB")).unsqueeze(0).to(device) for p in image_paths]

# Embeddings
with torch.no_grad():
    image_features = [model.encode_image(img).cpu().numpy() for img in images]
X = np.vstack(image_features)
```

#### Reducción y Visualización (`embeddings_visuales_clip_pca.ipynb`)
```python
# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# t-SNE
tsne = TSNE(n_components=2, perplexity=14, random_state=42)
X_tsne = tsne.fit_transform(X)

# Visualización PCA
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=cluster_labels, cmap='viridis', s=100)
for i, path in enumerate(image_paths):
    img = Image.open(path).resize((32, 32))
    imagebox = plt.matplotlib.offsetbox.OffsetImage(img, zoom=1)
    ab = plt.matplotlib.offsetbox.AnnotationBbox(imagebox, X_pca[i])
    plt.gca().add_artist(ab)
plt.savefig("/content/graficos/pca_projection.png")
```

#### GIF de Transición (`embeddings_visuales_clip_pca.ipynb`)
```python
# Transición t-SNE a PCA
for i in range(n_transition_frames):
    alpha = i / (n_transition_frames - 1)
    alpha_smooth = alpha ** 2
    X_interpolated = (1 - alpha_smooth) * X_tsne + alpha_smooth * X_pca
    plt.scatter(X_interpolated[:, 0], X_interpolated[:, 1], c=cluster_labels, cmap='viridis', s=100)
    for j, path in enumerate(image_paths):
        img = Image.open(path).resize((32, 32))
        imagebox = plt.matplotlib.offsetbox.OffsetImage(img, zoom=1)
        ab = plt.matplotlib.offsetbox.AnnotationBbox(imagebox, X_interpolated[j])
        plt.gca().add_artist(ab)
    plt.savefig(f"/content/graficos/frame_{i}.png", bbox_inches='tight')
imageio.mimsave("/content/graficos/tsne_to_pca_transition.gif", images_for_gif, fps=5)
```

---

## 📊 Resultados Visuales

### Proyección PCA

![pca_projection](https://github.com/user-attachments/assets/677c0f99-01c4-4727-acdb-daf47b13a7c9)

- Muestra las imágenes proyectadas en 2D con PCA, agrupadas en 3 clústeres. Las imágenes de "cat" y "dog" tienden a agruparse, mientras que "tree" forma un clúster separado.

### Proyección t-SNE

![tsne_projection](https://github.com/user-attachments/assets/8e9f57c0-de70-4889-a518-953c24b8e1eb)

- Revela una separación más clara entre "cat", "dog" y "tree", con clústeres más definidos debido a la naturaleza no lineal de t-SNE.

### Imágenes y Texto Combinados

![combined_projection](https://github.com/user-attachments/assets/e0768e5a-6c7e-47d6-b575-d1e10fad7956)

- Combina embeddings de imágenes (azul) y texto ("cat", "dog", "tree" en rojo). Los prompts de texto se alinean cerca de sus respectivas imágenes, confirmando la coherencia semántica de CLIP.

### GIF

![tsne_to_pca_transition](https://github.com/user-attachments/assets/e8f5b86f-a820-4582-a2ca-ffe0d7ef90b0)

- Animación que muestra la transición suave, destacando cómo los clústeres evolucionan.

---

## 🧩 Prompts Usados
A continuación, se simulan los prompts usados en nuestra interacción:

```text
El código falla al descargar imágenes de Unsplash. ¿Cómo arreglo el error "Error en la API de Unsplash: 401"?
```
- **Respuesta**: Verifiqué que la clave API (`UNSPLASH_ACCESS_KEY`) sea válida y única. Añadí manejo de errores para casos de autenticación fallida.

```text
¿Cómo hago para mostrar miniaturas de las imágenes en los gráficos PCA y t-SNE?
```
- **Respuesta**: Implementé `OffsetImage` y `AnnotationBbox` de Matplotlib para superponer miniaturas en las coordenadas de proyección.

```text
Quiero un GIF que muestre la transición de t-SNE a PCA. ¿Cómo lo hago?
```
- **Respuesta**: Creé un bucle de interpolación entre X_tsne y X_pca, generé frames con `plt.savefig()`, y usé `imageio.mimsave()` para crear el GIF.

```text
¿Puedo agregar embeddings de texto a la visualización?
```
- **Respuesta**: Añadí código para tokenizar prompts ("cat", "dog", "tree"), generar sus embeddings con `model.encode_text()`, y proyectarlos junto a las imágenes en PCA.

---

## 💬 Reflexión Final
- **¿Qué patrones observaste?**  
  Las imágenes de "cat" y "dog" se agrupan cerca debido a similitudes visuales (animales domésticos), mientras que "tree" forma un clúster separado por su naturaleza vegetal. Los embeddings de texto se alinean con sus categorías respectivas, validando la capacidad semántica de CLIP.

- **¿Hubo agrupamientos inesperados?**  
  Sí, en t-SNE, algunas imágenes de "cat" se acercaron a "dog" más de lo esperado, posiblemente por fondos similares (interior/casa). Esto sugiere que CLIP captura no solo el sujeto principal sino también el contexto visual.

- **Desafíos y Soluciones**  
  - **Desafío**: Fallos en la API de Unsplash.  
    **Solución**: Validé la clave API y añadí manejo de errores.  
  - **Desafío**: Miniaturas solapadas en gráficos.  
    **Solución**: Ajusté el tamaño de las miniaturas (`zoom=1`) y usé `bbox_inches='tight'` en los saves.  
  - **Desafío**: Consistencia en el GIF.  
    **Solución**: Fijé límites de eje y añadí frames adicionales para el estado final PCA.

---

## ✅ Lista de Entrega
- [x] Carpeta `2025-07-04_taller_embeddings_visuales_clip_pca`
- [x] Implementación funcional en Colab (`embeddings_visuales_clip_pca.ipynb`)
- [x] Imágenes en `images/` (cat_0.jpg a tree_4.jpg)
- [x] Gráficos en `graficos/` (pca_projection.png, tsne_projection.png, combined_projection.png, tsne_to_pca_transition.gif)
- [x] Código limpio, modular y comentado
- [x] README completo con explicación, evidencias gráficas, prompts y reflexión
- [x] Commits descriptivos en inglés (e.g., "Add Colab notebook and initial visualization scripts")

---
