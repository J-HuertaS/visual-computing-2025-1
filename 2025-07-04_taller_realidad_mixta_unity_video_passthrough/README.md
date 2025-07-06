# 🧪 Taller - Realidad Mixta con Unity: Superposición de Elementos sobre Video

## 📅 Fecha  
`2025-07-04` 

---

## 🎯 Objetivo del Taller

Crear una escena en Unity donde se superpongan objetos 3D sobre una fuente de video simulada, recreando una experiencia tipo passthrough similar a la de HoloLens o Meta Quest, pero sin necesidad de visor. El objetivo es entender cómo anclar elementos virtuales sobre un fondo real capturado por cámara o video.

---

## 🧠 Conceptos Aprendidos

- [x] Unity Editor
- [x] Archivo de video
- [x] UI Canvas

---

## 🔧 Herramientas y Entornos

- Unity
- Google Firebase

---

## 📁 Estructura del Proyecto

```
2025-07-04_taller_realidad_mixta_unity_video_passthrough
├── unity/
├── media/
├── resultados/
└── README.md
```

---

## 🧪 Implementación

### 🔹 Etapas realizadas

1. Renderización de archivo multimedia: Lo primero que se hace es crear un plano en la escena y ubicarlo frente a la cámara, en este se agrega el componente de video y se carga el clip, de manera que el video sea renderizado sobre el plano, con el objetivo de simular lo que seria un entorno real.
2. Creación de un objeto superpuesto: A continuación se crea un objeto 3D sobre el video, buscando simular la sensación de un objeto que está sobre el mundo real, en este caso es un cubo simple que se coloca a una profundidad menor a la del video, es decir más cerca de la cámara.
3. Creación de scripts de interacción: Para generar una mayor interacción cómo seria en la vida real, se crea un script que permite que el cubo se desplace junto con el cursor sobre la escena, este comportamiento de moverse siguiendo al cursor se puede asemejar al comportamiento de una escena de realida mixta dónde el objeto digital también se mueve para mantenerse dentro del rango de visibilidad.
4. Adición de otras funciones de UI: Finalmente se añade un botón UI en el canvas que busca proporcionar otra posibilidad que es la de fijar el objeto cuando no queremos que se desplace con nosotros, este regresa el cubo a sus coordenadas iniciales y desactiva el seguimiento del cursor.

---

## 🔹 Código relevante

```cs
void Update()
    {
        if (seguirCursor)
        {
            Vector2 mousePosition = Mouse.current.position.ReadValue();
            Vector3 worldPos = mainCamera.ScreenToWorldPoint(new Vector3(mousePosition.x, mousePosition.y, 5f));
            transform.position = worldPos;
        }

        if (Mouse.current.leftButton.wasPressedThisFrame)
        {
            GetComponent<Renderer>().material.color = Random.ColorHSV();
        }
    }
```

```cs
public void ResetCube()
    {
        Debug.Log("🟢 Botón presionado");
        if (cube != null)
        {
            FollowCursor seguidor = cube.GetComponent<FollowCursor>();
            if (seguidor != null)
            {
                seguidor.seguirCursor = false;
                Debug.Log("🔴 Se desactivó el seguimiento del cursor");
            }

            cube.transform.position = new Vector3(0.21f, 0.08f, 18.35f);
            PlayerPrefs.DeleteAll();
        }
        else
        {
            Debug.LogWarning("❌ Cubo no asignado en el botón");
        }
    }
```

---

## 📊 Resultados Visuales

![deteccion](./resultados/fondo_cubo_realidad_mixta.gif)

---

## 🧩 Prompts Usados

```text
"Crea un script de Unity que permita que un objeto siga el movimiento del cursor"
```

---

## 💬 Reflexión Final

Este taller permitió explorar cómo simular experiencias de realidad mixta sin necesidad de hardware especializado, utilizando solo Unity y un video como fondo. Al superponer objetos 3D sobre una fuente de video y permitir su interacción con el cursor, se logró una representación convincente de cómo se integran elementos digitales en entornos reales. La implementación de seguimiento y fijación del objeto refuerza la comprensión de conceptos como alineación espacial, anclaje de contenido y responsividad interactiva. Esta aproximación ofrece un punto de partida accesible para desarrollar prototipos de realidad mixta que combinan percepción visual, control del usuario y narrativa espacial.

---

## ✅ Checklist de Entrega

- [x] Carpeta `YYYY-MM-DD_nombre_taller`
- [x] Código limpio y funcional
- [x] GIF incluido con nombre descriptivo (si el taller lo requiere)
- [x] Visualizaciones o métricas exportadas
- [x] README completo y claro
- [x] Commits descriptivos en inglés

---
