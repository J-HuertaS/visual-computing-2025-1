# 🧪 Taller - Exploración de Dispositivos de Realidad Extendida con Escena 360° en Meta Quest Pro

## 📅 Fecha
`2025-07-05` – Fecha de realización

---

## 🎯 Objetivo del Taller
Explorar las características, capacidades y limitaciones de cinco dispositivos de Realidad Extendida (XR): HoloLens 1, HoloLens 2, Magic Leap 1, Apple Vision Pro y Meta Quest Pro. Desarrollar una escena de video 360° en Unity para el Meta Quest Pro, alojada en YouTube para facilitar el acceso sin instalación de paquetes, y realizar un análisis comparativo de los dispositivos basado en exploración práctica.

---

## 🧠 Conceptos Aprendidos
- [x] Fundamentos de XR: Diferencias entre Realidad Virtual (VR), Realidad Aumentada (AR) y Realidad Mixta (MR).
- [x] Arquitecturas específicas de dispositivos: Sensores, ópticas y métodos de interacción (gestos, voz, controladores).
- [x] Integración de video 360° en Unity: Renderizado de videos equirectangulares en esferas invertidas para experiencias inmersivas.
- [x] Diseño de interacción: Entrada basada en gestos y controladores para aplicaciones XR.
- [x] Optimización de rendimiento: Gestión de tasas de fotogramas y tiempos de carga en entornos XR.
- [x] Análisis comparativo: Evaluación de hardware para aplicaciones en industria, educación y entretenimiento.

---

## 🔧 Herramientas y Entornos
- Unity 2021 LTS
- Meta Quest Pro SDK (para desarrollo y pruebas)
- YouTube (para alojar el video 360°)
- GitHub (para repositorio del proyecto)
- OBS Studio (para grabar GIFs)
- Dispositivo Meta Quest Pro para pruebas

📌 Herramientas instaladas según las guías oficiales del Meta Quest Developer Hub.

---

## 📁 Estructura del Proyecto

```
2025-07-05_xr_devices_workshop/
├── unity/                    # Proyecto Unity con escena de video 360°
├── resultados/               # GIFs y capturas de pantalla
│   └── meta_quest_360_result.gif
├── README.md
```

---

## 🧪 Implementación

### 🔹 Etapas realizadas

#### Exploración de Dispositivos
1. **Rotación por estaciones**: Los grupos probaron demos preinstaladas en HoloLens 1, HoloLens 2, Magic Leap 1, Apple Vision Pro y Meta Quest Pro, documentando UX, rendimiento y calidad de interacción.
2. **Registro de datos**: Se anotaron tiempos de carga, tasas de fotogramas, complejidad de configuración y desafíos técnicos para cada dispositivo.

#### Escena de Video 360° en Unity (Meta Quest Pro)
1. Se creó un objeto Sphere en Unity e invertieron sus normales para renderizar la superficie interna.
2. Se configuró un componente `VideoPlayer` para transmitir un video 360° desde una URL de YouTube.
3. Se asignó un material con una Render Texture a la esfera para la reproducción del video.
4. Se implementó interacción basada en gestos (usando el seguimiento de manos del Meta Quest Pro) para reproducir/pausar el video.
5. Se añadió un lienzo UI con un botón para alternar la reproducción del video.
6. Se optimizó la escena para el Meta Quest Pro, asegurando tasas de fotogramas estables (objetivo: 72 FPS).
7. Se exportó la escena como APK para Meta Quest Pro y se grabó un GIF de demostración.

#### Alojamiento del Video
- Se subió el video 360° a YouTube para evitar la instalación de paquetes locales, asegurando accesibilidad mediante streaming por URL en Unity.
- Video 1: https://youtu.be/Z1e8cggr8t0
- Video 2: https://youtu.be/Lqz2Y9tQRUE

### 🔹 Código relevante

#### Unity (Reproducción de Video e Interacción)

```C#
using UnityEngine;
using UnityEngine.Video;
using UnityEngine.UI;

public class XRVideoController : MonoBehaviour
{
    public VideoPlayer videoPlayer;
    public Material sphereMaterial;
    public RenderTexture videoRenderTexture;
    public Button toggleButton;

    void Start()
    {
        // Configurar URL del video de You\tube
        videoPlayer.url = "https://www.youtube.com/watch?v=your_360_video_id";
        videoPlayer.renderMode = VideoRenderMode.RenderTexture;
        videoPlayer.targetTexture = videoRenderTexture;
        sphereMaterial.mainTexture = videoRenderTexture;

        // Añadir listener al botón para reproducir/pausar
        toggleButton.onClick.AddListener(ToggleVideo);
        
        // Preparar y reproducir video
        videoPlayer.Prepare();
        videoPlayer.prepareCompleted += (vp) => { vp.Play(); };
    }

    void ToggleVideo()
    {
        if (videoPlayer.isPlaying)
        {
            videoPlayer.Pause();
            Debug.Log("Video pausado.");
        }
        else
        {
            videoPlayer.Play();
            Debug.Log("Video reproduciendo.");
        }
    }

    void Update()
    {
        // Detección de gestos para reproducir/pausar (seguimiento de manos Meta Quest Pro)
        if (OVRInput.GetDown(OVRInput.Button.PrimaryHandTrigger))
        {
            ToggleVideo();
        }
    }
}
```

---

