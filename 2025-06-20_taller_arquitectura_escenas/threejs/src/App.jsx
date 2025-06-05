import { Routes, Route, Link } from 'react-router-dom';
import Menu from './components/Menu';
import Juego from './components/Juego';
import Creditos from './components/Creditos';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Roboto, sans-serif' }}>
      {/* Menú Fijo a la Izquierda */}
      <nav style={{
        width: '200px',
        background: '#2c3e50',
        color: 'white',
        padding: '20px',
        position: 'fixed',
        height: '100vh',
        boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
        zIndex: 1000
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#ecf0f1', fontWeight: 700 }}>Navegación</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px' }}>
            <Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', padding: '10px', display: 'block', borderRadius: '5px' }}>
              <i className="fas fa-home"></i> Menú Principal
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link to="/juego" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', padding: '10px', display: 'block', borderRadius: '5px' }}>
              <i className="fas fa-gamepad"></i> Juego
            </Link>
          </li>
          <li>
            <Link to="/creditos" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', padding: '10px', display: 'block', borderRadius: '5px' }}>
              <i className="fas fa-info-circle"></i> Créditos
            </Link>
          </li>
        </ul>
      </nav>

      {/* Contenedor de las Escenas a la Derecha */}
      <div style={{ marginLeft: '200px', width: 'calc(100% - 200px)', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/juego" element={<Juego />} />
          <Route path="/creditos" element={<Creditos />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;