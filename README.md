# Node-Js

## Sending Emails

### How Does Sending Emails Work?

* Now it's super important to understand and a common misconception that node and expressjs, these are language or frameworks runtimes that we use for writing our server side logic but with nodejs,
you can't trivially create a mailing server.

* it's a totally different technology, something totally different happens behind the scenes.

* so in reality you typically use third party mail servers for that 

### Using SendGrid

* Install nodemailer and send grid
```js
npm install --save nodemailer nodemailer-sendgrid-transport
```
* Lets add mail logic in  auth controller

```js
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
//  we need to initialize a so-called transporter,so that is essentially some setup telling nodemailer how your e-mails will be delivered

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
      //After login Settings -> API Key -> Create API Key
        api_key:'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'
    }
}))
```
* we need to initialize a so-called transporter,so that is essentially some setup telling nodemailer how your e-mails will be delivered

* So here I will use nodemailer and then call the create transport method. In create transport,

* we can now pass sendgridTransport and execute this as a function because this function will then return a configuration that nodemailer can use to use sendgrid.

* Now to that sendgridTransport function, we pass an object where we pass an auth object and this in turn holds an object where we have to pass in an API user and an API key field.

* Now both are values you get from inside your sendgrid account,

* After login Settings -> API Key -> Create API Key

* With the transporter we can now use to send mails. we want to sent mail after user register.

```js
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
                            // Here we are sending mail
                            return transporter.sendMail({
                                to : email,
                                from : 'node@learning.com',
                                subject: 'Signup Succeeded!!',
                                html : '<h1>You successfully integrated mail in node!!</h1>'
                            }).catch(err => {
                                console.log(err);
                            });
                            
                        });
        })
        .catch(err => {
            console.log(err);
        });
};
```
* Refer : https://app.sendgrid.com/settings/api_keys





