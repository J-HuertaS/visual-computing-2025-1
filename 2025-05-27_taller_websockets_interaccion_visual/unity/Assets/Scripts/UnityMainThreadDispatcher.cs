// src/UnityMainThreadDispatcher.cs
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Este script permite ejecutar acciones en el hilo principal de Unity
// desde otros hilos (como los callbacks de WebSocket).
public class UnityMainThreadDispatcher : MonoBehaviour
{
    private static readonly Queue<Action> _executionQueue = new Queue<Action>();
    private static UnityMainThreadDispatcher _instance;

    public static UnityMainThreadDispatcher Instance()
    {
        if (_instance == null)
        {
            _instance = FindObjectOfType<UnityMainThreadDispatcher>();
            if (_instance == null)
            {
                GameObject dispatcher = new GameObject("UnityMainThreadDispatcher");
                _instance = dispatcher.AddComponent<UnityMainThreadDispatcher>();
                DontDestroyOnLoad(dispatcher);
            }
        }
        return _instance;
    }

    public void Enqueue(Action action)
    {
        lock (_executionQueue)
        {
            _executionQueue.Enqueue(action);
        }
    }

    void Update()
    {
        lock (_executionQueue)
        {
            while (_executionQueue.Count > 0)
            {
                _executionQueue.Dequeue().Invoke();
            }
        }
    }
}