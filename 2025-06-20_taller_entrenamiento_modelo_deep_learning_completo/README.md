# 🧪 Taller - Entrenamiento de un Modelo de Deep Learning de Inicio a Fin

## 📅 Fecha
`2025-06-15` - Fecha de finalización

---

## 🎯 Objetivo del Taller

Entrenar un modelo de Deep Learning desde la preparación de datos hasta la evaluación, aplicando validación cruzada, fine-tuning y exportación del modelo. El objetivo es comprender el flujo completo del proceso y aplicarlo a proyectos de clasificación de imágenes, utilizando el dataset MNIST.

---

## 🧠 Conceptos Aprendidos

Los principales conceptos aplicados en este taller fueron:

- [x] Carga y preprocesamiento de datos (MNIST) con transformaciones
- [x] Creación de dataloaders para entrenamiento, validación y prueba
- [x] Definición y entrenamiento de una red neuronal simple (SimpleNet)
- [x] Validación hold-out y K-Fold Cross Validation
- [x] Fine-tuning de un modelo preentrenado (ResNet18)
- [x] Evaluación de modelos con métricas y visualizaciones (curvas de pérdida, matriz de confusión)
- [x] Guardado y carga de modelos
- [ ] Implementación de técnicas avanzadas de regularización (e.g., L2, data augmentation)

---

## 📖 Descripción Breve de las Técnicas Implementadas

### Carga y Preprocesamiento de Datos

Se cargó el dataset MNIST, normalizando las imágenes (escala de grises, 28x28 píxeles) para mejorar la convergencia del modelo. Se aplicaron transformaciones (`ToTensor`, `Normalize`) para estandarizar los datos.

**Ubicación**: `python/entrenamiento_modelo.ipynb` (sección 2, líneas 1-20)

### Creación de Dataloaders

El conjunto de entrenamiento se dividió en 80% entrenamiento y 20% validación. Se crearon dataloaders con un tamaño de lote de 64 para iterar eficientemente durante el entrenamiento, validación y prueba.

**Ubicación**: `python/entrenamiento_modelo.ipynb` (sección 3, líneas 1-20)

### Definición y Entrenamiento de SimpleNet

Se diseñó una red neuronal simple (`SimpleNet`) con capas densas (784→128→64→10), ReLU y dropout (0.2). Se entrenó durante 10 épocas con Adam (lr=0.001) y entropía cruzada, monitoreando pérdida y precisión en validación.

**Ubicación**: `python/entrenamiento_modelo.ipynb` (sección 4, líneas 1-60)

### Validación

- **Hold-out**: Validación en cada época con el conjunto de validación (20% de los datos).
- **K-Fold Cross Validation**: 5 folds para evaluar la robustez del modelo, con una precisión media de ~0.98 ± 0.02.

**Ubicación**: `python/entrenamiento_modelo.ipynb` (sección 6, líneas 1-60)

### Fine-Tuning con ResNet18

Se usó ResNet18 preentrenado en ImageNet, adaptando la capa inicial para 1 canal (MNIST). Se realizaron dos enfoques:
- **Capa Final**: Solo se entrenó la capa final (lr=1e-4), logrando ~0.92 de precisión.
- **Fine-Tuning Completo**: Todas las capas ajustadas (lr=1e-5), alcanzando ~0.98 de precisión.

**Ubicación**: `python/entrenamiento_modelo.ipynb` (sección 7, líneas 1-100)

### Evaluación y Visualización

Se generaron:
- Curvas de pérdida (entrenamiento/validación).
- Matriz de confusión para el conjunto de prueba.
- Comparación de precisión entre SimpleNet, ResNet18 (capa final) y ResNet18 (fine-tuning completo).

**Ubicación**: `python/entrenamiento_modelo.ipynb` (secciones 5-6, líneas 60-100)

### Guardado y Carga del Modelo

El modelo ResNet18 con fine-tuning completo se guardó y se verificó cargándolo correctamente.

