# Node-Js

## Express Js
* Alternatives plain vannila node js , Adonis.js inspired from laravel(php framework), koa , sails... etc

### Install Express
* install as production dependency
```js
npm install --save express
```
* Now use express(app.js)
```js
const http = require('http');

const express = require('express');

const app = express()

const server = http.createServer(app);

server.listen(8000);

```
### Adding Middleware

* Expressjs is all about middleware
![](readmeimg/middleware.png)

* middleware means that an incoming request is automatically funneled through a bunch of functions by expressjs,
* This allows you to split your code into multiple blocks or pieces instead of having one huge function that does everything and this is the pluggable nature of expressjs, where you can easily add other third party packages

```js
const http = require('http');

const express = require('express');

const app = express()

app.use((req, res, next)=>{
    console.log("In the middleware!!");
    next(); //Allow the request to travel on to the next middleware in line
})

app.use((req, res, next)=>{
    console.log("In the another middleware!!")
})

const server = http.createServer(app);

server.listen(8000);

```
* Use allows us to add a new middleware function,

* Now one easy way of using it is that you simply pass a function to it ,this function you pass to app use will be executed for every incoming request !!!.\

* this function will receive three arguments, the request and the response object (request, response, next)

* Next is actually a function, a function that will be passed to use method by expressjs, basically this function(next) you're receiving here has to be executed to allow the request to travel on to the next middleware.

* we have to call next() to allow the request to travel on to the next middleware in line.So it basically goes from top to bottom through that file

* So it basically goes from top to bottom through that file, so if we don't call next, we should actually send back a response because otherwise the request can't continue its journey,

### How Middleware works ??

* Expressjs and that's important doesn't send a default response or anything like that,so instead we should send a response at the end if we don't have any next function.

```js
app.use((req, res, next)=>{
    console.log("In the another middleware!!")
    res.send('<h1>Hello From Express</h1>')
})
```
* Since you sending html the content type is automatically set as html. this is done for us by express.

* so you really just travel from middleware to middleware, from top to bottom by calling next

### Express.js - Looking Behind the Scenes

* Refer https://github.com/expressjs/express

* Based on our reference we could refract our code little more like below

```js
//const http = require('http');
const express = require('express');

const app = express()

app.use((req, res, next)=>{
    console.log("In the middleware!!");
    next(); //Allow the request to travel on to the next middleware in line
})

app.use((req, res, next)=>{
    console.log("In the another middleware!!")
})
//*** Not really need we could do simple as below
// const server = http.createServer(app);
// server.listen(8000);
app.listen(8000)
```

### Handling Different Routes

* Refer https://expressjs.com/en/5x/api.html#app.use

* we can add a path at the beginning, for example just slash, this however is the default by the way

```js
app.use('/',(req, res, next)=>{
    console.log("In the another middleware!!")
    res.send('<h1>Hello From Express</h1>')
})
```
* This will allow user to see the response in slash(/) url but for http://localhost:8000/add-product also we will have the same response that is not good.

* so this middleware gets executed for both slash and add product because this does not mean that the full path, so the part after the domain has to be a slash. how we can fix this ??

```js
app.use('/add-product',(req, res, next)=>{
    console.log("In the add-product middleware!!")
    res.send('<h1>Hello From Express- add-product</h1>')
})
app.use('/',(req, res, next)=>{
    console.log("In the another middleware!!")
    res.send('<h1>Hello From Express</h1>')
})
```
* Now why before this middleware and not after it?

* Because remember, the request goes through the file from top to bottom and if we don't call next, it's not going to the next middleware.

* the order here as well as the fact whether we are calling next or not matters a lot.

* if you are sending a response, this is a good indication that you never want to call next too. means you don't want to execute any other response.

*  if we have a middleware that should be applied to all requests, we would simply add it on top of all the other middlewares and call next

```js
app.use('/',(req, res, next)=>{
    console.log("This always runs!");
    next();
})
app.use('/add-product',(req, res, next)=>{
    console.log("In the add-product middleware!!")
    res.send('<h1>Hello From Express- add-product</h1>')
})
app.use('/',(req, res, next)=>{
    console.log("In the another middleware!!")
    res.send('<h1>Hello From Express</h1>')
})
```

### Parsing Incoming Requests

* let's now understand how we can actually work with incoming requests and how we can extract data

* for that I again want to be able to handle a post request

* Note: this of course is a bit of an incomplete html document,  I'm keeping this shorter here to make it easier to read but later we
will also write proper html code

```js
app.use('/add-product',(req, res, next)=>{
    console.log("In the add-product middleware!!")
    res.send('<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">Add Product</button></form>')
})
```
* Here this middleware handles and send data to "/product" URL. we can keep this "/product" before or after "/add-product" no issues with that but strictly before slash "/" url

