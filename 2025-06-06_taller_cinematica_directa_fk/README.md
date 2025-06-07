# 🧪 Taller - Cinemática Directa: Animando Brazos Robóticos o Cadenas Articuladas

## 📅 Fecha

`2025-06-06` – Fecha de realización

---
## 🎯 Objetivo del Taller

Aplicar conceptos de cinemática directa (Forward Kinematics) para animar objetos enlazados como brazos robóticos, cadenas de huesos o criaturas segmentadas. El objetivo es comprender cómo rotaciones encadenadas afectan el movimiento y la posición de cada parte en una estructura jerárquica.

---

## 🧠 Conceptos Aprendidos

### ¿Qué es la Cinemática Directa?
La cinemática directa (Forward Kinematics) es el proceso de calcular la posición y orientación de las partes finales (por ejemplo, la mano de un robot) a partir de los ángulos de las articulaciones y las longitudes de los segmentos.
Es un enfoque jerárquico donde cada segmento depende del anterior, y las rotaciones se acumulan.

- [x] Cinemática directa (Forward Kinematics)
- [x] Transformaciones jerárquicas
- [x] Rotaciones locales y globales
- [x] Acumulación de transformaciones
- [x] Trail o trayectoria visual
- [x] Ejes locales vs ejes globales

---

## 🔧 Herramientas y Entornos

- Threejs
- Unity

---

## 📁 Estructura del Proyecto

```
2025-06-06_taller_cinematica_directa_fk
├── results/
│   └── threejs_result.py
│   └── unity_result.py
├── threejs/
├── unity/
│   └── Assets/
│   └── ProjectSettings/
│   └── Packages/
├── README.md
```
---

## 🧪 Implementación

### Implementación de la animación directa en Threejs

En el proyecto con React Three Fiber, se representó un brazo robótico con 3 segmentos conectados mediante groups jerárquicos.
Cada grupo rota sobre su eje local, y estas rotaciones se propagan hacia los elementos hijos.

En resumen:
Se usaron referencias (ref) para controlar rotaciones de cada articulación.

Las rotaciones se aplicaron en cascada usando rotation.z = ....

La posición del extremo se calculó con getWorldPosition() para rastrear su trayectoria.

La UI con Leva permite ajustar manualmente los ángulos o activar animación automática.

### Implementación de la animación directa en Unity

La implementación de la Cinemática Directa del "brazo robótico" en Unity se realizó siguiendo estos pasos:

1. Jerarquía de Objetos: Se estableció una estructura padre-hijo (Base → Brazo1 → Brazo2 → Pinza) utilizando GameObjects y primitivos. Esta jerarquía es fundamental, ya que las rotaciones del padre se propagan automáticamente a los hijos, simulando el movimiento encadenado de un brazo.

2. Control de Ángulos por Articulación: Se definieron variables públicas (float) en un script C# (RobotArmController.cs) para almacenar el ángulo de rotación deseado para cada segmento del brazo (anguloBrazo1Y, anguloBrazo2X, anguloPinzaY).
Crucialmente, cada articulación se configuró para rotar en un eje local específico (e.g., Brazo1 en Y, Brazo2 en X), permitiendo así un movimiento tridimensional del brazo.

3. Aplicación de Rotaciones: En el método Update() del script, se aplicaron estas rotaciones a cada segmento utilizando transform.localRotation = Quaternion.Euler(x, y, z);. El uso de localRotation garantiza que las rotaciones se realicen en el espacio local de cada articulación.
4. Control por UI (Sliders): Se crearon métodos públicos (SetAngleBrazo1Y(float), etc.) en el script, que reciben el valor float de un Slider de la interfaz de usuario.
Cada Slider de la UI se enlazó a su respectivo método, permitiendo la manipulación interactiva de los ángulos de las articulaciones en tiempo real.

5. Visualización de Trayectoria: Se obtuvo la posición global del extremo final del brazo (pinza.position) en cada frame.
Un componente LineRenderer fue utilizado para dibujar una línea conectando estas posiciones a lo largo del tiempo, visualizando la trayectoria tridimensional que describe el efector final del brazo como resultado de las rotaciones aplicadas.
Esta configuración permite observar directamente cómo la manipulación de los ángulos de cada articulación, en una estructura jerárquica, determina la posición y movimiento del extremo del brazo robótico, validando los principios de la Cinemática Directa.

