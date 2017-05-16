'use strict'

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Anuncio = mongoose.model('Anuncio');

//Agregar autenticación

router.get('/', (req, res, next) => {

    //Filtros
    const filtros = {}
    const tag = req.query.tag;
    const esVenta = req.query.esVenta;
    const nombre = req.query.nombre;
    const precio = req.query.precio;

    if (tag) { 
        filtros.tags = {$in: [tag]}
    }
    if (esVenta) { filtros.esVenta = esVenta}
    if (nombre) { filtros.nombre = new RegExp('^' + nombre, "i")}
    if (precio) {
        let precioSplit = precio.split('-');
        
        //Si el array tiene mas de un elemento, entonces es un precio con condición, se va a especificar en la documentación como pasar el precio con "-"
        if (precioSplit.length > 1) {
            //Si el primer elemento es un string vacio, quiere decir que viene con el "-" adelante ($lt), uso $lt y no $lte porque el enunciado aclara menor que, no menor igual que
            if (precioSplit[0] === '') {
                filtros.precio = { '$lt': precioSplit[1] }
            } else if (precioSplit[1] === '') { //si el segundo elemento es un string vacio, es entonces con el "-" desp del precio ($gt)
                filtros.precio = { '$gt': precioSplit[0] }
            } else {
                filtros.precio = { '$gte': precioSplit[0], '$lte': precioSplit[1]}
            }
        } else {
            filtros.precio = precio;
        }
    }
    //Skip, limit y sort
    const limit = parseInt(req.query.limit);
    const start = parseInt(req.query.start);
    const sort = req.query.sort;

    Anuncio.list(filtros,limit,start,sort, (err, anuncios) => {
        if (err) {
            //manejar error
            return;
        }
        res.json({success: true, result: anuncios});
    });
});

module.exports = router;
