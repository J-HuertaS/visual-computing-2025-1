using UnityEngine;
using UnityEngine.UI;

public class MaterialController : MonoBehaviour
{
    public GameObject targetObject; // arrastras tu esfera o cubo con material
    public Slider metallicSlider;
    public Slider smoothnessSlider;

    private Material materialInstance;

    void Start()
    {
        // Creamos una instancia del material que se puede modificar en runtime
        materialInstance = targetObject.GetComponent<Renderer>().material;

        // Asignamos valores iniciales a los sliders
        metallicSlider.value = materialInstance.GetFloat("_Metallic");
        smoothnessSlider.value = materialInstance.GetFloat("_Smoothness");

        // Nos aseguramos de escuchar los cambios (si no lo has hecho ya por UI)
        metallicSlider.onValueChanged.AddListener(UpdateMetallic);
        smoothnessSlider.onValueChanged.AddListener(UpdateSmoothness);
    }

    public void UpdateMetallic(float value)
    {
        materialInstance.SetFloat("_Metallic", value);
    }

    public void UpdateSmoothness(float value)
    {
        materialInstance.SetFloat("_Smoothness", value);
    }
}