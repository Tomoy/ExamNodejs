'use strict'

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const sha256 = require('sha256');

const Usuario = mongoose.model('Usuario');

router.post('/', (req, res, next) => {
    //Creo objeto de tipo Usuario
    let usuario = new Usuario(req.body);

    //Hasheo la clave del usuario
    usuario.password = sha256(usuario.password);

    //Lo guardo en la base de datos
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            //manejar el error;
            return;
        }
        res.json({ success: true, result: usuarioGuardado });
    });
});

module.exports = router;
