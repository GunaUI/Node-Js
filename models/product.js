
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