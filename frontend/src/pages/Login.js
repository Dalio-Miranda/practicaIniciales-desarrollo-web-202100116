import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

function Login() {
  const [registro, setRegistro] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!registro || !contrasena) {
      setError('Por favor llena todos los campos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        registro_academico: registro,
        contrasena: contrasena
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/home');
    } catch (err) {
      setError('Registro o contrasena incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>INICIAR SESION</h2>
        <h3 style={styles.subtitle}>Ingenieria USAC</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Registro Academico" value={registro} onChange={e => setRegistro(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Contrasena" value={contrasena} onChange={e => setContrasena(e.target.value)} />
        <button style={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? 'Iniciando...' : 'INICIAR SESION'}
        </button>
        <p style={styles.link}>No tenes cuenta? <Link to="/registro">Registrate</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '350px', display: 'flex', flexDirection: 'column', gap: '15px' },
  title: { textAlign: 'center', color: '#1a3a6b', margin: 0 },
  subtitle: { textAlign: 'center', color: '#666', margin: 0, fontWeight: 'normal' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' },
  button: { padding: '12px', backgroundColor: '#1a3a6b', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', margin: 0 },
  link: { textAlign: 'center', margin: 0 }
};

export default Login;