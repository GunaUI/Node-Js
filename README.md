# Node-Js

## Session and Cookies

* let me dive into some mechanisms of storing data in memory or even on the client side, so in the browser. And for that in this module, we'll have a look at the sessions and cookies,

### What's a Cookie ??

*  when the user logs in, we want to store the information that the user is logged in somewhere so that when the user reloads the page and therefore technically a new request is sent, we still have that information around that the user is logged in

* and for that, we can send back a cookie with the response we send back upon the request.

* So the user submits the login data and we return a response which can be a new view to which we redirect to user but we also include our cookie and that cookie simply is important to well telling the user or to storing that information that the user is authenticated. We can store that information in the browser, (Refer Cookie image)

### Creating login form

* Lets add auth router for login page
```js
//router - auth.js
const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

module.exports = router;

```
* Controller 

```js
//controller auth.js
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login'
  });
};
```

* login Template 

```js
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" href="/css/forms.css">
    <link rel="stylesheet" href="/css/auth.css">
</head>

<body>
<%- include('../includes/navigation.ejs') %>

    <main>
        <form class="login-form" action="/login" method="POST">
            <div class="form-control">
                <label for="email">E-Mail</label>
                <input type="email" name="email" id="email">
            </div>
            <div class="form-control">
                <label for="password">Password</label>
                <input type="password" name="password" id="password">
            </div>
            <button class="btn" type="submit">Login</button>
        </form>
    </main>
<%- include('../includes/end.ejs') %>
```

* In order to reach this we also need to update app.js file regarding this new router

```js
....
....

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
....
....
...
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

```
### Adding the Request Driven Login Solution

* Lets add new controoller function postLogin in auth controller

```js
exports.postLogin = (req, res, next) => {
    req.isLoggedIn = true;
    res.redirect('/');
};
```
* Add corresponding routers

```js
router.post('/login', authController.postLogin);
```
* Now we have to pass this isLoggedIn to the template through every render method in controller Note!!! all render method!!

```js
exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};
```

* Show menu only if authenticated

```js
<% if (isAuthenticated) { %>
    <li class="main-header__item">
        <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Add Product
        </a>
    </li>
    <li class="main-header__item">
        <a class="<%= path === '/admin/products' ? 'active' : '' %>" href="/admin/products">Admin Products
        </a>
    </li>
<% } %>
```
* With the above change still Add Product and Admin Products won't be visible why ??

* The reason is once we set the isLoggedIn true immediately we are redirecting once we redirected the request is dead.basically we finished with the request that why its dead. these data will not stick arount it will get lost. the redirection creates a brand new request.


* If we used in some middle that runs all every request we could access isAuthenticated but here the isLoggedIn will be totally lost.

### Setting a Cookie

* what other alternative we have ?? we could use some global variable, but since that variable would be shared across all requests, it would also be shared across all users
and that is exactly where cookies can help us.

*  With cookies we can store data in the browser of a singleuser and store data in that browser which is customized to that user which does not affect all the other users
but can be sent with requests to tell us hey I already am authenticated.

* So instead of just redirecting here, what we can do is we can set a cookie by simply  setting a header.

```js
exports.postLogin = (req, res, next) => {
    // Set-Cookie is reserved name
    res.setHeader('Set-Cookie','isLoggedIn=true')
    res.redirect('/');
};
```
* now this cookie is not only set but the browser by default sends it to the server with every request we make,

* we need to extract 

```js
exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie').trim().split("=")[1] === 'true'
    res.render('auth/login', {
        isAuthenticated: isLoggedIn,
        path: '/login',
        pageTitle: 'Login'
    });
};
```
* Now our menus visible but Still there is a big disadvantage and do you know which one that is?

* So we have seen how we can set a cookie and some a bit too complex way of extracting cookie

* disadvantage is since we  can access our cookies that easily in the developer tools, we can easily change them, we can go here and manipulate the value,

* So the issue here is we can manipulate that from inside the browser and obviously you don't want to allow the users of your website to login by simply manipulating some cookie value.

