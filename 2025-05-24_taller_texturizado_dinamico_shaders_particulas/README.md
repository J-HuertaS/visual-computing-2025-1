# 🧪 Taller - Texturizado Creativo: Materiales Dinámicos con Shaders y Partículas

## 📅 Fecha
`2025-05-24` – Fecha de realización

---

## 🎯 Objetivo del Taller

Este taller busca capacitar a los participantes en la creación de materiales dinámicos que respondan en tiempo real a entradas como el tiempo, el movimiento del mouse o interacciones del usuario, utilizando shaders personalizados en Three.js con React Three Fiber. Además, se integran sistemas de partículas para complementar los efectos visuales, simulando fenómenos como energía pulsante o explosiones, logrando una experiencia visual interactiva y atractiva.

---

## 🧠 Conceptos Aprendidos

Principales conceptos aplicados:

- [x] **Creación de Materiales Dinámicos con Shaders:** Implementación de un `ShaderMaterial` con vertex y fragment shaders para generar efectos visuales animados, como patrones de ruido que simulan líquidos o energía.
- [x] **Uso de Ruido Simplex en Shaders:** Aplicación de la función de ruido simplex para crear patrones orgánicos y animados en el material, combinando múltiples capas de ruido con diferentes escalas y velocidades.
- [x] **Interacción con el Mouse:** Modificación del material en tiempo real basada en la posición del mouse, añadiendo un efecto de influencia que altera el patrón de ruido cerca del cursor.
- [x] **Sistema de Partículas Dinámico:** Creación de un sistema de partículas usando `Mesh` con geometrías esféricas, distribuidas en una esfera alrededor del objeto central, con movimiento ondulante y capacidad de dispersión al interactuar.
- [x] **Efecto de Explosión Interactivo:** Implementación de un efecto de explosión al hacer clic, donde las partículas se dispersan con velocidades aleatorias y regresan a su posición original tras un tiempo definido.
- [x] **Controles Dinámicos con Leva:** Uso de la biblioteca `leva` para ajustar parámetros en tiempo real, como la intensidad y velocidad del shader, el número de partículas, su tamaño y color.
- [x] **Gestión de Recursos en Three.js:** Actualización eficiente de geometrías y materiales de partículas cuando cambian los parámetros, evitando fugas de memoria mediante la liberación de recursos obsoletos.
- [x] **Animación con useFrame:** Utilización del hook `useFrame` para actualizar los uniforms del shader y las posiciones de las partículas en cada frame, asegurando una animación fluida.

---

## 🔧 Herramientas y Entornos

- Entorno de desarrollo: Vite con React
- Librerías: `@react-three/fiber`, `@react-three/drei`, `three`, `leva`

---

## 📁 Estructura del Proyecto

```
2025-05-24_taller_texturizado_dinamico_shaders_particulas/
├── threejs/
│   ├── creative-texturing/
├── resultados/
│   ├── explosion_effect.gif
│   ├── particles_system3.gif
│   ├── particles_system2.gif
│   ├── particles_system1.gif
│   ├── shader_material.gif
├── README.md
```

El componente principal `creative-texturing.tsx` contiene la lógica de la escena, el material dinámico con shaders y el sistema de partículas.

---

## 🧪 Implementación

### 🔹 Etapas realizadas

#### Material dinámico con shaders
1. Creación de un `ShaderMaterial` con vertex y fragment shaders.
2. Implementación de ruido simplex para patrones animados.
3. Integración de interacción con el mouse para modificar el material.
4. Uso de controles `leva` para ajustar intensidad y velocidad.

#### Sistema de partículas
1. Generación de partículas como mallas esféricas distribuidas en una esfera.
2. Animación ondulante basada en funciones sinusoidales.
3. Actualización dinámica del número, tamaño y color de partículas.
4. Gestión eficiente de recursos al cambiar parámetros.

#### Efecto de explosión
1. Dispersión de partículas con velocidades aleatorias al hacer clic.
2. Regreso suave a las posiciones originales tras 2 segundos.
3. Coordinación entre el material y las partículas para un efecto integrado.

### 🔹 Código relevante

**Fragment Shader**:
```glsl
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uIntensity;
uniform float uSpeed;
varying vec2 vUv;
varying vec3 vNormal;

float snoise(vec2 v) { /* Implementación de ruido simplex */ }

void main() {
  vec2 mouseDirection = uMouse - vUv;
  float mouseDistance = length(mouseDirection);
  float noise1 = snoise(vUv * 3.0 + uTime * uSpeed * 0.1);
  float noise2 = snoise(vUv * 5.0 - uTime * uSpeed * 0.15);
  float noise3 = snoise(vUv * 8.0 + uTime * uSpeed * 0.2);
  float combinedNoise = (noise1 + noise2 * 0.5 + noise3 * 0.25) * 0.5 + 0.5;
  float mouseInfluence = smoothstep(0.5, 0.0, mouseDistance) * 2.0;
  combinedNoise = mix(combinedNoise, 1.0, mouseInfluence * 0.5);
  vec3 finalColor = mix(uColor1, uColor2, combinedNoise);
  float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
  finalColor += vec3(1.0, 1.0, 1.0) * fresnel * uIntensity;
  float pulse = sin(uTime * uSpeed) * 0.5 + 0.5;
  finalColor *= 1.0 + pulse * 0.2 * uIntensity;
  gl_FragColor = vec4(finalColor, 1.0);
}
```

**Sistema de Partículas**:
```jsx
function ParticleSystem({ exploding, count, size, color }) {
  const groupRef = useRef();
  const particlesRef = useRef([]);
  useEffect(() => {
    // Crear o actualizar partículas dinámicamente
    /* Lógica para añadir o remover partículas */
  }, [count, size, color]);
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    particlesRef.current.forEach((particle, index) => {
      if (exploding) {
        particle.position.add(particle.userData.velocity);
      } else {
        const origPos = particle.userData.originalPosition;
        const xOffset = Math.sin(time * 0.5 + index * 0.01) * 0.01;
        particle.position.lerp(
          new THREE.Vector3(origPos.x + xOffset, origPos.y, origPos.z),
          0.05
        );
      }
    });
  });
  return <group ref={groupRef} />;
}
```

---

## 📊 Resultados Visuales

### 📌 Este taller **requiere explícitamente GIFs animados**:

#### Material dinámico con shader

![shader_material](https://github.com/user-attachments/assets/a798d440-c6d9-46ca-9817-5ba42dfc833e)


El shader combina ruido simplex animado con una transición de colores (`#00aaff` a `#ff00aa`) y responde al movimiento del mouse, creando un efecto de energía pulsante.

#### Sistema de partículas

Las partículas, distribuidas alrededor de la esfera, tienen un movimiento ondulante y cambian dinámicamente según los controles de `leva` (número, tamaño y color).

### Número

![particles_system1](https://github.com/user-attachments/assets/95ab2c43-5354-4d24-bfd9-656d1738207f)

### Tamaño 

![particles_system2](https://github.com/user-attachments/assets/a0f03b23-6d74-4f45-bdab-0d414fe4e0ce)

### Color

![particles_system3](https://github.com/user-attachments/assets/29a09e4d-3bdd-4d07-94fd-3fc30bbc31b9)


Al hacer clic, las partículas se dispersan con velocidades aleatorias y regresan a su posición original, complementando el material dinámico.

#### Efecto de explosión

![explosion_effect](https://github.com/user-attachments/assets/d1dc58bd-b266-443b-af09-2cf7901dd316)


---

## 🧩 Prompts Usados

```text
Crea un código en React Three Fiber que implemente un ShaderMaterial con ruido simplex para simular un efecto de líquido o energía, respondiendo al tiempo y al movimiento del mouse.
```

```text
Ayúdame a implementar un sistema de partículas en Three.js con React Three Fiber que se distribuyan alrededor de una esfera y tengan un movimiento ondulante.
```

```text
Modifica este código para añadir un efecto de explosión de partículas al hacer clic, donde las partículas se dispersen y luego regresen a su posición original.
[Código del sistema de partículas]
```

```text
Estoy usando v0 para generar un proyecto en React Three Fiber. Quiero que me ayudes a implementar un material dinámico con shaders que use ruido para un efecto de energía y un sistema de partículas con un efecto de explosión al hacer clic.
```

---

## 💬 Reflexión Final

La implementación del material dinámico con ruido simplex fue fascinante, ya que permitió crear un efecto visual orgánico y fluido que simula energía pulsante. La integración del sistema de partículas añadió una capa de interactividad, especialmente con el efecto de explosión, que fue el aspecto más desafiante debido a la necesidad de coordinar las velocidades aleatorias y el retorno suave a las posiciones originales. La biblioteca `leva` resultó muy útil para experimentar con parámetros en tiempo real, aunque optimizar la actualización de partículas para evitar problemas de rendimiento fue un reto. En general, el taller permitió explorar la potencia de los shaders y las partículas para crear experiencias visuales inmersivas, y sería interesante añadir efectos de sonido o texturas adicionales en futuras iteraciones.

---

## ✅ Checklist de Entrega

- [x] Carpeta `2025-05-23_taller_texturizado_dinamico_shaders_particulas`
- [x] Código limpio y funcional (`creative-texturing.tsx`)
- [x] GIFs incluidos con nombres descriptivos
- [x] Visualizaciones exportadas
- [x] README completo y claro
- [x] Commits descriptivos en inglés

---
