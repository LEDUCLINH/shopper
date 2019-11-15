const router = require('express').Router();
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var randtoken = require('rand-token');
var tokenList  = {} ;

router.route('/').get(function(req, res) {
    res.send('<form method="POST" action="/login"><input name="name" /><input name="password"/><button>POST</button></form>')
})
   
router.route('/').post(function(req, res) {
    var loginUser = req.body;
    User.findOne({name: loginUser.name}, function(errName, nameUser) {
        if (nameUser){
                    bcrypt.compare(loginUser.password, nameUser.password , function(errCompare, resCompare) {
                        if  (resCompare ){
                            const payload = {
                                _id: nameUser._id,
                                email: nameUser.email,
                                name: nameUser.name
                            }
                          let token = jwt.sign(payload, process.env.SECRET__KEY, {expiresIn: process.env.tokenLife});
                          let refreshToken = jwt.sign(payload, process.env.REFRESH__SECRET__KEY, {expiresIn: process.env.refreshTokenLife});
                          console.log(token.expiresIn);
                          tokenList[refreshToken] = loginUser;
                    //    res.setHeader("authorization", token);
                    //    console.log(token);
                       res.status(200).json({
                           token: token,
                           avatar: nameUser.avatar,
                           refreshToken: refreshToken
                       });
                        }
                        else{
                            res.status(400).json({
                                notification : "Wrong username or password"
                            });
                        }
                    });
        }
        else {
            res.status(400).json({
                notification : "Wrong username or password"
            });
        }
    })
})

router.route('/forget').post(function(req, res) {
    const { email } = req.body;
    User.findOne({email:email}, function(err, user) {
        if(!user) {
         return   res.status(400).json({err: "Email không hợp lệ hoặc chưa được đăng ký"})
        }
        var transporter =  nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'linhducle123@gmail.com',
                pass: 'Bongda24h'
            }
        });
      
        var capcha = Math.floor(Math.random()*1000000);
        var mailOptions = {
            from: 'linhducle123@gmail.com',
            to: email,
            subject: "Forget Password",
            text: `${capcha}`
        }
        transporter.sendMail(mailOptions, function(err, info){
            if (err) {
                console.log("Error "+err)
            }
            else{
                console.log('Email sent '+ info.response);
                res.status(200).json({
                    validate : capcha
                })
            }
        })
    })
   
})
module.exports = router;