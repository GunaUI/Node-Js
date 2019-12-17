# Node-Js

## Working with REST APIs - The Basics

### REST

* REST stands for representational state transfer

* the simple translation I like to use is that we transfer data instead of user interfaces.

* So instead of html, we just transfer data and we leave it to the client or to the frontend, be that a mobile app, be that a single page application, we leave it to that frontend to then do with this data whatever it wants to do.

* Refer REST images

### Creating our REST API Project & Implementing the Route Setup

* First step install express 

```js
npm init
npm install --save express
```
* Next we have to install a development dependency nodemon, because I still don't want to restart my server manually after every change.

```js
npm install --save-dev nodemon
```
* Once installed in package.json we need to add config for this nodemon

```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app.js"
  },
```
* Then create app.js file

```js
const express = require('express');

const app = express();

app.listen(8080);
```

* I will also install the body parser as a production dependency, so that I can parse well incoming request bodies

```js
npm install --save-dev body-parser
```

* we expect our clients to communicate with our API, with requests that contain json data just as we return json data. Json data is the data format we want to use both for requests and for responses and therefore I will use my body parser of course, that's why I installed it.

* lets start adding some routes

```js
// routes/feed.js
const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', feedController.createPost);

module.exports = router;

```

* Lets include this router in app.js

```js
const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form> this is the default data that data has if submitted through a form post request.

app.use(bodyParser.json()); // application/json

app.use('/feed', feedRoutes);

app.listen(8080);
```


* Lets create getPosts and createPost controller action.

* We will not call res render in here because we will not render a view, you will not see me call res render anymore again because rest APIs simply don't render views because they don't return html 

* we will return a json response. Json is a method provided by expressjs that allows us to conveniently return a response with json data, with the right headers being set and so on. 

* We can pass a normal javascript object to json and it will be converted to the json format and sent back as a response to the client who sent the request

```js
//controller/feed.js
exports.getPosts = (req, res, next) => {

//Previously in the course we sent the whole interface so the client didn't have to worry about that, now the client has to and therefore setting the right status code is important.
    res.status(200).json({
        posts: [{ title: 'First Post', content: 'This is the first post!' }]
    });
};

exports.createPost = (req, res, next) => {
// So we need this middleware (body parser) to parse incoming json data so that we are able to extract it on the body because that will be added by our body parser, this body field on the incoming request. With that we can extract all that data

    const title = req.body.title;
    const content = req.body.content;
    // Create post in db
    res.status(201).json({
        message: 'Post created successfully!',
        post: { id: new Date().toISOString(), title: title, content: content }
    });
};

```
* Now we can able to access this get API in http://localhost:8080/feed/posts

* If you open your developer tools and you go to the network tab in there and you reload that page you also see that request here and if you inspect it, you of course see the response body
but if you have a look at the headers, you see that in the response headers we see that application
json was set automatically by our server because we used that json method and we indeed get back
the content we defined here, we can see it here too.

* So directly accessing the data like this is of course not the plan.Just showed for your reference.

* Its working fine in the POSTMAN too. 

### REST APIs, Clients & CORS Errors

* No "Access Control Allow Origin" error, This error is also called a "CORS" error

* CORS stands for Cross Origin Resource Sharing and by default, this is not allowed by browsers.

* So if client and server run in the same domain and the domain could be localhost 3000, important the port is part of the domain, if they run on the same server, we can send requests and responses as we want to without issues.

* But both are in different domain, it will throw CORS error, because it's a security mechanism
provided by the browser that you can't share resources across domains, across servers, across origins

* However we can overwrite this because this mechanism makes sense for some applications, for rest
APIs, it typically does not. We want to allow our server to share its data, we want to offer data from our server to different clients and these clients will often not be served by the same server as our API runs on.

* we need to tell that browser that it may accept the response sent by our server. And to tell the browser,we have to change something on the server and this is a common gotcha.

* A lot of people see that error and want to solve it in their browser side javascript code,
you just can't, you can only solve that on the server.

* we just need to set some special headers,before I forward the requests to my routes where I will ultimately send the response, I want to add headers to any response, 

* Set header will only modify it and add a new header and now there are a couple of headers we need to set.

```js
const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json


// *** CORS error solution
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", 'GET, POST, PUT, PATCH, DELETE');
    // you could also use * or you could specify headers
    // By adding this we are giving permission to set Content-Type
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Authorization');
    next() // So request can continue..and can be handled by our routes
});

app.use('/feed', feedRoutes);

app.listen(8080);
```
### Sending POST Requests

* If we are using two different server,and then try to POST some params , we cant access those params in server side using "req.body.title", it will be undefined , so we can't extract those data.

* the reason for that can be found if we go to the network tab and have a look at this post request
that was sent, there in the request headers,we see that the content type was text plain and that is the problem. It should be application json 

* but we also see that the request payload was not json data which in the end is just text but in
a special format but that it was a javascript object which just can't be sent or which can't be handled.

* First of all on the body, I will call JSON.stringify which is a method provided by default by javascript, it will take a javascript object and convert it to json.

```js
method: 'POST',
body : JSON.stringify({
    title: 'A code Pen',
    content: 'Created Via code pen'
})
```

* After this body JSON.stringify, the payload now in the json format, not text format

* But still content type is text/plain, ut we need to tell the server that our content type is of type application json and  therefore besides setting the body, on the client I'll also add headers 

```js
method: 'POST',
body : JSON.stringify({
    title: 'A code Pen',
    content: 'Created Via code pen'
}),
headers:{
    'Content-Type': 'application/json'
}
```
* So this client code may differs based on the environment like web, android, IOS..etc  the server side code does not really differ. You want to make sure your clients can communicate and that everything works just fine there.

* If you do single /post using POST method, but in developer tool network you could see two /post, why ??

* Second one is our actual post request which we triggered, what is the first request?

* If you have a look at it and we see the response is just post, ok, the headers are interesting though. We can see that in the general part,the method here is "OPTIONS"

* That is this last method we saw in REST http method image. I mentioned it would be sent automatically by the browser and also for example by many mobile app clients. What is the idea behind options?

* The browser simply goes ahead and checks whether the request you plan to send which is a post request,it checks for the post request, it checks if that will be allowed otherwise it will throw an error.

* but the important thing is that you are not confused by that extra request. It's simply a mechanism the browser uses to see if the next request which it wants to view, the post request will succeed if it is allowed.