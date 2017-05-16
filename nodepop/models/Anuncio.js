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
anuncioSchema.statics.list = function(filtros, callback) {
    console.log("Filtros: ", filtros);
    const query = Anuncio.find(filtros);
    query.exec(callback);
}


//Creo el modelo de Anuncio partiendo del Schema
var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;


