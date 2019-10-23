# Node-Js

## Model View Controller (MVC) - Structuring your code

### What is the MVC?

* It's all about a separation of concerns,

* Making sure that different parts of your code do different things and you clearly know which part is responsible for what.

* MVC - Model, View and Controller, we already got views in our project, right.

* Models are basically objects or is a part of your code that is responsible for representing your data in your code and allowing you to work with your data, so things like saving data, fetching data to or from a file or even if it's just in memory as we're currently
doing it,this should be handled by models

* The views are responsible for what the user sees in the end, they are responsible for rendering the right content in our html documents and sending that back to the user, so they are decoupled from your application code and are just having some light or minor integrations regarding the data we inject into our templating engine to generate these views.

* And the controllers are now the connection point between the models and your views, because since the views shouldn't care about the application logic and the models do care about how to save and fetch data and so on, the controllers are the thing working with the models, saving that data or triggering that save process and so on and also the part where they then pass that data that was fetched to your views

* So the controller is the middleman, it contains the in-between logic.

* Now in case you're also wondering how routes fit into this picture, well routes are basically the things which define upon which path for which http method which controller code should execute (Refer image folder)

### Adding Controllers

* We are going to split few of our router logic to controller

* With the current app routes which holds some of the controller logic, which needs to be moved to controller (controller/products.js).

```js
exports.getAddproduct = (req, res, next)=>{
    res.render('add-product',{docTitle: "Add New Product", pathParam:"/admin/add-product", pageTitle: "Add Product"});
};
```
* Now we have "getAddproduct" response from products controller let us use this in routers

```js
const productController = require('../controllers/products');

router.get('/add-product',productController.getAddproduct);
```
* The same way we have to do for post Add product also
```js
const products = [];

exports.getAddproduct = (req, res, next)=>{
    res.render('add-product',{docTitle: "Add New Product", pathParam:"/admin/add-product", pageTitle: "Add Product"});
};

exports.postAddproduct = (req, res, next)=>{
    products.push({title:req.body.title, pathParam:"/", pageTitle: "Add Product"})
    res.redirect('/');
};

```

* Corresponding changes in admin.js router also.

```js
const express = require('express');

const router = express.Router();

const productController = require('../controllers/products');

router.get('/add-product',productController.getAddproduct)

router.post('/add-product',productController.postAddproduct)

module.exports = router
```

* because of this changes now router export tweeked little bit and product exported in different source we have to update this changes in our app.js

```js
//app.use("/admin",adminRouter); since we changed the way we export adminRouter we are using the below one.
//app.use("/admin",adminRouter.routes); since we changed the way we export adminRouter again we removed this way of export
app.use("/admin",adminRouter);
```

* Let do the similar changes in shop.js routes

```js
//shop.js routes
const path = require('path');

const express = require('express');

const router = express.Router();

const productController = require('../controllers/products');

router.get('/', productController.getProducts);

module.exports = router;
```
* Do getProducts logics in controller 

```js
exports.getProducts = (req, res, next) => {
    res.render('shop',{prods : products, pageTitle: "My Shop", pathParam:"/"})
}
```

### Finishing the Controllers
* Same for 404

```js
// error.js
exports.get404 = (req, res, next)=>{
    res.status(404).render('404',{pageTitle: "404",pathParam : ""});
}
```
* In app.js

```js
const errorController = require('./controllers/error');
.......
.......
app.use(errorController.get404);
```

### Adding a Product Model

* we have added controllers and views now we have to add models. Currently we have very simple model using array variable..still we can define a model for that. (models/product.js)

* How does the model looks like its completely upto us..

```js
//Models/product.js

const products = [];

module.exports = class Product {
    constructor(thalaipu){
        this.title = thalaipu;
    }

    save() {
        products.push(this); // this will refer to the object created based on the class and that is exactly the object I want to store in this array.
    }
    static fetchAll(){ // static keyword which javascript offers which makes sure that I can call this method directly on the class itself and not on an instantiated object
        return products;
    }
}
```

