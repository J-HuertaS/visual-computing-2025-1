# 🧪 Taller - Jerarquías

## 📅 Fecha
`2025-05-07` – Fecha de realización

## 🔧 Herramientas y Entornos

- Three.js (usando node.js)
- Unity

## Introducción

Este taller muestra el uso de jerarquías de transformación en Three.js y Unity. Muestra cómo las transformaciones de los objetos padres afectan a sus hijos en una escena 3D y como manejar esas jerarquías tanto en código como en una GUI en el caso de Unity.

## 🎯 Características

- Estructura jerárquica de tres niveles (padre → hijo → nieto)
- Controles interactivos para rotación y posición
- Visualización en tiempo real de las transformaciones
- Interfaz de usuario con sliders usando Leva

## 🎨 Elementos de la Escena

1. **Cubo Padre**

2. **Esfera Hijo**

3. **Toroide (three.js) o cápsula (unity) nieto**

4. **Interfaces de control**


## 🎮 Controles

- **Rotación**: Controla la rotación del cubo padre alrededor del eje global.
- **Posición**: Mueve el cubo padre a lo largo del eje global
- **Escalado**: Agranda al cubo respecto a un eje local. 

## 🧠 Conceptos Aprendidos

Lista los principales conceptos aplicados:

- [x] Segmentación de imágenes
- [x] Detección de contornos
- [x] Análisis morfológico (área, perímetro, centro de masa)
- [x] Otro: Binarización adaptativa y bounding boxes

---

## 🔧 Herramientas y Entornos

- Python (Jupyter Notebook en Google Colab)
- Librerías: `opencv-python`, `numpy`, `matplotlib`, `imageio`

---

## 📁 Estructura del Proyecto

```
2025-05-07_taller_jerarquias_transformaciones/
├── Unity/               
├── threejs/
├── resultados/ 
│   └── three.gif
│   └── unity.gif   
├── README.md
```


### 🔹 Código relevante

```three.js
function ParentGroup() {
  const groupRef = useRef<THREE.Group>(null)
  
  const { rotation, position } = useControls({
    rotation: {
      value: 0,
      min: 0,
      max: Math.PI * 2,
      step: 0.1
    },
    position: {
      value: 0,
      min: -2,
      max: 2,
      step: 0.1
    }
  })

  return (
    <group 
      ref={groupRef}
      rotation={[0, rotation, 0]}
      position={[position, 0, 0]}
    >
      {/* Cubo padre */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      {/* Esfera hijo */}
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>

      {/* Dona nieta */}
      <group position={[2, 0, 0]}>
        <mesh position={[1, 0, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>
      </group>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ParentGroup />
      <OrbitControls />
    </>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
```

