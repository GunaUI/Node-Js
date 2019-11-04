# Node-Js

## Dynamic Routes & Advanced Models

* Now we need to pass some dynamic data through our routes

### Adding the Product ID to the Path

* Lets create a product detail page action. to view details about a product obviouly we need a unique identifier when we save a new product the DB. for time being we will use "this.id = Math.random().toString;"

* In can't send the entire the product details as the part of the URL but we can send the key information

```js
<a href="/products/<%= product.id %>" class="btn"> Details</a>
```

### Extracting Dynamic Params

* Its time to extract these id from the URL, lets go the routes.

```js
router.get('/products/:productId', shopController.getProductDetails);
```
* Important !!! Make sure the dynamic router ordered properly because as we already discussed this orders mater a lot , specific router should move to the top , move the dynamic router bottom because for eg if any url like "/products/delete" looks "/products/:productId" both are same. so we should be careful with the router order.

```js
exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId);
    res.redirect('/');
};
```
### Loading Product Detail Data

* Now we get the dynamic param , next we have to get the product detail data.

* Lets add  a static method 

```js
static findById(id,cb) {
    getProductById(id,cb);
  }

// already getProductsFromFile returning the all data from file
// return product if product id and the id we are passing are same.
const getProductById= (id,cb) => {
    getProductsFromFile(products =>{
        const product = products.find(p => p.id === id);
        cb(product);
    });
};
```
* Now we have to make sure we calling this model function in our controller.

```js
exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId, product => {
      console.log(product)
    })
    res.redirect('/');
};
```
### Rendering the Product Detail View

* Now we have to render our product details 

```js
<%- include('../includes/head.ejs') %>
    </head>

    <body>
        <%- include('../includes/navigation.ejs') %>
        <main class="centered">
            <h1><%= product.title %></h1>
            <hr>
            <div>
                <img src="<%= product.imageUrl %>" alt="<%= product.title %>">
            </div>
            <h2><%= product.price %></h2>
            <p><%= product.description %></p>
            <form action="/cart" method="post">
                <button class="btn" type="submit">Add to Cart</button>
            </form>
        </main>
        <%- include('../includes/end.ejs') %>
```

* Now we have to feed our product data to this template in controller.

```js
exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    });
};
```

### Passing Data with POST Requests

* Now we want to add this product to cart. since we are using this in many places let us create include file and use it where ever it needs

```js
// include/add-to-cart.js
<form action="/cart" method="post">
    <button class="btn" type="submit">Add to Cart</button>
    <input type="hidden" name="productId" value="<%= product.id %>"/>
</form>
```
* Now we can use this include as per our needs

```js
 <%- include('../includes/add-to-cart.ejs') %>
```

* But if we have a include in a for loop we need to pass the data to the loop otherwise it won't access data because product is local variable we have to pass that data to the include.

```js
<%- include('../includes/add-to-cart.ejs',{product: product}) %>
```

### Adding a Cart Model

* How we want to manage the cart ?? We have to group product by id and then we have to increase the quantity

*  I will first of all create a constructor here which allows us to create a new cart.

```js
module.exports = class Cart{
    constructor() {
        this.product = [];
        this.totalPrice = 0;
    }
}
```
* Now what we need on this cart though is a way to add and remove our products.

* if we use the above method we will constantly recreate it but this is not we need instead there always will be a cart in our application and we just want to manage the products in there.  I'll add a static method, add product and  this will take the ID of the product I want to add.

* The goal her is fetch the old or previous cart from our file for now, analyze that and see if we already have that product, find existing product and then add new product or increase the quantity. That is what we plan to do,

```js
module.exports = class Cart{
   static addProductToCart(id {
       // Fetch the previous cart

       // Analyze the cart => Find existing product 

       // Add new product/ increase quantity

   }
}
```

* let's start with adding the logic for fetching a cart from a file.

```js
const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart{
   static addProductToCart(id {
       // Fetch the previous cart

            fs.readFile(p, (err, fileContent) => {
                // New cart 
                let cart = { products: [], totalPrice: 0 };
                if (!err) {
                    // Existing cart
                    cart = JSON.parse(fileContent);
                }
            });

       // Analyze the cart => Find existing product 

       // Add new product/ increase quantity

   }
}
```

* now we can analyze it and add a product,

