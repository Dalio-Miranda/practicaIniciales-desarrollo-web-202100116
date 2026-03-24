import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

function Home() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState({});
  const [filtroCurso, setFiltroCurso] = useState('');
  const [filtroCatedratico, setFiltroCatedratico] = useState('');
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    if (!usuario) { navigate('/'); return; }
    cargarPublicaciones();
    axios.get(`${API}/api/cursos`)
      .then(r => setCursos(r.data))
      .catch(() => console.error('Error cargando cursos'));
    axios.get(`${API}/api/catedraticos`)
      .then(r => setCatedraticos(r.data))
      .catch(() => console.error('Error cargando catedraticos'));
  }, []);

  const cargarPublicaciones = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API}/api/publicaciones`);
      setPublicaciones(res.data);
    } catch (err) {
      setError('Error al cargar publicaciones. Verifica tu conexion.');
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorCurso = async (id) => {
    setFiltroCurso(id); setFiltroCatedratico('');
    if (!id) { cargarPublicaciones(); return; }
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/publicaciones/curso/${id}`);
      setPublicaciones(res.data);
    } catch (err) {
      setError('Error al filtrar por curso.');
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorCatedratico = async (id) => {
    setFiltroCatedratico(id); setFiltroCurso('');
    if (!id) { cargarPublicaciones(); return; }
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/publicaciones/catedratico/${id}`);
      setPublicaciones(res.data);
    } catch (err) {
      setError('Error al filtrar por catedratico.');
    } finally {
      setLoading(false);
    }
  };

  const cargarComentarios = async (publicacion_id) => {
    try {
      const res = await axios.get(`${API}/api/comentarios/${publicacion_id}`);
      setComentarios({ ...comentarios, [publicacion_id]: res.data });
    } catch (err) {
      console.error('Error cargando comentarios');
    }
  };

  const agregarComentario = async (publicacion_id) => {
    const mensaje = nuevoComentario[publicacion_id];
    if (!mensaje) return;
    try {
      await axios.post(`${API}/api/comentarios`, { publicacion_id, usuario_id: usuario.id, mensaje });
      setNuevoComentario({ ...nuevoComentario, [publicacion_id]: '' });
      cargarComentarios(publicacion_id);
    } catch (err) {
      console.error('Error agregando comentario');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Publicaciones</h2>

      <div style={styles.filtros}>
        <select style={styles.select} value={filtroCurso} onChange={e => filtrarPorCurso(e.target.value)}>
          <option value="">Filtrar por curso</option>
          {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <select style={styles.select} value={filtroCatedratico} onChange={e => filtrarPorCatedratico(e.target.value)}>
          <option value="">Filtrar por catedratico</option>
          {catedraticos.map(c => <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>)}
        </select>
        <button style={styles.btnLimpiar} onClick={() => { setFiltroCurso(''); setFiltroCatedratico(''); cargarPublicaciones(); }}>Limpiar filtros</button>
      </div>

      {loading && <p style={styles.loading}>Cargando publicaciones...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && publicaciones.length === 0 && !error && (
        <p style={styles.vacio}>No hay publicaciones aun. Se el primero en publicar!</p>
      )}

      {publicaciones.map(p => (
        <div key={p.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.autor}>{p.nombres} {p.apellidos}</span>
            <span style={styles.fecha}>{new Date(p.fecha_creacion).toLocaleDateString()}</span>
          </div>
          {p.nombre_curso && <span style={styles.tag}>📖 {p.nombre_curso}</span>}
          {p.nombre_catedratico && <span style={styles.tag}>👨‍🏫 {p.nombre_catedratico}</span>}
          <p style={styles.mensaje}>{p.mensaje}</p>
          <button style={styles.btnComentarios} onClick={() => cargarComentarios(p.id)}>
            💬 Ver comentarios
          </button>
          {comentarios[p.id] && (
            <div style={styles.comentariosSection}>
              {comentarios[p.id].length === 0 && <p style={styles.sinComentarios}>Sin comentarios aun.</p>}
              {comentarios[p.id].map(c => (
                <div key={c.id} style={styles.comentario}>
                  <strong>{c.nombres} {c.apellidos}:</strong> {c.mensaje}
                </div>
              ))}
              <div style={styles.nuevoComentario}>
                <input style={styles.inputComentario} placeholder="Escribe un comentario..."
                  value={nuevoComentario[p.id] || ''}
                  onChange={e => setNuevoComentario({ ...nuevoComentario, [p.id]: e.target.value })} />
                <button style={styles.btnEnviar} onClick={() => agregarComentario(p.id)}>Enviar</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '30px auto', padding: '0 20px' },
  titulo: { color: '#1a3a6b' },
  filtros: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  select: { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', flex: 1 },
  btnLimpiar: { padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  loading: { textAlign: 'center', color: '#1a3a6b', fontSize: '16px' },
  error: { textAlign: 'center', color: 'red', fontSize: '16px' },
  vacio: { textAlign: 'center', color: '#999', fontSize: '16px', marginTop: '40px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '15px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  autor: { color: '#1a3a6b', fontWeight: 'bold' },
  fecha: { color: '#999', fontSize: '13px' },
  tag: { backgroundColor: '#e8f0fe', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', marginRight: '5px' },
  mensaje: { marginTop: '10px', lineHeight: '1.6' },
  btnComentarios: { backgroundColor: 'transparent', border: '1px solid #1a3a6b', color: '#1a3a6b', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' },
  comentariosSection: { marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' },
  sinComentarios: { color: '#999', fontSize: '13px', textAlign: 'center' },
  comentario: { padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '5px', marginBottom: '5px', fontSize: '14px' },
  nuevoComentario: { display: 'flex', gap: '10px', marginTop: '10px' },
  inputComentario: { flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '5px' },
  btnEnviar: { padding: '8px 16px', backgroundColor: '#1a3a6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Home;