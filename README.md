# Node-Js

## Working with Handlebars

* Handlebars using normal html with some syntax changes.

* In app.js we need to use new template engine as handlebars 

```js
npm install --save express-handlebars

//npm install --save express-handlebars@3.0
```
* we did installed express-handlebars but we need to instruct express such a handlebar engine available.

```js
const expressHbs = require('express-handlebars'); // we can use any name not necessary expressHbs

app.engine('hbs', expressHbs()); // hbs is the engine name

app.set('view engine', 'hbs'); // we have to use the same name as above (hbs) and also for file extention use the same name.

app.set('views', 'views');
```
* Now lets add 404.hbs file
```hbs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ pageTitle }}</title>
    <link rel="stylesheet" href="/css/main.css">
</head>

<body>
    <header class="main-header">
        <nav class="main-header__nav">
            <ul class="main-header__item-list">
                <li class="main-header__item"><a href="/">Shop</a></li>
                <li class="main-header__item"><a href="/admin/add-product">Add Product</a></li>
            </ul>
        </nav>
    </header>
    <h1>Page Not Found!</h1>
</body>

</html>
```
* here we used pageTitle , params might remain the same even the template engine same... no need any param changes..

* Same way replace shop.hbs and add-product.hbs files respectively..

```js
//shop.hbs

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{ pageTitle }</title>
    <link rel="stylesheet" href="/css/main.css">
</head>

<body>
    <header class="main-header">
        <nav class="main-header__nav">
            <ul class="main-header__item-list">
                <li class="main-header__item"><a class="active" href="/">Shop</a></li>
                <li class="main-header__item"><a href="/admin/add-product">Add Product</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="grid">
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title">First book</h1>
                </header>
                <div class="card__image">
                    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/7gAB//9k="
                        alt="A Book">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$19.99</h2>
                    <p class="product__description">A very interesting book about so many even more interesting things!</p>
                </div>
                <div class="card__actions">
                    <button class="btn">Add to Cart</button>
                </div>
            </article>
        </div>
    </main>
</body>

</html>
```
* Now as like pug here we want to use the dynamic data from routes using if/else and foreach helpers

```js
const product = adminData.products;
    res.render('shop',{prods : product, pageTitle: "My Shop", pathParam:"/"})
```

```hbs
<main>
    {{#if prods.length>0}}
    <div class="grid">
        <article class="card product-item">
            <header class="card__header">
                <h1 class="product__title">First book</h1>
            </header>
            <div class="card__image">
                <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD///9k="
                    alt="A Book">
            </div>
            <div class="card__content">
                <h2 class="product__price">$19.99</h2>
                <p class="product__description">A very interesting book about so many even more interesting things!</p>
            </div>
            <div class="card__actions">
                <button class="btn">Add to Cart</button>
            </div>
        </article>
    </div>
    {{ else }}
        <h1>No Products Found!</h1>
    {{/if}}
</main>
```
* here we used # for block statement like #if #each

* once you opened a if block we should close that..

* when you try ti run the above code it will not work because handlesbars won't accept "{{#if prods.length>0}}" , it will accept either true/false.

```js
res.render('shop',{prods : product, pageTitle: "My Shop", pathParam:"/", hasProducts: product.length>0})
```
* now we can use "hasProducts" param instead of "{{#if prods.length>0}}"

* this looks bit complex because it forces us to put all our logic into express code not in template.

```hbs
<main>
        {{#if hasProducts}}
        <div class="grid">
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title">First book</h1>
                </header>
                <div class="card__image">
                    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/uLSs"
                        alt="A Book">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$19.99</h2>
                    <p class="product__description">A very interesting book about so many even more interesting things!</p>
                </div>
                <div class="card__actions">
                    <button class="btn">Add to Cart</button>
                </div>
            </article>
        </div>
        {{ else }}
            <h1>No Products Found!</h1>
        {{/if}}
    </main>
```
* Now we have to do each in handlebars template. make sure you closing the each after done.

```hbs
<main>
        {{#if hasProducts}}
        <div class="grid">
            {{#each prods}}
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title">{{ this.title }}</h1>
                </header>
                <div class="card__image">
                    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/k="
                        alt="A Book">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$19.99</h2>
                    <p class="product__description">A very interesting book about so many even more interesting things!</p>
                </div>
                <div class="card__actions">
                    <button class="btn">Add to Cart</button>
                </div>
            </article>
            {{/each}}
        </div>
        {{ else }}
            <h1>No Products Found!</h1>
        {{/if}}
    </main>
```
* here we used "{{ this.title }}" because this will always refers to one product.

### Adding the Layout to Handlebars

* to use layout in handlebars first of we need to configure something..

```js
const app = express({
    layoutsDir: 'views/layouts/', // layout directory
    defaultLayout: 'main-layout',   // layout file name
    extname: 'hbs'  // file extention
});
```
* to use different partials we used block in pug file but here.. we can't do that unfortunately hbs does not have that feature.. but instead we can use the below way..

```hbs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ pageTitle }}</title>
    <link rel="stylesheet" href="/css/main.css">
    {{#if formsCss}}
    <link rel="stylesheet" href="/css/forms.css">
    {{/if}}
    {{#if productsCss}}
    <link rel="stylesheet" href="/css/product.css">
    {{/if}}

</head>

<body>
    <header class="main-header">
        <nav class="main-header__nav">
            <ul class="main-header__item-list">
                <li class="main-header__item"><a href="/" class="{{#if activeShop }}active{{/if}}">Shop</a></li>
                <li class="main-header__item"><a href="/admin/add-product" class="{{#if activeProduct }}active{{/if}}">Add Product</a></li>
            </ul>
        </nav>
    </header>
        {{{ body }}}
</body>

</html>
```
* here to indicate blocks we used three curly braces.. for styles we are using some very simple way there might be some other better way.. just refer handlebars docs

* Make sure we are passing these params from express routes..

```js
//shop.hbs
res.render('shop',{prods : product, pageTitle: "My Shop", pathParam:"/", hasProducts: product.length>0, activeShop: true, productsCss: true})
```
* Now layout is ready we have to use this layout in our template, to use we no need to do anything but if we want to remove with the above params pass layout : false !!!!

```js
//shop.hbs
res.render('shop',{prods : product, pageTitle: "My Shop", pathParam:"/", hasProducts: product.length>0, activeShop: true, productsCss: false})
```






