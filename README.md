# Node-Js

## Mongo Db

### What is mongoDB ??

* The name stems from the word humongous because mongodb was built for one major purpose, that you could store and work with lots and lots of data.

* So mongodb is built for large scale applications, mongodb is built to quickly query data, store data, interact with data,

* so it's really fast and it's really awesome database philosophy that is behind NoSQL databases

### how does it work?

* Well just like in the SQL world, we spin up a mongodb server and there we can have multiple databases,

* in the SQL world, we would have multiple tables, in the NoSQL mongodb world we have multiple collections

* Now inside of each collection, we don't have so-called records but we have a couple of documents , documents also look different, than records did.

* the core philosophy behind the database really is a totally different one. For example mongodb is schemaless, inside of one collection, your documents which is your data, your entry so to say don't have to have the same structure.here we can have any kind of data in one and the same collection.(Refer MongoDb image)

* Mongodb uses json to store data in collections,

* To be very precise mongodb uses something which is called bson for binary json but that only means that mongodb kind of transforms this behind the scenes before storing it in the filesbut we don't have to worry about that, we will basically use it as json

### Relations in NoSQL

* instead of just matching by ID as you do it in the SQL world, here you can also depict (copy/repeat) a relation by embedding data into other documents.

* There also are cases where you would have a lot of data duplication and where you need to work with that data a lot and hence it would change a lot and you would have to manually update it in all duplicate places, where using embedded documents is not ideal.

* Refer : Embedded vs Refernece image and NoSql characteristics image...

### Setting Up MongoDB

* Either you could download MongoDb local server or we could use cloud service 

* Let me try cloud environment (MongoDB atlas) , this is free !!!, signup and then create free cluster using default free setup..

* Refer https://cloud.mongodb.com/v2/5dca892eff7a2509fd477526#security/database/users

* Now we have to create Db users with read and write 

* Next step is IP white list - Add IP address of current IP address since node app runs locally on our machine our node app will have this IP address later while deploy we have to use different IP addressnof our server, This is Good security feature this will make sure no unauthorised user can't access

### Installing the MongoDB Driver

* let's add the mongodb driver which simply is a package we can use to connect to mongodb
```js
npm install --save mongodb
```
* Let do the initial driver set up in app.js to use mongodb before that remove sequlize related setup.

* Now lets do the database connectivity related changes in utils/database.js

```js
// This gives us access to mongodb package
const mongodb = require('mongodb');
// In that, we can extract a Mongo Client constructor by simply accessing mongodb,
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  // coppied from mongo cloud connect URL refer image (MongoDb connect)
  // Make sure to update usename and password in above url
  MongoClient.connect(
    'mongodb+srv://guna:<password>@nodemongo-jwgkk.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true }
  )
    .then(client => {
      console.log('Connected!');
      callback(client);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = mongoConnect;

```
* Now we have to connect this callback method in app.js

```js
const mongoConnect = require('./util/database');
mongoConnect(client => {
    console.log(client);
    app.listen(3000);
});
```
* In case if you are facing any connection time-out issue check your ip whitelist

