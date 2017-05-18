'use strict'

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


//Listener pero solo una vez para logear solo la primera vez que se conecte
mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDb.');
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        if (err) {
            //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
            console.log('Error: ', err.message);
            return;
        }
        names.forEach((value, index, array) => {
            mongoose.connection.db.dropCollection(value.name);
            console.log("Eliminada colleccion previa: ", value.name);
        });

        //Cargo la nueva data una vez que haya eliminado las collecciones anteriores
        cargarData();
    });
})

function cargarData() {

    const anunciosPromesa = leerArchivo('./db/anuncios.json')
        .then((data) => {
            //Guardo los anuncios en la db
            Anuncio.insertMany(data.anuncios)
                .then(anunciosGuardados => {
                    console.log("Anuncios: ", anunciosGuardados, "guardados en la db con éxito");
                })
                .catch(err => {
                    console.log('Error: ', err.message);  //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                });

        }).catch(err => {
            console.log("Error: ", err.message);
        });

    const usuariosPromesa = leerArchivo('./db/usuarios.json')
        .then((data) => {
            //Guardo los usuarios en la db
            Usuario.insertMany(data.usuarios)
                .then(usuariosGuardados => {
                    console.log("Usuarios: ", usuariosGuardados, "guardados en la db con éxito");
                })
                .catch(err => {
                    console.log('Error: ', err.message);  //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                });
                
        }).catch(err => {
            console.log("Error: ", err.message);
        });
}

