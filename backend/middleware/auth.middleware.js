const User  = require('../models/users.model');
var jwt = require('jsonwebtoken');

module.exports.requiredAuth = function(req, res, next) {
   jwt.verify(req.headers['authorization'], process.env.SECRET__KEY, function(err, decoded){
        if (err){
            let message = err.message
          return  res.status(401).json({message})
        }
        console.log("OK")
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
    });

}

