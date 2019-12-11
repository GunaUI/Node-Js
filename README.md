# Node-Js

## Understanding Validation

* Refer Validation image
* Express-Validator Docs: https://express-validator.github.io/docs/
* Validator.js (which is used behind the scenes) Docs: https://github.com/chriso/validator.js

### Setup & Basic Validation

```js
npm install --save express-validator
```
* we are going to validate (POST) login and signup data

* Email Validation

```js
const { check } = require('express-validator');
const authController = require('../controllers/auth');
...
...
// this can be either string or array of string
router.post('/signup', check('email').isEmail().withMessage('Please enter a valid Email.'), authController.postSignup);
```

* In controller postSignuo validate the result and redirect

```js
// validationResult will be a function which allow us to gather all the error
const { validationResult } = require('express-validator');

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Validations changes here..
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    // 422 - common status code to indicate the validation failed.
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      // since error is array object ......
      errorMessage: errors.array()[0].msg
    });
  }

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash(
          'error',
          'E-Mail exists already, please pick a different one.'
        );
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
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
          return transporter.sendMail({
            to: email,
            from: 'shop@node-complete.com',
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
```
### Built-In & Custom Validators

* You can also add your own validator though

* let's say we're not just using isEmail,I also want to make sure it's a specific e-mail I want to have. For that I can add custom here 

```js
router.post('/signup', check('email')
                        .isEmail()
                        .withMessage('Please enter a valid Email.')
                        .custom((value, {req}) => {
                            // Here we will add our validation logic 
                            if(value === 'test@test.com'){
                                throw new Error('This email is forbidden.');
                            }
                            // if valid we will return true
                            return true;
                        }),
                        authController.postSignup);
```
* how you can use the many built-in ones ? and of course that you can chain them after each other to add multiple validators to one and the same field.

### More Validators

```js
const { check, body } = require('express-validator');

router.post('/signup', [
                        check('email')
                        .isEmail()
                        .withMessage('Please enter a valid Email.')
                        .custom((value, {req}) => {
                            if(value === 'test@test.com'){
                                throw new Error('This email is forbidden.');
                            }
                            return true;
                        }),
                        // body just an alternative we could ise check also
                        // if you want to add default error message for all validation of the element
                        body('password',
                        'Please enter value with only with number and text , Atlest min 3 characters '
                        )
                        .isLength({min: 3, max: 5})
                        .isAlphanumeric()
                        ],
                        authController.postSignup);
```
### Checking For Field Equality

```js

router.post('/signup', [
                            check('email')
                            .isEmail()
                            .withMessage('Please enter a valid Email.')
                            .custom((value, {req}) => {
                                if(value === 'test@test.com'){
                                    throw new Error('This email is forbidden.');
                                }
                                return true;
                            }),

                            // body just an alternative we could ise check also
                            // if you want to add default error message for all validation of the element
                            body('password',
                            'Please enter value with only with number and text , Atlest min 3 characters '
                            )
                            .isLength({min: 3, max: 5})
                            .isAlphanumeric(),

                            // Confirm password validation
                            body('confirmPassword')
                            .custom((value, {req}) => {
                                if(value !== req.body.password){
                                    throw new Error('Passwords have to match');
                                }
                                return true;
                            })
                        ],
                        authController.postSignup);
```

### Adding Async Validation

* As of now we are checking email existance after validation but it should be part of our validation.

```js
const UserModel = require('../models/user');

router.post('/signup', [check('email')
                        .isEmail()
                        .withMessage('Please enter a valid Email.')
                        .custom((value, {req}) => {
                            // Async Validation here..
                            return UserModel.findOne({ email: value })
                                    .then(userDoc => {
                                        if (userDoc) {
                                        // A promise is a built-in javascript object and with reject, 
                                        // I basically throw an error inside of the promise and I reject with this error message I used before
                                            return Promise.reject('Email exist already, Please pick a different one')
                                        }
                                    })
                        }),
                    ....
                    ....
                    ],
                        authController.postSignup);
```

