const router = require('express').Router();
const Products = require('../models/products.model');

router.route('/').get(function(req, res){
    Products.find()
    .then(products => res.json(products))
    .catch(err => res.status(400).json("Error"+ err))
})



module.exports = router