const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
    password: {
        type: String,
        require: true,
        minLength:6
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    avatar: {
        type: String
    }
},{
    versionKey: false,
    timestamps: true
})

const User = mongoose.model('User', userSchema );
module.exports = User;