* Now we have model next we have to use this model in controller.

```js
const Products = require('../models/product')

exports.postAddproduct = (req, res, next)=>{
    const product = new Products(req.body.title)
    product.save();
    res.redirect('/');
};


exports.getProducts = (req, res, next) => {
    const products = Products.fetchAll(); // Since this is  static method no need to initiate new object..
    res.render('shop',{prods : products, pageTitle: "My Shop", pathParam:"/"})
}
```

### Storing Data in Files via the Model

* let us try to save our product data in to file not into array variable

```js
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const filepath = path.join(
    rootDir,
    'data',  
    'products.json'
); // data folder, products.json filename, Make sure you have data folder..

module.exports = class Product {
    constructor(thalaipu){
        this.title = thalaipu;
    }

    save() {
    //readFile reads the entire file content of the file, for huge files there are more efficient way than this readFile.eg:ReadStream 
        fs.readFile(filepath, (error, fileContent) =>{
            let products=[];
            if(!error){
                // here JSON is helper object existing in vanilla node js no need to import anything
                products = JSON.parse(fileContent);
            }
            products.push(this);
            //stringify() takes javascript object/ array and convert that key into string.
            fs.writeFile(filepath, JSON.stringify(products), error=>{
                console.log(error);
            });
        })
    }
}
```
* readFile reads the entire file content of the file, for huge files there are more efficient way than this readFile.eg:ReadStream 

* JSON is helper object existing in vanilla node js no need to import anything

* stringify() takes javascript object/ array and convert that key into string.

* Now the data saved into the file successfully but now we have to do fetchAll data.

```js
static fetchAll(){ // static keyword which javascript offers which makes sure that I can call this method directly on the class itself and not on an instantiated object
        fs.readFile(filepath, (error, fileContent) =>{
            if(error){
                return []
            }
            return JSON.parse(fileContent);
        })
    }
```
* the issue is readFile is asynchronos code before readFile return fetchAll function finishes... With the above code for fetchAll it will through error because the return statement here belongs to the inner function not the outer function so fetch all doesn't return anything it will return undefined.

* There are multiple way of fixing this issue..  now I will simply accept an argument in fetch all and that's a callback

* instead of retruning the data we are passing that data to the call-back function as argument. 

```js
 static fetchAll(cb){ // static keyword which javascript offers which makes sure that I can call this method directly on the class itself and not on an instantiated object
        fs.readFile(filepath, (error, fileContent) =>{
            if(error){
                cb([])
            }else{
                cb(JSON.parse(fileContent));
            }
           
        })
    }
```
* Now in controller where we do call fetchAll model
```js
exports.getProducts = (req, res, next) => {
    Products.fetchAll((products)=>{ // we receiving the callback function here which will have data once its fetched , after that we could render the products data to shop template
        res.render('shop',{prods : products, pageTitle: "My Shop", pathParam:"/"})
    });
    
}
```
* we receiving the callback function in Products.fetchAll which will have data once its fetched asynchronously, after that we could render the products data to shop template

###  Refactoring the File Storage Code

* here we used getProductsFromFile helper function for better slim code.

```js
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const filepath = path.join(
    rootDir,
    'data',
    'products.json'
);

const getProductsFromFile = (cb) =>{
    fs.readFile(filepath, (error, fileContent) =>{
        if(error){
            cb([])
        }else{
            cb(JSON.parse(fileContent));
        }
        
    })
}

module.exports = class Product {
    constructor(thalaipu){
        this.title = thalaipu;
    }
    save() {
        getProductsFromFile(products => {
            products.push(this);
            //stringify() takes javascript object/ array and convert that key into string.
            fs.writeFile(filepath, JSON.stringify(products), error=>{
                console.log(error);
            });
        })
    }
    static fetchAll(cb){ // static keyword which javascript offers which makes sure that I can call this method directly on the class itself and not on an instantiated object
        getProductsFromFile(cb)
    }
}
```