```js
// Response from above client
MongoClient {
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  s:
   { url:
      'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/test?retryWrites=true&w=majority',
     options:
      { servers: [Array],
        retryWrites: true,
        w: 'majority',
        ssl: true,
        authSource: 'admin',
        replicaSet: 'NodeMongo-shard-0',
        caseTranslate: true,
        useUnifiedTopology: true,
        auth: [Object],
        dbName: 'test',
        srvHost: 'nodemongo-jwgkk.mongodb.net',
        socketTimeoutMS: 360000,
        connectTimeoutMS: 30000,
        useRecoveryToken: true,
        readPreference: [ReadPreference],
        credentials: [MongoCredentials],
        promiseLibrary: [Function: Promise] },
     promiseLibrary: [Function: Promise],
     dbCache: Map {},
     sessions: Set {},
     writeConcern: undefined,
     namespace: MongoDBNamespace { db: 'admin', collection: undefined } },
  topology:
   NativeTopology {
     _events:
      [Object: null prototype] {
        topologyDescriptionChanged: [Array],
        authenticated: [Function],
        error: [Function],
        timeout: [Function],
        close: [Function],
        parseError: [Function],
        fullsetup: [Function],
        all: [Function],
        reconnect: [Function],
        serverOpening: [Function],
        serverDescriptionChanged: [Function],
        serverHeartbeatStarted: [Function],
        serverHeartbeatSucceeded: [Function],
        serverHeartbeatFailed: [Function],
        serverClosed: [Function],
        topologyOpening: [Function],
        topologyClosed: [Function],
        commandStarted: [Function],
        commandSucceeded: [Function],
        commandFailed: [Function],
        joined: [Function],
        left: [Function],
        ping: [Function],
        ha: [Function] },
     _eventsCount: 24,
     _maxListeners: Infinity,
     s:
      { id: 0,
        options: [Object],
        seedlist: [Array],
        state: 'connected',
        description: [TopologyDescription],
        serverSelectionTimeoutMS: 30000,
        heartbeatFrequencyMS: 10000,
        minHeartbeatFrequencyMS: 500,
        Cursor: [Function: Cursor],
        bson: BSON {},
        servers: [Map],
        sessionPool: [ServerSessionPool],
        sessions: Set {},
        promiseLibrary: [Function: Promise],
        credentials: [MongoCredentials],
        clusterTime: [Object],
        monitorTimers: [Set],
        iterationTimers: Set {},
        connectionTimers: Set {},
        clientInfo: [Object],
        srvPoller: [SrvPoller],
        detectTopologyDescriptionChange: [Function] } } }
```
### Creating the Database Connection

* Now lets work on product module which is used by admin router 

* Unlike sequlize db we no need to create db those will be created on the fly.

* In SQL we had to prepare everything in advance, we're just telling mongodb hey connect me to the shop database

and if that database doesn't exist yet, mongodb will create it as soon as we start writing

data to it.

```js
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = callback => {
  MongoClient.connect(
    // by default test as database name you could find in the URL
    'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true }
  )
    .then(client => {
      console.log('Connected!');
      //here we could override database name...
      //_db = client.db('test');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if(_db){
    return _db;
  }
  throw "No DB connection found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

```
* So now I'm exporting two methods, one for connecting and then storing the connection to the database

* Now let us do product model

```js
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl ){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    // collection ====> Table refer https://docs.mongodb.com/manual/crud/
    // db.collection('products').insertOne({name: 'A Book', price: 2323.44});
    // db.collection('products').insertMany([{name: 'A Book', price: 2323.44},{name: 'A Book', price: 2323.44}]);
    return db.collection('products').insertOne(this).then(result =>{
      console.log(result)
    }).catch(err =>{
      console.log(err)
    });
  }
}
module.exports = Product;
```
* Make user we updated our mongoconnect object with the correct path.

```js
const mongoConnect = require('./util/database').mongoConnect;

mongoConnect(() => {
    app.listen(8000);
});
```
* View add product page is just a template it will work fine without but we need to work on create/update product.

### Creating Products

* postAddProduct - Let update our add product controller

```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Here we are passing data to product model constructor..
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

// Console log

[ Product {
       title: 'zczxczc',
       price: '2',
       description: 'zczxc',
       imageUrl: 'xzczc',
       // return insertedCount and _id which is dynamically created ID
       _id: 5dce3e7380009da82acdc173 } ],
  insertedCount: 1,
  insertedId: 5dce3e7380009da82acdc173 }
```

### Understanding the MongoDB Compass

* We did insert a product into our mongodb database which is awesome.Now I also want to see it and before we actually fetch it in our node application, let me show you another tool called compass.

* Download and install https://www.mongodb.com/download-center/compass

* Since mac not supporting dmg file in my machine i didn't try this am using mongo cloud service atlas.

### Fetching All Products

```js

static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }
```
*  Now the important thing about find is find does not immediately return a promise though, instead it returns a so-called cursor.

* A cursor is an object provided by mongodb which allows us to go through our documents step by step because theoretically in a collection, find could of course return millions of documents and you don't want to transfer them over the wire all
at once.

* So instead find gives you a handle which you can use to tell mongodb ok give me the next document, ok give me the next document and so on.

* there is a toArray method you can execute to tell mongodb to get all documents and turn them into a javascript array

* but you should only use that if you know that we're talking about hunderds odf document, otherwise we could use pagination we will see that soon..

* Now we have fetch all product model now we can call this in controller to use these in template..

