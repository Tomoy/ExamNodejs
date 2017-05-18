'use strict'

const mongoose = require('mongoose');

//Defino el Schema del modelo Anuncio
const anuncioSchema = mongoose.Schema({
    nombre: String,
    esVenta: Boolean,
    precio: Number,
    urlFoto: String,
    tags: [String]
});

//Método estático para listar los anuncios
anuncioSchema.statics.list = function (filtros, limit, start, sort) {

    return new Promise((resolve, reject) => {
        const query = Anuncio.find(filtros);
        query.limit(limit);
        query.skip(start);
        query.sort(sort);
        query.exec()
            .then(anuncios => {
                resolve(anuncios);
            })
            .catch( err => {
                reject(err);
            });
    });
}

//Método estático para listar los tags existentes en los anuncios
anuncioSchema.statics.listTags = function () {

    return new Promise((resolve, reject) => {
        const query = Anuncio.find().distinct('tags');
        query.exec()
            .then(anuncios => {
                resolve(anuncios);
            })
            .catch(err => {
                reject(err);
            });
    });
}

//Creo el modelo de Anuncio partiendo del Schema
var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;


