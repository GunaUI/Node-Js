# Node-Js

## SQL Introduction

### SQL VS NoSQL

* So what is SQL, how does it work then? 

* SQL database thinks in so-called tables,

* SQL simply stands for structured query language,

* Refer image folders

### NoSQL Introduction

* Now the name NoSQL simply means that it doesn't follow the approach SQL follows,

* Now in NoSQL, tables are called collections but you can think of them as tables, so as the table equivalent   

* Now in a collection, we don't find records but so-called documents

* NoSQL doesn't have a strict schema. Here we got two documents in the same collection but the second document, Manuel here does not have an age and that is perfectly fine in NoSQL (schemaless Refer image)

* you can store multiple documents with different structures in the same collection.

*  NoSQL world, we got no real relations, instead we go for duplicate data

* PROS : if we ever retrieve data, we don't have to join multiple tables together which can lead to very long and difficult code and which can also impact performance, and therefore this can be done in a super fast way and that is one of the huge advantages of NoSQL, it can be very fast and efficient.

#### NO SQL Characteristic

* So NoSQL characteristics in general are that we have no strong data schema,

* we can have mixed data in the same collection,

* no structure is required and that we have generally no data relations. refer image

* we also got a difference between SQL and NoSQL regarding our scalability.

* So as our application grows and we need to store more add more data and access that data or work with it more frequently, we might need to scale our database servers and we can differentiate between horizontal and vertical scaling.

#### Horizontal vs Vertical scaling

* we often need to scale our database to keep up with our growing application with more and more users

* Horizontal and vertical scaling are the two approaches we can use to scale our database.Now what do they mean? 

##### Horizontal scaling

* Well in horizontal scaling, we simply add more servers.

* the advantage here of course is that we can do this infinitely. We can always buy new servers, be that on a cloud provider or in our own data center and connect them to our database and split our data across all these servers,

* of course this means that we also need some process that runs queries on all of them and merges them together intelligently,so this is generally something which is not that easy to do but this is of course a good way of scaling. (Refer Image)

##### Vertical scaling

* Vertical scaling simply means that we make our existing server stronger by adding more CPU or memory or with something like that, especially with cloud providers, this is typically very easy, you simply choose another option from the dropdown, you pay more and you're done,

* the problem here is that you have some limit, you can't fit infinitely much CPU power into a single machine.

### Setting Up MySQL

* Refer (https://dev.mysql.com/downloads/);

* First download and install MySQL Community Server - macOS 10.14 (x86, 64-bit), DMG Archive

* Intall MySQL Workbench

* MySQL Workbench , Create new schema (eg name : node-complete) , then click apply , now our database is created with name "node-complete".

### Connecting our App to the SQL Database

* Now installation done but to use SQL we need to install the below package.

```js
npm install --save mysql2
```

* This package allow us to write and execute SQL code

* Now the next step is we need to connect this Db from our app

* DB should create DB and give us object , using that we can run query.

* Now there are 2 ways of connecting our app with MYSQL db

* One is that we setup one connection which we can always use to run queries , we should always close this connection once we done with the query. the issue in this method we have to re-execute this connection for every new query. Creating new connections for each and every query will become inefficient.

* The better way is connection using so called createPool.

* instead of createPool we can use createConnection but we don't want a single connection but a pool of connections which will allow us to always reach out to it whenever we have a query to run and then we get a new connection from that pool which manages multiple connections.

* so that we can run multiple queries simultaneously because each query needs its own connection and once the query is done, the connection will be handed back into the pool and it's available again for a new query and the pool can then be finished when our application shuts down.

```js
//database.js

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'ciscoBgl#6788'
});

module.exports = pool.promise();
```
* this will allow us to use promises when working with these connections which of course handle asynchronous tasks, asynchronous data instead of callbacks because promises allow us to write code in a bit more structured way,

### Retrieving Data

* Now we can use this database connection to excute our queries

```js
//app.js
const db = require('./util/database');

db.execute('SELECT * FROM products')
    .then(result=>{
        console.log(result);
    }).catch((err)=>{
        console.log(err);
    });
```

### Fetching Products

* Now we can use db to fetch and save data no need files to save and retrive data anymore.. lets remove files related code..

```js
static fetchAll() {
    // getProductsFromFile(cb);
    return db.execute('SELECT * FROM products');
  }
```
* Now we have to use promise and next gen feature called destructuring to get query data

```js
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
```

### Inserting Data Into the Database

```js
save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }
```
* Now we can redireact after promise done

```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
};
```
### Fetching a Single Product with the "where" Condition

* In module

```js
static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
}
```
* In controller

```js
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
```