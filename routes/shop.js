const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../util/path');

const adminData = require('./admin');

router.get('/', (req, res, next) => {
    // res.send('<h1>Hello from Express!</h1>');
    //res.sendFile("../views/shop.html")
    //console.log('shop.js',adminData.products);
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    const product = adminData.products;
    res.render('shop',{prods : product, pageTitle: "My Shop", pathParam:"/"})
});

module.exports = router;
