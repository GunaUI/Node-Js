# Node-Js

## Error Handling 

### Types of Errors & Error Handling

* Refer : Types of error and working with error images in image folder

### Analyzing the Error Handling in the Current Project

* for example mongodb will throw an error if it can't connect or if an operation fails. So such errors can be thrown and if we don't handle them, then our application just crashes

* Now how can we handle errors?

* Well one solution for synchronous code, so code that executes line by line immediately and does not wait for anything, so for example where we don't interact with files or where we don't send requests, well such code can be wrapped with try catch

```js
const sum = (a, b) => {
    if(a & b){
        return a + b;
    }
    throw new Error('Invalid Agument');
};

try {
    console.log(sum(1));
} catch (error) {
    console.log('Error occured!');
    console.log(error)
}

console.log("This line executed after error message");
```

* with the above code we handeled error in try catch so that our app won't crash, So this is why handling code like this is a good thing to do because this ensures that we can continue with code, that we can handle this gracefully, Now here we have a look at an error and synchronous code throwing an error which we can handle with try catch.

* Now we also have async operations that can fail of course and such operations when using promises are handled with then and catch, that is what we can see a lot in our code, then is your success case and catch allows you to execute code if that fails. Catch by the way collects all errors that are thrown by any prior then blocks,

* so if we had more than then block in our chain here, catch would fire on any error thrown in any then block or any operation executed in a then block,

### Throwing Errors in Code

```js
app.use((req, res, next) => {
    // here we are returning next id user session is not set,  if I would not add this check, then I could try to find a user without the session object existing and that would then crash our app.
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
          // It might of course still fail and for some reason, we might still not find that user even if we have it stored in a session, maybe because the user was deleted in a database in-between. so its better tor redirect..
        if(!user){
          return next()
        }
        req.user = user;
        next();
      })
      .catch(err => {
          //Throwing this error has a significant advantage, that we will see soon..
          //  expressjs gives us a way of taking care of such errors,
          // we will discuss this soon.. after 500 error
        throw new Error(err)
      });
  });
```
### Returning Error Pages

* Sometimes you got bigger problems though, you don't want to return the same page again,instead you really want to show an error page to show the user something bigger is wrong, we're working on it but for now you'll probably not be able to continue. And for such scenarios, I'll add a new view next to my 500.ejs file,

```js
<%- include('includes/head.ejs') %>
</head>

<body>
    <%- include('includes/navigation.ejs') %>
    <h1>Some error occured!</h1>
    <p>We are working on fixing this, sorry for the inconvenience !</p>

<%- include('includes/end.ejs') %>
```

* Make sure you added controller action 500

```js
exports.get500= (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
};
```
* Add  500 route in app.js 

```js
app.use('/500',errorController.get500);
```
* Now we can use this 500 page in our admin controller catch block

```js
...
...

.catch(err => {
    res.redirect('/500');
});
```
### Using the Express.js Error Handling Middleware

* Now we have to do this changes in all catch block instead of that we will add a error handling middleware..

* Before that instead of redirect we will throw error inside catch block

```js
.catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    // when we call next with an error passed as an argument, then we actually let express know that an error occurred and it will skip all other middlewares and move right away to an error handling middleware
    return next(error);

});
```
* when we call next with an error passed as an argument, then we actually let express know that an error occurred and it will skip all other middlewares and move right away to an error handling middleware, that we are going to define next.

* all these middlewares use three arguments, request response and next. Express also knows a middleware with four arguments, a so-called error handling middleware

```js
app.use((error, req, res, next) => {
  res.redirect('/500');
});
```
* Now please note, the this error handler will not execute for 404 errors. There we still handle this manually because technically, the 404 error is simply just a valid url which we catch with our catch all handler there where we then just happen to render the 404 page, it's not a technical error

* So one important takeaway is throwing an error here does not lead to our general error handling middleware being called and that is important.
This is true because we're inside some async code, we're inside a promise here, we're inside a then or a catch block. If you throw errors there, you will not reach that express error handling middleware.

* The interesting thing is if you would throw an error outside of async code, so in a place where the code executes synchronously, so basically outside of a promise, then catch block or outside of a callback, you'll see that it tried to load the 500 page 

* The reason for that is that in synchronous places, so outside of callbacks and promises, you throw an error and express will detect this and execute your next error handling middleware. 

* so inside of then, catch or callbacks, this does not work however. Inside of that, you have to use next with an error included.

```js
.catch(err => {
        next(new Error(err))
      });
```
### Status Codes

* The codes are simply extra information we pass to the browser which helps the browser understand if an operation succeeded or not.

* status codes also allow you to understand if an error happened, which kind of error because you typically map certain kinds of errors to certain kinds of status codes.

    *  200 status codes, most importantly 200 and 201, these are always success status codes, they indicate that the operation simply succeeded

    * 300 status codes which simply indicates that a redirection happened.

    * 400 status codes which show you that something happened because an error was done by the client, for example incorrect data was entered into a form,  well then we return this 422 error code

    * 500 status codes which indicate that a server side error occurred.

    * Refer status code image 


### Available Status Codes
* Which status codes are available? 

* MDN has a nice list: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

* 1×× Informational

    * 100 Continue

    * 101 Switching Protocols

    * 102 Processing

* 2×× Success

    * 200 OK

    * 201 Created

    * 202 Accepted

    * 203 Non-authoritative Information

    * 204 No Content

    * 205 Reset Content

    * 206 Partial Content

    * 207 Multi-Status

    * 208 Already Reported

    * 226 IM Used

* 3×× Redirection

    * 300 Multiple Choices

    * 301 Moved Permanently

    * 302 Found

    * 303 See Other

    * 304 Not Modified

    * 305 Use Proxy

    * 307 Temporary Redirect

    * 308 Permanent Redirect

* 4×× Client Error

    * 400 Bad Request

    * 401 Unauthorized

    * 402 Payment Required

    * 403 Forbidden

    * 404 Not Found

    * 405 Method Not Allowed

    * 406 Not Acceptable

    * 407 Proxy Authentication Required

    * 408 Request Timeout

    * 409 Conflict

    * 410 Gone

    * 411 Length Required

    * 412 Precondition Failed

    * 413 Payload Too Large

    * 414 Request-URI Too Long

    * 415 Unsupported Media Type

    * 416 Requested Range Not Satisfiable

    * 417 Expectation Failed

    * 418 I'm a teapot

    * 421 Misdirected Request

    * 422 Unprocessable Entity

    * 423 Locked

    * 424 Failed Dependency

    * 426 Upgrade Required

    * 428 Precondition Required

    * 429 Too Many Requests

    * 431 Request Header Fields Too Large

    * 444 Connection Closed Without Response

    * 451 Unavailable For Legal Reasons

    * 499 Client Closed Request

* 5×× Server Error

    * 500 Internal Server Error

    * 501 Not Implemented

    * 502 Bad Gateway

    * 503 Service Unavailable

    * 504 Gateway Timeout

    * 505 HTTP Version Not Supported

    * 506 Variant Also Negotiates

    * 507 Insufficient Storage

    * 508 Loop Detected

    * 510 Not Extended

    * 511 Network Authentication Required

    * 599 Network Connect Timeout Error

* Source: https://httpstatuses.com/