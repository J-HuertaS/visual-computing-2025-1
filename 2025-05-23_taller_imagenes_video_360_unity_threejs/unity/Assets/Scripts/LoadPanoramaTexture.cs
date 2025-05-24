using UnityEngine;

public class LoadPanoramaTexture : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        // Obtener el componente Renderer de este mismo objeto
        Renderer renderer = GetComponent<Renderer>();

        // Asegurarse de que el renderer existe y tiene un material
        if (renderer != null && renderer.material != null)
        {
            // Cargar la textura desde la carpeta Resources
            // Asegúrate que tu imagen se llame "panorama" y esté en alguna carpeta "Resources"
            // Ejemplo: Assets/MyTextures/Resources/panorama.png
            Texture2D panoramaTexture = Resources.Load("panorama") as Texture2D;

            // Asignar la textura al 'mainTexture' del material
            if (panoramaTexture != null)
            {
                renderer.material.mainTexture = panoramaTexture;
                Debug.Log("Textura 'panorama' cargada y asignada correctamente.");
            }
            else
            {
                Debug.LogError("No se encontró la textura 'panorama' en ninguna carpeta Resources. ¡Asegúrate de que el nombre coincida y esté en la carpeta correcta!");
            }
        }
        else
        {
            Debug.LogError("El objeto no tiene un componente Renderer o un Material asignado.");
        }
    }
}