const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: './public/upload/'});
const User = require('../models/users.model');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
router.route('/').get(function (req, res) {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json(err))
})



router.route('/register').post( upload.single('avatar'), [
    check('name', 'Invalid name! Name is leatest has 6 length').isLength({ min: 6 }),
    check('password', 'Invalid password! Password is weak').isLength({ min: 6 }),
    check('email', 'Invalid email! You should try again').isLength({ min: 11 })], 
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        else {
     var postUser = req.body;
     const processedFile = req.file || {};
    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
    orgName = orgName.trim().replace(/ /g, "-");
    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
    const newFullPath = `${fullPathInServ}-${orgName}`;
    fs.renameSync(fullPathInServ, newFullPath);
    // res.send({
    //     status: true,
    //     message: 'file uploaded',
    //     fileNameInServer: newFullPath
    // })
    postUser.avatar = newFullPath;
            let name = postUser.name;
            let email = postUser.email;
            User.findOne({ name: name, email: email }, function (err, user) {
                if (user) {
                    let err=[];
                    let errors = {};
                    err.push({ param: 'name',
                    msg: 'Exist valid name' })
                    if (email === user.email) {
                        err.push({param: 'email',
                             msg: 'Exist valid email' })
                    }
                    errors.errors = err;
                  return  res.status(400).json(errors);
                }
                else {
                    var errs=[];
                    var check1 = false;
                    var check2 = false;
                    var errors = {};
                    User.findOne({ name: name }, function (err, user) {
                        if(user){         
                            check1 = true; 
                            errs.push({param: 'name',
                            msg: 'Exist valid name' })
                        }
                    User.findOne({ email: email }, function (err, user) {
                         if (user){
                             check2 = true
                             errs.push({param: 'email',
                             msg: 'Exist valid email'});
                             errors.errors = errs;
                         }
                         if ( check1 || check2){
                            return   res.status(400).json(errors);
                            }   
                        else {
                            var transporter =  nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.EMAIL,
                                    pass: process.env.PASS
                                }
                            });
                            var mailOptions = {
                                from: process.env.EMAIL,
                                to: 'nhat@yopmail.com',
                                subject: "Well come to shopper",
                                text: `Hi Nhat, Congratuation`
                            }
                            transporter.sendMail(mailOptions, function(err, info){
                                if (err) {
                                    console.log("Error "+err)
                                }
                                else{
                                    console.log('Email sent '+ info.response);
                                }
                            })
                            var newUser = new User(postUser);
                            bcrypt.genSalt(saltRounds, function (err, salt) {
                                bcrypt.hash(newUser.password, salt, function (err, hash) {
                                    newUser.password = hash;
                                    // Store hash in your password DB.   
                                    newUser.save(function (err, user) {
                                        if (err) {
                                            console.log(err)
                                        }
                                        else {
                                            res.status(200).json({ notification:"Welcom to shop",
                                            fileNameInServer: newFullPath
                                        })
                                        }
                                    });
                                });
                            })
                        }
                    })
            
                })

                }
               

            })

        }
    })

    router.route('/:name').get((req, res) => {
        const fileName = req.params.name;
        console.log('fileName', fileName);
        if (!fileName) {
            return res.send({
                status: false,
                message: 'no filename specified',
            })
        }
        res.sendFile(path.resolve(`./public/upload/${fileName}`));
    })
 

router.route('/updatepass').post(function(req, res) {
    var { password, email } = req.body;
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash( password, salt, function (err, hash) {
          User.update({'email':email}, {'password': hash},function(err, obj){
        if (!err) {
             User.findOne({'email':email}, function(err, user) {
                 if (user) {
                const   payload = {
                    _id: user._id,
                    email: user.email,
                    name: user.name
                }
                  let token = jwt.sign(payload,process.env.SECRET__KEY,{expiresIn:'7d'})
           res.status(200).json({notification: "Bạn đã đổi mật khẩu thành công",
                              token:token});
                }
             })
      
        }
        else {
            res.status(400).json(err)
        }
         })
      });
    })
})
module.exports = router;