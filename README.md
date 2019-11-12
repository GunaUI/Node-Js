# Node-Js

## Sequelize

*  what is sequelize actually? Sequelize is a third party package, to be precise it's an object relational mapping library

* it does all the heavy lifting, all the SQL code behind the scenes for us and maps it into javascript objects with convenience methods which we can call

to execute that behind the scenes SQL code so that we never have to write SQL code on our own.(Refer sequlize image)

* Sequelize offers us the models to work with our database

* We can then instantiate these models, so these classes so to say, we can execute the constructor functions or use utility methods to create let's say a new user object based on that model

* so we have a connection now then we can then run queries on that.

* And we can also associate our models, for example we could associate our user model to a product model. (Refer image sequlise core)

### Connecting to the Database

```js
npm install --save sequelize
```
* Make sure we also installed mysql2

* Now we have to do sequlize connection and object export

```js
const Sequelize = require('sequelize');

// var sequelize = new Sequelize('database', 'username', 'password')
const sequelize = new Sequelize('node-complete', 'root', 'CiscoBgl#6788', {
    // database engine
  dialect: 'mysql',
  // by default it will set localhost host but still here we set up localhost
  host: 'localhost'
});

module.exports = sequelize;

```
* We can use this in our models Refer : https://sequelize.org/v5/manual/models-definition.html

```js
const Sequelize = require('sequelize');
// Db connection managed by sequelize
const sequelizeConnector = require('../util/database');

// product model definition
const Product = sequelizeConnector.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;
```
### Syncing JS Definitions to the Database

* Sequlize can also create table for us , not only data manage and also it can create table. we need to tell sequlize to create table.

* I want to ensure that all my models are basically transferred into tables or get a table that belongs to them whenever we start our application.

* if the table already exists, it will of course not override it by default though we can tell it to do so.

* Now in my app.js file which is the file execute when I do start my program,

* sync basically syncs your models to the database by creating the appropriate tables.

```js
// app.js
const sequelizeConnector = require('../util/database');

sequelizeConnector.sync().then(result =>{
    console.log(result);
    // Only want to start my server only after sequlize syc result.
    app.listen(8000);
}).catch(err =>{
    console.log(err);
})
// result log response 
// we named our model as product but here its products because its automatically pluralize it.
Executing (default): CREATE TABLE IF NOT EXISTS `products` (`id` INTEGER NOT NULL auto_increment , `title` VARCHAR(255), `price` DOUBLE PRECISION NOT NULL, `imageUrl` VARCHAR(255) NOT NULL, `description` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `products`
```
* So now I just get MySQL query here and if we now have a look at the workbench and we right click on our database and click on refresh all, we see that under tables, we get a products table and if we inspect that with this icon, we see all the fields we defined and that is added by sequelize to new fields, created at and updated at.

* So it automatically manages some timestamps for us.

### Inserting Data & Creating a Product

* we will get rid of the old code we used to creating a product and now we will create new product by sequilize

```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  }).then(response => {
    console.log(response);
  }).catch(err => {
    console.log(err);
  })
};
```
### Retrieving Data & Finding Products

* Sequilize does not have fetchAll method but have diff method name findAll.
```js
exports.getIndex = (req, res, next) => {
  Product.findAll().then(products =>{
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
```

### Getting a Single Product with the "where" Condition

* First let see getting a product details by primary key

```js
exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
          .then((product) => {
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
* there is one more alternative way to find product but still above method is perfectly alright. this is alternative way using where syntax

```js
exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId;
     Product.findAll({where: {id : prodId}}) .then((product) => {
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
### Fetching Admin Products

```js
exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
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
### Updating Products

* Before update lets check our edit call

```js
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!JSON.parse(editMode)){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  
  Product.findByPk(prodId).then(product => {
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
```

* Now lets update the product details

```js
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
      // here save method special method from sequlize to save data to DB
      // if no product data found it will create product or else update...
      return product.save();
    }).then(result => {
      console.log("Data updated successfully!!");
      // redirect only async operation done..
       res.redirect('/admin/products');
    }).catch(err => {
      console.log(err);
    });
};
```

### Deleting Products

```js
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
```
* Alternative method 

```js
exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.destroy({where:{
    id : productId
  }}).then(result => {
    console.log("Deleted successfully!!");
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  });
};
```

### Creating a User Model

```js
// user model 
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = User;
```
### Adding a One-To-Many Relationship (Association).

```js
const Product = require('./models/product');
const User = require('./models/user');
....
....
// User created this product 

// here in second object we are defining how this relationship should be managed..

//constraints are used to specify rules for the data in a table.Constraints are used to limit the type of data that can go into a table. This ensures the accuracy and reliability of the data in the table. If there is any violation between the constraint and the data action, the action is aborted.

