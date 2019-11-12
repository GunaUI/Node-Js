const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  }).then(response => {
    console.log(response);
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!JSON.parse(editMode)){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where: {id: prodId}})
  .then(products => {
    const product = products[0]
    if(!product){
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      product: product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode
    });
  }).catch(err => {
    console.log(err);
  });
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err =>{
    console.log(err);
  });
};

exports.updateProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.findByPk(productId)
  .then(product => {
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save();
  }).then(result => {
    console.log("Data updated successfully!!");
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  });
  
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByPk(productId)
  .then(product => {
    return product.destroy();
  }).then(result => {
    console.log("Deleted successfully!!");
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  });
};