```js
exports.getProducts = (req, res, next) => {
  // Here fetchall method is models static method name.. we could use user defined name..
  Product.fetchAll().then(products=>{
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
```
### Working on the Product Model to Edit our Product

```js
static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      //here, I want to look for a product where _id is equal to prod ID because that's the ID of the product I'm looking for. it might bring one product or many product.. so..
      //actually find will still give me a cursor because mongodb doesn't know that It will only get one
      // since in mongo db document _id is saved as bson format object("5dce3e7380009da82acdc173"), since prodId is just string  because a string is not equal to the object id we need to use mongodb.ObjectId
      // here we using find that is why we used next .. if we used findone no need to use next.

      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }
```
* since in mongo db document _id is saved as bson format object("5dce3e7380009da82acdc173"), since prodId is just string  because a string is not equal to the object id we need to use mongodb.ObjectId

* Make sure we imported mongodb in this model before we use mongodb.ObjectId.

*  here we using find that is why we used next .. if we used findone no need to use next.
* cursor.next() - Iterates the cursor and returns a Promise that resolves to the next document in the cursor. If the cursor is exhausted, the promise resolves to undefined.

* Lets use the above model to the controller..
```js
exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then((product) => {
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product[0].title,
        path: '/products'
      });
    }).catch(err =>{
      console.log(err);
    });
};
```
### Working on the Product Model to update

* To upate product we need _id as optional parameter in product constructor 

* update one takes at least two arguments.

* The first one is that we add a filter that defines which element or which document we want to update.

* Second object arument is not "this",  is not new object  Instead we have to describe the operation and we do this by using a special property name which is understood by mongodb, kind of a reserved name you could say, $set.This again takes an object as a value { $set : this } similar to ===> { $set : {title : this.title, price : this.price...} }

```js
class Product {
  constructor(title, price, description, imageUrl, id ){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new mongodb.ObjectId(id);
  }
  save() {
    const db = getDb();
    let dbObj;
    if(this._id){
      // update product
      // update one takes at least two arguments.
      // The first one is that we add a filter that defines which element or which document we want to update,
      // Second object arument is not "this",  is not new object  Instead we have to describe the operation and we do this by using a special property name which is understood by mongodb, kind of a reserved name you could say, $set.This again takes an object as a value
      //{ $set : this } similar to ===> { $set : {title : this.title, price : this.price...} }
      dbObj = db.collection('products').updateOne({_id: this._id},{ $set : this });
    }else{
      // collection ====> Table refer https://docs.mongodb.com/manual/crud/
      // db.collection('products').insertOne({name: 'A Book', price: 2323.44});
      dbObj = db.collection('products').insertOne(this);
    }
      return dbObj.then(result =>{
        console.log(result)
      }).catch(err =>{
        console.log(err)
      });
  }
```

* Now our update model is ready we have to do changes in  our controller for update product accordingly..

* Similar like addProduct here we just added productId as one of the constructor object.Make sure we imported mongoDb for "mongoDb.ObjectID"

```js
exports.updateProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, imageUrl, description, productId);
  product
  .save()
  .then(result => {
    console.log("Data updated successfully!!");
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  });
  
};
```
### Delete product 

* As usual lets add model logic for delete an item

```js
static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      //here, I want to look for a product where _id is equal to prod ID because that's the ID of the product I'm looking for. it might bring one product or many product.. so..
      //actually find will still give me a cursor because mongodb doesn't know that It will only get one
      // since in mongo db document _id is saved as bson format object("5dce3e7380009da82acdc173"), since prodId is just string  because a string is not equal to the object id we need to use mongodb.ObjectId
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }
```
* Lets add controller details for the above static delete method.

```js
exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
  .then(() => {
    console.log("Deleted successfully!!");
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  });
};
```
* Note : Make sure we are having proper routes for all the controller!!!

### Creating New Users

* Now let me show you how you can now work with relations and for that, let's work with some users again.
* Now we have to work in user model

```js
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
        }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then(user => {
            console.log(user);
            return user;
            })
            .catch(err => {
            console.log(err);
            });
    }
}

module.exports = User;
```
* here we using findOne that is why we didn't used next .. if we used findone no need to use next.
* cursor.next() - Iterates the cursor and returns a Promise that resolves to the next document in the cursor. If the cursor is exhausted, the promise resolves to undefined.

