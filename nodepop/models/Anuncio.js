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
anuncioSchema.statics.list = function(filtros,limit,start,sort, callback) {
    const query = Anuncio.find(filtros);
    query.limit(limit);
    query.skip(start);
    query.sort(sort);
    query.exec(callback);
}

//Método estático para listar los tags existentes en los anuncios
anuncioSchema.statics.listTags = function(callback) {
    const query = Anuncio.find().distinct('tags');
    query.exec(callback);
}


//Creo el modelo de Anuncio partiendo del Schema
var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;


