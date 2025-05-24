# 🧪 Taller - Visualización de Imágenes y Video 360° en Unity y Three.js

## 📅 Fecha
`2025-05-23` – Fecha de realización

---

## 🎯 Objetivo del Taller

Aprender a cargar e integrar imágenes panorámicas (equirectangulares) y videos 360° dentro de entornos 3D inmersivos usando Unity y Three.js con React. Este tipo de contenido es clave para experiencias XR, recorridos virtuales y visualización inmersiva.

---

## 🧠 Conceptos Aprendidos

- [x] Imagen equirectangular en entornos 3D
- [x] Inversión de normales en geometrías esféricas
- [x] Aplicación de texturas panorámicas en esferas
- [x] Reproducción de video 360° en materiales
- [x] Uso de `meshBasicMaterial` con `THREE.BackSide`
- [x] Control de cámara libre con mouse o giroscopio
- [x] Navegación entre escenas panorámicas

---

## 🔧 Herramientas y Entornos

- Unity LTS
- Threejs

---

## 📁 Estructura del Proyecto

```
2025-05-23_taller_imagenes_video_360_unity_threejs/
├── unity/      
├── threejs/            
├── resultados/               
│   └── threejs_360_result.gif
│   └── unity_360_result.gif
├── README.md
```

---

## 🧪 Implementación

### 🔹 Etapas realizadas

#### Cargar Imagen y Video 360 - Unity

1. Crear objeto Sphere en Unity.
2. Invertir normales de la esfera para ver desde adentro.
3. Asignación de material con textura equirectangular.
4. Crear un componente VideoPlayer en la esfera.
5. Asignar el material del objeto esférico al video.
6. Activar modo render-to-material.
7. Añadir Canva y botones.
8. Agregar lógica de cambio de escenas (entre imagen y video).

#### Cargar Imagen y Video 360 - Threejs

1. Solicitar código para mostrar imagen y video en threejs.
2. Modificar relación de aspecto para mejorar rendimiento.

### 🔹 Código relevante

#### Unity

```C#
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
```

#### Threejs

```javascript
// Componente para mostrar una imagen 360
function PanoramaImage({ url }) {
  // Carga la textura de la imagen panorámica
  const texture = useTexture(url);
  return (
    <mesh scale={[-1, 1, 1]}>
      {/* Esfera invertida para que la textura se vea desde dentro */}
      <sphereGeometry args={[10, 60, 40]} />
      {/* Material básico con la textura y renderizado por la parte trasera */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Componente para mostrar un video 360
function PanoramaVideo({ url }) {
  // Crea y reproduce el elemento de video HTML
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = url;
    vid.crossOrigin = 'Anonymous'; // Importante para texturas de video
    vid.loop = true;
    vid.muted = true; // El video debe estar silenciado para la reproducción automática en muchos navegadores
    vid.play();
    return vid;
  });

  // Crea una textura de Three.js a partir del elemento de video
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter; // O THREE.NearestFilter
  videoTexture.magFilter = THREE.LinearFilter; // O THREE.NearestFilter

  return (
    <mesh scale={[-1, 1, 1]}>
      {/* Esfera invertida para que el video se vea desde dentro */}
      <sphereGeometry args={[10, 60, 40]} />
      {/* Material básico con la textura de video y renderizado por la parte trasera */}
      <meshBasicMaterial map={videoTexture} side={THREE.BackSide} />
    </mesh>
  );
}
```

---

## 📊 Resultados Visuales

### 📌 Este taller **requiere explícitamente un GIF animado**:

#### Unity

![alt text](resultado/unity_360_result.gif)

#### Threejs

![alt text](resultado/threejs_360_result.gif)

---

## 🧩 Prompts Usados

```text
Explicame de forma sencilla qué es una imagen 360° equirectangular.
```

```text
Explicame de forma sencilla qué es y cómo funciona un video 360
```

```text
Explicame de forma sencilla qué es una Skybox o Esfera invertida y para que se usa
```

```text
Explicame de forma sencilla qué es Mapeo UV y proyección interna y para que se usa en la representación de imagenes 3D
```

```text
Estoy trabajando en Unity. Quiero que me ayudes a crear un objeto sphere, invertir sus normales para mirar desde adentro y asignar un material con textura equirectangular
```

```text
Estoy trabajando en Unity. Me gustaría saber si, ¿Hay manera de hacer que la camara no se sienta con un fov tan pequeño?
```

```text
Estoy trabajando en Unity. Quiero que me ayudes a crear un componente VideoPlayer, asignar l material del objeto esferico al video y activar el modo render-to-material.
```

```text
Estoy trabajando en Unity. Ayudame a crear un botón que cambie entre escena de imagen a escena de video.
```
```text
Dado el script de switching que hemos trabajado. Agregale la lógica de los botones para cambiar entre escenas adecuadamente.
```

```text
Este es mi codigo, modificalo para que ahora con dos botones que agregue, Button_ShowImage y Button_ShowVideo, cambien como con los números.

[codigo de cambio de escenas]
```


```text
Estoy trabajando en threejs. Crea un app.jsx que muestre imagen y video 360 alternando entre escenas con botones. Esta aplicación debe usar una SphereGeometry invertida (scale.set(-1, 1, 1)), aplicar la textura panorámica como mapa de un material, crear un elemento video HTML oculto, usar videoTexture como mapa de material, asignar el videoTexture al meshBasicMaterial y, finalmente, añadir OrbitControls para navegación.
```



## 💬 Reflexión Final

Este taller me permitió entender cómo se crean experiencias inmersivas básicas con imágenes y videos 360°, tanto en Unity como en Three.js con React. Me sorprendió descubrir lo intuitivo que puede ser representar un entorno envolvente utilizando una esfera invertida y una proyección equirectangular. 

El trabajo práctico con `VideoPlayer` en Unity y `VideoTexture` en Three.js me enseñó cómo los motores gráficos manejan flujos de video en tiempo real como texturas dinámicas. Además, integrar controles de cámara y navegación me ayudó a pensar en la interacción del usuario como parte del diseño inmersivo.

En general, este taller reforzó mi interés en el desarrollo de experiencias VR y me dio herramientas concretas para comenzar a prototipar recorridos virtuales o aplicaciones interactivas en 360°. Finalmente, como anotación, es que se debería considerar utilizar un modelo de esfero con UV mapping más adecuado que el simple objeto esfera que proporciona Unity para un acabado más profesional.
---

## ✅ Checklist de Entrega

- [x] Carpeta `2025-05-23_taller_imagenes_video_360_unity_threejs`
- [x] GIF incluido con nombre descriptivo
- [x] Visualización de imagenes y videos 360 de forma adecuada
- [x] README completo y claro
- [x] Commits descriptivos en inglés

---
