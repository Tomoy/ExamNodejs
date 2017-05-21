'use strict';

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../lib/auth_jwt');

const Anuncio = mongoose.model('Anuncio');

router.get('/', auth.ensureAuthenticated, (req, res, next) => {
    Anuncio.listTags()
        .then(uniqueTags => {
            res.json({ success: true, result: uniqueTags });
        }).catch(err => {
            next(err);
        });
});

module.exports = router;
