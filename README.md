# Node-Js

## Mongoose

### What is Mongoose? 

* Mongoose is an ODM, an object document mapping library and that's something like sequelize which was an ORM, an object relational mapping library
and the difference of course just is that mongodb is not a relational database, it's a document database,it thinks in documents and hence we have an ODM here.

* of course we can write the query for that on our own, that is exactly what we did in the last module but it would be a bit easier if we could just focus on
our objects, on our data and see how it should look like and then work with it  (Refer mongoose image)

* The core concepts are that we work with schemas and models where we define how our data should look like

* then we have so-called instances where we instantiate our models,so where we create real javascript objects we can work with that are based on our blueprints.

* once we get that setup, we can run queries and there we again use our objects, we use our models and we can then query the database (Refer MongooseCore image)

### Connecting to the MongoDB Server with Mongoose

* Refer : https://mongoosejs.com/docs/

```js
npm install --save mongoose
```
* Next is database connection

* we could use our database utility file here but actually mongoose does all of that utility management and the management of that connection behind the scenes for us. What we can do is we can get rid of (Remove) the database.js file and we can go to the app.js file

```js
const mongoose = require('mongoose');
// Same URL we used in mongoDb..
mongoose
    .connect(
        'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });
```
* mongoose will manage that one connection behind the scenes for us so that in other places where we start using mongoose from the mongoose package, we use that same connection we set up here, really convenient of course

* Now again we have to change all our models to mongoose..

### Creating the Product Schema and Saving Data Through Mongoose

* Make sure we droped all old db , we will create the same using mongoose.

* Lets create our product model

```js
const mongoose = require('mongoose');
// This constructors allow us to create new schema..
const Schema = mongoose.Schema;
// here we are defining Schema ie  how our product should look like 
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

// Here we are exporting our mongoose Product model with proproductSchemaduct
module.exports = mongoose.model('Product', productSchema);

```
* Now model defined here..now we have to use controller logic

```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl});
  product
    .save()
    .then(result => {
      console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};
```
* Note : !!! in above model we used a method save but we don't have method name defined with save in product model !!! , then how can we use that ?? Actually this save method is mongoose model not from our product model method. this save method is default mangoose method to save.

* For the above model it will create a products model , here product is fetched from model and added 's' at the end to pluralise

* We now able to save data through mongoose.

### Fetching All Products

* Controller logic : in mongodb we used fetchAll() here in mongoose we have to use find() but this wont return as cursor we will see that in upcoming topics..


```js
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
```

###  Fetching a Single Product

* findById is mongoose method not our local model method.
```js
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
```

### Updating Products

```js
exports.updateProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
// here we are finding product by id and then updating it using save  method of mongoose.
  Product.findById(productId).then(product => {
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save();
  })
  .then(result => {
    console.log("Data updated successfully!!");
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  });
};
```

### Deleting Products

```js
// findByIdAndRemove is mongoose method 
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
```

### Adding and Using a User Model

```js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
              // Schema.Types.ObjectId - this will store ObjectId type
                productId: { type: Schema.Types.ObjectId, required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});

module.exports = mongoose.model('User', userSchema);
```
* now of course I want to work with a user. And for that I'll go back to the app.js file and I will actually create a user here

```js
app.use((req, res, next) => {
  // findById mongoose method
    User.findById('5ddf6c24e882af4871e6179c')
        .then(user => {
            // !!! Now here we are using full mongoose model in req.user so that we can acess all mongoose methods on the user object .
            req.user = user
            next();
        })
        .catch(err => console.log(err));
});

mongoose
    .connect(
        'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/shop?retryWrites=true&w=majority',{ useUnifiedTopology: true, useNewUrlParser: true  }
    )
    .then(result => {
        // findOne mongoose method - if didn't give argument it will always returns the first record.
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                name: 'Guna',
                email: 'guna@test.com',
                cart: {
                    items: []
                }
                });
               // save mongoose method 
                user.save();
            }
        });
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });
```
### Using Relations in Mongoose

* With the user model set up, let's make sure we can use it together with the product model.

* Now obviously every product should be assigned to a user,so first of all we need to change our product schema a little bit.

