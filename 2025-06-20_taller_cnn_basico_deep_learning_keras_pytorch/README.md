# 🧪 Taller - Redes Convolucionales desde Cero: Reconocimiento de Imágenes con Keras

## 📅 Fecha
`2025-06-19` - Fecha de finalización

---

## 🎯 Objetivo del Taller

Construir, entrenar y evaluar una red neuronal convolucional (CNN) desde cero utilizando Keras (TensorFlow) para clasificar imágenes del dataset CIFAR-10. El objetivo es comprender los componentes fundamentales de una CNN (filtros, capas, pooling, etc.) y aplicarlos en una tarea práctica de visión por computador.

---

## 🧠 Conceptos Aprendidos

Los principales conceptos aplicados en este taller fueron:

- [x] Carga y preprocesamiento de datos (CIFAR-10) con normalización
- [x] Creación de una CNN básica con capas convolucionales, pooling y densas
- [x] Entrenamiento de la CNN con optimizador Adam y entropía cruzada
- [x] Evaluación del modelo con métricas (accuracy) y visualizaciones (curvas de pérdida, matriz de confusión, predicciones)
- [x] Implementación de Dropout para evitar overfitting
- [x] Guardado y carga de modelos en formato HDF5
- [ ] Implementación en PyTorch (opcional, no completada en este taller)
- [ ] Ajuste avanzado de hiperparámetros (e.g., tamaño de kernel, número de filtros)

---

## 📖 Descripción Breve de las Técnicas Implementadas

### Carga y Preprocesamiento de Datos

Se cargó el dataset CIFAR-10, que contiene 60,000 imágenes RGB de 32x32 píxeles con 10 clases. Los píxeles se normalizaron (0-255 a 0-1) para facilitar la convergencia del modelo, y las etiquetas se convirtieron a formato one-hot para la clasificación multiclase.

**Ubicación**: `keras/cnn_cifar10.ipynb` (sección 1, líneas 1-30)

### Creación de la CNN

Se diseñó una CNN con la siguiente arquitectura:
- 2 capas convolucionales (32 y 64 filtros, kernel 3x3, ReLU, padding='same')
- 2 capas de MaxPooling (2x2, stride=2)
- 1 capa Flatten
- 2 capas densas (128 neuronas con ReLU y 10 neuronas con Softmax)
- Dropout (0.5) para reducir overfitting

**Ubicación**: `keras/cnn_cifar10.ipynb` (sección 2, líneas 1-20)

### Entrenamiento del Modelo

El modelo se entrenó durante 20 épocas con:
- Optimizador: Adam (learning rate por defecto)
- Función de pérdida: Categorical Crossentropy
- Métrica: Accuracy
Se monitorearon las curvas de precisión y pérdida para entrenamiento y validación.

**Ubicación**: `keras/cnn_cifar10.ipynb` (sección 3, líneas 1-40)

### Evaluación y Visualización

Se evaluó el modelo en el conjunto de prueba, obteniendo:
- Accuracy en el conjunto de prueba (~0.65-0.70, dependiendo de la ejecución)
- Matriz de confusión para analizar errores de clasificación
- Visualización de predicciones correctas e incorrectas (3 ejemplos de cada una)

**Ubicación**: `keras/cnn_cifar10.ipynb` (sección 4, líneas 1-60)

### Implementación de Dropout

Se añadió una capa de Dropout (0.5) antes de la capa de salida para prevenir el overfitting, mejorando la generalización en el conjunto de validación.

**Ubicación**: `keras/cnn_cifar10.ipynb` (sección 2, línea 12)

### Guardado y Carga del Modelo

El modelo entrenado se guardó en formato HDF5 (`cnn_cifar10.h5`) y se verificó cargándolo correctamente para asegurar su reutilización.

**Ubicación**: `keras/cnn_cifar10.ipynb` (sección 5, líneas 1-10)

---

## 🔧 Herramientas y Entorno

Para este taller, se utilizaron las siguientes herramientas:
- **Python** con **TensorFlow/Keras** para modelado y entrenamiento
- **Matplotlib** para visualizaciones
- **NumPy** para manipulación de datos
- **Scikit-learn** para la matriz de confusión
- Entorno: Google Colab (CPU/GPU)
- Dataset: CIFAR-10 (integrado en Keras, `/data/cifar10`)

---

## 📁 Estructura del Proyecto

```
2025-06-19_taller_cnn_basico_deep_learning_keras_pytorch/
├── keras/
│   └── cnn_cifar10.ipynb
├── README.md
```

---

## 🧪 Implementación

El proceso consistió en construir una CNN desde cero para clasificar imágenes de CIFAR-10, siguiendo un flujo completo de Deep Learning: carga de datos, diseño del modelo, entrenamiento, evaluación y visualización. La CNN básica logró una precisión aceptable (~0.65-0.70) en el conjunto de prueba, aunque limitada por la simplicidad del modelo frente a la complejidad del dataset.

### 🔹 Pasos Realizados
1. Cargar y normalizar el dataset CIFAR-10.
2. Diseñar una CNN básica con capas convolucionales, pooling, densas y Dropout.
3. Entrenar el modelo durante 20 épocas con Adam y categorical crossentropy.
4. Evaluar el modelo con accuracy y generar visualizaciones (curvas de pérdida, matriz de confusión, predicciones).
5. Guardar y verificar el modelo en formato HDF5.

### 🔹 Código Clave

```python
# Definición de la CNN
model = models.Sequential([
    layers.Conv2D(32, (3, 3), padding='same', activation='relu', input_shape=(32, 32, 3)),
    layers.MaxPooling2D((2, 2), strides=2),
    layers.Conv2D(64, (3, 3), padding='same', activation='relu'),
    layers.MaxPooling2D((2, 2), strides=2),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])
```

