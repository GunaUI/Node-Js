# Node-Js

## Advanced Authentication

### Resetting Passwords

* If people forget password we should offer them resetting them.

```js
// reset view
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" href="/css/forms.css">
    <link rel="stylesheet" href="/css/auth.css">
</head>

<body>
<%- include('../includes/navigation.ejs') %>

    <main>
        <% if (errorMessage) { %>
            <div class="user-message user-message--error"><%= errorMessage %></div>
        <% } %>
        <form class="login-form" action="/reset" method="POST">
            <div class="form-control">
                <label for="email">E-Mail</label>
                <input type="email" name="email" id="email">
            </div>
            <input type="hidden" name="_csrf" value="<%= csrfToken %>">
            <button class="btn" type="submit">Reset Password</button>
        </form>
    </main>
<%- include('../includes/end.ejs') %>
```
* In auth controller add reset function 

```js
exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
};
```
* Router for reset password

```js
router.get('/reset', authController.getReset);
```
* We need a link in to reset password page in login controller

```js
<div class="centered">
    <a href="/reset">Reset Password</a>
</div>
```
### Implementing the Token Logic

* we need to first of all create a unique token that also has some expiry date which we will store in our database so that the link which we didn't click includes that token and we can verify that the user did get that link from us because if we just, well let the user now change that password, we got no security mechanism in place, so we need that token to put it into the email we're about to send to only let users change the password through the email that contains that token, that's an additional security mechanism.

* Node js has build in crypto library , we can use this for generate token. This is a library that helps us with creating secure unique random values and other things but we'll need that unique secure random value here.

```js
exports.postReset = (req, res, next) => {
// 32 randomBytes
  crypto.randomBytes(32, (err, buffer) => {
      // this is a call back once randomBytes done this will get called.
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    //  we just need to pass hex because that buffer will store hexadecimal values and this is information toString needs to convert hexadecimal values to normal ASCII characters.
    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        // if user found we have to save token and TokenExpiration in user db
        user.resetToken = token;
        // resetTokenExpiration today date + 1 hour in milli sec
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        // Mail sent to the user with the reset link
        transporter.sendMail({
          to: req.body.email,
          from: 'node@learning.com',
          subject: 'Password reset',
          // 
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:8000/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
```
* Make sure we have changes the user db schema with the restToken and resetTokenExpiry details

```js
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // her we added resetToken and resetTokenExpiration Schema
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
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
* Make sure our newly addede resetpassword post controller reached through router

```js
router.post('/reset', authController.postReset);
```
* Now email will have a reset link with resetToken , now we have to fetch that token and let user to update their password.

### Creating the Reset Password Form

```js
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" href="/css/forms.css">
    <link rel="stylesheet" href="/css/auth.css">
</head>

<body>
<%- include('../includes/navigation.ejs') %>

    <main>
        <% if (errorMessage) { %>
            <div class="user-message user-message--error"><%= errorMessage %></div>
        <% } %>
        <form class="login-form" action="/new-password" method="POST">
            <div class="form-control">
                <label for="password">Password</label>
                <input type="password" name="password" id="password">
            </div>
            // We will get this userId and passwordToken from controller action.
            <input type="hidden" name="userId" value="<%= userId %>">
            <input type="hidden" name="passwordToken" value="<%= passwordToken %>">
            <input type="hidden" name="_csrf" value="<%= csrfToken %>">
            <button class="btn" type="submit">Update Password</button>
        </form>
    </main>
<%- include('../includes/end.ejs') %>
```
* Now we need a controller action to run this new password screen

```js
exports.getNewPassword = (req, res, next) => {
    // we'll need to add a route later that and Cote's the token in a token field in our parameters
  const token = req.params.token;
  // $gt is greater than than now(today's date)
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      // here with the view we are passing userId and passwordToken also to update password.
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};
```
* Make sure we added hidden userId in our new password template

* Makes sure we added routes for this new password page

```js
// here we added token param to fetch token from URL.
router.get('/reset/:token', authController.getNewPassword);
```
### Adding Logic to Update the Password

* New password update 

```js
exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    // make sure we added passwordToken also as hidden element
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
    });
};
```

### Authorisation / Roles and previlages

* Authorisation means that I restrict permissions of a logged in user.

* So every user might be able to add anything to the cart including products created by the user but you might not be able to delete an edit products which is created by others.

* In admin page I only want to render products that were created by the logged in user because there is no sense in showing products on this page that were not created by the user

* when I find product, I dont find all but I'll add a filter and I'll filter for products where the user ID is equal to the user id of the currently logged in user,

```js
exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};
```
* keep in mind request user exists because we do extract that user in app.js in a separate middleware

### Adding Protection to Post Actions

* it still doesn't mean we can't send requests somehow by creating our own pages where we still try to delete another product. So we should also add protections in our post actions, like in post edit and post delete product,

* After findById then block where I have that product fetched from the database, there I will quickly check if product user ID is not equal to request user ID because if it's not equal, then this means the wrong user is trying to edit this.

* For Edit 

```js
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
        // here we are retruning if he is not product creator
        //  should convert both to a string because I'm also checking for type equality.
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save().then(result => {
        //As we know then block will always execute even after  return in above then block
        // That is why we moved then block immediately after return
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
        }).catch(err => console.log(err));
    })
    // .then(result => {
    //     console.log('UPDATED PRODUCT!');
    //     res.redirect('/admin/products');
    //     })
    
    .catch(err => console.log(err));
};

```

* For Delete

```js
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
```
