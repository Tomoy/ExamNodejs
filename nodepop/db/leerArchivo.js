'use strict'

const fs = require('fs');


function leerArchivo(rutaArchivo, callback) {
    fs.readFile(rutaArchivo, (err, data) => {
        if (err) {
            callback(err);
            return;
        }

        try {
            //Parsear el contenido del json a Objeto
            const response = JSON.parse(data);
            callback(null, response);
        } catch (error) {
            callback(error);
        }
    });
}

module.exports = leerArchivo;

