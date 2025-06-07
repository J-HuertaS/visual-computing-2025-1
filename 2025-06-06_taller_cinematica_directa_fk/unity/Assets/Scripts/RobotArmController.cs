using UnityEngine;
using UnityEngine.UI;

public class RobotArmController : MonoBehaviour
{
    [Header("Referencias a los segmentos del brazo")]
    public Transform brazo1; // El hombro
    public Transform brazo2; // El codo
    public Transform pinza;  // La muñeca/efector final

    // Variables de ángulo para cada articulación, con sus respectivos rangos
    // Cada ángulo controlará la rotación en un eje específico para cada articulación
    [Header("Control de Ángulos de Articulación (Sliders)")]
    [Range(-180f, 180f)] // Hombro: Rotación en Y (pan)
    public float anguloBrazo1Y = 0f;
    [Range(-90f, 90f)]   // Codo: Rotación en X (pitch)
    public float anguloBrazo2X = 0f;
    [Range(-90f, 90f)]   // Pinza: Rotación en Y (yaw) o Z (roll)
    public float anguloPinzaY = 0f; // Puedes cambiar a Z si prefieres otro movimiento de muñeca

    [Header("Animación Automática")]
    public bool animarAutomaticamente = false;
    public float velocidadAnimacion = 1f; // Ajusta la velocidad de la animación

    [Header("Visualización")]
    public LineRenderer trayectoriaLineRenderer;
    public int maxPuntosTrayectoria = 100;
    private Vector3[] puntosTrayectoria;
    private int puntoActualTrayectoria = 0;

    void Start()
    {
        if (trayectoriaLineRenderer != null)
        {
            trayectoriaLineRenderer.positionCount = 0;
            puntosTrayectoria = new Vector3[maxPuntosTrayectoria];
            // Asegurarse de que el LineRenderer tenga un material asignado para que sea visible
            if (trayectoriaLineRenderer.material == null)
            {
                Debug.LogWarning("Line Renderer sin material. Asignando material por defecto.");
                trayectoriaLineRenderer.material = new Material(Shader.Find("Sprites/Default"));
                trayectoriaLineRenderer.startColor = Color.red;
                trayectoriaLineRenderer.endColor = Color.red;
                trayectoriaLineRenderer.startWidth = 0.05f;
                trayectoriaLineRenderer.endWidth = 0.05f;
            }
        }
    }

    void Update()
    {
        // Animación automática (opcional)
        if (animarAutomaticamente)
        {
            // Movimiento del hombro (Brazo1) en Y
            anguloBrazo1Y = Mathf.Sin(Time.time * velocidadAnimacion * 0.5f) * 90f; // Oscila entre -90 y 90

            // Movimiento del codo (Brazo2) en X
            anguloBrazo2X = Mathf.Sin(Time.time * velocidadAnimacion * 0.7f + 1f) * 75f; // Oscila entre -75 y 75

            // Movimiento de la pinza (muñeca) en Y
            anguloPinzaY = Mathf.Sin(Time.time * velocidadAnimacion * 1.0f + 2f) * 45f; // Oscila entre -45 y 45
        }

        // Aplicar rotaciones a los segmentos del brazo
        // CADA ARTICULACIÓN GIRA EN SU PROPIO EJE LOCAL ESPECÍFICO

        if (brazo1 != null)
        {
            // Rotación del "hombro" alrededor del eje Y local de la Base/Brazo1
            brazo1.localRotation = Quaternion.Euler(0f, anguloBrazo1Y, 0f);
        }

        if (brazo2 != null)
        {
            // Rotación del "codo" alrededor del eje X local de Brazo2
            // Esto hará que Brazo2 se doble hacia arriba/abajo en relación a Brazo1
            brazo2.localRotation = Quaternion.Euler(anguloBrazo2X, 0f, 0f);
        }

        if (pinza != null)
        {
            // Rotación de la "muñeca" alrededor del eje Y local de la Pinza
            // Esto hará que la pinza gire sobre sí misma en relación a Brazo2
            pinza.localRotation = Quaternion.Euler(0f, anguloPinzaY, 0f);
            // Si prefieres que la pinza se "incline" lateralmente, usa el eje Z:
            // pinza.localRotation = Quaternion.Euler(0f, 0f, anguloPinzaY);
        }

        // Visualizar la trayectoria del extremo
        ActualizarTrayectoria();
    }

    // --- MÉTODOS PARA RECIBIR EL VALOR DEL SLIDER ---
    // Asegúrate de enlazar cada slider con el método correspondiente
    public void SetAngleBrazo1Y(float value)
    {
        anguloBrazo1Y = value;
    }

    public void SetAngleBrazo2X(float value)
    {
        anguloBrazo2X = value;
    }

    public void SetAnglePinzaY(float value)
    {
        anguloPinzaY = value;
    }

    void ActualizarTrayectoria()
    {
        if (trayectoriaLineRenderer != null && pinza != null)
        {
            Vector3 puntaPinza = pinza.position; // La posición global de la Pinza

            if (puntoActualTrayectoria < maxPuntosTrayectoria)
            {
                puntosTrayectoria[puntoActualTrayectoria] = puntaPinza;
                puntoActualTrayectoria++;
            }
            else
            {
                // Mueve todos los puntos hacia atrás y añade el nuevo al final
                for (int i = 0; i < maxPuntosTrayectoria - 1; i++)
                {
                    puntosTrayectoria[i] = puntosTrayectoria[i + 1];
                }
                puntosTrayectoria[maxPuntosTrayectoria - 1] = puntaPinza;
            }

            trayectoriaLineRenderer.positionCount = puntoActualTrayectoria;
            for (int i = 0; i < puntoActualTrayectoria; i++)
            {
                trayectoriaLineRenderer.SetPosition(i, puntosTrayectoria[i]);
            }
        }
    }
}