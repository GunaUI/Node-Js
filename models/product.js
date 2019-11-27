const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId ){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbObj;
    if(this._id){
      // update product
      //update one takes at least two arguments.
      //The first one is that we add a filter that defines which element or which document we want to update,
      // Second object arument is not "this",  is not new object  Instead we have to describe the operation and we do this by using a special property name which is understood by mongodb, kind of a reserved name you could say, $set.This again takes an object as a value
      //{ $set : this } similar to ===> { $set : {title : this.title, price : this.price...} }
      dbObj = db.collection('products').updateOne({_id: this._id},{ $set : this });
    }else{
      console.log("Hey came inside else part")
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
}

module.exports = Product;