```js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
 ....
 .....
 ......
 // User is the model name user we are refering here in product model
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
```
* ref configuration and ref takes a string where we tell mongoose hey which other mongoose model is actually related to the data in that field. here we are refering User model.

* We could refer produt in user model for cart items products ...

```js
const userSchema = new Schema({
    ....
    .....
    ......
    cart: {
        items: [
            {
              // Product refers to the product model
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});
```
* Now remember on create new product we have to pass user id

```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    {
      title: title, 
      price: price,
      description: description,
      imageUrl: imageUrl,
      // userId added...
      // userId: req.user we could use like this mongoose smart enough to pick id from this object.
      userId: req.user._id
    }
    );
  product
    .save()
    .then(result => {
      console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};
```
* userId: req.user we could use like this mongoose smart enough to pick id from this object. no need to specify req.user._id.

### One Important Thing About Fetching Relations

* Previous to fetch user relation data in product model we have to do one query by id, now its very simple.

* Mongoose has a useful utility method which we can add after find and that is populate. Populate allows you to tell mongoose to populate a certain field with all the detail information and not just the ID,

```js
exports.getProducts = (req, res, next) => {
  Product.find()
    // here in our case its just userId , we could also use nested object like userId.cart to populate
    // we will see this mondgo db course..
    .populate('userId')
    .then(products => {
    console.log(products);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err =>{
    console.log(err);
  });
};
```

* After find, you can call select which defined which field we want to retrive from db

```js
Product.find()
.select('title price -_id')
```
* Here we are including title , price and excluding  _id by adding minus in front of that.

### Working on shoping cart

*  previously we had utility methods like add to cart to add products to the cart of that user and actually it was really useful to have these because that allowed us to move logic from our controller into the model which is typically where your data related logic should live. So therefore I will re-add it and mongoose makes this really simple,

```js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});

userSchema.methods.addToCart = function(product){
    // we can still able to use this.cart.items because our schema have those structure
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
        //productId: new ObjectId(product._id),
        // we already defined these type in the above schema no need to add seperately.
        productId: product._id,
        quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };

    this.cart = updatedCart;

    return this.save();
};

module.exports = mongoose.model('User', userSchema);
```

* In our controller we can access this addToCart method using user model as

```js
exports.addToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      // user-defined method in User model
      req.user.addToCart(product);
      res.redirect('/cart');
    })
    .then(result => {
      console.log(result);
    });
};
```

### Loading the Cart

* req.user.populate does not return a promise, so calling then on it would not work we have to chain execPopulate() after that and then we'll get a promise

```js
exports.getCart = (req, res, next) => {
  
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
```
### Deleting Cart Items

* To delete cart item previous we are using user-defined method to filter the item and the update the cart. let us create user-defined schema method 

```js
userSchema.methods.deleteItemFromCart = function(productId){

    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });

    this.cart.items = updatedCartItems;
    return this.save();
}
```
* controller logic

```js
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};
```
### Creating & Getting Orders

* First let us create order model

```js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        product: { type: Object, required: true },
        quantity: { type: Number, required: true }
    }],
    user: {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);
```

* Lets do changes in addOrder

```js
const OrderObj = require('../models/order');

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const product = user.cart.items.map(i =>{
        return {quantity: i.quantity, product: i.productId}
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
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
```

### Storing All Order Related Data

* The above product: i.productId not populating all product related data its just populating product id alone but this is not we expected ..

* We have to use spread operation not directly on productId but in some special operator _doc

```js
return {quantity: i.quantity, product: {...i.productId._doc}}
```
* because product ID actually will be an object with a lot of metadata attached to it even though we can't directly see that when console logging
it but with .doc we get really access to just the data.

* then with the spread operator inside of a new object, we pull out all the data in that document

### Clearing the Cart After Storing an Order

* Now we have the clear the cart in user model once our order saved.

```js
userSchema.methods.clearCart = function(){
    this.cart = {items:[]};
    return this.save();
}
```
* Controller logic

```js
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
      // Here we using our user defined model method to cleat cart data
      return req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
```
### Getting & Displaying the Orders 

```js
exports.getOrdersList = (req, res, next) => {
  // here we are comparing req.user._id ie userid with user table model schema structure to fetch user related orders.
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
```



