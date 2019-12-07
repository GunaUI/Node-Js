const User = require('../models/user');
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // // Set-Cookie is reserved name
    // res.setHeader('Set-Cookie','isLoggedIn=true; HttpOnly')
    User.findById('5de0bdf1d8266b23f9e24c42')
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(()=>{
            res.redirect('/');
        })
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
