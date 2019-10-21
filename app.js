// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const expressHbs = require('express-handlebars'); // we can use any name not necessary expressHbs

const app = express({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs'
});

app.engine('hbs', expressHbs()); // hbs is the engine name

app.set('view engine', 'hbs'); // we have to use the same name as above (hbs) and also for file extention use the same name.

app.set('views', 'views');

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')))

//app.use("/admin",adminRouter); since we changed the way we export adminRouter we are using the below one.
app.use("/admin",adminRouter.routes);

app.use(shopRouter);
app.use((req, res, next)=>{
    //res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404',{pageTitle: "404"});
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