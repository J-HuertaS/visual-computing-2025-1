using UnityEngine;
using NativeWebSocket; // Importa la librería NativeWebSocket
using System;
using System.Collections; // Para Coroutines
using Newtonsoft.Json; // Necesitarás una librería para parsear JSON, ver paso 4

// Definimos una clase para la estructura de los datos que esperamos del WebSocket
[System.Serializable]
public class WebSocketData
{
    public float x;
    public float y;
    public string color; // El color hexadecimal en string
}

public class WebSocketClient : MonoBehaviour
{
    WebSocket websocket;
    public GameObject targetSphere; // Referencia a la esfera que controlaremos

    // Start is called before the first frame update
    async void Start()
    {
        // Crea una nueva instancia de WebSocket
        // Asegúrate de que la IP y el puerto coincidan con tu servidor Python
        websocket = new WebSocket("ws://localhost:8765");

        // Evento cuando la conexión se abre
        websocket.OnOpen += () =>
        {
            Debug.Log("Conexión WebSocket abierta!");
        };

        // Evento cuando se recibe un mensaje
        websocket.OnMessage += (bytes) =>
        {
            // Convertir bytes a string
            var message = System.Text.Encoding.UTF8.GetString(bytes);
            Debug.Log("Mensaje recibido: " + message);

            // Intentar parsear el JSON
            try
            {
                WebSocketData data = JsonConvert.DeserializeObject<WebSocketData>(message);

                // Asegúrate de que la actualización de la UI/objetos se haga en el hilo principal
                // Las callbacks de WebSocket no siempre están en el hilo principal
                UnityMainThreadDispatcher.Instance().Enqueue(() =>
                {
                    UpdateSphere(data);
                });

            }
            catch (Exception e)
            {
                Debug.LogError("Error al parsear JSON: " + e.Message);
            }
        };

        // Evento cuando la conexión se cierra
        websocket.OnClose += (e) =>
        {
            Debug.Log("Conexión WebSocket cerrada con código: " + e);
        };

        // Evento si ocurre un error
        websocket.OnError += (e) =>
        {
            Debug.LogError("Error en WebSocket: " + e);
        };

        // Inicia la conexión WebSocket
        await websocket.Connect();
    }

    void Update()
    {
        // Esto es necesario para que NativeWebSocket procese los mensajes entrantes
        // y dispare los eventos OnOpen, OnMessage, etc.
        #if !UNITY_WEBGL || UNITY_EDITOR
            websocket.DispatchMessageQueue();
        #endif
    }

    void UpdateSphere(WebSocketData data)
    {
        if (targetSphere != null)
        {
            // Actualizar posición
            targetSphere.transform.position = new Vector3(data.x, data.y, 0); // Z en 0 para 2D o ajusta según tu escena

            // Actualizar color
            Color newColor;
            if (ColorUtility.TryParseHtmlString(data.color, out newColor))
            {
                // Busca el Renderer del GameObject para cambiar su material
                Renderer sphereRenderer = targetSphere.GetComponent<Renderer>();
                if (sphereRenderer != null && sphereRenderer.material != null)
                {
                    sphereRenderer.material.color = newColor;
                }
            }
            else
            {
                Debug.LogWarning("Color inválido recibido: " + data.color);
            }
        }
    }

    // Asegúrate de cerrar la conexión cuando la aplicación se detiene
    private async void OnApplicationQuit()
    {
        if (websocket != null && websocket.State == WebSocketState.Open)
        {
            await websocket.Close();
        }
    }
}