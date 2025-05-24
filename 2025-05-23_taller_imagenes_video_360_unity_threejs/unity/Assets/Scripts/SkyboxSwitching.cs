using UnityEngine;
using UnityEngine.Video; // Necesario para VideoPlayer
using UnityEngine.UI; // Para que Unity reconozca Button, si lo necesitas


public class SkyboxSwitcher : MonoBehaviour
{
    // === Materiales y Texturas ===
    public Material staticImageMaterial; // Arrastra tu material con la imagen estática (shader Unlit/Texture)
    public Texture2D staticImageTexture; // Arrastra tu textura 360 estática aquí

    public Material videoMaterial;       // Arrastra tu material para el video (shader Unlit/Texture)
    public RenderTexture videoRenderTexture; // Arrastra tu Render Texture aquí

    // === Componentes ===
    public VideoPlayer videoPlayer;      // Arrastra el componente VideoPlayer de tu esfera
    private Renderer sphereRenderer;     // Renderer de la esfera para cambiar el material

    public Button Button_ShowImage;
    public Button Button_ShowVideo;


    void Awake() // Usamos Awake para asegurarnos de que se configure antes que Start de otros scripts
    {
        sphereRenderer = GetComponent<Renderer>();
        if (sphereRenderer == null)
        {
            Debug.LogError("SkyboxSwitcher: No se encontró un Renderer en este GameObject. Desactivando script.");
            enabled = false;
            return;
        }

        if (videoPlayer == null)
        {
            Debug.LogError("SkyboxSwitcher: No se encontró un VideoPlayer asignado. Desactivando script.");
            enabled = false;
            return;
        }

        // Configuración inicial del VideoPlayer:
        // Asegurarse de que no reproduzca audio al inicio si no se está viendo el video.
        // Y que esté configurado para la Render Texture.
        videoPlayer.playOnAwake = false; // Importante para que no suene al inicio
        videoPlayer.renderMode = VideoRenderMode.RenderTexture;
        videoPlayer.targetTexture = videoRenderTexture;

        // Deshabilitar todas las pistas de audio al inicio para evitar sonido no deseado
        // Esto es más robusto que solo mutear.
        for (ushort i = 0; i < videoPlayer.audioTrackCount; i++)
        {
            videoPlayer.SetTargetAudioSource(i, null); // Desconecta la pista de audio de cualquier AudioSource
            videoPlayer.EnableAudioTrack(i, false);    // Deshabilita la decodificación de audio
        }

        // Mostrar la imagen estática al inicio
        ShowStaticImage();

        // Enlazar botones a los métodos si se asignan desde el inspector
        if (Button_ShowImage != null)
            Button_ShowImage.onClick.AddListener(ShowStaticImage);
        if (Button_ShowVideo != null)
            Button_ShowVideo.onClick.AddListener(ShowVideo);
    }

    // Método para mostrar la imagen estática
    public void ShowStaticImage()
    {
        Debug.Log("Cambiando a imagen estática.");

        // Detener el video y deshabilitar sus pistas de audio
        if (videoPlayer != null && videoPlayer.isPlaying)
        {
            videoPlayer.Stop();
            // Deshabilita todas las pistas de audio para detener el sonido
            for (ushort i = 0; i < videoPlayer.audioTrackCount; i++)
            {
                videoPlayer.EnableAudioTrack(i, false);
            }
        }

        // Asegurarse de que el material de la imagen esté configurado correctamente
        if (staticImageMaterial != null && staticImageTexture != null)
        {
            staticImageMaterial.mainTexture = staticImageTexture; // Re-asigna la textura a la propiedad _MainTex
            sphereRenderer.material = staticImageMaterial;        // Asigna el material a la esfera
        }
        else
        {
            Debug.LogWarning("SkyboxSwitcher: Material de imagen estática o textura no asignados.");
        }
    }

    // Método para mostrar el video
    public void ShowVideo()
    {
        Debug.Log("Cambiando a video.");

        // Asegurarse de que el material del video esté configurado
        if (videoMaterial != null && videoRenderTexture != null)
        {
            videoMaterial.mainTexture = videoRenderTexture; // Asigna la Render Texture al material de video
            sphereRenderer.material = videoMaterial;        // Asigna el material a la esfera
        }
        else
        {
            Debug.LogWarning("SkyboxSwitcher: Material de video o Render Texture no asignados.");
            return; // No intentar reproducir si no hay material o RT
        }

        // Habilitar pistas de audio del video
        // Es importante hacer esto ANTES de Prepare/Play
        for (ushort i = 0; i < videoPlayer.audioTrackCount; i++)
        {
            videoPlayer.EnableAudioTrack(i, true); // Habilita la decodificación de audio
            // Si necesitas un AudioSource específico para el video, asignarlo aquí:
            // videoPlayer.SetTargetAudioSource(i, myAudioSourceComponent);
        }

        // Preparar y reproducir el video
        // Prepare() es importante para asegurar que el video esté listo antes de reproducir
        if (videoPlayer != null)
        {
            // Opcional: Para asegurar que el video se prepara correctamente
            // videoPlayer.Prepare();
            // videoPlayer.prepareCompleted += (vp) => { vp.Play(); }; // Reproducir cuando esté preparado

            // Para este caso simple, si ya está configurado y el clip asignado, solo Play() es suficiente
            if (!videoPlayer.isPlaying)
            {
                videoPlayer.Play();
            }
        }
    }

    // Opcional: Para probar con teclas (quitar para la versión final con botones UI)
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1)) // Presiona '1' para la imagen
        {
            ShowStaticImage();
        }
        if (Input.GetKeyDown(KeyCode.Alpha2)) // Presiona '2' para el video
        {
            ShowVideo();
        }
    }

    void OnDestroy()
    {
        // Asegurarse de detener el video y liberar recursos cuando el objeto se destruye
        if (videoPlayer != null)
        {
            videoPlayer.Stop();
        }
    }
}