```js
app.use('/product',(req, res, next)=>{
    console.log(req.body)
    res.redirect('/')
})
```

* I can use response redirect which certainly is easier than manually setting the status code and setting the location header.

*  the console, we see undefined , because but by default, request doesn't try to parse the incoming request body.

* To do that, we need to register a parser and we do that by adding another middleware.and you typically do that before your route handling middlewares because the parsing of the body should be done no matter where your request ends up.

* Now for that we can install a third party package

```js
npm install --save body-parser
```
* I'll store it in a body parser constant
```js
const express = require('express');
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({extended: true}));

```
* in this middleware function call next in the end, so that the request also reaches our middleware.

* Now this will not parse all kinds of possible bodies, files, json and so on but this will parse bodies like the one we're getting here, sent through a form

* we added extended: false because we get warning  "body-parser deprecated undefined extended: provide extended option" this is if it should be able to parse non-default features you could say.

###  Limiting Middleware Execution to POST Requests

* this middleware always executes, not just for post requests but also for get requests, what can we do regarding that?

```js
app.post('/product',(req, res, next)=>{
    console.log(req.body)
    res.redirect('/');
})
```

* Well instead of app use, we can also use app.get, app.post , app.delete, app.patch, app.put

### Using Express Router

* we want to basically export our logic in different files and import it into app.js file.

* routes/admin.js

```js

const express = require('express');

const router = express.Router();

//admin/add-product => GET
router.get('/add-product',(req, res, next)=>{
    res.send('<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">Add Product</button></form>');
})

//admin/add-product => POST
router.post('/product',(req, res, next)=>{
    console.log(req.body)
    res.redirect('/');
})

module.exports = router

```
* This router is like a mini express app tied to the other express app or pluggable into the other express app.

* Now we have to import this admin.js router into app.js file.

```js
const express = require('express');
const bodyParser = require('body-parser');

const app = express()

const adminRouter = require("./routes/admin");

app.use(bodyParser.urlencoded({extended: true}));

app.use(adminRouter);

app.use('/',(req, res, next)=>{
    res.send('<h1>Hello From Express</h1>');
})

app.listen(8000);
```

* Do the same for routes/shop.js also

```js
const express = require('express');

const router = express.Router();

router.get('/',(req, res, next)=>{
    res.send('<h1>Hello From Express</h1>');
})

module.exports = router
```

* Add shop router routes to app.js

```js
const express = require('express');
const bodyParser = require('body-parser');

const app = express()

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: true}));

app.use(adminRouter);
app.use(shopRouter);

app.listen(8000);
```

* Note if i switch position between adminRouter and shopRouter it will work fine now because for slash(/) in shop.js now we are using get method not app.use.

* Get, post and so on will actually do an exact match.

### Adding a 404 Error Page

* we have a set up where we also have some unhandled routes. If we enter some random string after slash, we get error. cannot GET "/zdzzsdsdsdsd"

* Now typically, we would want to see a 404 error page 

* Remember that the request goes from top to bottom 

* But if we got no fitting middleware and we don't have one here, then we actually make it all the way to the bottom and eventually we don't handle that request. So to send a 404 error page, we simply have to add a catch all middleware at the bottom

```js

app.use(adminRouter);
app.use(shopRouter);

app.use((req, res, next)=>{
    res.status(404).send('<h1>Page not found</h1>');
});
```

### Filtering Paths

* Now sometimes these outsourced routes (like adminRouter , shopRouter) have a common starting path,

```js
app.use("/admin",adminRouter);
app.use("/shop",shopRouter);
```
* so now /add-product will match the /admin/add-product route because /admin was already stripped out here  

### Creating HTML Pages

* One part of it is that we manage our views, so what we serve to the user in one place of our application in the views folder (views/shop.html, views/add-product.html)
* Later we will add concept of templating engines,so that we can dynamically add content into the html files, but for now, let's just start with these files.
* views/shop.html
```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Add Product</title>
</head>

<body>
    <header>
        <nav>
            <ul>
                <li><a href="/">Shop</a></li>
                <li><a href="/admin/add-product">Add Product</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <h1>My Products</h1>
        <p>List of all the products...</p>
    </main>
</body>

</html>
```
* views/add-product.html
```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Add Product</title>
</head>

<body>
    <header>
        <nav>
            <ul>
                <li><a href="/">Shop</a></li>
                <li><a href="/admin/add-product">Add Product</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <form action="/admin/add-product" method="POST">
            <input type="text" name="title">
            <button type="submit">Add Product</button>
        </form>
    </main>
</body>

</html>
```
### Serving HTML Pages

* now the goal is to serve the shop.html and add-product.html

* instead of sending some text or this html text here in this case, let's instead send a file with res.sendFile

