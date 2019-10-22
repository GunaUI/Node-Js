# Node-Js

## Working with EJS

```js
npm install --save ejs 
```

* Ejs configuration similar like pug no need to import into app.js which we did for handlebars

* lets start with 404.ejs, it will use the normal html and also like pug we could use condition blocks in template , layout also not possible in ejs but still we will try to do some reuseable code.

```js
//404.ejs
<title><%= pageTitle %></title>
```

* More interesting part in if statement and loop.

```js
//shop.ejs
<main>
    <% if (prods.length > 0) { %>
        <div class="grid">
            <% for (let product of prods) { %>
                <article class="card product-item">
                    <header class="card__header">
                        <h1 class="product__title"><%= product.title %></h1>
                    </header>
                    <div class="card__image">
                        <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PDw8NDQ0NDQ0NDQ0NDQ0NDw8NDQ0NFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFQ8QFSsdFR0uLSsrKy0rKy0tKy0tKysrMCstLS0rLS0rLSstKy0rLS0rLTctLS0tLTctKy0tLTc3K//AABEIALsBDQMBIgACEQEDEQH/xA" alt="A Book">
                    </div>
                    <div class="card__content">
                        <h2 class="product__price">$19.99</h2>
                        <p class="product__description">A very interesting book about so many even more interesting things!</p>
                    </div>
                    <div class="card__actions">
                        <button class="btn">Add to Cart</button>
                    </div>
                </article>
            <% } %>
        </div>
    <% } else { %>
        <h1>No Products Found!</h1>
    <% } %>
</main>
```

### Working on the Layout with Partials

* Since we cant use layout kind of feature here we will use partials instead of creating one layout that will have block content of different file. we will create different partials like header, footer and then we will enclose our app with this partials.

* /views/includes/head.ejs
```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%= pageTitle %></title>
    <link rel="stylesheet" href="/css/main.css">
```

* /views/includes/end.ejs

```js
</body>

</html>
```
* /views/includes/navigation.ejs

```js
<header class="main-header">
        <nav class="main-header__nav">
            <ul class="main-header__item-list">
                <li class="main-header__item"><a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a></li>
                <li class="main-header__item"><a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Add Product</a></li>
            </ul>
        </nav>
    </header>
```
* Now we have our partials we need to include this as per our need
```js
// 404.ejs now its become more simple
<%- include('includes/head.ejs') %>
</head>

<body>
    <%- include('includes/navigation.ejs') %>
    <h1>Page Not Found!</h1>

<%- include('includes/end.ejs') %>
```

```js
// add-product.ejs
<%- include('includes/head.ejs') %>
    <link rel="stylesheet" href="/css/forms.css">
    <link rel="stylesheet" href="/css/product.css">
</head>

<body>
   <%- include('includes/navigation.ejs') %>

    <main>
        <form class="product-form" action="/admin/add-product" method="POST">
            <div class="form-control">
                <label for="title">Title</label>
                <input type="text" name="title" id="title">
            </div>

            <button class="btn" type="submit">Add Product</button>
        </form>
    </main>
<%- include('includes/end.ejs') %>
```

```js
// shop.ejs
<%- include('includes/head.ejs') %>
    <link rel="stylesheet" href="/css/product.css">
</head>

<body>
    <%- include('includes/navigation.ejs') %>

    <main>
        <% if (prods.length > 0) { %>
            <div class="grid">
                <% for (let product of prods) { %>
                    <article class="card product-item">
                        <header class="card__header">
                            <h1 class="product__title"><%= product.title %></h1>
                        </header>
                        <div class="card__image">
                            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/="
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
                <% } %>
            </div>
        <% } else { %>
            <h1>No Products Found!</h1>
        <% } %>
    </main>
<%- include('includes/end.ejs') %>
```
