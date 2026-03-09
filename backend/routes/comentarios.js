const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener comentarios de una publicación
router.get('/:publicacion_id', (req, res) => {
    const sql = `
        SELECT c.*, u.nombres, u.apellidos
        FROM comentarios c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.publicacion_id = ?
        ORDER BY c.fecha_creacion ASC
    `;
    db.query(sql, [req.params.publicacion_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Crear un comentario
router.post('/', (req, res) => {
    const { publicacion_id, usuario_id, mensaje } = req.body;
    const sql = 'INSERT INTO comentarios (publicacion_id, usuario_id, mensaje) VALUES (?, ?, ?)';
    db.query(sql, [publicacion_id, usuario_id, mensaje], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Comentario agregado', id: result.insertId });
    });
});

module.exports = router;