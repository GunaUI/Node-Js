const express = require('express');

const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const UserModel = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login',
    [
        body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),

        body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin
);

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

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;