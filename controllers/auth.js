const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    let loginErrMessage = req.flash('loginError')

    if(loginErrMessage.length >0 ){
        loginErrMessage = loginErrMessage[0]
    }else{
        loginErrMessage = null
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage : loginErrMessage
    });
};

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
        errorMessage : signupErrMessage
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('loginError', 'Invalid Email or Password.');
            return res.redirect('/login');
        }
        bcrypt
            .compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                    console.log(err);
                    req.flash('loginError', 'Wrong Password');
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

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('signUpError', 'Email exist already, Please pick a different one');
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

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};