* Now we have to use above user model to fetch user details using app.use middleware..

```js
app.use((req, res, next) => {
  User.findById('5baa2528563f16379fc8a610')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
// Console.log

 _id: 5dd0bd381c9d440000906f42,
  name: 'Guna',
  email: 'reachtoguna@gmail.com' }
```

### Storing the User in our Database

* when saving a product, I want to store a reference to a user here or embed the entire user data as you learned.

* However for products in users, you could actually find arguments for both approaches here,

* you certainly don't want to enclose all the user data in an embedded document because that would mean that if the user data changes, you need to change that data in all products

* but if you do include something which is unlikely to change very often, like the username for example,well then you could certainly go ahead and embed that together with the ID so that you always have that ID to fetch more data about the user if you need to,

* you've got to find by the method in the user model after all or that you have at least some snapshot data like the username available immediately, if that should change, you need to update it everywhere.

* The alternative to this is that you just store the ID, so just a reference and therefore if you need connected data, you always have to fetch it manually from two collections

* we should actually store the user ID when creating a new product.

```js
constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

```
* Now from add product we need to pass this userid 

```js
const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );
  product
    .save()

// cosole.log - product document
_id:5dd0cfb09cadaaa136c3d660
title:"asdasdasd"
price:"1212"
description:"sdszdszd"
imageUrl:"http://dfdcxz"
userId:5dd0bd381c9d440000906f42
```
### Working on Cart Items & Orders

* So let me start with the cart model, now what is, what's the overall goal we have here?

* Well obviously for every user ,we want to store a cart right and that user will have a cart and that cart will then hold the products. 

* this is a great place for embedded documents because we have a strict one-to-one relation between a user and a cart and therefore there is no need to manage this with a reference,

* I could actually get rid of my cart items, my cart model so that I just have product and usernand for now, also the orders and now on the user model, there I also want to store my cart items also.

* In users model add addToCart method 
```js
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  // Here we imported cart and id of the user 
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        // here we added cart items as array of objects...like below example
        this.cart = cart; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
        }
  // Here we added new addToCart function to manage cart details.
    addToCart(product) {
         const updatedCart = {
            items: [{...product, quantity: 1}]
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } }
            );
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then(user => {
            console.log(user);
            return user;
            })
            .catch(err => {
            console.log(err);
            });
    }
}

module.exports = User;

```

### Adding the "Add to Cart" Functionality in app.js

* user I'm getting here is data I'm getting out of the database and the methods aren't stored there, they couldn't be stored there

```js
app.use((req, res, next) => {
  User.findById('5baa2528563f16379fc8a610')
    .then(user => {
      // So to have a real user object with which we can interact, I should actually create a new user here and then simply pass like below
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
});
```
* user I'm getting here is data I'm getting out of the database and the methods aren't stored there,they couldn't be stored there.

* So to have a real user object with which we can interact, I should actually create a new user here and then simply pass user.name which is my username, how it's a stored, user email, user cart and user_id,

* With the above change we could able to access method in our controller..

```js
exports.addToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
    });
}


```
* Make sure we enabled corresponding routes in shop.js routes

* We have duplicate data here,we have the same product here as an embedded document and we have it in products. (Refer Mongo cloud user image - Cart item has the whole product details..)

* So this is maybe something which we should change because if we change the product right now, if we

* change the title or the price, this will not be reflected in the cart and in the cart

* we should have correct data because if the price changes, we can show the wrong price in our cart,right.

* I actually don't want to store all product data in this object
and then the quantity,I just want to store the product ID

```js
 addToCart(product) {
   // Instead of whole product details document here we are just  updating product id alone..
        const updatedCart = {
            items: [{productId: new ObjectId(product._id), quantity: 1}]
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } }
            );
    }
```
### Storing Multiple Products in the Cart

```js
addToCart(product) {
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
            productId: new ObjectId(product._id),
            quantity: newQuantity
            });
        }
        const updatedCart = {
            items: updatedCartItems
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } }
            );
    }
    // CONSOLE LOG

    _id:5dd0bd381c9d440000906f42
    name:"Guna"
    email:"reachtoguna@gmail.com"
    cart:Object 
      items :Array 
        0 :Object
          productId:5dd0cfb09cadaaa136c3d660
          quantity:2
        1:Object
          productId:W453455E6R67T878ER45
          quantity:1
```
### Displaying the Cart Items
*  I want to find all products that are in my cart.Now how can I do that? Well for this, we can use a special query syntax mongodb supports $in 