## 📊 Resultados Visuales

### 📌 GIF Animado
Se incluye un GIF para demostrar la reproducción del video 360° en el Meta Quest Pro, controlado mediante gestos de mano.

![Meta Quest Pro 360° Video](resultados/meta_quest_360_result.gif)

### 📊 Tabla Comparativa de Dispositivos - Técnica

| **Dispositivo**         | **Tipo de XR** | **Resolución por Ojo** | **Campo de Visión (FOV)** | **Interacción**                     | **Casos de Uso**                          | **Limitaciones**                          |
|-------------------------|----------------|------------------------|---------------------------|-------------------------------------|-------------------------------------------|-------------------------------------------|
| **HoloLens 1**          | MR             | 1268x720               | ~34°                      | Gestos, voz                         | Entrenamiento industrial, visualización médica | FOV limitado, hardware obsoleto            |
| **HoloLens 2**          | MR             | 2048x1080              | ~52°                      | Gestos, voz, seguimiento ocular    | Colaboración remota, revisión de diseño    | Alto costo, configuración compleja        |
| **Magic Leap 1**        | MR             | 1280x960               | ~50°                      | Controladores, gestos, voz         | Computación espacial, artes creativas      | Ecosistema de apps limitado, diseño voluminoso |
| **Apple Vision Pro**    | MR             | 3660x3200              | ~100°                     | Seguimiento ocular, manos, voz      | Productividad, entretenimiento inmersivo    | Alto costo, batería limitada               |
| **Meta Quest Pro**      | VR/MR          | 1800x1920              | ~106°                     | Controladores, manos, seguimiento facial | VR social, prototipado AR, juegos          | Calidad de AR passthrough inferior        |

**Observaciones**:
- **HoloLens 1:** 
- **HoloLens 2** mejora el FOV y la interacción, pero es costoso.
- **Magic Leap 1** destaca en mapeo espacial, pero carece de un ecosistema robusto de aplicaciones.
- **Apple Vision Pro** ofrece visuales superiores y controles intuitivos, pero su costo y duración de batería son limitantes.
- **Meta Quest Pro:** Son ligeras y cómodas al no tener otro equipamento extra, procesamiento rápido, la resolución es buena, evidenciado un problema con el mando porque no tenía buen seguimiento, tiene un sistema operativo completo, por ejemplo nosotros descargamos YouTube para desarrollar la práctica.
- **Meta Quest 3:** Son ligeras y cómodas al no tener otro equipamento extra, procesamiento rápido, la resolución es buena, evidenciado un problema con el mando porque no tenía buen seguimiento, tiene un sistema operativo completo, por ejemplo nosotros descargamos YouTube para desarrollar la práctica. Finalmente, se puede controlar mediante gestos lo cual lo hace más flexible para diferentes casos de uso.
---

## 🧩 Prompts Usados
- "Explica de forma sencilla las diferencias entre VR, AR y MR."
- "¿Cómo creo una escena de video 360° en Unity para Meta Quest Pro usando una URL de YouTube?"
- "Ayúdame a implementar controles de gestos para reproducir/pausar en Unity con Meta Quest Pro."
- "¿Cuáles son las especificaciones clave y casos de uso de HoloLens 1, HoloLens 2, Magic Leap 1, Apple Vision Pro y Meta Quest Pro?"
- "¿Cómo optimizo una escena XR en Unity para tasas de fotogramas estables en Meta Quest Pro?"

---

## 💬 Reflexión Final
Este taller proporcionó una inmersión práctica en las capacidades de los dispositivos XR, revelando sus fortalezas y limitaciones. Trabajar con el Meta Quest Pro para crear una escena de video 360° fue particularmente interesante, ya que destacó la facilidad de integrar medios inmersivos con herramientas accesibles como el streaming de YouTube. La interacción basada en gestos fue intuitiva, aunque optimizar las tasas de fotogramas requirió atención cuidadosa a la complejidad de la escena. La comparación de dispositivos fue reveladora: la pantalla de alta resolución y el seguimiento ocular de Apple Vision Pro destacaron, pero su costo limita su accesibilidad, mientras que el equilibrio de características y asequibilidad del Meta Quest Pro lo hizo ideal para prototipos.

El aspecto más desafiante fue garantizar un rendimiento fluido en el Meta Quest Pro, ya que la transmisión de video 360° de alta calidad introdujo problemas de latencia que requirieron optimización de la Render Texture. En proyectos futuros, exploraría la integración de audio espacial para mejorar la inmersión y experimentaría con interacciones más complejas, como colaboración multiusuario en VR. Este taller reforzó mi comprensión de los ecosistemas XR y despertó interés en desarrollar aplicaciones XR multiplataforma.

---

## 👥 Contribuciones Grupales
- Configuré el proyecto Unity e implementé la escena de video 360°.
- Programé los controles basados en gestos para Meta Quest Pro.
- Grabé el GIF de demostración y redacté el análisis comparativo.
- Gestioné el repositorio de GitHub y la documentación del README.

---

## ✅ Checklist de Entrega
- [x] Carpeta `2025-07-05_xr_devices_workshop`
- [x] Código limpio y funcional
- [x] GIF incluido con nombre descriptivo (`meta_quest_360_result.gif`)
- [x] Tabla comparativa de dispositivos
- [x] README completo y claro
- [x] Commits descriptivos en inglés
