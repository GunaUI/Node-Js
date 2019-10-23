const Products = require('../models/product')

exports.getAddproduct = (req, res, next)=>{
    res.render('add-product',{docTitle: "Add New Product", pathParam:"/admin/add-product", pageTitle: "Add Product"});
};

exports.postAddproduct = (req, res, next)=>{
    // products.push({title:req.body.title, pathParam:"/", pageTitle: "Add Product"})
    const product = new Products(req.body.title)
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Products.fetchAll((products)=>{
        res.render('shop',{prods : products, pageTitle: "My Shop", pathParam:"/"})
    });
    
}

