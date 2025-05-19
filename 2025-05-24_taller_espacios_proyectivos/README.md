# 🧪 Workshop - Projective Spaces and Projection Matrices

## 📅 Date
`2025-04-XX` - Date of completion

---

## 🎯 Workshop Objective

Understand and implement projective spaces and projection matrices in Python, Three.js, and Processing. The goal is to visualize and compare perspective and orthogonal projections, exploring how parameters like focal distance affect 3D-to-2D transformations, using homogeneous coordinates and interactive controls.

---

## 🧠 Concepts Learned

The main concepts applied in this workshop were:

- [x] Homogeneous coordinates for 3D transformations  
- [x] Perspective projection matrices  
- [x] Orthogonal projection matrices  
- [x] Interactive visualization with sliders and controls  
- [x] Camera simulation in 3D environments  

## 📖 Brief Description of Implemented Projections

### Perspective Projection

Perspective projection simulates human vision, making distant objects appear smaller. It uses a frustum defined by a field of view, aspect ratio, and near/far planes. A projection matrix transforms 3D points into 2D, with homogeneous coordinates normalized to create the perspective effect.

### Orthogonal Projection

Orthogonal projection maps 3D points to 2D without depth-based scaling, preserving object sizes. It uses a box-shaped view volume defined by left, right, top, bottom, near, and far planes, resulting in parallel projection lines.

## 🔧 Tools and Environment

For this workshop, the following tools were used:

- **Python**: Jupyter Notebook with `numpy`, `matplotlib`, and `ipywidgets` for interactive visualization.
- **Three.js**: Next.js with `@react-three/fiber` and `@react-three/drei` for WebGL rendering.
- **Processing**: Processing IDE with P3D renderer for 3D graphics.

---

## 📁 Project Structure

```
2025-04-XX_taller_espacios_proyectivos/
├── python/
│   └── Espacios_Proyectivos_y_Matrices_de_Proyección.ipynb
│   └── proyecciones.png
├── threejs/
│   └── projective-spaces/
│   └── demo.gif
├── processing/
│   └── processing_spacesproyectives.pde
│   └── Perspectiva_Ortografica.gif
├── README.md
```

---

## 🧪 Implementation

The implementation was completed across three environments, with clear steps for each.

### 🔹 Python (Activity 1)

#### Steps Taken
1. Set up a Jupyter Notebook with `numpy`, `matplotlib`, and `ipywidgets`.
2. Define a 3D staircase using homogeneous coordinates.
3. Implement perspective and orthogonal projection matrices.
4. Create an interactive slider to adjust focal distance for perspective projection.
5. Visualize the 3D staircase and its 2D perspective and orthogonal projections.

#### Key Code
```python
from ipywidgets import interact
import numpy as np
import matplotlib.pyplot as plt

def proyectar_perspectiva(puntos, d=1.0):
    P = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 1/d, 0]
    ])
    puntos_hom = np.vstack((puntos, np.ones((1, puntos.shape[1]))))
    proy = P @ puntos_hom
    proy[-1, :] = np.where(proy[-1, :] == 0, 1e-10, proy[-1, :])
    proy /= proy[-1, :]
    return proy[:-1]

def proyectar_ortogonal(puntos):
    P = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1]
    ])
    puntos_hom = np.vstack((puntos, np.ones((1, puntos.shape[1]))))
    proy = P @ puntos_hom
    return proy[:-1]

@interact(d=(0.5, 12, 0.1))
def plot_proyeccion(d=1.0):
    fig = plt.figure(figsize=(15, 5))
    ax1 = fig.add_subplot(131, projection='3d')
    ax2 = fig.add_subplot(132)
    ax3 = fig.add_subplot(133)
    puntos = np.array([[x, y, z] for x in range(5) for y in range(5) for z in range(5)]).T
    proy_persp = proyectar_perspectiva(puntos, d)
    proy_orto = proyectar_ortogonal(puntos)
    ax1.scatter(puntos[0], puntos[1], puntos[2])
    ax2.scatter(proy_persp[0], proy_persp[1])
    ax3.scatter(proy_orto[0], proy_orto[1])
    plt.show()
```

### 🔹 Three.js (Activity 2)

#### Steps Taken
1. Set up a Next.js project with React Three Fiber and Drei.
2. Create a 3D scene with three objects at different Z-depths.
3. Implement perspective and orthogonal cameras, switchable via controls.
4. Add `OrbitControls` for interactive navigation.
5. Include a technical information tab explaining projection concepts.

#### Key Code
```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProjectiveSpaceDemo from '@/components/projective-space-demo'

export default function Home() {
  return (
    <Tabs defaultValue="demo">
      <TabsList>
        <TabsTrigger value="demo">Demostración 3D</TabsTrigger>
        <TabsTrigger value="info">Información Técnica</TabsTrigger>
      </TabsList>
      <TabsContent value="demo">
        <Canvas>
          <ProjectiveSpaceDemo />
          <OrbitControls />
        </Canvas>
      </TabsContent>
      <TabsContent value="info">
        <div>
          <h2>Proyecciones en Espacios Proyectivos</h2>
          <p><strong>Perspectiva:</strong> Simula la visión humana, objetos lejanos parecen más pequeños.</p>
          <p><strong>Ortogonal:</strong> Mantiene el tamaño de los objetos, ideal para dibujos técnicos.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
```

### 🔹 Processing (Activity 3)

#### Steps Taken
1. Set up a Processing sketch with P3D renderer.
2. Define three pretzel-shaped objects at Z-depths -200, 0, and 200.
3. Implement perspective and orthogonal projections, toggled with 'p' and 'o' keys.
4. Add dynamic colors using sinusoidal functions and animate rotation.
5. Draw pretzels with Bezier curves for a twisted shape.

#### Key Code
```processing
boolean usePerspective = true;
float angle = 0;
float colorPhase = 0;

void setup() {
  size(800, 600, P3D);
}

void draw() {
  background(220);
  lights();
  if (usePerspective) {
    perspective(radians(60), float(width)/height, 1, 1000);
  } else {
    ortho(-width/2, width/2, -height/2, height/2, 1, 1000);
  }
  translate(width/2, height/2, 0);
  rotateY(angle);
  for (int z = -200; z <= 200; z += 200) {
    pushMatrix();
    translate(0, 0, z);
    drawPretzel();
    popMatrix();
  }
  angle += 0.01;
  colorPhase += 0.05;
}

void drawPretzel() {
  float r = 150 + 100 * sin(colorPhase);
  float g = 75 + 100 * sin(colorPhase + TWO_PI / 3);
  float b = 100 * sin(colorPhase + 2 * TWO_PI / 3);
  stroke(r, g, b);
  strokeWeight(8);
  noFill();
  beginShape();
  vertex(-30, -50, 0);
  bezierVertex(-20, -70, 20, -70, 30, -50);
  bezierVertex(40, -30, 40, 30, 30, 50);
  bezierVertex(20, 70, -20, 70, -30, 50);
  bezierVertex(-40, 30, -40, -30, -30, -50);
  endShape(CLOSE);
}

void keyPressed() {
  if (key == 'p' || key == 'P') {
    usePerspective = true;
    println("Proyección: Perspectiva");
  } else if (key == 'o' || key == 'O') {
    usePerspective = false;
    println("Proyección: Ortográfica");
  }
}
```

---

## 📊 Visual Results

- **Python**: Staircase projection with interactive focal distance  

![proyección perspectiva](https://github.com/user-attachments/assets/bb4c85fd-eca4-4b9a-8067-78f9ca6cd139)


- **Three.js**: 3D scene with OrbitControls and camera switching

![demo](https://github.com/user-attachments/assets/3ca6b8ab-53e0-4c76-8c7f-7702ae0ae32a)


- **Processing**: Perspective and Orthogonal projection of pretzels with dynamic colors  

![Perspectiva_Ortografica](https://github.com/user-attachments/assets/87d04f8d-04f0-435e-92cd-af6c18875ad7)


---

## 🧩 Prompts Used

- **Python**:
``` text
"Set up a Jupyter Notebook to visualize a 3D staircase with perspective and orthogonal projections, using homogeneous coordinates and an interactive slider for focal distance."
```
- **Three.js**:
``` text
"Create a Next.js application with React Three Fiber for a 3D scene with objects at different depths, perspective and orthogonal cameras, OrbitControls, and a technical information tab."
```
- **Processing**:
``` text
"Generate a Processing sketch with three pretzel-shaped objects at different Z-depths, using perspective() and ortho() modes, toggled with 'p' and 'o' keys, with dynamic colors and animation."
```
---

## 💬 Final Reflection

This workshop deepened my understanding of projective spaces and projection matrices through practical implementations. In Python, the interactive slider clarified how focal distance alters perspective projections, though handling edge cases like division by zero was challenging. The Three.js application provided a polished interface, with OrbitControls making projection differences intuitive. Processing’s animated pretzels, with their dynamic colors and Bezier curves, vividly illustrated perspective’s depth effects versus orthogonal’s uniform scaling. Refining the visual design, especially in Processing, was rewarding. The table below summarizes the projections’ properties:

| Projection   | Visual Effect                     | Use Case                          | Complexity                     | Key Notes                                      |
| :----------- | :-------------------------------- | :-------------------------------- | :----------------------------- | :--------------------------------------------- |
| Perspective  | Far objects appear smaller        | Realistic 3D rendering            | Moderate (focal distance)      | Mimics human vision, uses frustum             |
| Orthogonal   | Objects maintain size             | Technical drawings, CAD           | Simpler (no scaling)           | Parallel projection, uses box volume          |

---

## ✅ Delivery Checklist

- [x] Folder `2025-04-XX_taller_espacios_proyectivos`  
- [x] Working implementations in Python, Three.js, and Processing  
- [x] Clear visualization of perspective and orthogonal projections  
- [x] Well-organized and commented code  
- [x] README with explanations and screenshots/GIFs  
- [x] Complete and clear README  
- [x] Descriptive commits in English

---
