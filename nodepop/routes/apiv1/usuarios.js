'use strict'

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const sha256 = require('sha256');
const service = require('../../lib/auth_jwt');

const Usuario = mongoose.model('Usuario');

router.post('/', (req, res, next) => {

    //Valido que se pasen los datos necesarios para el registro
    const nombre = req.body.nombre;
    const email = req.body.email;
    const password = req.body.password;

    if (nombre && email && password) {
        //Creo objeto de tipo Usuario
        let usuario = new Usuario(req.body);

        //Hasheo la clave del usuario
        usuario.password = sha256(usuario.password);

        //Lo guardo en la base de datos
        usuario.save().then(usuarioGuardado => {
            res.status(200)
                .send({ token: service.createToken(usuarioGuardado) })
        }).catch(err => {
            next(err);
        });
    } else {
        const err = new Error();
        err.localizedKey = "FIELD_MISSING";
        err.status = 400;
        next(err);
    }
});

router.post('/authenticate', (req, res, next) => {
    Usuario.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                //Hasheo la clave que viene en el request para que coincida con la hasheada en la db
                let passwd = sha256(req.body.password);

                //Si existe el usuario y la contraseña es válida, mandamos un 200 junto con el token generado
                if (user.password === passwd) {
                    res.status(200)
                        .send({ token: service.createToken(user) })
                } else {
                    let err = new Error();
                    err.localizedKey = "WRONG_PASSWORD"
                    err.status = 400;
                    next(err);
                }

            } else {
                const err = new Error("");
                err.localizedKey = "USER_NOT_FOUND"
                err.status = 404;
                next(err);
            }

        }).catch(err => {
            next(err);
        });
})

module.exports = router;
