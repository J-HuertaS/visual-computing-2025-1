using UnityEngine;

public class ResetPosition : MonoBehaviour
{
    public GameObject cube;

    public void ResetCube()
    {
        Debug.Log("🟢 Botón presionado");

        if (cube != null)
        {
            // Detener el seguimiento
            FollowCursor seguidor = cube.GetComponent<FollowCursor>();
            if (seguidor != null)
            {
                seguidor.seguirCursor = false;  // 🟥 Desactiva el seguimiento
                Debug.Log("🔴 Se desactivó el seguimiento del cursor");
            }

            // Reiniciar posición
            cube.transform.position = new Vector3(0.21f, 0.08f, 18.35f);
            PlayerPrefs.DeleteAll();
        }
        else
        {
            Debug.LogWarning("❌ Cubo no asignado en el botón");
        }
    }
}
