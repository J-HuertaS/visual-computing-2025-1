using UnityEngine;

public class VisualizadorTrayecto : MonoBehaviour
{
    public Transform puntoInicio;
    public Transform puntoFinal;

    void OnDrawGizmos()
    {
        if (!puntoInicio || !puntoFinal) return;

        Gizmos.color = Color.green;
        for (float t = 0; t < 1f; t += 0.05f)
        {
            Vector3 puntoA = Vector3.Lerp(puntoInicio.position, puntoFinal.position, t);
            Vector3 puntoB = Vector3.Lerp(puntoInicio.position, puntoFinal.position, t + 0.05f);
            Gizmos.DrawLine(puntoA, puntoB);
        }
    }
}

