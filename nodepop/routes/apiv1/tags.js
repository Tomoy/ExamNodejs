'use strict'

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Anuncio = mongoose.model('Anuncio');

//Agregar autenticación

router.get('/', (req, res, next) => {
    Anuncio.listTags((err, uniqueTags) => {
        if (err) {
            //manejar error
            return;
        }
        res.json({ success: true, result: uniqueTags });
    });
});

module.exports = router;