```python
# Entrenamiento
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])
history = model.fit(x_train, y_train, epochs=20, batch_size=64, 
                    validation_data=(x_test, y_test))
```

---

## 📊 Resultados Visuales

- **Imágenes de Entrada**:
  
![image](https://github.com/user-attachments/assets/3d8f15b6-e71f-46d2-9759-05d2e5bc27ba)

  Muestra 9 ejemplos del dataset CIFAR-10 con sus etiquetas correspondientes.

- **Curvas de Entrenamiento**:

  ![image](https://github.com/user-attachments/assets/e794f80e-eea1-41b0-ab85-2931a6a86488)

  Representa la precisión y pérdida en entrenamiento y validación, indicando convergencia y leve overfitting.

- **Matriz de Confusión**:

![image](https://github.com/user-attachments/assets/5149c1d2-5b27-4e90-89be-1b7258562128)

  Visualiza la distribución de predicciones, destacando confusiones entre clases similares (e.g., gatos y perros).

- **Predicciones Correctas e Incorrectas**:
  
![image](https://github.com/user-attachments/assets/28a2e183-97d3-4ac9-a5da-368c30ba808a)

  Muestra 3 ejemplos de predicciones correctas y 3 incorrectas para analizar el comportamiento del modelo.

---

## 🧩 Prompts Utilizados

A continuación, se presentan ejemplos de prompts que podrían haberse utilizado para solicitar ayuda durante el desarrollo del taller:

```text
"Estoy implementando una CNN en Keras para CIFAR-10, pero la precisión en validación es baja (~0.50). ¿Qué puedo hacer para mejorar el rendimiento, como ajustar la arquitectura o hiperparámetros?"
```

```text
"No entiendo cómo generar una matriz de confusión en Keras para un modelo de clasificación multiclase. ¿Puedes darme un ejemplo de código usando scikit-learn?"
```

```text
"¿Cómo puedo añadir Dropout a mi CNN en Keras para evitar el overfitting? ¿En qué capa es mejor colocarlo?"
```

```text
"Las curvas de pérdida muestran que mi modelo tiene overfitting en CIFAR-10. ¿Qué técnicas, además de Dropout, puedo usar para mejorar la generalización?"
```

---

## 💬 Reflexión Final

Este taller consolidó mi comprensión de las redes convolucionales y su aplicación en clasificación de imágenes. La implementación de una CNN básica para CIFAR-10 me permitió explorar los roles de las capas convolucionales (extracción de características), pooling (reducción de dimensionalidad) y Dropout (regularización). La precisión obtenida (~0.65-0.70) fue aceptable para un modelo simple, pero refleja las limitaciones de la arquitectura frente a la complejidad de CIFAR-10, que incluye imágenes RGB con variaciones significativas.

Los filtros convolucionales (32 y 64) y el tamaño del kernel (3x3) fueron efectivos para capturar patrones locales, pero experimentos adicionales (e.g., más filtros o kernels 5x5) podrían mejorar el rendimiento, aunque a costa de mayor costo computacional. Dropout (0.5) ayudó a mitigar el overfitting, como se observó en las curvas de validación, pero la brecha entre precisión de entrenamiento y validación sugiere que técnicas adicionales (e.g., data augmentation, batch normalization) serían útiles.

Los desafíos incluyeron configurar correctamente el modelo en Keras (e.g., padding='same' para mantener dimensiones) y interpretar la matriz de confusión, que reveló confusiones entre clases visualmente similares. El uso de Google Colab facilitó el entrenamiento, pero limitó la capacidad de realizar experimentos extensivos debido a restricciones de recursos.

En términos de aprendizaje, comprendí la importancia de diseñar arquitecturas adecuadas al problema y de equilibrar regularización y capacidad del modelo. Para futuros proyectos, exploraría:
- Modelos más profundos (e.g., ResNet) o preentrenados con fine-tuning.
- Técnicas de aumento de datos para mejorar la generalización.
- Ajuste sistemático de hiperparámetros (e.g., learning rate, batch size).

### Tabla de Comparación de Técnicas

| Técnica                     | Estado           | Impacto en Rendimiento | Notas                                                  |
|-----------------------------|------------------|------------------------|--------------------------------------------------------|
| Normalización de Datos      | ✅ Implementado   | Alto                  | Mejora la convergencia del modelo                      |
| Dropout (0.5)               | ✅ Implementado   | Medio                 | Reduce overfitting, pero no lo elimina completamente   |
| Matriz de Confusión         | ✅ Implementado   | Medio                 | Útil para analizar errores de clasificación            |
| Curvas de Pérdida           | ✅ Implementado   | Medio                 | Permite detectar overfitting y convergencia            |
| Data Augmentation           | ❌ No implementado | Alto                | Podría mejorar generalización en CIFAR-10              |
| Batch Normalization         | ❌ No implementado | Alto                | Estabiliza el entrenamiento en redes profundas         |
| Ajuste de Hiperparámetros   | ❌ No implementado | Medio               | Optimizar learning rate o filtros mejoraría resultados |

---

## ✅ Lista de Entrega

- [x] Carpeta `2025-06-19_taller_cnn_basico_deep_learning_keras_pytorch`
- [x] Implementación funcional en `keras/cnn_cifar10.ipynb`
- [x] Evaluación con accuracy y matriz de confusión
- [x] Visualizaciones (input_images.png, training_curves.png, confusion_matrix.png, predictions.png)
- [x] Código limpio y comentado
- [x] README con descripción, resultados y reflexión
- [ ] Implementación en PyTorch (no completada por enfoque en Keras)
- [ ] Técnicas avanzadas como data augmentation o batch normalization