// cascade delete means that if a record in the parent table is deleted, then the corresponding records in the child table will automatically be deleted. This is called a cascade delete

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

// User might added many product. this is  optional .. we can also replace belongsTo with hasMany class
User.hasMany(Product);

sequelizeConnector.sync().then(result =>{
    //console.log(result);
    app.listen(8000);
}).catch(err =>{
    console.log(err);
})

```
* Refer sequelize doc for futher other options..

* Now with this being set up, sequelize sync will not just create tables for our models but also define

the relations in our database as we define them here.

```js
// Response after sync()

Executing (default): DROP TABLE IF EXISTS `products`;
Executing (default): DROP TABLE IF EXISTS `users`;
Executing (default): DROP TABLE IF EXISTS `users`;
Executing (default): CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(255), `email` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `users`
Executing (default): DROP TABLE IF EXISTS `products`;
Executing (default): CREATE TABLE IF NOT EXISTS `products` (`id` INTEGER NOT NULL auto_increment , `title` VARCHAR(255), `price` DOUBLE PRECISION NOT NULL, `imageUrl` VARCHAR(255) NOT NULL, `description` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `userId` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `produ
```
* in the above respose you could note here in this response "FOREIGN KEY (`userId`) REFERENCES `users` (`id`)" which is created from the above assosiation config

### Creating & Managing a Dummy User

* Just dummy user ..

```js
// npm start runs this alone..
sequelizeConnector
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Max', email: 'test@test.com' });
        }
        return user;
    })
    .then(user => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });
```
* As a next step, I'll will register a new middleware because I want to store that user in my request so that I can use it from anywhere in my app conveniently.

```js
//So this code will only run for incoming requests
app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// sequelizeConnector placed below this middleware..
```
* we might wonder if this can ever return a userdata and we are creating sequelizeConnector below the middleware ??

* Now keep in mind, app use here only registers a middleware so for an incoming request, we will then execute this function. 

* Npm start runs this code for the first time and npm start is what runs sequelize here not incoming requests, incoming requests are only funneled through our middleware.

* Also keep in mind the user we're retrieving from the database here is not just a javascript object with the values stored in a database, it's a sequelize object with the value stored in the database and with all these utility methods sequelize added, like destroy.

* So we're storing this sequelize object here in the request and not just a javascript object with the field values, it is that we got the extended version here and therefore whenever we call request user in the future in our app.

### Using Magic Association Methods

* From now on all new products that are created should be associated to the currently logged in user.

* oneway is we could pass this user id as part of reqest data .. something like below
```js
Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    // here...
    userId: req.user.id
  }).then(response => {
    console.log(response);
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  })
```
* But we can do this in more eligant way by using sequlize method like below
```js

```
* create product method. Now where is that coming from?

* sequelize add special methods depending on the association you added and for a belongs to has many association as we did

* for example to create a new associated object. So since a user has many products or a product belongs to a user as we learned or as we set it up in app.js

* since we have that relation defined, sequelize automatically adds a create product method to the user. Create product because our model is named product and create is then automatically added at the beginning of the method name,that is some magic done by sequelize.

```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Here we used sequlize helper function createProduct... this will update foreign key in product table
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
```
### Fetching Related Products

* Since user details added to the table we have to fetch product details using both user id and product id 

```js
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!JSON.parse(editMode)){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // here we used sequlize helper method to fetch product using userid and product id
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
```
* The above code will execute the below query

```js
 SELECT `id`, `title`, `price`, `imageUrl`, `description`, `createdAt`, `updatedAt`, `userId` FROM `products` AS `product` WHERE (`product`.`userId` = 1 AND `product`.`id` = '1');
```
* We have to update the other methods also the same way like fetchAll products..
```js
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
```
### One-To-Many & Many-To-Many Relations

* Now from a relation or association perspective, a cart should belong to a user and a cart that in turn simply holds products, many products with a quantity associated to them.

* Lets add cart model

```js
const Sequelize = require('sequelize');

const sequelize = require('../util/database');
// Here we defining CartItem with cart id alone
const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Cart;

```
* Now you might be wondering where are the products?

* we have to keep in mind that a cart should belong to a single user but may hold multiple products.

* The carts table however should hold the different carts for the different users, so we'll not just need the carts table and model, we'll also need a new cart-item.js model
```js
const Sequelize = require('sequelize');

const sequelize = require('../util/database');
// Here we defining CartItem with primary id and qty
// Details of the product id we will add from association like we did for user
const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = CartItem;
```
* Details of the product id we will add from association like we did for user

* Now its time to add more associations besides products and user.

```js
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

//This setup below, either of the two approaches will add a key to the cart, a new field to the cart which is the user id to which the cart belongs.
User.hasOne(Cart);
Cart.belongsTo(User);
// here { through: CartItem } telling sequelize where these connection should be stored and that is  cartitem model,
Cart.belongsToMany(Product, { through: CartItem });
```
### Creating & Fetching a Cart

* Just like create dummy user we will create cart for the user.

```js
sequelizeConnector
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Max', email: 'test@test.com' });
        }
        return user;
    })
    .then(user => {
      // Just like user creation..
        return user.createCart();
    }).then(user => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });
```
* I don't need to pass any data in there because cart in the beginning will not hold any special data.

* we can't access cart as a property "req.user,cart", but we can access using getCartMethod

* we can use it to fetch the products that are inside of it by returning carts get products.

```js
exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart =>{
    console.log(cart);
    // This was added by sequlize as magic method..
    return cart.getProducts().then(products => {
      res.render('shop/cart', {
              products: products,
              pageTitle: 'Your Cart',
              path: '/cart'
            });
    })
  }).catch(err => {
      console.log(err);
  });
};
// the above code will output below query
SELECT `product`.`id`, `product`.`title`, `product`.`price`, `product`.`imageUrl`, `product`.`description`, `product`.`createdAt`, `product`.`updatedAt`, `product`.`userId`, `cartItem`.`id` AS `cartItem.id`, `cartItem`.`quantity` AS `cartItem.quantity`, `cartItem`.`createdAt` AS `cartItem.createdAt`, `cartItem`.`updatedAt` AS `cartItem.updatedAt`, `cartItem`.`cartId` AS `cartItem.cartId`, `cartItem`.`productId` AS `cartItem.productId` FROM `products` AS `product` INNER JOIN `cartItems` AS `cartItem` ON `product`.`id` = `cartItem`.`productId` AND `cartItem`.`cartId` = 1;
```
### Adding New Products to the Cart

* we need to work on add card method

*  here add product is another magic method added by sequlize for many to many relationship

```js
exports.addToCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      // If product exist...
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      // If new product...
      // here add product is another magic method added by sequlize for many to many relationship
      // I can add a single product here and I will add it to this in-between table with its ID.
      // So here I add the product I retrieved,
      return fetchedCart.addProduct(product, {
        // I just need to also make sure that I set this extra field I added to my cart item, this is the in-between table
        // FYI Cart.belongsToMany(Product, { through: CartItem }); // refer app.js
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};
```
### Deleting Related Items & Deleting Cart Products

```js
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};
```
### Adding an Order Model

* Well an order is in the end just an in-between table between a user to which the order belongs and then multiple products that are part of the order

```js
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;
```
* Then we will have order quantity in order item model

```js
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = OrderItem;

```
* Now we have to connect these order and order item

```js
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
```
### Storing Cartitems as Orderitems

```js
<hr>
  <div class="centered">
      <form action="/create-order" method="POST">
          <button type="submit" class="btn">Order Now!</button>
      </form>
  </div>
```
* Lets add order routes

```js
router.post('/create-order', shopController.postOrder);
```

* Lets add logic for post order controller

```js
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      // Just like create cart lets create order magic method
      return req.user
        .createOrder()
        // Executing (default): CREATE TABLE IF NOT EXISTS `orderItems` (`id` INTEGER NOT NULL auto_increment , `quantity` INTEGER, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `orderId` INTEGER, `productId` INTEGER, UNIQUE `orderItems_orderId_productId_unique` (`orderId`, `productId`), PRIMARY KEY (`id`), FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;
        .then(order => {
        // Now this gives us an order but we don't just need the order, we also need to associate our products to that order,
          return order.addProducts(
            products.map(product => {
              // orderItem which is fetched from orderItem model
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      // Here we are dropping cart details since we pushing all our data to order details
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
```
### Resetting the Cart & Fetching and Outputting Orders

```js
exports.getOrders = (req, res, next) => {
  req.user
  // if we want to fetch related products of orders.. we need to include that ..
    .getOrders({include: ['products']})
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
* corresponding template for orders..

```js
<%- include('../includes/head.ejs') %>
    </head>

    <body>
        <%- include('../includes/navigation.ejs') %>
        <main>
            <% if (orders.length <= 0) { %>
                <h1>Nothing there!</h1>
            <% } else { %>
                <ul>
                    <% orders.forEach(order => { %>
                        <li>
                            <h1># <%= order.id %></h1>
                            <ul>
                                <% order.products.forEach(product => { %>
                                    <li><%= product.title %> (<%= product.orderItem.quantity %>)</li>
                                <% }); %>
                            </ul>
                        </li>
                    <% }); %>
                </ul>
            <% } %>
        </main>
        <%- include('../includes/end.ejs') %>
```
