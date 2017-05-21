'use strict';

const fs = require('fs');

function leerArchivo(rutaArchivo) {

    return new Promise((resolve, reject) => {

        fs.readFile(rutaArchivo, (err, data) => {
            if (err) {
                reject(err);
            }

            try {
                //Parsear el contenido del json a Objeto
                const response = JSON.parse(data);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    });
}

module.exports = leerArchivo;

