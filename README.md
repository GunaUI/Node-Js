# Node-Js

## What is Authentication?

* We need to be able to differentiate between anonymous users who are not logged in and logged in users

### How is Authentication Implemented?

* now typically, a user will send a login request. Now obviously for that, a user, a visitor of our page needs to have signed up before but after you signed
up, you can login with your email and password and on the server, we check whether that email and password combination is valid,

* If valid, we create a session for this user, this session then identifies this user.This is required because otherwise without a session, even if we find out that the credentials are valid, for the very next request the user would be logged out again because remember, requests interact separated from each other, they don't know anything about each other,we need a session to connect them,

* We then return a success response and we obviously also store the cookie belonging to that session on the client, we return that with that response so that we really established a session.

* now this cookie is sent with every request, on the server we can connect this cookie to a session and in the session we have the information whether that user is signed in or not, and if the user is signed in, we can grant access to certain resources, (Refer Authentication image)

### Implementing an Authentication Flow

* Now we have routes and template for signup , then we have to work on controller part. let us retrive and save form data.

```js
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    // Find if this user email is already in used (in db), if yes return else save
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            const user = new User({
                email: email,
                password: password,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
};
```
* Make sure we update the modle change to accomodate this password field.

```js
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  // we removed name and password field added.
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});
```
* Now we have create user form let us remove the default user creation from app.js we did previously since we don't have create user , now we can remove that.

```js
mongoose
  .connect(
    mongoDB_URI,{ useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(result => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: 'Guna',
    //       email: 'guna@test.com',
    //       cart: {
    //         items: []
    //       }
    //     });
    //     user.save();
    //   }
    // });
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });
```
### Encrypting Passwords

* We're storing the password in plain text , we should encrypt that password,

```js
npm install --save bcryptjs
```
* in Post login controller we cab use this bcrypt to encrypt user password

```js
// we need to import bcryptjs package
const bcrypt = require('bcryptjs');


exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            // if new user then we have to save user details before that we encrypting  our password with 12 rounds of hashing  combination.

            // Since this is async task this will retun  as promise.
            return bcrypt.hash(password, 12);

        }).then(hashedPassword => {
            const user = new User({
                email: email,
                // instead of plain text we are saving encrypted password
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
};
```
### Adding a Tiny Code Improvement

* Here in above code if existing user we are redirecting to the signup page in side then block but still it will reach to next then block but we will will not sent hashed password right ??? How can we fix this ??

* we can chain then block which expecting hashedPassword with return password.

```js
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                        });
                        return user.save();
                    })
                    .then(result => {
                        res.redirect('/login');
                    });
    })
    .catch(err => {
      console.log(err);
    });
};
```

###  Adding the Signin Functionality

* Previously we used to find the user by _id hardcoded , now we can find the user by email id.

* We can't reverse this password then how can we validate this password?? we can do comparisson between db password and login user password

```js
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            return res.redirect('/login');
        }
        // comparisson between db password and login user password
        bcrypt
            .compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                    });
                }
                res.redirect('/login');
            })
            .catch(err => {
                console.log(err);
                res.redirect('/login');
            });
    })
    .catch(err => console.log(err));
};
```
### Working on Route Protection

* when I logout and therefore my session is gone, even when I do that, I can still manually enter admin add product and reach that page and I could even try to create a product.

* we don't even want to be able to load this page if we're not logged in

* Well to protect routes, we want to check where the user is authenticated before we render back let's say the add product page.

```js
exports.getAddProduct = (req, res, next) => {
  if(!req.session.isLoggedIn){
      // Since we retrun if not logged in 
    return res.redirect('/login');
    // below codereturn will not work
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};
```
* Note but adding like this in every controller function is cumbersome, lets do better way...

### Using Middleware to Protect Routes  

* As we see the above solution is not scalable way beacause we can't add this to all the other every controller the best way is implement through comman middleware.

* Let us create a new folder middleware/is-auth.js.

```js
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    // next -> if logged in continue the req
    next();
}
```
* here in this middleware we just checking if not isLoggedIn redirect , this is same logic as before but its wrapped in middleware.

* Now we have to include our middleware in admin.js

```js
const isAuth = require('../middleware/is-auth');
router.get('/add-product', isAuth, adminController.getAddProduct);
// if logged it will continue next (adminController.getAddProduct) or redirect. 
```
* Add this middleware where ever we need login authentication.

### Understanding CSRF Attacks

* let's talk about security - CSRF stands for cross-site request forgery,

* This is a special kind of attack pattern or approach where people can abuse your sessions and trick users of your application to execute malicious code. This is how it works,

