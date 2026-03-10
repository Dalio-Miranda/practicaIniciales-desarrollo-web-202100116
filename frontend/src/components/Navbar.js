import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo} onClick={() => navigate('/home')}>📚 CatedrApp</h2>
      <div style={styles.links}>
        <button style={styles.btn} onClick={() => navigate('/home')}>Inicio</button>
        <button style={styles.btn} onClick={() => navigate('/crear-publicacion')}>Nueva Publicación</button>
        <button style={styles.btn} onClick={() => navigate(`/perfil/${usuario?.registro_academico}`)}>Mi Perfil</button>
        <button style={styles.btnLogout} onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a3a6b', padding: '10px 30px', color: 'white' },
  logo: { margin: 0, cursor: 'pointer', color: 'white' },
  links: { display: 'flex', gap: '10px' },
  btn: { padding: '8px 16px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '5px', cursor: 'pointer' },
  btnLogout: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Navbar;