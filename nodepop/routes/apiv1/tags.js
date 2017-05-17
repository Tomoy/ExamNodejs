'use strict'

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../lib/auth_jwt')

const Anuncio = mongoose.model('Anuncio');

router.get('/', auth.ensureAuthenticated, (req, res, next) => {
    Anuncio.listTags((err, uniqueTags) => {
        if (err) {
            next(err);
        }
        res.json({ success: true, result: uniqueTags });
    });
});

module.exports = router;