* sensitive data should not be stored in the browser because users can edit them 

* cookies are generally a good thing for storing data across requests, it might not be the best approach in all scenarios and that is exactly something where sessions can help us with.

### Configuring Cookies


* So we can manipulate cookies so storing sensitive data is not ideal but I mentioned that for example for tracking users, it's a popular instrument and why is that?

* the cookies don't only have to relate to your page. A cookie can also be sent to another page and that is a common instrument in tracking where you have that so-called tracking pixel on pages which is simply an image url with no real image but that image can be located on let's say Google's servers and you have a cookie on that page which is also sent along with that and therefore Google can track on which page you are and how you are moving through the web even if you're not on their websites

* Now obviously we could add multiple cookies, multiple key value pairs,we can also add a semi-colon after the key value pair and for example set expires to some expiration date

```js
 res.setHeader('Set-Cookie','isLoggedIn=true; Max-Age=10')
```
* you might know that from your online bank where you timeout after a certain duration

* You can also add a domain to which the cookies should be sent

* You can add secure just like this without an equal sign, just secure,

```js
 res.setHeader('Set-Cookie','isLoggedIn=true; Secure')
```
* this means this cookie will only be set if the page is served via https.

*  you can also set this to http only.

```js
 res.setHeader('Set-Cookie','isLoggedIn=true; HttpOnly')
```
* it is set but now it has this checkmark here in the http column and that means that now we can't access the cookie value through client side javascript, so in the scripts running in the browser. This can be an important security mechanism because it protects us against cross-site scripting attacks now

* because now your client side javascript where someone could have injected malicious code can't read your cookie values 

* So this can be an extra security layer because now the cookie will still be attached to every request that is sent to the server but you can't read the cookie value from inside the browser javascript code.

### What is a Session?

* So now instead of storing the information that the user is authenticated in the frontend which was a bad place as we learned, we'll store it in the backend with a so-called session

* we only want to share the information across all requests of the same user and that's really important, the same user so that other users can't see your data can't assume your role, can't tell the server that they are authenticated, only you are authenticated

* Now for that, we need to store it on the server, we'll start by storing it in memory 

* we need one important piece of information. A client needs to tell the server to which session he belongs because the session will in the end just be an entry stored in memory or stored in a database.

* instead we'll use a cookie where we will store the ID of the session.

* Now obviously you can still change that and assume a different ID if you want to but that will not work like this because actually the value we store will not be the ID but the hashed ID, hashed with a certain algorithm where only the server can confirm that it has not been fiddled with so that you didn't play around with it and tried to create a different one.

* So this will be a secure way because you basically store the ID in an encrypted way where only the server is able to confirm that the stored cookie value relates to a certain ID in the database

* So sessions are stored on the server side, cookies client side, sessions server side. (Refer session image)

* Now let us see how to implement this.

### Initializing the Session Middleware

* To implement a session, we'll need another third party package,

```js
npm install --save express-session
```
* To use it, we'll go to our app.js file because we want to initialize that session early on.

* we want to initialize that session when we, well when we start up our server then we want to initialize the session middleware at least and the session
will then be used for every incoming request.

```js
const sessionObj = require('express-session');

app.use(sessionObj(
  {
    secret: 'this will be used for signing the hash which secretly stores our ID in the cookie.  in production, this should be a long string value.',
    resave: false,
    saveUninitialized: false
  }));

```
* you should add the re-save option and set this to false, this means that the session will not be saved on every request that is done, so on every response that is sent but only if something changed in the session., this will obviously improve performance and so on.

* save uninitialized value which you should set to false because this will also basically ensure that no session gets saved for a request where it doesn't need to be saved because nothing was changed about it

* you can configure that cookie with expire or maxAge but you can also go with the default settings.

* And with that, the session middleware is initialized and we're now ready to use the session.

### Using the Session Middleware

* now we have add the below line of code in login

