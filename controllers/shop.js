const Product = require('../models/product');
const OrderObj = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find().then(products=>{
    res.render('shop/product-list', {
      prods: products,
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
    Product.findById(prodId).then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    }).catch(err =>{
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find().then(products =>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err =>{
    console.log(err);
  });
};

exports.getCart = (req, res, next) => {
  // populate does not return a promise, so calling then on it would not work we have to chain execPopulate() after that and then we'll get a promise,
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user.cart.items);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items
      });
    })
    .catch(err => console.log(err));
};

exports.addToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      req.user.addToCart(product);
      res.redirect('/cart');
    })
    .then(result => {
      console.log(result);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrdersList = (req, res, next) => {
  OrderObj.find({"user.userId" : req.user})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const product = user.cart.items.map(i =>{
        //return {quantity: i.quantity, product: i.productId}
        return {quantity: i.quantity, product: { ...i.productId._doc }}
      })
      const orderData = new OrderObj({
        products: product,
        user : {
          name: req.user.name,
          // As we already see mongoose will pick id from this object
          userId: req.user
        }
      })
      return orderData.save();
    })
    .then(result => {
      return req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
