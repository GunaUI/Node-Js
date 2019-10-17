// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express()

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: true}));

app.use("/admin",adminRouter);
app.use(shopRouter);
app.use((req, res, next)=>{
    res.status(404).send('<h1>Page not found</h1>');
});

// app.use((req, res, next)=>{
//     console.log("In the middleware!!");
//     next(); //Allow the request to travel on to the next middleware in line
// })
// app.use('/add-product',(req, res, next)=>{
//     console.log("In the add-product middleware!!")
//     res.send('<h1>Hello From Express- add-product</h1>')
// })

// app.use('/add-product',(req, res, next)=>{
//     res.send('<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">Add Product</button></form>');
// })

// app.post('/product',(req, res, next)=>{
//     console.log(req.body)
//     res.redirect('/');
// })

// app.use('/',(req, res, next)=>{
//     res.send('<h1>Hello From Express</h1>');
// })

// const server = http.createServer(app);      *** Not really need we could do simple as below

// server.listen(8000);

app.listen(8000);