* Now the user can do intended things like for example send money to B, if you are building a banking app 

* your user is tricked onto a fake site and this can be done for example by sending a link in an e-mail, that site can look like your own page but it technically is a different one.

* Now on that site, there could be a link leading to your page, to your real page executing some request there, of course you could include a form for example which sends a post request to your page, so to your own node server where you added some fields to send money to another person, to C in this case instead of B.

* To the user, this is pretty invisible because he saw a page that maybe looked like your page or clicked on a link that instantly redirected to your page but with behind the scenes some data being sent there that does something the user would not want to do normally.

* Well since you got valid session for that user if you send something to your site, to your servers, your session is used for that user and therefore that behind the scenes data that the user never sees that configures the money transferal is not ok to the user,

* this part is invisible to the user but the valid session gets used for it because your server is used and therefore this is accepted. This is an attack pattern where the session can be stolen so to say, where you can abuse the fact the users are logged in and you can simply trick them into making requests which they might not even notice

### how can we protect now?

* Well the idea is that we want to ensure that people can only use your session if they are working with your views, so with the views rendered by your application, so that the session is not available on any fake page that might look like your page but that aren't your page. And to ensure this, to add this feature, we will use a so-called csrf token.

### Using a CSRF Token

```js
npm install --save csurf
```
* Basically a token, a string value we can embed into our forms, so into our pages for every request that does something on the backend that changes the users state,

* anything that does something sensitive which we want to protect against. We can include such a token in our views then and on the server, this package will check if the incoming request does have that valid token.

* Now how does this protect us?

* Well the fake sites might send a request to your backend and they could theoretically use your session therefore but the requests will be missing the token and they can't guess the token because it's a random hashed value and only one value is valid of course and the package here which runs on the server determines whether a token is valid, so they can't guess it and they also can steal it because a new token is generated for every page you render.

* To enable CSRF protection go to the app.js 

```js

const csrf = require('csurf');
const csrfProtection = csrf({})

app.use(csrfProtection);
```
* for any non-get requests this package will look for the existence of a csrf token in your views

* Now to make sure that such a token is there, we first of all need to ensure we have it available in our views, to do that we have to pass data into our view.

* we would have to pass a new piece of information into the render method, you could name it csrf token, that name is up to you and you get it from request and then there, there will be a csrf token method.

```js
exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => {
      console.log(err);
    });
};
```
* After login this csrf token passed 

```js
// csrfToken key should match with the above method object csrfToken , both name should be similar

// hidden element name should be _csrf because the package which we added will look for this name, so for an input with that name

<li class="mobile-nav__item">
    <form action="/logout" method="post">
        <input type="hidden" name="_csrf" value="<%= csrfToken %>"/>
        <button type="submit">Logout</button>
    </form>
</li>
```
* Add this csrfToken should added in both in mobile and other logout menu also.

* But still adding this token all the view is again combursome let make it simple.

### Adding CSRF Protection

* Now we want to have such a token and by the way also, our authentication status on every page we render.

* we have tell expressjs that we have some data that should be included in every rendered view.

* Before all our routes we will add another middleware..

```js
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next()
});
```
* Side Note : Since we added isAuthenticated in middleware we can remove this from all render method

* we can access a special field on the response, the locals field. This allows us to set local variables that are passed into the views, local simply will only exist in the views which are rendered.

* I do pass my token into all views but in the views, I still need to use it.

* we have to add this hidden elemets to all views

### Providing User Feedback

* As of now if something failed we are just redirecting but we should show some error message. how can we do that.

* We will use session to show error message

* I want to add something to the error message, kind of flash it onto the session and once the error message was then used, so once we pulled it out of the session and did something with it, I want to remove it from the session

* For that we will use error message.

```js
npm install --save connect-flash
```
* After install we need to configure this flash in our app.js

```js
const flash = require('connect-flash');

// Note !!! we need to do this configuration after our session configuration

app.use(flash());
```
* Now we can use our flash anywhere in our application.

```js
// In login Post controller if no user found we can send message like this
 if (!user) {
      req.flash('loginError', 'Invalid Email or Password.');
      return res.redirect('/login');
  }
```

* In login controller we can fetch that error message.. which is send from post login to get login controller function.

```js
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage : req.flash('loginError')
    });
};
```
* Whenever we pulled loginError message from post login to get login controller function his information is removed from the session.

* Now we can display errorMessage in our login template

```js
  <%= if(errorMessage) { %>
  <div><%= errorMessage %></div>
  <%= } %>
  // Login form .....

```



