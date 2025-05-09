# Instrucciones
- Crear un proyecto con Vite y React Three Fiber
- Agregar un objeto 3D (cubo o esfera)
- Aplicar animaciones con useFrame para: Trasladar el objeto por una trayectoria senoidal o circular; Rotarlo sobre su propio eje con incremento en cada frame; Escalarlo suavemente con una función temporal (Math.sin(clock.elapsedTime))
- Bonus: incluir OrbitControls para navegar la escena

# Solución
- Se inicializan todas las dependencias del proyecto, y la esencia de la solución está en MyScene.jsx dónde se ven las transformaciones
- Se crea la referencia para acceder al mesh, y se crea la función useFrame que se ejecuta cada vez que cambia el reloj
- Se toma en la variable t el tiempo que ha pasado desde que empezó la escena
- Se mueve la caja den su posición en x y en y, aquí hacemos uso de cos y sen para darle un efecto de movimiento circular, y multiplicamos por 2, lo que significa que la traslación va desde 0 hasta 2 para cada eje
- Para la rotación volvemos a usar sen y cos, permitiendo que la figura se rote en los ejes x e y, en función del tiempo
- Para la escala volvemos a usar sen, permitiendo que la figura se escale en función del tiempo, y se le suma 1, ya que este puede tomar -1, entonces al sumar 1 lo forzamos a tomar siempre valores positivos. Y dicha escala se aplica a las dimensiones del cubo
- Finalmente nos encargamos de actualizar la figura, y darle valores para los colores


