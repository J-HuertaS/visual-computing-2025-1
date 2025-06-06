using UnityEngine;

public class ColisionParticulas : MonoBehaviour
{
    public ParticleSystem efecto;
    public AudioSource sonido;
    
    private void OnCollisionEnter(Collision collision)
    {
        if (efecto != null)
        {
            efecto.transform.position = collision.contacts[0].point;
            efecto.Play();
            if (sonido != null) sonido.Play();
        }
    }
}
