# Node-Js

## Pagination

* right now we always fetch all products when we display the product page. In this module, we'll dive into a technique called pagination which allows us to split our data across multiple pages, something you typically want to do when you work with a lot of data

### Adding Pagination Links

* First of all in the product page let us add pagination section

```js
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" href="/css/product.css">
</head>

<body>
    <%- include('../includes/navigation.ejs') %>

    <main>
        <% if (prods.length > 0) { %>
            <div class="grid">
                <% for (let product of prods) { %>
                    <article class="card product-item">
                        <header class="card__header">
                            <h1 class="product__title"><%= product.title %></h1>
                        </header>
                        <div class="card__image">
                            <img src="/<%= product.imageUrl %>"
                                alt="<%= product.title %>">
                        </div>
                        <div class="card__content">
                            <h2 class="product__price">$<%= product.price %></h2>
                            <p class="product__description"><%= product.description %></p>
                        </div>
                        <div class="card__actions">
                                <a href="/products/<%= product._id %>" class="btn">Details</a>
                                <% if (isAuthenticated) { %>
                                    <%- include('../includes/add-to-cart.ejs', {product: product}) %>
                                <% } %>
                        </div>
                    </article>
                <% } %>
            </div>
            <section class="pagination">
                <a href="/?page=1">1</a>
                <a href="/?page=2">2</a>
            </section>
        <% } else { %>
            <h1>No Products Found!</h1>
        <% } %>
    </main>
<%- include('../includes/end.ejs') %>
```
* now we have buttons if i click one of them the URL changes

### Retrieving a Chunk of Data

* I'm setting these query parameters and I can use that data on the backend to control which data I want to fetch,

* We can access the page number from URL query param

* we now need to control the amount of data we're retrieving from the database.

```js
const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
  // page number from URL
  const page = req.query.page;
  Product.find()
    // skip function, to skip the first X amount of results 
    // in fist page skip (1-1)*2 = 0 items
    // in second page skip (2-1)*2 = 2 items, so skip first two items
    .skip((page - 1) * ITEMS_PER_PAGE)
    // I also want to limit the amount of items I retrieve, here 2 items per page
    .limit(ITEMS_PER_PAGE)
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

```

* In mongodb and therefore also mongoose, there is a skip function, to skip the first X amount of results and here, that would be page -1,

* I don't just want to skip some items, I also want to limit the amount of items I retrieve though, so that I don't just skip the items of previous pages but for the current page, I also only fetch as many items as I want to display there

### Skip & Limit with SQL

* When using MongoDB, you can use skip() and limit() 

* But how would that work in SQL?

* Here's how you would implement pagination in SQL code: 
https://stackoverflow.com/questions/3799193/mysql-data-best-way-to-implement-paging

* To quickly sum it up: The LIMIT command allows you to restrict the amount of data points you fetch, it's your limit() equivalent. Combined with the OFFSET command (which replaces skip()), you can control how many items you want to fetch and how many you want to skip.

* When using Sequelize, the official docs describe how to add pagination: 
http://docs.sequelizejs.com/manual/tutorial/querying.html#pagination-limiting

### Preparing Pagination Data on the Server

* but my buttons are hardcoded right now and that is not ideal of course, instead I rather maybe want to highlight the page I'm currently on and then show the next page number or the previous page number. For this I need to fetch more information.

```js
exports.getIndex = (req, res, next) => {
  // page number from URL
  // here we added plus in fromt of the query param to make this as number !!!
  // here we used or because if req.query.page is undefined it will take 1 as default
  const page = +req.query.page || 1;

  Product.find()
        // since collection.count is deprecated mongo recommend us to use   Collection.countDocuments or Collection.estimatedDocumentCount
        .countDocuments()
        .then(numProducts => {
          // Total number of products
          totalItems = numProducts;
          return Product.find()
          // skip function, to skip the first X amount of results 
          // in fist page skip (1-1)*2 = 0 items
          // in second page skip (2-1)*2 = 2 items, so skip first two items
          .skip((page - 1) * ITEMS_PER_PAGE)
          // I also want to limit the amount of items I retrieve, here 2 items per page
          .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
          res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            // currently active page
            currentPage: page,
            // when render we need to pass these information to template
            totalProducts: totalItems,
            // this hasNextPage pass true or false based on that template will decide nextpage or not
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            // if the current page is greater than 1 we will have previous page
            hasPreviousPage: page > 1,
            // here we are setting next and previous page number
            nextPage: page + 1,
            previousPage: page - 1,
            // So if we have let's say 11 total items and we have items per page of two, then the result would be 5.5 and then math.seal would return us 6 which would be the correct value because we would need 6 pages to display all 11 items
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
          });
        })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
```
* Now we are passsing all these information to product page, now we can use this for our dynamic page.

### Adding Dynamic Pagination Buttons

```js
<section class="pagination">

        <% if (currentPage !== 1 && previousPage !== 1) { %>
            <a href="?page=1">1</a>
        <% } %>

        <% if (hasPreviousPage) { %>
            <a href="?page=<%= previousPage %>"><%= previousPage %></a>
        <% } %>

        <a href="?page=<%= currentPage %>" class="active"><%= currentPage %></a>

        <% if (hasNextPage) { %>
            <a href="?page=<%= nextPage %>"><%= nextPage %></a>
        <% } %>
        
        <% if (lastPage !== currentPage && nextPage !== lastPage) { %>
            <a href="?page=<%= lastPage %>"><%= lastPage %></a>
        <% } %>

</section>
```
### Re-Using the Pagination Logic & Controls

* We need to reuse the same pagination logic in other templates  also 

```js
//includes/pagination.ejs

<section class="pagination">
    <% if (currentPage !== 1 && previousPage !== 1) { %>
        <a href="?page=1">1</a>
    <% } %>
    <% if (hasPreviousPage) { %>
        <a href="?page=<%= previousPage %>"><%= previousPage %></a>
    <% } %>
    <a href="?page=<%= currentPage %>" class="active"><%= currentPage %></a>
    <% if (hasNextPage) { %>
        <a href="?page=<%= nextPage %>"><%= nextPage %></a>
    <% } %>
    <% if (lastPage !== currentPage && nextPage !== lastPage) { %>
        <a href="?page=<%= lastPage %>"><%= lastPage %></a>
    <% } %>
</section>
```
* Now we can use this partials in our templates 

```js
<%- include('../includes/pagination.ejs', {currentPage: currentPage, nextPage: nextPage, previousPage: previousPage, lastPage: lastPage, hasNextPage: hasNextPage, hasPreviousPage: hasPreviousPage}) %>
```
* Apply these same partials and controller action logic to getProducts action too..

