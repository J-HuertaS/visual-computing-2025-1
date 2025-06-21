using UnityEngine;
using UnityEngine.AI;

public class Patrullaje : MonoBehaviour
{
    public Transform[] puntos;                       // Puntos de patrullaje
    private int index = 0;

    private NavMeshAgent agent;
    private Transform jugador;
    private bool persiguiendo = false;

    private Animator animator;

    public float distanciaDetencion = 1.5f;          // Distancia mínima para detenerse al llegar al jugador

    // Variables para estado de búsqueda
    private Vector3 ultimaPosicionJugador;
    private bool buscando = false;
    public float tiempoBusqueda = 3f;
    private float temporizadorBusqueda = 0f;

    void Start()
    {
        agent = GetComponent<NavMeshAgent>();
        animator = GetComponent<Animator>();

        agent.speed = 0.8f;  // Velocidad normal de patrullaje

        if (puntos.Length > 0)
        {
            agent.SetDestination(puntos[0].position);
        }
    }

    void Update()
    {
        // Actualiza el parámetro de velocidad para el Animator
        animator.SetFloat("velocidad", agent.velocity.magnitude);

        if (buscando)
        {
            temporizadorBusqueda += Time.deltaTime;

            bool animacionTerminada = !animator.GetCurrentAnimatorStateInfo(0).IsName("Search");

            if (temporizadorBusqueda >= tiempoBusqueda && animacionTerminada)
            {
                buscando = false;
                agent.speed = 0.8f;
                index = (index + 1) % puntos.Length;
                agent.SetDestination(puntos[index].position);
            }

            return; // Evita que haga otras cosas mientras busca
        }



        // Si está persiguiendo al jugador
        if (persiguiendo && jugador != null)
        {
            float distancia = Vector3.Distance(transform.position, jugador.position);

            if (distancia > distanciaDetencion)
            {
                ultimaPosicionJugador = jugador.position; // Guarda última posición conocida
                agent.SetDestination(jugador.position);
                agent.speed = 3.1f;  // Velocidad de persecución
            }
            else
            {
                agent.ResetPath(); // Se detiene si está cerca
                agent.speed = 0f;
            }
        }
        // Si está patrullando
        else if (!agent.pathPending && agent.remainingDistance < 0.5f)
        {
            index = (index + 1) % puntos.Length;
            agent.SetDestination(puntos[index].position);
            agent.speed = 0.8f;
        }
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            jugador = other.transform;
            persiguiendo = true;
            buscando = false;
        }
    }

    void OnTriggerExit(Collider other)
{
    if (other.CompareTag("Player"))
    {
        jugador = null;
        persiguiendo = false;
        buscando = true;
        temporizadorBusqueda = 0f;

        agent.ResetPath(); // Detiene cualquier movimiento mientras busca
        animator.SetTrigger("buscar"); // Activa animación de búsqueda
    }
}

}