```js
cconst fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
   static addProductToCart(id, productPrice){
       // Fetch the previous cart

            fs.readFile(p, (err, fileContent) => {
                // New cart 
                let cart = { products: [], totalPrice: 0 };
                if(!err) {
                    // Existing cart
                    cart = JSON.parse(fileContent);
                }
       // Analyze the cart => Find existing product 
                const existingProductIndex = cart.products.findIndex(
                    prod => prod.id === id
                );
                let updatedProduct;
                // With the existing product index we have to find the existing product.
                const existingProduct = cart.products[existingProductIndex];

                 // Add new product/ increase quantity
                 if (existingProduct) {
                     // distributing all properties of product to new object
                    updatedProduct = { ...existingProduct };
                    // add and increase the qty to +1
                    updatedProduct.qty = updatedProduct.qty + 1;
                    // Just copying the old product 
                    cart.products = [...cart.products];
                    // Then copying the updatedProduct to that existingProductIndex
                    cart.products[existingProductIndex] = updatedProduct;
                }else{
                    // no existing product ie incase of new product

                    updatedProduct = { id: id, qty : 1}
                    // here with the other cart details will add our new(updated) product to the cart list
                    cart.products = [...cart.products, updatedProduct]

                }
                // Updating totalPrice of the cart 
                // here we added 2 + sign one before productPrice to convert the price to number from string
                cart.totalPrice = cart.totalPrice + +productPrice;
                // updating the cart details to DB ie file
                fs.writeFile(p, JSON.stringify(cart), err => {
                    console.log(err);
                });

            });
      

   }
}
```

### Using Query Params

* Now lets create templeate for edit product , we can copy and use the same template of add-product but it will be more better if we reuse and share the template.

* Since both are same template i no longer need add-product let us use the edit-product and delete addproduct and do the corresponding changes in controller

```js
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};
```
* Now still add Product screen working fine. Now i want a route for edit product 

```js
// /admin/edit-product => GET
router.get('/edit-product/:productId', adminController.getEditProduct);
```

* Now we have to identity add/ edit using some extra param with "editing : true"

```js
// eg URL : http://localhost:8000/admin/edit-product/12121212?edit=true
exports.getEditProduct = (req, res, next) => {
    // Fetching Query Param
  const editMode = req.query.edit;
  if(!editMode){
    res.redirect('/');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode
  });
  
};
```
### Pre-Populating the Edit Product Page with Data

* Now we have to get the edit product data from product id 

```js
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(!editMode)
  if(!editMode){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if(!product){
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      product: product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode
    });
  });
};
```
* Now we have to update the submit button text based on editing flag

```js
 <button class="btn" type="submit"><% if (editing) { %>Update Product<% } else { %>Add Product<% } %></button>
```
* Make sure we are sending the add product editing flag as false.

* Change the submit form logic also to accodmodate add and edit URL

```js
 <form class="product-form" action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>" method="POST">
```

* Same logic to display values for editMode 

```js

<form class="product-form" action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>" method="POST">
    <div class="form-control">
        <label for="title">Title</label>
        <input type="text" name="title" id="title" value="<% if (editing) { %><%= product.title %><% } %>">
    </div>
    <div class="form-control">
        <label for="imageUrl">Image URL</label>
        <input type="text" name="imageUrl" id="imageUrl" value="<% if (editing) { %><%= product.imageUrl %><% } %>">
    </div>
    <div class="form-control">
        <label for="price">Price</label>
        <input type="number" name="price" id="price" step="0.01" value="<% if (editing) { %><%= product.price %><% } %>">
    </div>
    <div class="form-control">
        <label for="description">Description</label>
        <textarea name="description" id="description" rows="5"><% if (editing) { %><%= product.description %><% } %></textarea>
    </div>

    <button class="btn" type="submit"><% if (editing) { %>Update Product<% } else { %>Add Product<% } %></button>
</form>
```
### Linking to the edit page

* Now we have to add query param and product id to edit button 

```js
<a href="/admin/edit-product/<%= product.id %>?edit=true" class="btn">Edit</a>
```
* Then we have to add logic for update product, let us create a post route for edit page.

```js
router.post('/edit-product', adminController.UpdateProduct);
```

### Editing the Product Data

 * Lets reuse the same save function for both update and save.

 ```js
 module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  
  save() {
    getProductsFromFile(products => {
      if(this.id){
        // we have to find the existing product and update
        const existingProductIndex = products.findIndex(prod => prod.id === this.id)
        const updatedProducts = [...products];
        // now with the new array we will update updated product using existingProductIndex
        updatedProducts[existingProductIndex]= this
        // here we are writing the updated product to the file.
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      }else{
        // Add new product
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

};
 ```

 * After this above change we have to pass null value as id for newly creating product

 ```js
 exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};
 ```

 * Also for update product we have to pass hidden product id from form submit.

