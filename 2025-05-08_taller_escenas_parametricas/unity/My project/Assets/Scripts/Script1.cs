//Se importan todas las dependencias necesarias
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.IO;

//Se crea una clase ObjetoGenerador
public class ObjetoGenerador : MonoBehaviour
{
    //Se crean dos ssliders y un botón para un archivoJSON
    public TextAsset archivoJSON;
    public Slider escalaSlider;
    public Slider rotacionSlider;

    /*Se crea una clase de datos de objeto, entre sus atributos esta su posición, su color,
    su escala, e incluso el tipo de objeto, ya que tendremos esferas, cubos, y cilindros*/ 
    [System.Serializable]
    public class ObjetoData
    {
        public Vector3 posicion;
        public string tipo; 
        public Color color;
        public Vector3 escala;
    }

    //Se crean dos listas para las instancias de datos de objetos y objetos creados
    public List<ObjetoData> datos = new List<ObjetoData>();
    private List<GameObject> objetosCreados = new List<GameObject>();

    /*La función start es la que se encarga de inicializar las cosas importantes para la escena,
    cómo llamar a la función que carga los datos, revisar si hay cambios en los sliders y botones, 
    y llamar a las funciones de aplicación de escala y rotación*/
    void Start()
    {
        CargarDesdeJSON();

        if (escalaSlider != null)
            escalaSlider.onValueChanged.AddListener(delegate { AplicarEscala(escalaSlider.value); });

        if (rotacionSlider != null)
            rotacionSlider.onValueChanged.AddListener(delegate { AplicarRotacion(rotacionSlider.value); });
    }

    /*Este método de generar objetos permite crear los objetos con CreatePrimitive, y define el tipo primitivo 
    de acuerdo al tipo de objeto que se indica en los datos, además aplica una escala y una rotación
    según lo que se indice en los sliders de la escena*/
    public void GenerarObjetos()
    {
        Limpiar();

        foreach (var dato in datos)
        {
            PrimitiveType tipo = PrimitiveType.Cube;
            if (dato.tipo == "esfera") tipo = PrimitiveType.Sphere;
            else if (dato.tipo == "cilindro") tipo = PrimitiveType.Cylinder;

            GameObject obj = GameObject.CreatePrimitive(tipo);
            obj.transform.position = dato.posicion;
            obj.transform.localScale = dato.escala;

            Renderer rend = obj.GetComponent<Renderer>();
            rend.material.color = dato.color;

            objetosCreados.Add(obj);
        }

        if (escalaSlider != null) AplicarEscala(escalaSlider.value);
        if (rotacionSlider != null) AplicarRotacion(rotacionSlider.value);
    }

    /*Este método limpiar se encarga de eliminar los objetos de la escena*/
    public void Limpiar()
    {
        foreach (var obj in objetosCreados)
        {
            Destroy(obj);
        }
        objetosCreados.Clear();
    }

    /*Este método carga los datos desde un archivo JSON y luego le pasa los datos a generar objetos*/
    public void CargarDesdeJSON()
    {
        datos = JsonUtility.FromJson<Wrapper>("{\"lista\":" + archivoJSON.text + "}").lista;
        GenerarObjetos();
    }

    /*Esta función se encarga de generar una escala para cada uno de los objetos creados, esta se vincula al slider de escala*/
    public void AplicarEscala(float factor)
    {
        foreach (var obj in objetosCreados)
        {
            obj.transform.localScale = Vector3.one * factor;
        }
    }

    /*Esta función se encarga de generar una rotación para cada uno de los objetos creados, esta se vincula al slider de rotación*/
    public void AplicarRotacion(float angulo)
    {
        foreach (var obj in objetosCreados)
        {
            obj.transform.rotation = Quaternion.Euler(0, angulo, 0);
        }
    }

    /*Esta función exporta los objetos en un archivo JSON, esta función se asocia a un botón de exportar que se muestra en la escena*/
    public void ExportarJSON()
    {
        List<ObjetoData> exportar = new List<ObjetoData>();

        foreach (var obj in objetosCreados)
        {
            var tipo = obj.name.ToLower().Contains("sphere") ? "esfera" :
                       obj.name.ToLower().Contains("cylinder") ? "cilindro" : "cubo";

            var color = obj.GetComponent<Renderer>().material.color;

            exportar.Add(new ObjetoData
            {
                posicion = obj.transform.position,
                tipo = tipo,
                color = color,
                escala = obj.transform.localScale
            });
        }

        string json = JsonUtility.ToJson(new Wrapper { lista = exportar }, true);
        File.WriteAllText(Application.dataPath + "/exportado.json", json);
        Debug.Log("Exportado en: " + Application.dataPath + "/exportado.json");
    }

    [System.Serializable]
    private class Wrapper
    {
        public List<ObjetoData> lista;
    }
}

