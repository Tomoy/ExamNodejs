'use strict';

const leerArchivo = require('./leerArchivo');
var keys_en = {};
var keys_es = {};


leerArchivo('./lib/localization_en.json')
    .then((data) => {
        keys_en = data.keys;
    }).catch(err => {
        console.log('Error: ', err.message);
    });

leerArchivo('./lib/localization_es.json')
    .then((data) => {
        keys_es = data.keys;
    }).catch(err => {
        console.log('Error: ', err.message);
    });

exports.translate = (key, lang) => {
    let translatedResponse = '';

    if (lang === 'en') {
        translatedResponse = keys_en[key];
    } else if (lang === 'es') {
        translatedResponse = keys_es[key];
    }

    return translatedResponse;
};