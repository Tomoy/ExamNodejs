'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var conf = require('./conf');

exports.ensureAuthenticated = function (req, res, next) {

    var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];

    if (token) {
        try {
            var payload = jwt.decode(token, conf.TOKEN_SECRET);

            if (payload.exp <= moment().unix()) {
                const err = new Error();
                err.localizedKey = "TOKEN_EXPIRED";
                err.status = 403;
                next(err);
                return;
            }

            req.user = payload.sub;
            next();
        } catch (err) {
            err.status = 403;
            next(err);
        }
    } else {
        const err = new Error();
        err.localizedKey = "MISSING_TOKEN";
        err.status = 403;
        next(err);
    }
}

exports.createToken = (user) => {

    try {
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, "days").unix(),
        };
        return jwt.encode(payload, conf.TOKEN_SECRET);
    } catch (err) {
        next(err);
    }
}
