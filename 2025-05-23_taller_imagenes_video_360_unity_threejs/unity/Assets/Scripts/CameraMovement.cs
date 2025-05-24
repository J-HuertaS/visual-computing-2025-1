using UnityEngine;

public class CameraMovement : MonoBehaviour
{
    public float movementSpeed = 5.0f; // Velocidad de movimiento
    public float rotationSpeed = 2.0f; // Velocidad de rotación con el mouse

    private float yaw = 0.0f;
    private float pitch = 0.0f;

    void Start()
    {
        // Opcional: Bloquear y ocultar el cursor para una mejor experiencia de "primera persona"
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
    }

    void Update()
    {
        // === ROTACIÓN DE LA CÁMARA (Mouse Look) ===
        // Obtener el movimiento del mouse
        yaw += rotationSpeed * Input.GetAxis("Mouse X");
        pitch -= rotationSpeed * Input.GetAxis("Mouse Y");

        // Limitar la inclinación vertical para evitar voltearse
        pitch = Mathf.Clamp(pitch, -90f, 90f);

        // Aplicar la rotación a la cámara
        transform.eulerAngles = new Vector3(pitch, yaw, 0.0f);

        // === MOVIMIENTO DE LA CÁMARA (Teclado) ===
        float horizontal = Input.GetAxis("Horizontal"); // A/D o Flecha izquierda/derecha
        float vertical = Input.GetAxis("Vertical");   // W/S o Flecha arriba/abajo

        // Calcular el vector de movimiento
        Vector3 moveDirection = transform.right * horizontal + transform.forward * vertical;
        moveDirection.Normalize(); // Normalizar para evitar mayor velocidad diagonal

        // Mover la cámara
        transform.position += moveDirection * movementSpeed * Time.deltaTime;

        // Opcional: Liberar el cursor con Escape
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }
    }
}