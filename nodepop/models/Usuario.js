'use strict'

const mongoose = require('mongoose');

//Defino el Schema del modelo Anuncio
const usuarioSchema = mongoose.Schema({
    nombre: String,
    email: {
        type: String,
        index: true,
        unique: true
    },
    password: String
});

//Creo el modelo de Anuncio partiendo del Schema
var Usuario = mongoose.model('Usuario', usuarioSchema);