**Ubicación**: `python/entrenamiento_modelo.ipynb` (sección 9, líneas 1-20)

---

## 🔧 Herramientas y Entorno

Para este taller, se utilizaron las siguientes herramientas:
- **Python** con **PyTorch** y **torchvision** para modelado y datasets.
- **Scikit-learn** para validación cruzada y métricas.
- **Matplotlib** y **Seaborn** para visualizaciones.
- **Pandas** para manejo de métricas.
- **Tqdm** para barras de progreso.
- Entorno: Google Colab (CPU/GPU).
- Dataset: MNIST (`/data/MNIST`).

---

## 📁 Estructura del Proyecto

```
2025-06-15_taller_entrenamiento_modelo_deep_learning_completo/
├── python/
│   └── entrenamiento_modelo.ipynb
├── modelos/
│   └── modelo_final.pth
├── resultados/
│   ├── curva_loss.png
│   ├── confusion_matrix.png
│   ├── comparacion_metrics.csv
│   ├── comparacion_modelos.png
│   ├── ejemplo_imagen.png
├── README.md
```

---

## 🧪 Implementación

El proceso de implementación consistió en entrenar y evaluar modelos de clasificación de dígitos manuscritos (MNIST) con un flujo completo de Deep Learning. Se compararon un modelo simple (SimpleNet) y un modelo preentrenado (ResNet18) con fine-tuning, utilizando validación hold-out y K-Fold para garantizar robustez.

### 🔹 Pasos Realizados
1. Configurar el entorno y cargar el dataset MNIST.
2. Crear dataloaders para entrenamiento, validación y prueba.
3. Definir y entrenar SimpleNet (10 épocas).
4. Realizar validación hold-out y K-Fold (5 folds).
5. Implementar fine-tuning en ResNet18 (capa final y completo).
6. Evaluar modelos con métricas (classification_report, confusion_matrix).
7. Visualizar resultados (curvas de pérdida, matriz de confusión, comparación de modelos).
8. Guardar y verificar el modelo final.

### 🔹 Código Clave

```python
# Definición de SimpleNet
class SimpleNet(nn.Module):
    def __init__(self):
        super(SimpleNet, self).__init__()
        self.flatten = nn.Flatten()
        self.fc1 = nn.Linear(28*28, 128)
        self.relu1 = nn.ReLU()
        self.dropout = nn.Dropout(0.2)
        self.fc2 = nn.Linear(128, 64)
        self.relu2 = nn.ReLU()
        self.fc3 = nn.Linear(64, 10)
    
    def forward(self, x):
        x = self.flatten(x)
        x = self.relu1(self.fc1(x))
        x = self.dropout(x)
        x = self.relu2(self.fc2(x))
        x = self.fc3(x)
        return x
```

```python
# Fine-Tuning con ResNet18
model_ft = models.resnet18(pretrained=True)
model_ft.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
num_ftrs = model_ft.fc.in_features
model_ft.fc = nn.Linear(num_ftrs, 10)
model_ft.to(device)

# Entrenar solo la capa final
for param in model_ft.parameters():
    param.requires_grad = False
optimizer_ft = optim.Adam(model_ft.fc.parameters(), lr=1e-4)
```

---

## 📊 Resultados Visuales

- **Curva de Pérdida**:

![image](https://github.com/user-attachments/assets/a0a5db8c-2e01-43a9-b871-625211f71f0a)

  Muestra la disminución de la pérdida en entrenamiento y validación para SimpleNet, indicando buena convergencia.

- **Matriz de Confusión**:
  
![image](https://github.com/user-attachments/assets/f312b0f0-da73-4613-8d21-66eed9f54f5c)

  Visualiza la distribución de predicciones en el conjunto de prueba, con alta precisión en la mayoría de clases.

- **Comparación de Modelos**:
  
![image](https://github.com/user-attachments/assets/9f985459-9271-4836-a555-395bcb1cb3be)

  Compara la precisión de validación entre SimpleNet (~0.97), ResNet18 (capa final, ~0.92) y ResNet18 (fine-tuning completo, ~0.98).

---

## 🧩 Prompts Utilizados

A continuación, se presentan ejemplos de prompts que podrían haberse utilizado para solicitar ayuda a una IA durante el desarrollo del taller:

```text
"Estoy intentando adaptar ResNet18 para imágenes en escala de grises de MNIST, pero recibo un error en la capa convolucional inicial. ¿Cómo puedo modificar la capa conv1 para que acepte 1 canal en lugar de 3?"
```

```text
"Mi modelo SimpleNet tiene una precisión baja en validación (~0.85). ¿Qué hiperparámetros (como learning rate o dropout) debo ajustar para mejorar el rendimiento?"
```

```text
"No entiendo cómo implementar K-Fold Cross Validation en PyTorch con el dataset MNIST. ¿Puedes proporcionarme un ejemplo de código que use KFold de scikit-learn con DataLoader?"
```

```text
"Las curvas de pérdida de mi modelo muestran que la pérdida de validación aumenta después de algunas épocas. ¿Esto indica sobreajuste? ¿Qué técnicas puedo usar para mitigarlo?"
```

---

## 💬 Reflexión Final

Este taller permitió consolidar el flujo completo de entrenamiento de modelos de Deep Learning, desde la preparación de datos hasta la evaluación y optimización. La implementación de SimpleNet demostró que modelos ligeros son suficientes para datasets simples como MNIST, alcanzando una precisión de ~0.97. El fine-tuning de ResNet18, aunque más complejo, mejoró marginalmente la precisión (~0.98) con fine-tuning completo, pero requirió ajustes específicos (e.g., modificar la capa convolucional inicial) debido a la diferencia entre MNIST e ImageNet.

La validación K-Fold fue especialmente útil para evaluar la robustez del modelo, confirmando una precisión estable (~0.98 ± 0.02). En contraste, la validación hold-out fue más práctica para iteraciones rápidas. Los desafíos incluyeron la configuración inicial de ResNet18 para imágenes monocromáticas y la gestión de recursos computacionales en Google Colab.

En términos de aprendizaje, el taller destacó la importancia de equilibrar complejidad del modelo y rendimiento, así como la utilidad de técnicas de validación para garantizar generalización. Para futuros proyectos, se podrían explorar datasets más complejos (e.g., CIFAR-10), técnicas de regularización avanzadas (e.g., data augmentation) y ajuste automático de hiperparámetros.

### Tabla de Comparación de Técnicas

| Técnica                     | Estado           | Impacto en Rendimiento | Notas                                                  |
|-----------------------------|------------------|------------------------|--------------------------------------------------------|
| Validación Hold-out         | ✅ Implementado   | Medio                 | Rápida para iteraciones, pero menos robusta            |
| K-Fold Cross Validation     | ✅ Implementado   | Alto                  | Evalúa robustez, pero más costosa computacionalmente    |
| Fine-Tuning (Capa Final)    | ✅ Implementado   | Medio                 | Mejora limitada para MNIST                            |
| Fine-Tuning Completo        | ✅ Implementado   | Alto                  | Mayor precisión, pero requiere ajuste cuidadoso        |
| Data Augmentation           | ❌ No implementado | Medio               | Podría mejorar generalización en datasets complejos    |
| Regularización L2           | ❌ No implementado | Bajo                | Útil para evitar sobreajuste en modelos más grandes    |

---

## ✅ Lista de Entrega

- [x] Carpeta `2025-06-15_taller_entrenamiento_modelo_deep_learning_completo`
- [x] Implementación funcional en `entrenamiento_modelo.ipynb`
- [x] Validación hold-out y K-Fold
- [x] Fine-tuning de ResNet18 (capa final y completo)
- [x] Visualizaciones (curva_loss.png, confusion_matrix.png, comparacion_modelos.png)
- [x] Código limpio, comentado y con barra de progreso
- [x] README con descripción, resultados y reflexión
- [ ] Data augmentation y regularización avanzada (no implementado por simplicidad del dataset)
