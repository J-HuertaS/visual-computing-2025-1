using UnityEngine;
using UnityEngine.UI; // Necesario para los componentes UI
using TMPro; // Necesario para TextMeshPro

public class ParentController : MonoBehaviour
{
    [Header("Objeto a Controlar")]
    public Transform parentObject; // Arrastra aquí el objeto 'Padre'

    [Header("Sliders de Posición")]
    public Slider sliderPosX;
    public Slider sliderPosY;
    public Slider sliderPosZ;

    [Header("Sliders de Rotación")]
    public Slider sliderRotX;
    public Slider sliderRotY;
    public Slider sliderRotZ;

    [Header("Sliders de Escala")]
    public Slider sliderScaleX;
    public Slider sliderScaleY;
    public Slider sliderScaleZ;

    [Header("Textos para Mostrar Valores")]
    public TextMeshProUGUI textPosition;
    public TextMeshProUGUI textRotation;
    public TextMeshProUGUI textScale;

    [Header("Controles de Animación (Bonus)")]
    public Button buttonPlay;
    public Button buttonPause;
    public Button buttonReset;

    private bool isAnimating = false;
    private float animationTime = 0f;
    private Vector3 initialPosition;
    private Quaternion initialRotation;
    private Vector3 initialScale;

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
}