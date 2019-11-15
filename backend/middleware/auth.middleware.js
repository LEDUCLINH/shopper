const User  = require('../models/users.model');
var jwt = require('jsonwebtoken');

module.exports.requiredAuth = function(req, res, next) {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET__KEY);
    console.log(new Date())
    const user = {
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email
    }
    User.findOne(
        user
    , function(err, user){
        if(user){
            next();
        }
        if (err){
           res.send(400).json("Unauthorization")
        }
    })
}

