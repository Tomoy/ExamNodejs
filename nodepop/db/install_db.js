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
    
    leerArchivo("./db/anuncios.json", (err, data) => {
        if (err) {
            //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
            console.log('Error: ', err.message);
            return;
        }

        data.anuncios.forEach((value, index, array) => {
            //Creo objeto de tipo Anuncio
            let anuncio = new Anuncio(value);

            //Lo guardo en la base de datos
            anuncio.save((err, anuncioGuardado) => {
                if (err) {
                    //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                    console.log('Error: ', err.message);
                    return;
                }
                console.log("Anuncio: ", anuncioGuardado, "guardado en la db con éxito");
            });
        });
    });

    leerArchivo("./db/usuarios.json", (err, data) => {
        if (err) {
            //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
            console.log('Error: ', err.message);
            return;
        }

        data.usuarios.forEach((value, index, array) => {
            //Creo objeto de tipo Usuario
            let usuario = new Usuario(value);

            //Hasheo el password
            usuario.password = sha256(usuario.password);

            //Lo guardo en la base de datos
            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                    console.log('Error: ', err.message);
                    return;
                }
                console.log("Usuario: ", usuarioGuardado, "guardado en la db con éxito");
            });
        });
    });
}

