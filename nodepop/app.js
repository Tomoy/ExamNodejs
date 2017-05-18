var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//Establezco la conexión de la base de datos
require('./db/connectDb');

//Incluyo mis modelos
require('./models/Anuncio');
require('./models/Usuario');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios.js'));
app.use('/apiv1/tags', require('./routes/apiv1/tags.js'));
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios.js'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//modulo para traducir los errores
const trans = require('./lib/translate'); 

// error handler
app.use(function(err, req, res, next) {
  console.log("REsponse: ", err.status);
  let errorMsg = err.message;
  //Si es un error custom y el lang fue enviado en las cabeceras, entonces lo traducimos y mandamos como mensaje de error
  if (err.localizedKey) {
    if (req.headers.lang) {
      errorMsg = trans.translate(err.localizedKey, req.headers.lang);
    } else {
      errorMsg = "Falta enviar el lang en el header!";
    }
  }

  // set locals, only providing error in development
  res.locals.message = errorMsg;
  console.log("Error translated: ", errorMsg);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
