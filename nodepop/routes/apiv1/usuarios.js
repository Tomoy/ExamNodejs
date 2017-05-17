'use strict'

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const sha256 = require('sha256');
const service = require('../../lib/auth_jwt');

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
            console.log(err.message);
            return;
        }
        res.status(200)
            .send({token: service.createToken(usuarioGuardado)})
    });
});

router.post('/authenticate', (req, res, next) => {
    Usuario.findOne({email:req.body.email}, (err, user) => {
        let passwd = sha256(req.body.password);
        
        if (user.password === passwd) {
            
            res.status(200)
                .send({ token: service.createToken(user) })
        } else {
            res.json({success:false, result:"Wrong password"})
        }
    })
})

module.exports = router;
