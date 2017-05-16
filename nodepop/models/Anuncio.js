'use strict'

const mongoose = require('mongoose');

//Defino el Schema del modelo Anuncio
const anuncioSchema = mongoose.Schema({
    nombre:String,
    esVenta:Boolean,
    precio:Number,
    urlFoto:String,
    tags: [String]
});

//Método estático para listar los anuncios
anuncioSchema.statics.list = function(filter, callback) {
    const query = Anuncio.find(filter);
    query.exec(callback);
}


//Creo el modelo de Anuncio partiendo del Schema
var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;


