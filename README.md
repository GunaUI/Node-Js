# Node-Js

## Adding Payment

### How Payments Work
* steps : Refer image
    * we start by collecting the payment method

    *  We then have to verify that, is the credit card data correct, is it expired, is the number correct?

    * We then have to charge it 

    *  we have to manage payments, so that includes things like fraud protection, also managing disputes and so on.

    * And last but not least, we of course have to process the order in our app, so in our server side code, for example that we store it in the database there.

* Stripe is a very popular company offering payment services, it offers a great integration and it's super easy to add to any application

### How Stripe Works

* Well we have our client and our server,

* the client, we'll collect credit card data. We'll do that with the help of stripe and we'll send it to the stripe servers which are not owned by us but by that company to validate that input.

* Once it is valid, stripe will return a token to us which basically encodes or which includes that credit card data and the confirmation that it is correct. 

* We send that token to our server and in our code, we create a charge or we charge this payment method then with the help of stripe again.

* So we create a payment object, a charge object, we send that to stripe with that token and with our price included and stripe will then do the actual charging, do the actual managing and we will get a response once this is done and then we can also continue with our code and edit this
or store this in the database and so on. So this is generally how that will work.

* Refer : Stripe image

### Adding a Checkout Page

* Add router for checkout page

```js
router.get('/checkout', isAuth, shopController.getCheckout);
```
* Add Controller function for this checkout screen

```js
exports.getCheckout = (req, res, next) => {
    // this code similar as get chart please refer that
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      let total = 0;
      products.forEach(p => {
          // here we are calculating the total price
        total += p.quantity * p.productId.price;
      });
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
```

* now we can use the totalSum and product details in checkout.ejs file

```js
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" href="/css/cart.css">

    </head>

    <body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <ul class="cart__item-list">
            <% products.forEach(p => { %>
                <li class="cart__item">
                    <h1><%= p.productId.title %></h1>
                    <h2>Quantity: <%= p.quantity %></h2>
                </li>
            <% }) %>
        </ul>
        <div class="centered">
            <h2>Total: <%= totalSum %></h2>
        </div>
    </main>
<%- include('../includes/end.ejs') %>
```

* we need a link for this checkout page let us add it in cart.ejs

```html
<div class="centered">
    <!-- <form action="/create-order" method="POST">
        
        <input type="hidden" name="_csrf" value="<%= csrfToken %>"/>
        <button type="submit" class="btn">Order Now!</button>
    </form> -->
    <a class="btn" href="/checkout">Order Now!</a>
</div>
```
### Using Stripe in Your App

* First create stripe account : https://dashboard.stripe.com/login

* Once login under develper we could bunch of API keys : https://dashboard.stripe.com/test/apikeys which we will need to add stripe .

* Initially it will be test data, we can switch to actual data while we are moving to the actual production.here for learning we will proceed with test data.

* Now go back to Home and click "Grow your online business with Payments", this takes us to the "https://stripe.com/docs/payments"

* It turns out that you have various different ways of implementing payments with stripe and of course you can check out their entire documentation to learn all about the different ways of collecting payments.

* Now here we can go to Building with stripe "https://stripe.com/docs/stripe-js", Just follow the stripe instructions.

* Add stripe HTML in our checkout.ejs

```js
// checkout.ejs
div class="centered">
    <button id="order-btn" class="btn">ORDER</button>
    <script src="https://js.stripe.com/v3/"></script>
    <script>
        var stripe = Stripe('pk_test_aG8PUxRBozhibKb2xs4Sur0700Uv7qhR0e');
        var orderBtn = document.getElementById('order-btn');
        // here onclick button we redirecting to stripe
        orderBtn.addEventListener('click', function() {
            stripe.redirectToCheckout({
                // we will get sessionId from getCheckout function
                sessionId: '<%= sessionId %>'
            });
        });
    </script>
</div>
```

* To prepare the sessionId in controller action we have to install 

```js
npm install --save stripe
```
* This is now a package which we can use on our server side code. So in node J.S.

```js
// here we using secret key which we should use only in our node app , we should not expose this to others
// i changed this key after developement, this key won't work for you..
const stripe = require('stripe')('sk_test_sad8iflYtQsdsadasd6114IHaaQjJso003Hasdasdasd4zV40W');

exports.getCheckout = (req, res, next) => {
  // we added the below let product and total, simply to make it available everywhere, Previously this is will be accessble only inside the then block now we can access this everywhere inside this function.
  let products;
  let total = 0;

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });
      // Remember we needed such a session key in our template. Now here we're going to create such a session which ultimately gives us such a key to create you parse an object where you configure that session.
      return stripe.checkout.sessions.create({
        // payment type here is card
        payment_method_types: ['card'],
        // here we are populate line items
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            // here we multiplied with 100 because we should specify with "CENTS" which is like paise in india
            amount: p.productId.price * 100,
            currency: 'usd',
            quantity: p.quantity
          };
        }),
        // req.protocol  which is a property again I can get from this request object express,which is simply http/https
        // req.get('host') ---> This will give us our host address.or later once we deployed it the IP address domain of the host deployed it on to
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:8000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        // here we are passing sessionId to View
        sessionId: session.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

```
* Checkout success or checkout cancel well these routes might not exist yet.lets add those routes

```js
router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

```
* If success we have to create an new function, if it fails we will redirect back to getCheckout action.

```js
// here we did the same thing we did for post order before, now we are not using post order..
exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
```
* Now our order success and redirected back to checkout/success but this approach has a flaw currently in the end we confirm that an order was successful.by simply running the logic and get checkout success that we can always trigger that if we just manually route to this page.
If I add a product to the card again and now I don't order it but I simply go to slash checkout slash success here does all this exceeds my card is empty and I placed the order without paying for it.

* But it won't show payment in stripe, we can only see succeeded order details with item display.

* This stripe and DB we could compare and see the fradulent order but ofcourse for large scale data its not easy to compare 

* But its already mentioned in the stripe doc about this corn "You should not depend on success URL alone, Make sure the payment done"

* as your application grows. Web hooks here would actually be the preferred solution.The idea here is that you can configure stripe such that it sends a request to a URL of your choice which you would have to manage here in your application with routing and that tells you that the order succeeded because a stripe sends you that request behind the scenes.It does not to send the request to a URL of your page.Anyone can enter.

* Setting up webhook is bit more complex.. but we can't test it now..



