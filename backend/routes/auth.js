const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro
router.post('/registro', (req, res) => {
    const { registro_academico, nombres, apellidos, correo, contrasena } = req.body;
    const hashedPassword = bcrypt.hashSync(contrasena, 10);
    const sql = 'INSERT INTO usuarios (registro_academico, nombres, apellidos, correo, contrasena) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [registro_academico, nombres, apellidos, correo, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Usuario registrado correctamente' });
    });
});

// Login
router.post('/login', (req, res) => {
    const { registro_academico, contrasena } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE registro_academico = ?';
    db.query(sql, [registro_academico], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
        const usuario = results[0];
        const passwordValida = bcrypt.compareSync(contrasena, usuario.contrasena);
        if (!passwordValida) return res.status(401).json({ error: 'Contraseña incorrecta' });
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, usuario: { id: usuario.id, nombres: usuario.nombres, apellidos: usuario.apellidos, registro_academico: usuario.registro_academico } });
    });
});

// Recuperar contraseña
router.post('/recuperar', (req, res) => {
    const { registro_academico, correo } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE registro_academico = ? AND correo = ?';
    db.query(sql, [registro_academico, correo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Datos incorrectos' });
        res.json({ mensaje: 'Datos verificados', usuario_id: results[0].id });
    });
});

// Cambiar contraseña
router.put('/cambiar-contrasena', (req, res) => {
    const { usuario_id, nueva_contrasena } = req.body;
    const hashedPassword = bcrypt.hashSync(nueva_contrasena, 10);
    const sql = 'UPDATE usuarios SET contrasena = ? WHERE id = ?';
    db.query(sql, [hashedPassword, usuario_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    });
});

module.exports = router;