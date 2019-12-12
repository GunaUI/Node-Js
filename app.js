const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sessionObj = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(sessionObj);

const csrf = require('csurf');
const csrfProtection = csrf({})
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const mongoDB_URI = 'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/shop?retryWrites=true&w=majority'
const storeDb = new MongoDbStore({
  uri : mongoDB_URI,
  collection: 'sessions'
})


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionObj(
  {
    secret: 'this will be used for signing the hash which secretly stores our ID in the cookie.  in production, this should be a long string value.',
    resave: false,
    saveUninitialized: false,
    store: storeDb
  }));

  app.use(csrfProtection);

  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next()
  });

  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        if(!user){
          return next()
        }
        req.user = user;
        next();
      })
      .catch(err => {
        next(new Error(err))
      });
  });

  app.use(flash());

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500',errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.redirect('/500');
});


mongoose
  .connect(
    mongoDB_URI,{ useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(result => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });
