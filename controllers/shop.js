const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows, fieldData])=>{
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err =>{
    console.log(err);
  });
  
};

exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
          .then(([product]) => {
            res.render('shop/product-detail', {
              product: product[0],
              pageTitle: product[0].title,
              path: '/products'
            });
          }).catch(err =>{
            console.log(err);
          });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(([rows, fieldData])=>{
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err =>{
    console.log(err);
  });

  
};

exports.getCart = (req, res, next) => {
  Cart.fetchAllCart(cart => {
    console.log(cart);
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products){
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        products: cartProducts,
        pageTitle: 'Your Cart',
        path: '/cart'
      });
    });
  });
};

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;
  // Since we need product price we have to find the price through product Id 
  Product.findById(productId, product => {
    // now i have to use my cart model here..
    Cart.addProductToCart(productId, product.price);
    res.redirect('/cart');
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deletCartProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