*  I'm not looking for a single ID am looking for array of ids.

* $in operator. And this operator takes an array of IDs and therefore every ID which is in the array will be accepted and will get back a cursor which holds references to all products with one of the IDs mentioned in this array.

* now I'll again use toArray to quickly get that converted to a javascript array 

```js
getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
        return i.productId;
    });
    return db
        .collection('products')
        .find({ _id: { $in: productIds } })
        .toArray()
        .then(products => {
        return products.map(p => {
            return {
            ...p,
            quantity: this.cart.items.find(i => {
                          return i.productId.toString() === p._id.toString();
                      }).quantity
            };
        });
        });
    }
```
* We have to corresponding changes in the controller.. 

```js
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};
```

* Now we have data lets make sure our template aligned propely with the data

```js
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" href="/css/cart.css">
    </head>

    <body>
        <%- include('../includes/navigation.ejs') %>
        <main>
            <% if (products.length > 0) { %>
                <ul class="cart__item-list">
                    <% products.forEach(p => { %>
                        <li class="cart__item">
                            <h1><%= p.title %></h1>
                            <h2>Quantity: <%= p.quantity %></h2>
                            <form action="/cart-delete-item" method="POST">
                                <input type="hidden" value="<%= p._id %>" name="productId">
                                <button class="btn danger" type="submit">Delete</button>
                            </form>
                        </li>
                    <% }) %>
                </ul>
                <hr>
                <div class="centered">
                    <form action="/create-order" method="POST">
                        <button type="submit" class="btn">Order Now!</button>
                    </form>
                </div>
                
            <% } else { %>
                <h1>No Products in Cart!</h1>
            <% } %>
        </main>
        <%- include('../includes/end.ejs') %>
```

### Delete cart product
* Model logic

```js
deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: {items: updatedCartItems} } }
            );
    }
```

* Controller logic 

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
### Adding an Order

* Model logic
```js
addOrder() {
  // this.cart ==> { items: [ { productId: 5dd0cfb09cadaaa136c3d660, quantity: 1 } ] } refer add to cart..
        const db = getDb();
            return db.collection('orders').insertOne(this.cart);
            .then(result => {
            this.cart = { items: [] };
            return db
                .collection('users')
                .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: [] } } }
                );
            });
    }
```
* Controller logic

```js
exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

```
### Adding Relational Order Data

* In orders collection we also need user details and product details with the cart details.

```js
addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
            const order = {
                items: products,
                user: {
                _id: new ObjectId(this._id),
                name: this.name
                }
            };
            return db.collection('orders').insertOne(order);
            })
            .then(result => {
            this.cart = { items: [] };
            return db
                .collection('users')
                .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: [] } } }
                );
            });
    }
```

### Getting Orders
* In orders collection each user object has user id we need compare that with the current user.

* the only important thing to know here is that you need to use quotation marks around the path and then you can say check user and then the ID for the user.

* You do that by specifying user._id and this will look for _id in the user property which holds an embedded document

```js
//user model
  getOrders() {
      const db = getDb();
      return db
              .collection('orders')
              .find({'user._id': new ObjectId(this._id)})
              .toArray()
  }
```

* controller Logic

```js
exports.getOrdersList = (req, res, next) => {
  req.user
    .getOrders()
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
### Removing Deleted Items From the Cart

* If we delete a product the corresponding item added in the cart also should delete right product id in cart.. but how would you solve this?

* one approach that would makes sense is that you add some kind of worker process (CRON). which is something a bit more advanced and not directly related to building web applications with node,

* when you're calling get cart on the user and you know that there are cart items on the user object and still the products you get back is empty, then you know there's a mismatch between what you have in your cart and what's in the database and in such a case, you could then issue some behind the scenes request

* so basically with exactly the tools you learned about to update the cart of that user to match the product you got back from the database. So if you got an empty product array and you have items in the cart, you want to reset your cart.

* If you've got less items in the data you get back from the database then that's in your cart, you want to find out what the difference is and then update your cart accordingly.

## MONGODB END - MONGOOSE STARTED..:-)



