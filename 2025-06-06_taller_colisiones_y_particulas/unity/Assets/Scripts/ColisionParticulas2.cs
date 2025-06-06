using UnityEngine;

public class ColisionParticulas2 : MonoBehaviour
{
    public ParticleSystem efecto;
    public AudioSource sonido;
    
    private void OnTriggerEnter(Collider other)
    {
        if (efecto != null)
        {
            efecto.transform.position = transform.position;
            efecto.Play();
            if (sonido != null) sonido.Play();
        }
    }

}