```js
<% if (editing) { %>
    <input type="hidden" value="<%= product.id %>" name="productId">
<% } %>
```
* Then pass this data from controller to module

```js
const Product = require('../models/product');

exports.updateProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const updatedProduct = new Product(productId, title, imageUrl, description, price);
  updatedProduct.save();
  res.redirect('/admin/products');
};
```
### Adding the Product-Delete Functionality

* Lets create a new router for delete 
```js
router.post('/delete-product', adminController.deleteProduct);
```
* Let us add controller logic for delete product

```js
exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteProduct(productId);
  // it will be better if we have call back and the redirect we will do it later
  res.redirect('/admin/products');
};
```
* In our module we have to write the corresponding logics

```js
const deleteProductById=(id) =>{
  getProductsFromFile(products =>{
      // here we filtering except that product.
    const updatedProduct = products.filter(p => p.id !== id);
    fs.writeFile(p, JSON.stringify(updatedProduct), err => {
      console.log(err);
      if(!err){
        // here we have to write logic to remove product from cart also .. since product removed we have to remove that from cart also.
      }
    });
  });
}

static deleteProduct(id) {
    deleteProductById(id);
}
```
### Deleting Cart Items

* In cart modeule we have to write logics to delete product

```js
// we have to delete cart product and we also have to update total price also.
static deletCartProduct(id, productPrice) {
    // we have to read all cart product and then we have to apply our logic to that.
    fs.readFile(p, (err, fileContent) => {
      if(err){
        return;
      }
      const cart = JSON.parse(fileContent);
      const updatedCart = {...cart}
      // In the cart we have to find the product we are going to delete
      const product = updatedCart.products.find(prod => prod.id === id);
      const productQty =product.qty;
      // After we identified the product we have to filter the product exepect the deleting product
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
        // We have update total price logic based on the qty added to the cart
      updatedCart.totalPrice = updatedCart.totalPrice - productQty * productPrice;
      // Then we have to update the cart file with the new updated data
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }
```
* Now we have done with logic to delete the cart , once the product deleted we have to delete the corresponding product added to the cart also.

```js
// in productModule
const cartModule = require('./cart');

const deleteProductById=(id) =>{
  getProductsFromFile(products =>{
    const deletingProduct = products.filter(p => p.id === id);
    const updatedProducts = products.filter(p => p.id !== id);
    fs.writeFile(p, JSON.stringify(updatedProducts), err => {
      console.log(err);
      if(!err){
        cartModule.deletCartProduct(id, deletingProduct.price);
      }
    });
  });
}

```
### Displaying Cart Items on the Cart Page

* First we have to fetch the cart item in our controller from our module then we will populate the fetched data in our template.

```js
// Cart module

static fetchAllCart(cb) {
    getCartFromFile(cb);
}

const getCartFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};
```
* Now we have filter our product based on cart data.

```js
// Cart controller
exports.getCart = (req, res, next) => {
    // Here we fetching cart data
  Cart.fetchAllCart(cart => {
      // Product filtered based on cart data
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products){
          // Here we are collecting cart product data from cart file
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
```

* Now we can use these data in our cart template file
```js
<%- include('../includes/head.ejs') %>
    </head>

    <body>
        <%- include('../includes/navigation.ejs') %>
        <main>
            <% if (products.length > 0) { %>
                <ul>
                    <% products.forEach(p => { %>
                        <li>
                            <p><%= p.productData.title %> (<%= p.qty %>)</p>
                            <form action="/cart-delete-item" method="POST">
                                <input type="hidden" value="<%= p.productData.id %>" name="productId">
                                <button class="btn" type="submit">Delete</button>
                            </form>
                        </li>
                    <% }) %>
                </ul>
            <% } else { %>
                <h1>No Products in Cart!</h1>
            <% } %>
        </main>
        <%- include('../includes/end.ejs') %>
```
* In the above template we have delete btn lets add logics to delete item
```js
// In router
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
```
* Let add postCartDeleteProduct controller

```js
// postCartDeleteProduct Controller 
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
      // we already have deleteProduct cart
    Cart.deletCartProduct(prodId, product.price);
    res.redirect('/cart');
  });
};
```
### Fixing a Delete Product Bug





