import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

function CrearPublicacion() {
  const [tipo, setTipo] = useState('curso');
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [form, setForm] = useState({ curso_id: '', catedratico_id: '', mensaje: '' });
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    if (!usuario) { navigate('/'); return; }
    axios.get(`${API}/api/cursos`)
      .then(r => setCursos(r.data))
      .catch(() => setError('Error cargando cursos.'));
    axios.get(`${API}/api/catedraticos`)
      .then(r => setCatedraticos(r.data))
      .catch(() => setError('Error cargando catedraticos.'));
  }, []);

  const handleSubmit = async () => {
    if (!form.mensaje) { setError('El mensaje es obligatorio.'); return; }
    if (tipo === 'curso' && !form.curso_id) { setError('Selecciona un curso.'); return; }
    if (tipo === 'catedratico' && !form.catedratico_id) { setError('Selecciona un catedratico.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = {
        usuario_id: usuario.id,
        mensaje: form.mensaje,
        curso_id: tipo === 'curso' ? form.curso_id : null,
        catedratico_id: tipo === 'catedratico' ? form.catedratico_id : null
      };
      await axios.post(`${API}/api/publicaciones`, data);
      setExito('Publicacion creada exitosamente!');
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      setError('Error al crear la publicacion. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Nueva Publicacion</h2>
        <label style={styles.label}>Sobre que queres publicar?</label>
        <div style={styles.tipoContainer}>
          <button style={tipo === 'curso' ? styles.btnActivo : styles.btnInactivo} onClick={() => setTipo('curso')}>Curso</button>
          <button style={tipo === 'catedratico' ? styles.btnActivo : styles.btnInactivo} onClick={() => setTipo('catedratico')}>Catedratico</button>
        </div>
        {tipo === 'curso' && (
          <select style={styles.select} value={form.curso_id} onChange={e => setForm({ ...form, curso_id: e.target.value })}>
            <option value="">Selecciona un curso</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        )}
        {tipo === 'catedratico' && (
          <select style={styles.select} value={form.catedratico_id} onChange={e => setForm({ ...form, catedratico_id: e.target.value })}>
            <option value="">Selecciona un catedratico</option>
            {catedraticos.map(c => <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>)}
          </select>
        )}
        <textarea style={styles.textarea} placeholder="Escribi tu publicacion aqui..." value={form.mensaje}
          onChange={e => setForm({ ...form, mensaje: e.target.value })} rows={5} />
        {error && <p style={styles.error}>{error}</p>}
        {exito && <p style={styles.exito}>{exito}</p>}
        <button style={styles.btnPublicar} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
        <button style={styles.btnCancelar} onClick={() => navigate('/home')}>Cancelar</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '30px 20px' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' },
  titulo: { color: '#1a3a6b', margin: 0 },
  label: { fontWeight: 'bold', color: '#444' },
  tipoContainer: { display: 'flex', gap: '10px' },
  btnActivo: { flex: 1, padding: '10px', backgroundColor: '#1a3a6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  btnInactivo: { flex: 1, padding: '10px', backgroundColor: 'white', color: '#1a3a6b', border: '1px solid #1a3a6b', borderRadius: '5px', cursor: 'pointer' },
  select: { padding: '10px', border: '1px solid #ddd', borderRadius: '5px' },
  textarea: { padding: '10px', border: '1px solid #ddd', borderRadius: '5px', resize: 'vertical', fontFamily: 'inherit' },
  btnPublicar: { padding: '12px', backgroundColor: '#1a3a6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  btnCancelar: { padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center' },
  exito: { color: 'green', textAlign: 'center' }
};

export default CrearPublicacion;