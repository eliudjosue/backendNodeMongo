'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 5000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://eliud:1234@cluster0.kluto.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        .then(()=>{
            console.log("Conexion a la base de datos establecida con exito!")

            //Creacion del servidor
            app.listen(port, ()=>{
                console.log('Servidor corriendo correctamente!')
            })
        })
        .catch(err => console.log(err));

    // mongodb://localhost:27017/portafolio