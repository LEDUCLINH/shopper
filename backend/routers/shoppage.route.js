const router = require('express').Router();
const Products = require('../models/products.model');
const paginate = require('jw-paginate');

router.route('/search').get(function(req, res){
    const page = parseInt(req.query.page)||1;
    const name = req.query.name || '';
    const pageSize = 8;
    const maxPages = 5;
    // console.log(pageNumber);
    if(!name){
    Products.find() 
    .then(function(products) {
        const pager = paginate(products.length, page, pageSize, maxPages);
        const pageOfItems = products.slice(pager.startIndex, pager.endIndex + 1);
        return res.json({ pager, pageOfItems });
    })
    .catch(err => res.status(400).json("Error"+ err))
      }
    else{
        Products.find({product__company:name})
        .then(function(products) {
            const pager = paginate(products.length, page, pageSize, maxPages);

            const pageOfItems = products.slice(pager.startIndex, pager.endIndex + 1);
            return res.json({ pager, pageOfItems });
        })
        .catch(err => res.status(400).json("Error"+ err))
      }
    })
   



module.exports = router