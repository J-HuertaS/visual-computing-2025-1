using UnityEngine;
using UnityEngine.InputSystem;

public class FollowCursor : MonoBehaviour
{
    public Camera mainCamera;
    public bool seguirCursor = true;  // 🔹 Activar o desactivar seguimiento

    void Update()
    {
        if (seguirCursor)
        {
            // Obtener la posición del mouse con el nuevo Input System
            Vector2 mousePosition = Mouse.current.position.ReadValue();
            Vector3 worldPos = mainCamera.ScreenToWorldPoint(new Vector3(mousePosition.x, mousePosition.y, 5f));
            transform.position = worldPos;
        }

        // Detectar clic y cambiar color
        if (Mouse.current.leftButton.wasPressedThisFrame)
        {
            GetComponent<Renderer>().material.color = Random.ColorHSV();
        }
    }

    void Start()
    {
        float x = PlayerPrefs.GetFloat("x", transform.position.x);
        float y = PlayerPrefs.GetFloat("y", transform.position.y);
        float z = PlayerPrefs.GetFloat("z", transform.position.z);
        transform.position = new Vector3(x, y, z);
    }

    void OnApplicationQuit()
    {
        PlayerPrefs.SetFloat("x", transform.position.x);
        PlayerPrefs.SetFloat("y", transform.position.y);
        PlayerPrefs.SetFloat("z", transform.position.z);
        PlayerPrefs.Save();
    }
}
