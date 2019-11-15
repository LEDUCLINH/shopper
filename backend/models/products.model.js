const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: {
        type: Object
    },
    product__name: {
        type: String,
        require: true
    },
    product__price: {
        type: String,
        require: true
    },
    product__img: {
        type: String,
        require: true
    }
},{
    versionKey: false,
    timestamps: true
})

const Product = mongoose.model('Product', productSchema );
module.exports = Product;