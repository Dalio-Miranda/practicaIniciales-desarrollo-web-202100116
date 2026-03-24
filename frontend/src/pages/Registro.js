import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

function Registro() {
  const [form, setForm] = useState({ registro_academico: '', nombres: '', apellidos: '', correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegistro = async () => {
    if (!form.registro_academico || !form.nombres || !form.apellidos || !form.correo || !form.contrasena) {
      setError('Por favor llena todos los campos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/auth/registro`, form);
      navigate('/');
    } catch (err) {
      setError('Error al registrarse. El registro o correo ya existe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>CREAR CUENTA</h2>
        <h3 style={styles.subtitle}>Ingenieria USAC</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} name="registro_academico" placeholder="Registro Academico" onChange={handleChange} />
        <input style={styles.input} name="nombres" placeholder="Nombres" onChange={handleChange} />
        <input style={styles.input} name="apellidos" placeholder="Apellidos" onChange={handleChange} />
        <input style={styles.input} name="correo" placeholder="Correo electronico" onChange={handleChange} />
        <input style={styles.input} type="password" name="contrasena" placeholder="Contrasena" onChange={handleChange} />
        <button style={styles.button} onClick={handleRegistro} disabled={loading}>
          {loading ? 'Registrando...' : 'REGISTRARSE'}
        </button>
        <p style={styles.link}>Ya tenes cuenta? <Link to="/">Inicia sesion</Link></p>
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

export default Registro;