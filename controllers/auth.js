const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}))


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
        errorMessage : loginErrMessage,
        oldInput : {email: "", password: "",  confirmPassword: ""},
        validationErrors : []
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
        errorMessage : signupErrMessage,
        oldInput : {email: "", password: "",  confirmPassword: ""},
        validationErrors : []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput : {email: email, password: password },
            validationErrors : errors.array()
        });
    }


    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('loginError', 'Invalid Email or Password.');
            return res.status(422).render('auth/signup', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid Email or Password.',
                oldInput : {email: email, password: password },
                validationErrors : []
            });
        }
        bcrypt.compare(password, user.password).then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                    console.log(err);
                    req.flash('loginError', 'Wrong Password');
                    res.redirect('/');
                    });
                }
                return res.status(422).render('auth/signup', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid Email or Password.',
                    oldInput : {email: email, password: password },
                    validationErrors : []
                });
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput : {email: email, password: password },
            validationErrors : errors.array()
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

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

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

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
        console.log(err);
        return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                console.log("'No account with that email foun#####")
            req.flash('error', 'No account with that email found.');
            return res.redirect('/reset');
            }
            user.resetToken = token;
            // resetTokenExpiration today date + 1 hour in milli sec
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            res.redirect('/');
            transporter.sendMail({
            to: req.body.email,
            from: 'node@learning.com',
            subject: 'Password reset',
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

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
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

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
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
