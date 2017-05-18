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
    
    const anunciosPromesa = leerArchivo('./db/anuncios.json');
    anunciosPromesa.then((data) => {
        
        data.anuncios.forEach((value, index, array) => {
            //Creo objeto de tipo Anuncio
            let anuncio = new Anuncio(value);

            //Lo guardo en la base de datos
            anuncio.save((err, anuncioGuardado) => {
                if (err) {
                    console.log('Error: ', err.message); //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                    return;
                }
                console.log("Anuncio: ", anuncioGuardado, "guardado en la db con éxito");
            });
        });
    }).catch(err => {
        console.log("Error: ", err.message);
    })

    const usuariosPromesa = leerArchivo('./db/usuarios.json');
    usuariosPromesa.then((data) => {
        
        data.usuarios.forEach((value, index, array) => {
            //Creo objeto de tipo Anuncio
            let usuario = new Usuario(value);

            //Lo guardo en la base de datos
            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    console.log('Error: ', err.message);  //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db

                    return;
                }
                console.log("Usuario: ", usuarioGuardado, "guardado en la db con éxito");
            });
        });
    }).catch(err => {
        console.log("Error: ", err.message);
    })
}

