using UnityEngine;

[RequireComponent(typeof(LineRenderer))]
public class CurvaBezierRenderer : MonoBehaviour
{
    public Transform puntoInicio;
    public Transform puntoFinal;
    public bool usarBezier = true;
    public int resolucion = 20;

    private LineRenderer line;

    void Start()
    {
        line = GetComponent<LineRenderer>();
        line.positionCount = resolucion + 1;
    }

    void Update()
    {
        if (!puntoInicio || !puntoFinal) return;

        Vector3[] puntos = new Vector3[resolucion + 1];

        for (int i = 0; i <= resolucion; i++)
        {
            float t = i / (float)resolucion;

            if (usarBezier)
            {
                // Control en el centro elevado
                Vector3 control = (puntoInicio.position + puntoFinal.position) / 2 + Vector3.up * 5;
                puntos[i] = Bezier(puntoInicio.position, control, puntoFinal.position, t);
            }
            else
            {
                puntos[i] = Vector3.Lerp(puntoInicio.position, puntoFinal.position, t);
            }
        }

        line.SetPositions(puntos);
    }

    Vector3 Bezier(Vector3 a, Vector3 b, Vector3 c, float t)
    {
        Vector3 ab = Vector3.Lerp(a, b, t);
        Vector3 bc = Vector3.Lerp(b, c, t);
        return Vector3.Lerp(ab, bc, t);
    }
}
