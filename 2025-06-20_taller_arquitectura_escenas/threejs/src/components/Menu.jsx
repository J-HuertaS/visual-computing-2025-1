function Menu() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#1a2a44', fontFamily: 'Roboto, sans-serif' }}>
      <h1 style={{ color: '#ecf0f1', fontWeight: 700 }}>Práctica de Arquitectura de Escenas</h1>
      <p style={{ color: '#bdc3c7', fontSize: '18px', textAlign: 'center', maxWidth: '600px' }}>
        Bienvenido a esta práctica donde exploraremos la creación y manipulación de escenas 3D utilizando Three.js y React Three Fiber. Navega a la sección de "Juego" para interactuar con la escena.
      </p>
    </div>
  );
}

export default Menu;