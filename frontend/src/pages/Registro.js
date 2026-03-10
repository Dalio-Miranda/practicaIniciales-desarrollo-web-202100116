import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Registro() {
  const [form, setForm] = useState({ registro_academico: '', nombres: '', apellidos: '', correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegistro = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/registro', form);
      navigate('/');
    } catch (err) {
      setError('Error al registrarse. El registro o correo ya existe.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>CREAR CUENTA</h2>
        <h3 style={styles.subtitle}>Ingeniería USAC</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} name="registro_academico" placeholder="Registro Académico" onChange={handleChange} />
        <input style={styles.input} name="nombres" placeholder="Nombres" onChange={handleChange} />
        <input style={styles.input} name="apellidos" placeholder="Apellidos" onChange={handleChange} />
        <input style={styles.input} name="correo" placeholder="Correo electrónico" onChange={handleChange} />
        <input style={styles.input} type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} />
        <button style={styles.button} onClick={handleRegistro}>REGISTRARSE</button>
        <p style={styles.link}>¿Ya tenés cuenta? <Link to="/">Iniciá sesión</Link></p>
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