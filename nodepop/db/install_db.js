'use strict';

//Establezco la conexión de la base de datos
require('./connectDb');
//Incluyo mis modelos
require('../models/Anuncio');
require('../models/Usuario');

const leerArchivo = require('../lib/leerArchivo');
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const Usuario = mongoose.model('Usuario');
const sha256 = require('sha256');


function eliminarCollection (collection) {

    return new Promise((resolve, reject) => {
        mongoose.connection.db.dropCollection(collection.name)
            .then(() => {
                console.log('Eliminada colleccion previa: ', collection.name);
                resolve();
            })
            .catch(err => {
                reject(err);
            });
    });
}

function serie(collections, fn, callbackFinal) {
    
    if (collections.length == 0) {
        callbackFinal();
        return;
    }

    fn(collections.shift())
        .then(() => {
            serie(collections, fn, callbackFinal);
        })
        .catch(err => {
            //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
            console.log('Error : ', err);
        });
}

//Listener pero solo una vez para logear solo la primera vez que se conecte
mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDb.');
    mongoose.connection.db.listCollections().toArray(function (err, collections) {
        if (err) {
            //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
            console.log('Error: ', err.message);
            return;
        }
        //Serie para recorrer las colecciones en forma asincrona y elmminarlas
        serie(collections, eliminarCollection, () => {
            //Cargo la data una vez que se que todas las colecciones previas fueron eliminadas
            cargarData();
        });
    });
});

function cargarData() {

    leerArchivo('./db/anuncios.json')
        .then((data) => {

            //Guardo los anuncios en la db
            Anuncio.insertMany(data.anuncios)
                .then(anunciosGuardados => {
                    console.log('Anuncios: ', anunciosGuardados, 'guardados en la db con éxito');
                })
                .catch(err => {
                    //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                    console.log('Error: ', err.message);  //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                });

        }).catch(err => {
            console.log('Error: ', err.message);
        });

    leerArchivo('./db/usuarios.json')
        .then((data) => {

            //Hasheo los passwords con sha256 antes de guardarlos en la db
            data.usuarios.forEach(function(usuario) {
                usuario.password = sha256(usuario.password);
            });

            //Guardo los usuarios en la db
            Usuario.insertMany(data.usuarios)
                .then(usuariosGuardados => {
                    console.log('Usuarios: ', usuariosGuardados, 'guardados en la db con éxito');
                })
                .catch(err => {
                    //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                    console.log('Error: ', err.message);  //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                });
                
        }).catch(err => {
             //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
            console.log('Error: ', err.message);
        });
}

