const express = require('express');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require('cors');
var cookieParser = require('cookie-parser');
const path = require('path');
const paginate = require('jw-paginate');


require('dotenv').config();
app.use(cors());
app.use(cookieParser());

// static folder 
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "http://localhost:2000");
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });


const port = process.env.PORT || 4000;

// connect mongoose
const url = process.env.ATLAS_URI;
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Connect");
})


//router
const shopPage = require('./routers/shoppage.route');
const register = require('./routers/register.route');
const login = require('./routers/login.router');
const logout = require('./routers/logout.router')
const authMiddleWare = require('./middleware/auth.middleware');
const products = require('./routers/products.router')
// homepage
app.get('/', (req, res) => res.send('Hello World'));
app.use('/shoppage',authMiddleWare.requiredAuth, shopPage);
app.use('/user', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/products', products);
app.get('/api/items', (req, res, next) => {
    // example array of 150 items to be paged
    const items = [...Array(150).keys()].map(i => ({ id: (i + 1), name: 'Item ' + (i + 1) }));

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pager = paginate(items.length, page);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))