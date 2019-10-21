# Node-Js

## Working with Dynamic Content & Adding Templating Engines

###  Sharing Data Across Requests & Users

* we're not storing data now , it is kind of hard right now because we have no database where we could store it permanently

* For time being we can store it in javascript variables now  and see how that works..

* So let's say the incoming product title should be stored in a more permanent place. So how can we store this? we could add a
variable here in admin.js

```js
const products = [];


router.post('/add-product',(req, res, next)=>{
    console.log(req.body)
    products.push({title:req.body.title})
    res.redirect('/');
})


//module.exports = router
exports.routes = router;
exports.products = products;
```
* Note !! Since here we changed our export object .. we have to update the same in app.js import  adminRouter as below

```js
//app.use("/admin",adminRouter)
app.use("/admin",adminRouter.routes);
```
* Now we are storing and exporting product data now we can import this data in shop.js and use...

```js
const adminData = require('./admin');

console.log('shop.js',adminData.products);
```
* This is one way of sharing data.. if we open this same app in new browser but still you could able to access the data..

* so this is actually data which is inherent to our node server as it is running and therefore, it's shared across all users.

###  Templating Engines

* html content it uses there is generated on the fly, on the server by the templating engine taking that dynamic content into account.

* HTML generated on the fly using template engine (refer image folder)
    * Ejs "Eg : <p><%= name %></p>"
    * Pug(Jade) "Eg : p #{name}"
    * Handlebars "Eg : <p>{{name}}</p>"

### Pug : Installing and implementing

* Lets install pug

```js
npm install --save  pug 
```

* (app.js) after we created our express app  and stored it in the app constant, we can set a global configuration value.

*  Now what is that? app.set() allows us to set any values globally on our express application Refer : https://expressjs.com/en/api.html#app.set

```js
const express = require('express');

const app = express();

app.set('view engine', 'pug');

app.set('views', 'views');
// here in express views folder is default but in case if we are using any other names we need to specify for say if templates are in template-view folder..
// app.set('views', 'template-view'); *** something like this .. if views is the folder name then no need to add this config but even if we add not an issue..
```
* Fine now with the above steps our configurations are done , now we have to create pug template in view folder (shop.pug)

```pug
<!DOCTYPE html>
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        meta(http-equiv="X-UA-Compatible", content="ie=edge")
        title Document
        link(rel="stylesheet", href="/css/main.css")
        link(rel="stylesheet", href="/css/product.css")
    body
        header.main-header
            nav.main-header__nav
                ul.main-header__item-list
                    li.main-header__item
                        a.active(href="/") shop
                    li.main-header__item
                        a(href="/admin/add-product").active Add Product
        main    
            h1  My Products
            p   List of all the products...

```
* Now we have to instruct our app to use shop.pug file instead of shop.html file in shop.js

```js
router.get('/', (req, res, next) => {
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop') // since we already set path as view no need to specify path here and also no need to specify file as shop.pug that also already configured as default view engine as pug so just specify the file name is enough.
});
```
* Now this pug file will rendered fine.. if you inspect or view source of this file its is our normal html file.. pug generated this html version based on our minimal pug version.

### Outputting Dynamic Content

* We rending our template fine but we are not rendering dynamic content.that is what we are going to do now.

* we already have our product data, now we have to insert as dynamic contents to shop template file how ??

```js
const product = adminData.products;
res.render('shop',{prods : product, doctitle:"My Products Pug file"})
```
* now in our pug template we can access objects in template file.

```js
#{doctitle}
```
* before implement the product loop lets add the rest of the shop template for book listing.
```pug
<!DOCTYPE html>
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        meta(http-equiv="X-UA-Compatible", content="ie=edge")
        title #{doctitle}
        link(rel="stylesheet", href="/css/main.css")
        link(rel="stylesheet", href="/css/product.css")
    body
        header.main-header
            nav.main-header__nav
                ul.main-header__item-list
                    li.main-header__item
                        a.active(href="/") shop
                    li.main-header__item
                        a(href="/admin/add-product").active Add Product
        main    
            h1  My Products Pug file
            p   List of all the products...
            div.grid
                article.card.product-item
                    header.card__header
                        h1.product__title Great Book
                    div.card__image
                        img(src="https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png", alt="A Book")
                    div.card__content
                        h2.product__price $19.99
                        p.product__description A very interesting book about so many even more interesting things!
                    div.card__actions
                        button.btn Add to Cart
```
* now we have to do foreach (loop) for every product.

```pug
div.grid
    if prods.length>0   //- Note here we have if condition //
        each product in prods
            article.card.product-item
                header.card__header 
                    h1.product__title #{product.title} //- Note here we have product title //
                div.card__image
                    img(src="https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png", alt="A Book")
                div.card__content
                    h2.product__price $19.99
                    p.product__description A very interesting book about so many even more interesting things!
                div.card__actions
                    button.btn Add to Cart
    else
        h2 No books available
```
* Refer : https://pugjs.org/api/getting-started.html 

###  Converting HTML Files to Pug

* Similarly like shop template add template to the admin pug file.
```pug
<!DOCTYPE html>
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        meta(http-equiv="X-UA-Compatible", content="ie=edge")
        title Add New Product
        link(rel="stylesheet", href="/css/main.css")
        link(rel="stylesheet", href="/css/forms.css")
        link(rel="stylesheet", href="/css/product.css")
    body
        header.main-header
            nav.main-header__nav
                ul.main-header__item-list
                    li.main-header__item
                        a(href="/") Shop
                    li.main-header__item
                        a(href="/").active Shop
        
        main    
            form.product-form(action="/admin/add-product", method="POST")
                div.form-control
                    label(for="title") Title
                    input(type="text", name="title", id="title")
                    button.btn(type="submit") Add Product 
```
* Now we have to instruct the outer to use the pug file like we did for shop template.

```js
res.render('add-product');
```
* Same for 404 page also

```pug
<!DOCTYPE html>
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        meta(http-equiv="X-UA-Compatible", content="ie=edge")
        title Document
        link(rel="stylesheet", href="/css/main.css")
    body
        header.main-header
            nav.main-header__nav
                ul.main-header__item-list
                    li.main-header__item
                        a(href="/").active Shop
                    li.main-header__item
                        a(href="/admin/add-product") Add Product

        h1 Page Not Found! Pug template
```
* Now we have to instruct the outer to use the pug file

```js
app.use((req, res, next)=>{
    //res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404');
});
```
### Adding a Layout