* Since we handled email existence in router itself let us let us remove those logic from controller 

```js
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg
    });
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
                    return transporter.sendMail({
                        to : email,
                        from : 'node@learning.com',
                        subject: 'Signup Succeeded!!',
                        html : '<h1>You successfully integrated mail in node!!</h1>'
                    }).catch(err => {
                        console.log(err);
                    });
                    
                })
};
```

### Keeping User Input

* If user entered value is worng value we are clearing the value, but we should retain the value even after error message.

```js
// auth controller signup action 
return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        // while redirecting we are sending back the password to the template from controller
        oldInput : {email: email, password: password,  confirmPassword: req.body.confirmPassword}
    });
```

* In template add these old input values

```js
<form class="login-form" action="/signup" method="POST" novalidate>
            <div class="form-control">
                <label for="email">E-Mail</label>
                <input type="email" name="email" id="email" value="<%= oldInput.email %>">
            </div>
            <div class="form-control">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" value="<%= oldInput.password %>">
            </div>
            <div class="form-control">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" value="<%= oldInput.confirmPassword %>">
            </div>
            <input type="hidden" name="_csrf" value="<%= csrfToken %>"/>
            <button class="btn" type="submit">Signup</button>
        </form>
```
* Make sure on getsignup page we are sending empty oldInput object

```js
exports.getSignup = (req, res, next) => {
    let signupErrMessage = req.flash('signUpError')

    if(signupErrMessage.length >0 ){
        signupErrMessage = signupErrMessage[0]
    }else{
        signupErrMessage = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage : signupErrMessage,
        oldInput : {email: "", password: "",  confirmPassword: ""}
    });
};
```

### Adding Conditional CSS Classes

* we could add some special class to the invalid input. 

```js
if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput : {email: email, password: password },
            // here we added validationErrors array
            validationErrors : errors.array()
        });
    }
```
* Now in our template we need to sets class conditionally basedon this validationErrors

```js
<form class="login-form" action="/signup" method="POST" novalidate>
            <div class="form-control">
                <label for="email">E-Mail</label>
                <input class="<%= validationErrors.find(e => e.param === 'email') ? 'invalid' : '' %>" type="email" name="email" id="email" value="<%= oldInput.email %>">
            </div>
            <div class="form-control">
                <label for="password">Password</label>
                <input class="<%= validationErrors.find(e => e.param === 'password') ? 'invalid' : '' %>" type="password" name="password" id="password" value="<%= oldInput.password %>">
            </div>
            <div class="form-control">
                <label for="confirmPassword">Confirm Password</label>
                <input class="<%= validationErrors.find(e => e.param === 'confirmPassword') ? 'invalid' : '' %>" type="password" name="confirmPassword" id="confirmPassword" value="<%= oldInput.confirmPassword %>">
            </div>
            <input type="hidden" name="_csrf" value="<%= csrfToken %>"/>
            <button class="btn" type="submit">Signup</button>
        </form>
```
* Make sure you added in valid css class

```css
.form-control input.invalid,
.form-control textarea.invalid{
  border-color: red
}
```
* Add the same kind of validation to login also

### Sanitizing Data

* For example what you can do is you can ensure that there is no excess whitespace in a string passed by the user on the left or on the right, you can normalize an e-mail which means it's converted to lowercase , So sanitising input is also something that makes sense to be done.

```js
router.post('/signup', [check('email')
                        .isEmail()
                        .withMessage('Please enter a valid Email.')
                        .custom((value, {req}) => {
                            return UserModel.findOne({ email: value })
                                    .then(userDoc => {
                                        if (userDoc) {
                                        // A promise is a built-in javascript object and with reject, 
                                        // I basically throw an error inside of the promise and I reject with this error message I used before
                                            return Promise.reject('Email exist already, Please pick a different one')
                                        }
                                    })
                        })
                        .normalizeEmail(),

                        // body just an alternative we could ise check also
                        // if you want to add default error message for all validation of the element
                        body('password',
                        'Please enter value with only with number and text , Atlest min 3 characters '
                        )
                        .isLength({min: 3, max: 5})
                        .isAlphanumeric()
                        .trim(),

                        body('confirmPassword')
                        .custom((value, {req}) => {
                            if(value !== req.body.password){
                                throw new Error('Passwords have to match');
                            }
                            return true;
                        })
                        .trim(),
                    ],
                        authController.postSignup);
```
* So sanitising data is also something which makes sense to ensure that your data is stored in a uniform format

