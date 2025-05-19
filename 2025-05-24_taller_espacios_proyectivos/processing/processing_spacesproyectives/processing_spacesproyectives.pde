// Taller 57 - Espacios Proyectivos y Matrices de Proyección
// Parte de Processing: Simulación de proyecciones perspectiva y ortográfica con pretzels 3D

boolean usePerspective = true; // Controla si se usa proyección perspectiva u ortográfica
float angle = 0; // Ángulo para rotación animada
float colorPhase = 0; // Fase para animación de color

void setup() {
  size(800, 600, P3D); // Crear lienzo en 3D
}

void draw() {
  background(220); // Fondo gris claro para mejor visibilidad
  lights(); // Activar iluminación básica
  
  // Configurar la cámara según el tipo de proyección
  if (usePerspective) {
    // Proyección perspectiva: campo de visión de 60°, relación de aspecto, planos cercano y lejano
    perspective(radians(60), float(width)/height, 1, 1000);
  } else {
    // Proyección ortográfica: límites del volumen de visualización
    ortho(-width/2, width/2, -height/2, height/2, 1, 1000);
  }
  
  // Centrar la escena y aplicar rotación para mejor visualización
  translate(width/2, height/2, 0);
  rotateY(angle); // Rotación animada en el eje Y
  
  // Dibujar tres pretzels a diferentes profundidades en el eje Z
  // Pretzel 1 (Z = -200)
  pushMatrix();
  translate(0, 0, -200);
  drawPretzel();
  popMatrix();
  
  // Pretzel 2 (Z = 0)
  pushMatrix();
  translate(0, 0, 0);
  drawPretzel();
  popMatrix();
  
  // Pretzel 3 (Z = 200)
  pushMatrix();
  translate(0, 0, 200);
  drawPretzel();
  popMatrix();
  
  // Actualizar ángulo para animación
  angle += 0.01;
  // Actualizar fase de color para animación
  colorPhase += 0.05; // Velocidad del cambio de color (ajusta según prefieras)
}

void drawPretzel() {
  // Calcular colores dinámicos usando funciones sinusoidales
  float r = 150 + 100 * sin(colorPhase); // Componente rojo entre 50 y 250
  float g = 75 + 100 * sin(colorPhase + TWO_PI / 3); // Componente verde, desfasada
  float b = 100 * sin(colorPhase + 2 * TWO_PI / 3); // Componente azul, desfasada
  
  stroke(r, g, b); // Aplicar color dinámico
  strokeWeight(8); // Grosor de las líneas
  noFill();
  
  // Forma retorcida del pretzel usando curvas y líneas
  beginShape();
  vertex(-30, -50, 0);
  bezierVertex(-20, -70, 20, -70, 30, -50);
  bezierVertex(40, -30, 40, 30, 30, 50);
  bezierVertex(20, 70, -20, 70, -30, 50);
  bezierVertex(-40, 30, -40, -30, -30, -50);
  endShape(CLOSE);
}

void keyPressed() {
  // Cambiar entre proyecciones al presionar 'p' u 'o'
  if (key == 'p' || key == 'P') {
    usePerspective = true;
    println("Proyección: Perspectiva");
  } else if (key == 'o' || key == 'O') {
    usePerspective = false;
    println("Proyección: Ortográfica");
  }
}