```js
exports.postLogin = (req, res, next) => {
    // // Set-Cookie is reserved name
    // res.setHeader('Set-Cookie','isLoggedIn=true; HttpOnly')
    User.findById(req.session.user._id)
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(()=>{
            res.redirect('/');
        })
    })
    .catch(err => console.log(err));
};
```
* After login in developer tool, what you should see is that a new cookie was added here, this connect SID for a session id cookie,this is this encrypted value so to say

* session cookie so it will expire when you close the browser.

* session cookie that will identify you to the server let log and see

```js
exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    // this console will return true..

    const isLoggedIn = req.get('Cookie').trim().split("=")[1] === 'true';
    res.render('auth/login', {
        isAuthenticated: isLoggedIn,
        path: '/login',
        pageTitle: 'Login'
    });
};
```
* we can go to a different page and come back to login and these are all individual requests which technically are totally separated from each other, but  still we see true here because we still store this in the session on the server side by default, just in the memory not in the database yet and the session is identified to this browser by cookie session id.

* It still needs a cookie to identify the user but the sensitive information is stored on the server, we can't modify it and that of course will be super important for authentication.

### Using MongoDB to Store Sessions

* Now I showed you how to use a session, the problem here is this session is stored in memory and memory is not an infinite resource. So for development, this is fine but for a production server, this would be horrible because if you have thousands or one hundred thousands of users, your memory will quickly overflow if you store all that information in memory.from a security perspective, it's also not ideal.

* Refer : https://github.com/expressjs/express

* Refer : https://www.npmjs.com/package/connect-mongodb-session

```js
npm install --save connect-mongodb-session
```
* now let's go to app.js where we do initialize our session, here we do configure the session we already did and this is also where we need to configure our store. Now to set up that store,

```js
//app.js

const sessionObj = require('express-session');
// Now this actually gives you a function which should execute to which you pass your sessionObj
const mongoDbStore = require('connect-mongodb-session')(sessionObj);

const app = express();
// execute mongodb store as a constructor because this function happens to yield a constructor function which we store in mongodb store
// To that constructor, you pass some options
// Well it will require a connection string because it needs to know in which database, on which database server to store your data.
const mongoDB_URI = 'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/shop?retryWrites=true&w=majority'

const storeDb = new MongoDbStore({
  uri : mongoDB_URI,
  collection: 'sessions'
})

// Now we can storeDb this in our store , the below middleware automatically sets a cookie for you and it automatically reads the cookie value for you too,
app.use(sessionObj(
  {
    secret: 'this will be used for signing the hash which secretly stores our ID in the cookie.  in production, this should be a long string value.',
    resave: false,
    saveUninitialized: false,
    store: storeDb
  }));

// **** Output ****
_id:"J7WH2oLSMXxYgJIP6g-br3eAeZhOalfa"
expires:2019-12-21T07:18:38.322+00:00
session:Object
    cookie:Object
        originalMaxAge:null
        expires:null
        secure:null
        httpOnly:true
        domain:null
        path:"/"
        sameSite:null
    isLoggedIn:true
```
* this is how you should store them for production, use a real session store,

* But with that sessions are a powerful tool for storing data across requests while still scoping them to a single user and not sharing the data across users because now as you saw, different users have different sessions

* So in general, use a session for any data that belongs to a user that you don't want to lose after every response you send and that should not be visible to other users.

### Deleting a Cookie

* Now there is a cleaner way of doing that and that cleaner way is to use a method provided by the session middleware,

```js
<li class="main-header__item">
    <form action="/logout" method="post">
        <button type="submit">Logout</button>
    </form>
</li>
```
*  Now when I click this, I want to clear any session I might have and for that I of course need to register a new route.
```js
router.post('/logout', authController.postLogout);
```
* In controller

```js
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
```

### Fixing Some Minor Bugs

* When MongoDbStore fetches the data, its only fethes the data it didn't know about the user schema method like userSchema.methods.addToCart

* Let add the middleware to get the user mongoose model methods

```js
app.use((req, res, next) => {
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
```
* we can imporve this minor.

```js
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
```