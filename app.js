const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5ddf6c24e882af4871e6179c')
        .then(user => {
            req.user = user
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/shop?retryWrites=true&w=majority',{ useUnifiedTopology: true, useNewUrlParser: true  }
    )
    .then(result => {
        // findOne mongoose method
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                name: 'Guna',
                email: 'guna@test.com',
                cart: {
                    items: []
                }
                });
                user.save();
            }
        });
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });

