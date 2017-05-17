'use strict'

var jwt = require('jwt-simple');  
var moment = require('moment');  
var conf = require('./conf');

exports.ensureAuthenticated = function(req, res, next) {  

  var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];

  if (token) {
    try {
      var payload = jwt.decode(token, conf.TOKEN_SECRET);

      if (payload.exp <= moment().unix()) {
        return res
          .status(401)
          .send({ message: "El token ha expirado" });
      }

      req.user = payload.sub;
      next();
    } catch(err) {
      return res
        .status(403)
        .send({ message: 'Error: ' + err.message});
    }
  } else {
    return res
      .status(403)
      .send({ message: "Tu petición no incluye el token" });
  }
}

function createToken(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, "days").unix(),
    };
    console.log("token: ", conf.TOKEN_SECRET);
    return jwt.encode(payload, conf.TOKEN_SECRET); 
}

exports.createToken = createToken;