```js
res.sendFile(//path));
```
* Now here, the question is how does the path look like? The file is in the views folder but how should this path now look like?

* We have use slash to map the html file path here and try like this

```js
res.sendFile("../views/shop.html")
```
* but we are getting error as "path must be absolute"

* So whatever we tried, this doesn't seem to work, the reason for this is that an absolute path would be correct but slash like this actually refers to our root folder on our operating system not to this project folder.

* So in order to construct the path to this directory and this file here ultimately, we can use a feature provided by nodejs core module ("path").

```js
const path = require('path');

```
* we create a path with the help of this module by calling the join method, join yields us a path at the end, it returns a path but it constructs this path by concatenating the different segments.

* Now the first segment we should pass here is then actually a global variable made available by nodejs and that is the underscore underscore and that's important, these are two underscores dir name.("__dirname"). This is a global variable which simply holds the absolute path on our operating system
to this project folder.

*  now we can add a comma and simply add views here because the first segment is basically the path to this whole project folder, then the third segment will be our file, so here shop.html and don't add slashes here because and that's important, we use path join not because of the absolute path, we could build this with dir name and then concatenating this manually too.

* but we're using path join because this will automatically build the path in a way that works on both Linux systems and Windows systems.

* Path join basically detects the operating system you're running on and then automatically builds a correct path.


```js
const path = require('path');

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'shop.html'));
});

```
* Now with that, we could expect that it works but actually dir name here will point in this routes folder, right. Dir name gives us the path to a file in which we use it and we're using it in the shop.js file in the routes folder, so this will point to the routes folder but views is actually located in a sibling folder to routes.

* So what can we do regarding that? Now the solution is that we add one more segment in there and that is "../" and this simply means go up one level,

```js
const path = require('path');

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

```
### Returning a 404 Page

```js
app.use((req, res, next)=>{
    res.sendFile(path.join(__dirname, 'views', '404.html'));
});
```
* we already are in the project folder here because we're in app.js, so we don't need to go up a level here because we already are in the root folder. Instead here we can go right away into the views folder and then serve the 404.html file

### Using a Helper Function for Navigation

* Note : for navigation to root folder for shop and admin its more preferable to use ".." instead of "../" it will work in windows and mac os

```js
// herer we replaced '../' with '..' its a cleaner way of doing this...
 res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
```
* We could also get the parent directory with the help of a little helper function

* lets create a new file path.js inside utils folder (utils/path.js), this little function help us to construct a path to the parent directory.

```js
const path = require('path');

module.exports = path.dirname(process.mainModule.filename);
```
* process is a global object no need to import

* process.mainModule.filename : this gives us the path to the file that is responsible for the fact that our application is running and this file name is what we put into dirname to get a path to that directory

* Now import this in path.js in your routes folder admin.js as local file import.

```js
const rootDir = require('../util/path');

res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
```
* Now this is more simpler than previous approach.

### Styling our Pages

```css
        body {
            padding: 0;
            margin: 0;
            font-family: sans-serif;
        }

        main {
            padding: 1rem;
        }

        .main-header {
            width: 100%;
            height: 3.5rem;
            background-color: #dbc441;
            padding: 0 1.5rem;
        }

        .main-header__nav {
            height: 100%;
            display: flex;
            align-items: center;
        }

        .main-header__item-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
        }

        .main-header__item {
            margin: 0 1rem;
            padding: 0;
        }

        .main-header__item a {
            text-decoration: none;
            color: black;
        }

        .main-header__item a:hover,
        .main-header__item a:active,
        .main-header__item a.active {
            color: #3e00a1;
        }
```
* here for class name we used BEM naming convention Refer : http://getbem.com/naming/

* Added same kind of styles to admin and 404 pages also..

### Serving Files Statically

* I want to use external css files instead of this embeded css.

* lets create a public folder inside our app.  you can create a new subfolder and you can name it whatever you want but the convention is to call it public because you want to indicate that this is a folder that holds content which are always exposed to the public crowd.

* we move css to public/css/main.css with "<link rel="stylesheet" href="/css/min.css">" in stop.html but still this will never work

* we can't aceess this app files statically if we try to access router will direct to 404 status. 

* For this we need a feature expressjs offers us. we need to be able to serve files statically and statically simply means not handled by the express router or other middleware but instead directly forwarded to the file system.

* And for this, we register a new middleware with app use and this this one expressjs ships with,

```js
app.use(express.static(path.join(__dirname, 'public')))
```
* We could add more static middleware like above as per our need

```js
// shop.html 
<link rel="stylesheet" href="/css/min.css"
```

```js
// product.css
<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="/css/product.css">
```
* so basically a folder which we want to grant read access to, it's only read access but that's still more than what we normally have.

*  With this, user should be able to access the public path and now if I save this and I reload shop.html
