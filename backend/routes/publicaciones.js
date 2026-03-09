const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las publicaciones ordenadas por fecha
router.get('/', (req, res) => {
    const sql = `
        SELECT p.*, u.nombres, u.apellidos,
               c.nombre AS nombre_curso,
               CONCAT(cat.nombres, ' ', cat.apellidos) AS nombre_catedratico
        FROM publicaciones p
        JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN cursos c ON p.curso_id = c.id
        LEFT JOIN catedraticos cat ON p.catedratico_id = cat.id
        ORDER BY p.fecha_creacion DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Crear una publicación
router.post('/', (req, res) => {
    const { usuario_id, catedratico_id, curso_id, mensaje } = req.body;
    const sql = 'INSERT INTO publicaciones (usuario_id, catedratico_id, curso_id, mensaje) VALUES (?, ?, ?, ?)';
    db.query(sql, [usuario_id, catedratico_id, curso_id, mensaje], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Publicación creada', id: result.insertId });
    });
});

// Filtrar por curso
router.get('/curso/:id', (req, res) => {
    const sql = `
        SELECT p.*, u.nombres, u.apellidos, c.nombre AS nombre_curso
        FROM publicaciones p
        JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN cursos c ON p.curso_id = c.id
        WHERE p.curso_id = ?
        ORDER BY p.fecha_creacion DESC
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Filtrar por catedrático
router.get('/catedratico/:id', (req, res) => {
    const sql = `
        SELECT p.*, u.nombres, u.apellidos,
               CONCAT(cat.nombres, ' ', cat.apellidos) AS nombre_catedratico
        FROM publicaciones p
        JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN catedraticos cat ON p.catedratico_id = cat.id
        WHERE p.catedratico_id = ?
        ORDER BY p.fecha_creacion DESC
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;