using UnityEngine;

public class InterpoladorMovimiento : MonoBehaviour
{
    public Transform puntoInicio;
    public Transform puntoFinal;
    public float duracion = 3f;
    public AnimationCurve curvaMovimiento; // para ease-in/out
    public bool usarBezier = false;

    private float tiempo;
    private bool enMovimiento = true;

    void Update()
    {
        if (!enMovimiento) return;

        tiempo += Time.deltaTime / duracion;
        float t = curvaMovimiento.Evaluate(Mathf.Clamp01(tiempo));

        if (usarBezier)
        {
            Vector3 puntoMedio = (puntoInicio.position + puntoFinal.position) / 2 + Vector3.up * 5;
            transform.position = Bezier(puntoInicio.position, puntoMedio, puntoFinal.position, t);
        }
        else
        {
            transform.position = Vector3.Lerp(puntoInicio.position, puntoFinal.position, t);
        }

        Quaternion rotInicial = Quaternion.LookRotation(Vector3.right);
        Quaternion rotFinal = Quaternion.LookRotation(Vector3.left);
        transform.rotation = Quaternion.Slerp(rotInicial, rotFinal, t);
    }

    Vector3 Bezier(Vector3 a, Vector3 b, Vector3 c, float t)
    {
        Vector3 ab = Vector3.Lerp(a, b, t);
        Vector3 bc = Vector3.Lerp(b, c, t);
        return Vector3.Lerp(ab, bc, t);
    }
}
