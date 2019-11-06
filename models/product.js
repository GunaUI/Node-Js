// const fs = require('fs');
// const path = require('path');
const db = require('../util/database');
const cartModule = require('./cart');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'products.json'
// );

// const getProductsFromFile = cb => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };
const deleteProductById=(id) =>{
  // getProductsFromFile(products =>{
  //   const deletingProduct = products.filter(p => p.id === id);
  //   const updatedProducts = products.filter(p => p.id !== id);
  //   fs.writeFile(p, JSON.stringify(updatedProducts), err => {
  //     console.log(err);
  //     if(!err){
  //       cartModule.deletCartProduct(id, deletingProduct.price);
  //     }
  //   });
  // });
}

const getProductById= (id,cb) => {
  // getProductsFromFile(products =>{
  //   const product = products.find(p => p.id === id);
  //   cb(product);
  // });
};
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
    
    // getProductsFromFile(products => {
    //   if(this.id){
    //     // we have to find the existing product and update
    //     const existingProductIndex = products.findIndex(prod => prod.id === this.id)
    //     const updatedProducts = [...products];
    //     // now with the new array we will update updated product using existingProductIndex
    //     updatedProducts[existingProductIndex]= this
    //     // here we are writing the updated product to the file.
    //     fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //       console.log(err);
    //     });
    //   }else{
    //     // Add new product
    //     this.id = Math.random().toString();
    //     products.push(this);
    //     fs.writeFile(p, JSON.stringify(products), err => {
    //       console.log(err);
    //     });
    //   }
    // });
  }

  static fetchAll() {
    // getProductsFromFile(cb);
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    // getProductById(id,cb);
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }

  static deleteProduct(id) {
    // deleteProductById(id);
  }
};
