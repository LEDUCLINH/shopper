const router = require('express').Router();
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
router.route('/refreshToken').post(function(req, res) {
    const refreshTokenFromClient = req.body.refreshToken;
    if ( refreshTokenFromClient ) {
          // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
          const user =  jwt.verify(refreshTokenFromClient, process.env.REFRESH__SECRET__KEY);
          const payload = {
            _id: user._id,
            email: user.email,
            name: user.name
          }
          User.findOne(
            payload
        , function(err, user){
            if(user){
               let token = jwt.sign(payload, process.env.SECRET__KEY, {expiresIn: process.env.tokenLife});
            return    res.status(200).json({token});
            }
            if (err){
               res.send(400).json("Unauthorization")
            }
        })
      } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
          message: 'No token provided.',
        });
      }
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
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });
      
        var capcha = Math.floor(Math.random()*1000000);
        var mailOptions = {
            from: process.env.EMAIL,
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