### Validating Product Addition

```js
// /admin/add-product => GET
router.get('/add-product',[
    body('title')
    .isAlphanumeric()
    .isLength({ min: 3})
    .trim(),

    body('imageUrl')
        .isURL(),

    body('price')
        .isFloat(),

    body('description')
    .isAlphanumeric()
    .isLength({ min: 5, max: 200})
    .trim(),
], isAuth, adminController.getAddProduct);



// /admin/add-product => GET
router.get('/add-product',[
    body('title')
    .isAlphanumeric()
    .isLength({ min: 3})
    .trim(),

    body('imageUrl')
        .isURL(),

    body('price')
        .isFloat(),

    body('description')
    .isAlphanumeric()
    .isLength({ min: 5, max: 200})
    .trim(),
], isAuth, adminController.getAddProduct);
```
* let's go to the admin controller and make sure we collect these validation errors and return them

```js
const { validationResult } = require('express-validator');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
/// Product Validations
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        // we shoukd return this otherwise it will continue rest of the code 
        return res.status(422).render('/admin/edit-product', {
            path: '/admin/edit-product',
            pageTitle: 'Products',
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {title: title, imageUrl: imageUrl, price: price, description: description },
            validationErrors : errors.array()
        });
    }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

```
* in our ejs template add hasError also with edit condition

```js
<form class="product-form" action="/admin/<% if (editing || hasError) { %>edit-product<% } else { %>add-product<% } %>" method="POST">
            <div class="form-control">
                <label for="title">Title</label>
                <input type="text"  name="title" class="<%= validationErrors.find(e => e.param === 'title') ? 'invalid' : '' %>"  id="title" value="<% if (editing || hasError) { %><%= product.title %><% } %>">
            </div>
            <div class="form-control">
                <label for="imageUrl">Image URL</label>
                <input type="text" name="imageUrl" id="imageUrl" class="<%= validationErrors.find(e => e.param === 'imageUrl') ? 'invalid' : '' %>" value="<% if (editing || hasError) { %><%= product.imageUrl %><% } %>">
            </div>
            <div class="form-control">
                <label for="price">Price</label>
                <input type="number" name="price" id="price" class="<%= validationErrors.find(e => e.param === 'price') ? 'invalid' : '' %>" step="0.01" value="<% if (editing || hasError) { %><%= product.price %><% } %>">
            </div>
            <div class="form-control">
                <label for="description">Description</label>
                <textarea name="description" id="description" class="<%= validationErrors.find(e => e.param === 'description') ? 'invalid' : '' %>" rows="5"><% if (editing || hasError) { %><%= product.description %><% } %></textarea>
            </div>
            <% if (editing || hasError) { %>
                <input type="hidden" value="<%= product._id %>" name="productId">
            <% } %>
            <input type="hidden" name="_csrf" value="<%= csrfToken %>"/>
            <button class="btn" type="submit"><% if (editing || hasError) { %>Update Product<% } else { %>Add Product<% } %></button>
        </form>
```

### Validating Product Editing

```js
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log(errors.array());
      // we shoukd return this otherwise it will continue rest of the code 
      return res.status(422).render('/admin/edit-product', {
          path: '/admin/edit-product',
          pageTitle: 'Edit Product',
          editing: true,
          hasError: true,
          errorMessage: errors.array()[0].msg,
          product: {title: updatedTitle, imageUrl: updatedImageUrl, price: updatedPrice, description: updatedDesc, _id : prodId},
          validationErrors : errors.array()
      });
  }

  Product.findById(prodId)
    .then(product => {
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      }).catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};
```