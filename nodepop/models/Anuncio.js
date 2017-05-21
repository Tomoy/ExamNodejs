'use strict';

const mongoose = require('mongoose');

//Defino el Schema del modelo Anuncio
const anuncioSchema = mongoose.Schema({
    nombre: String,
    esVenta: Boolean,
    precio: Number,
    urlFoto: String,
    tags: [String]
});

//Convierte la url relativa de la foto de los anuncios en url absoluta
function setearUrlAbsoluta(anuncios, req) {

    if (req) {
        const fullUrl = req.protocol + '://' + req.get('host');

        anuncios.forEach(function (anuncio) {
            anuncio.urlFoto = fullUrl + '/images/anuncios/' + anuncio.urlFoto;
        });

        return anuncios;
    } else {
        return anuncios;
    }

}

//Método estático para listar los anuncios
anuncioSchema.statics.list = function (filtros, limit, start, sort, req) {

    return new Promise((resolve, reject) => {
        const query = Anuncio.find(filtros);
        query.limit(limit);
        query.skip(start);
        query.sort(sort);
        query.exec()
            .then(anuncios => {
                anuncios = setearUrlAbsoluta(anuncios, req);
                resolve(anuncios);
            })
            .catch(err => {
                reject(err);
            });
    });
};

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
};

//Creo el modelo de Anuncio partiendo del Schema
var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;