### 🔹 Código relevante

#### Threejs

```JavaScript
// Rotaciones encadenadas (Forward Kinematics)
if (autoAnimation) {
  baseRef.current.rotation.z = Math.sin(t)
  joint1Ref.current.rotation.z = Math.sin(t * 1.5)
  joint2Ref.current.rotation.z = Math.sin(t * 2)
} else {
  baseRef.current.rotation.z = angle1
  joint1Ref.current.rotation.z = angle2
  joint2Ref.current.rotation.z = angle3
}
```

```JavaScript
// Cálculo de la posición del extremo del brazo
tipRef.current.updateWorldMatrix(true, false)
const tipWorldPos = new THREE.Vector3()
tipRef.current.getWorldPosition(tipWorldPos)
```

```JavaScript
// Visualización de la trayectoria del extremo
trail.current.push(tipWorldPos.clone())
if (trail.current.length > 100) trail.current.shift()
const geometry = new THREE.BufferGeometry().setFromPoints(trail.current)
lineRef.current.geometry.dispose()
lineRef.current.geometry = geometry
```

El primer bloque muestra cómo se aplican rotaciones progresivas a cada articulación, lo que genera el movimiento jerárquico característico de la cinemática directa. El segundo bloque obtiene la posición absoluta del extremo mediante la matriz global, y el tercero registra su trayectoria visual.

#### Unity

A continuación se presentan los fragmentos de código más relevantes que ilustran la implementación de la Cinemática Directa y su control en Unity:

1. Declaración de Variables de Ángulo y Referencias a Segmentos:

Este fragmento muestra las referencias a los Transform de cada segmento del brazo y las variables públicas que almacenan los ángulos de las articulaciones. [Range] es relevante para la configuración en el Inspector.

```C#
public class RobotArmController : MonoBehaviour
{
    [Header("Referencias a los segmentos del brazo")]
    public Transform brazo1; // El hombro
    public Transform brazo2; // El codo
    public Transform pinza;  // La muñeca/efector final

    [Header("Control de Ángulos de Articulación (Sliders)")]
    [Range(-180f, 180f)]
    public float anguloBrazo1Y = 0f;
    [Range(-90f, 90f)]
    public float anguloBrazo2X = 0f;
    [Range(-90f, 90f)]
    public float anguloPinzaY = 0f;

    // ... otras variables ...
}
```

2. Aplicación de Rotaciones en el Método Update():

Este es el corazón de la Cinemática Directa. Muestra cómo se utilizan los ángulos para aplicar rotaciones locales a cada segmento en sus ejes correspondientes.

```C#
void Update()
{
    // ... animación automática opcional ...

    if (brazo1 != null)
    {
        // Rotación del "hombro" alrededor del eje Y local
        brazo1.localRotation = Quaternion.Euler(0f, anguloBrazo1Y, 0f);
    }

    if (brazo2 != null)
    {
        // Rotación del "codo" alrededor del eje X local
        brazo2.localRotation = Quaternion.Euler(anguloBrazo2X, 0f, 0f);
    }

    if (pinza != null)
    {
        // Rotación de la "muñeca" alrededor del eje Y local
        pinza.localRotation = Quaternion.Euler(0f, anguloPinzaY, 0f);
    }

    ActualizarTrayectoria(); // Llamada a la función de visualización
}
```

3. Métodos para el Control por UI (Sliders):

Estos métodos públicos son los "setters" que permiten que los Sliders de la interfaz de usuario modifiquen directamente los valores de los ángulos de las articulaciones. Son cruciales para la interacción.

```C#
// --- MÉTODOS PARA RECIBIR EL VALOR DEL SLIDER ---
public void SetAngleBrazo1Y(float value)
{
    anguloBrazo1Y = value;
}

public void SetAngleBrazo2X(float value)
{
    anguloBrazo2X = value;
}

public void SetAnglePinzaY(float value)
{
    anguloPinzaY = value;
}
```

4. Captura y Visualización de la Trayectoria del Efector Final:

