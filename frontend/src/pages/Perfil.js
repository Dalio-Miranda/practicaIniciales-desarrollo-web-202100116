import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [cursosAprobados, setCursosAprobados] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registro } = useParams();
  const navigate = useNavigate();
  const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
  const esMiPerfil = usuarioActual?.registro_academico === registro;

  useEffect(() => {
    if (!usuarioActual) { navigate('/'); return; }
    cargarPerfil();
    axios.get(`${API}/api/cursos`)
      .then(r => setCursos(r.data))
      .catch(() => setError('Error cargando cursos.'));
  }, [registro]);

  const cargarPerfil = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API}/api/usuarios/${registro}`);
      setPerfil(res.data);
      setForm(res.data);
      cargarCursosAprobados(res.data.id);
    } catch (err) {
      setError('Usuario no encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const cargarCursosAprobados = async (id) => {
    try {
      const res = await axios.get(`${API}/api/usuarios/${id}/cursos-aprobados`);
      setCursosAprobados(res.data);
    } catch (err) {
      console.error('Error cargando cursos aprobados');
    }
  };

  const guardarEdicion = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.put(`${API}/api/usuarios/${perfil.id}`, form);
      setExito('Perfil actualizado correctamente');
      setEditando(false);
      cargarPerfil();
      setTimeout(() => setExito(''), 2000);
    } catch (err) {
      setError('Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const agregarCurso = async () => {
    if (!cursoSeleccionado) return;
    try {
      await axios.post(`${API}/api/usuarios/${perfil.id}/cursos-aprobados`, { curso_id: cursoSeleccionado });
      cargarCursosAprobados(perfil.id);
      setCursoSeleccionado('');
    } catch (err) {
      setError('Error al agregar curso aprobado.');
    }
  };

  const totalCreditos = cursosAprobados.reduce((acc, c) => acc + c.creditos, 0);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#1a3a6b' }}>Cargando perfil...</div>;
  if (error && !perfil) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  if (!perfil) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatar}>👤</div>
        <h2 style={styles.nombre}>{perfil.nombres} {perfil.apellidos}</h2>
        <p style={styles.registro}>Registro: {perfil.registro_academico}</p>
        {!editando ? (
          <>
            <p style={styles.info}>📧 {perfil.correo}</p>
            {esMiPerfil && <button style={styles.btnEditar} onClick={() => setEditando(true)}>✏️ Editar perfil</button>}
          </>
        ) : (
          <div style={styles.formEditar}>
            <input style={styles.input} value={form.nombres} onChange={e => setForm({ ...form, nombres: e.target.value })} placeholder="Nombres" />
            <input style={styles.input} value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} placeholder="Apellidos" />
            <input style={styles.input} value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} placeholder="Correo" />
            {error && <p style={styles.errorTxt}>{error}</p>}
            {exito && <p style={styles.exitoTxt}>{exito}</p>}
            <button style={styles.btnGuardar} onClick={guardarEdicion} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button style={styles.btnCancelar} onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h3 style={styles.subtitulo}>Cursos Aprobados</h3>
        <p style={styles.creditos}>Total de creditos: <strong>{totalCreditos}</strong></p>
        {cursosAprobados.length === 0 ? (
          <p style={styles.vacio}>No hay cursos aprobados aun</p>
        ) : (
          cursosAprobados.map(c => (
            <div key={c.id} style={styles.cursoItem}>
              <span>{c.nombre}</span>
              <span style={styles.credito}>{c.creditos} creditos</span>
            </div>
          ))
        )}
        {esMiPerfil && (
          <div style={styles.agregarCurso}>
            <select style={styles.select} value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)}>
              <option value="">Agregar curso aprobado</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <button style={styles.btnAgregar} onClick={agregarCurso}>Agregar</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '700px', margin: '30px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  avatar: { fontSize: '60px', textAlign: 'center' },
  nombre: { textAlign: 'center', color: '#1a3a6b', margin: '10px 0 5px' },
  registro: { textAlign: 'center', color: '#999', margin: 0 },
  info: { textAlign: 'center', color: '#555' },
  btnEditar: { display: 'block', margin: '10px auto', padding: '8px 20px', backgroundColor: '#1a3a6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  formEditar: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '5px' },
  btnGuardar: { padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  btnCancelar: { padding: '10px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  errorTxt: { color: 'red', textAlign: 'center' },
  exitoTxt: { color: 'green', textAlign: 'center' },
  subtitulo: { color: '#1a3a6b', marginTop: 0 },
  creditos: { color: '#555' },
  vacio: { color: '#999', textAlign: 'center' },
  cursoItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', marginBottom: '8px' },
  credito: { color: '#1a3a6b', fontWeight: 'bold' },
  agregarCurso: { display: 'flex', gap: '10px', marginTop: '15px' },
  select: { flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '5px' },
  btnAgregar: { padding: '8px 16px', backgroundColor: '#1a3a6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Perfil;