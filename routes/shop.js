const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetails);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.addToCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// // // router.get('/checkout', shopController.getCheckout);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrdersList);

module.exports = router;