Este fragmento muestra cómo se obtiene la posición global del efector final (pinza.position) y cómo se utiliza un LineRenderer para dibujar la trayectoria, demostrando el resultado acumulado de las transformaciones FK.

```C#
void ActualizarTrayectoria()
{
    if (trayectoriaLineRenderer != null && pinza != null)
    {
        Vector3 puntaPinza = pinza.position; // La posición global de la Pinza

        // Almacenamiento cíclico de puntos para la trayectoria
        if (puntoActualTrayectoria < maxPuntosTrayectoria)
        {
            puntosTrayectoria[puntoActualTrayectoria] = puntaPinza;
            puntoActualTrayectoria++;
        }
        else
        {
            for (int i = 0; i < maxPuntosTrayectoria - 1; i++)
            {
                puntosTrayectoria[i] = puntosTrayectoria[i + 1];
            }
            puntosTrayectoria[maxPuntosTrayectoria - 1] = puntaPinza;
        }

        // Actualizar LineRenderer con los puntos
        trayectoriaLineRenderer.positionCount = puntoActualTrayectoria;
        for (int i = 0; i < puntoActualTrayectoria; i++)
        {
            trayectoriaLineRenderer.SetPosition(i, puntosTrayectoria[i]);
        }
    }
}
```

## 📊 Resultados Visuales
Los resultados obtenidos se pueden ver a continuación: 

### Threejs



### Unity



---

## 🧩 Prompts Usados

Se realiza la siguiente consulta a la IA Grok:

```text
Explicame de forma simple qué es cinemática directa y en que casos se suele usar
```

```text
Estoy trabajando en Threejs. Genera un codigo para simular un brazo con <mesh> conectados jerárquicamente dentro de <group>s (que sean 3 cubos representando eslabones de un brazo). Y a todo esto, aplicar rotaciones progresivas desde useFrame(), teniendo en cuenta los siguientes requisitos:

- Cada elemento se rota respecto a su padre.
- Usar ref.current.rotation.z = Math.sin(clock.elapsedTime) o similar. 

Además, se debe poder visualizar una línea que trace el movimiento del extremo con Line o almacenando posiciones. Y para finalizar, quiero que existan sliders con leva para ajustar manualmente cada ángulo de rotación.
```

```text
Estoy trabajando en Unity (versión LTS). Genera un código para simular un brazo con una jerarquía de objetos (usando GameObjects vacíos y primitivos) conectados jerárquicamente (por ejemplo: Base → Brazo1 → Brazo2 → Pinza).

Aplica rotaciones encadenadas desde la base usando un script en C#, teniendo en cuenta los siguientes requisitos:

Cada objeto se rota respecto a su padre.

Usar Mathf.Sin(Time.time) o similar para animar cada articulación.

Aplicar transform.Rotate() o modificar localRotation para las rotaciones.

Además, se debe visualizar la trayectoria del extremo (pinza) usando Debug.DrawLine() o un objeto marcador que siga el movimiento.

Y para finalizar, quiero que existan sliders en la UI para ajustar manualmente cada ángulo de rotación.
```

---

## 💬 Reflexión Final

En este taller aprendí a implementar cinemática directa para animar estructuras jerárquicas como brazos robóticos o cadenas articuladas. Comprendí que el movimiento de cada eslabón depende de la rotación acumulada de sus padres, lo que implica que las transformaciones deben aplicarse de forma encadenada para lograr un movimiento coherente.

También valoré la importancia de controlar las rotaciones tanto de forma automática (mediante funciones matemáticas como Mathf.Sin o Math.sin) como manual (a través de sliders o controles UI), lo que facilita la exploración y ajuste fino de los movimientos.

La visualización de la trayectoria del extremo permitió entender mejor el recorrido espacial y verificar la correcta aplicación de las rotaciones. Esto es fundamental para aplicaciones prácticas como robótica, animación o simulaciones físicas.

Finalmente, este ejercicio reforzó mis conocimientos sobre jerarquías de objetos en motores gráficos y cómo la manipulación de transformaciones locales afecta la posición y orientación global, así como la relevancia de estructurar el código de manera modular y documentada para facilitar su comprensión y mantenimiento.