```Unity (Script)
   void Start()
    {
        if (parentObject == null)
        {
            Debug.LogError("Parent Object no asignado en el Inspector!");
            enabled = false; // Deshabilita el script si no hay objeto
            return;
        }

        // Guardar transformaciones iniciales para el reset y animación
        initialPosition = parentObject.localPosition;
        initialRotation = parentObject.localRotation;
        initialScale = parentObject.localScale;

        // Configurar listeners para los sliders
        // Posición
        sliderPosX.onValueChanged.AddListener(SetPositionX);
        sliderPosY.onValueChanged.AddListener(SetPositionY);
        sliderPosZ.onValueChanged.AddListener(SetPositionZ);
        // Rotación
        sliderRotX.onValueChanged.AddListener(SetRotationX);
        sliderRotY.onValueChanged.AddListener(SetRotationY);
        sliderRotZ.onValueChanged.AddListener(SetRotationZ);
        // Escala
        sliderScaleX.onValueChanged.AddListener(SetScaleX);
        sliderScaleY.onValueChanged.AddListener(SetScaleY);
        sliderScaleZ.onValueChanged.AddListener(SetScaleZ);

        // Configurar listeners para los botones (Bonus)
        buttonPlay.onClick.AddListener(PlayAnimation);
        buttonPause.onClick.AddListener(PauseAnimation);
        buttonReset.onClick.AddListener(ResetAnimation);

        // Inicializar los sliders con los valores actuales del objeto padre
        UpdateSlidersFromTransform();
        UpdateDisplayTexts();
    }

    void Update()
    {
        if (isAnimating)
        {
            animationTime += Time.deltaTime;
            // Ejemplo de animación: movimiento sinusoidal en X y rotación en Y
            float newX = initialPosition.x + Mathf.Sin(animationTime * 0.5f) * 2f; // Mueve 2 unidades a cada lado
            float newRotY = (initialRotation.eulerAngles.y + animationTime * 45f) % 360f; // Rota 45 grados/seg

            parentObject.localPosition = new Vector3(newX, parentObject.localPosition.y, parentObject.localPosition.z);
            parentObject.localRotation = Quaternion.Euler(parentObject.localEulerAngles.x, newRotY, parentObject.localEulerAngles.z);
            
            UpdateSlidersFromTransform(); // Actualizar sliders si la animación los afecta
        }
        
        // Siempre actualizamos los textos, o podrías hacerlo solo cuando cambie un valor.
        UpdateDisplayTexts();

        // Opcional: Imprimir en consola
        // Debug.Log($"Pos: {parentObject.localPosition}, Rot: {parentObject.localEulerAngles}, Scale: {parentObject.localScale}");
    }

    // --- Métodos para actualizar el transform desde los Sliders ---
    public void SetPositionX(float value) { if (!isAnimating) parentObject.localPosition = new Vector3(value, parentObject.localPosition.y, parentObject.localPosition.z); }
    public void SetPositionY(float value) { if (!isAnimating) parentObject.localPosition = new Vector3(parentObject.localPosition.x, value, parentObject.localPosition.z); }
    public void SetPositionZ(float value) { if (!isAnimating) parentObject.localPosition = new Vector3(parentObject.localPosition.x, parentObject.localPosition.y, value); }

    public void SetRotationX(float value) { if (!isAnimating) parentObject.localEulerAngles = new Vector3(value, parentObject.localEulerAngles.y, parentObject.localEulerAngles.z); }
    public void SetRotationY(float value) { if (!isAnimating) parentObject.localEulerAngles = new Vector3(parentObject.localEulerAngles.x, value, parentObject.localEulerAngles.z); }
    public void SetRotationZ(float value) { if (!isAnimating) parentObject.localEulerAngles = new Vector3(parentObject.localEulerAngles.x, parentObject.localEulerAngles.y, value); }
    
    public void SetScaleX(float value) { if (!isAnimating) parentObject.localScale = new Vector3(value, parentObject.localScale.y, parentObject.localScale.z); }
    public void SetScaleY(float value) { if (!isAnimating) parentObject.localScale = new Vector3(parentObject.localScale.x, value, parentObject.localScale.z); }
    public void SetScaleZ(float value) { if (!isAnimating) parentObject.localScale = new Vector3(parentObject.localScale.x, parentObject.localScale.y, value); }

    // --- Métodos para actualizar los Sliders desde el Transform (útil para animación/reset) ---
    void UpdateSlidersFromTransform()
    {
        sliderPosX.value = parentObject.localPosition.x;
        sliderPosY.value = parentObject.localPosition.y;
        sliderPosZ.value = parentObject.localPosition.z;

        sliderRotX.value = parentObject.localEulerAngles.x;
        sliderRotY.value = parentObject.localEulerAngles.y;
        sliderRotZ.value = parentObject.localEulerAngles.z;

        sliderScaleX.value = parentObject.localScale.x;
        sliderScaleY.value = parentObject.localScale.y;
        sliderScaleZ.value = parentObject.localScale.z;
    }
    
    // --- Métodos para la UI y Animación (Bonus) ---
    void UpdateDisplayTexts()
    {
        textPosition.text = $"Pos: {parentObject.localPosition.ToString("F2")}";
        textRotation.text = $"Rot: {parentObject.localEulerAngles.ToString("F2")}";
        textScale.text = $"Scale: {parentObject.localScale.ToString("F2")}";
    }

    public void PlayAnimation()
    {
        // Si no estaba animando, resetea el tiempo de animación para empezar desde el principio de la animación
        if (!isAnimating) {
            animationTime = 0f; 
            // Opcional: podrías querer que la animación empiece desde la posición actual en vez de la inicial
            // initialPosition = parentObject.localPosition; 
            // initialRotation = parentObject.localRotation;
        }
        isAnimating = true;
        Debug.Log("Animation Playing");
    }

    public void PauseAnimation()
    {
        isAnimating = false;
        Debug.Log("Animation Paused");
    }

    public void ResetAnimation()
    {
        isAnimating = false;
        animationTime = 0f;
        parentObject.localPosition = initialPosition;
        parentObject.localRotation = initialRotation;
        parentObject.localScale = initialScale;
        UpdateSlidersFromTransform(); // Actualizar sliders a los valores reseteados
        Debug.Log("Animation Reset");
    }
```

## 📊 Resultados Visuales


#### Análisis de imagen

![Gif three.js](Resultados\three.gif)

#### Análisis de video

![Gif Unity](Resultados\unity.gif)

---

## 🧩 Prompts Usados

```text
1. "Como puedo usar orbitControl en este caso"
2. Como agrego un hijo a un objeto en unity"
3. "Hazme una animación sencilla donde el objeto de vueltas y se mueva"
```

---



