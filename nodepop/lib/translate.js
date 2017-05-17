'use strict'

const leerArchivo = require('./leerArchivo');
var keys_en = {}
var keys_es = {}

leerArchivo("./lib/localization_en.json", (err, data) => {
    if (err) {
        console.log("Error: ", err.message);
        return;
    }

    keys_en = data.keys;
});

leerArchivo("./lib/localization_es.json", (err, data) => {
    if (err) {
        console.log("Error: ", err.message);
        return;
    }

    keys_es = data.keys;
});


exports.translate = (key, lang) => {    
    let translatedResponse = '';

    if (lang === 'en') {
        translatedResponse = keys_en[key];
    } else if (lang === 'es') {
        translatedResponse = keys_es[key];
    }

    return translatedResponse;
}