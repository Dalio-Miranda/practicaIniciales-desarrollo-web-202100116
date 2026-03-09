const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente' });
});

// Importar rutas
const authRoutes = require('./routes/auth');
const publicacionesRoutes = require('./routes/publicaciones');
const comentariosRoutes = require('./routes/comentarios');
const usuariosRoutes = require('./routes/usuarios');
const cursosRoutes = require('./routes/cursos');
const catedraticosRoutes = require('./routes/catedraticos');

app.use('/api/auth', authRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/catedraticos', catedraticosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});