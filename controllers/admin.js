const { validationResult } = require('express-validator');

const fileHelper = require('../util/file');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage:null,
    validationErrors : []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file
  const price = req.body.price;
  const description = req.body.description;

  if(!image){
    return res.status(422).render('/admin/add-product', {
      path: '/admin/add-product',
      pageTitle: 'Products',
      editing: false,
      hasError: true,
      errorMessage: 'Attached file is not a image!',
      product: {title: title, price: price, description: description },
      validationErrors : [] // i won't mark anything as red
    });
  }
  // I will use my image data which is that file object we get from multer and there we have information like the file path and it's this path that is interesting to me of course because this is the path that a file on my operating system,
  const imageUrl = image.path

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('/admin/add-product', {
            path: '/admin/add-product',
            pageTitle: 'Products',
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {title: title,  price: price, description: description },
            validationErrors : errors.array()
        });
    }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      // res.redirect('/500');

      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // when we call next with an error passed as an argument, then we actually let express know that an error occurred and it will skip all other middlewares and move right away to an error handling middleware
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log(errors.array());
      // we shoukd return this otherwise it will continue rest of the code 
      return res.status(422).render('/admin/edit-product', {
          path: '/admin/edit-product',
          pageTitle: 'Edit Product',
          editing: true,
          hasError: true,
          errorMessage: errors.array()[0].msg,
          product: {title: updatedTitle, price: updatedPrice, description: updatedDesc, _id : prodId },
          validationErrors : errors.array()
      });
  }

  Product.findById(prodId)
    .then(product => {
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      // if we are updating with new image at that time only we will update the new updated URL in Db.
      // if no image don't update
      if(image){
        // here we are removing/unlink the old image from folder
        fileHelper.deleteFile(product.imageUrl);

        const updatedImageUrl = image.path
        product.imageUrl = updatedImageUrl;
      }
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      }).catch(err => console.log(err));
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      // here we are deleting the product image
      fileHelper.deleteFile(product.imageUrl);

      // here we are deleting the product form DB
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      // now we return json responses because we don't want to render a new page, we just want to return some data.
      res.status(200).json({message: "Success!"})
      // i will not redirect, just will update the response in current page
      // res.redirect('/admin/products');
    })
    .catch(err => {
      // now we return json responses because we don't want to render a new page, we just want to return some data.
      res.status(500).json({message: "Deleting Product Failure!"})
    });
};

