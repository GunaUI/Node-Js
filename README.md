# Node-Js

## How Web Works ?
* when you browsing , browser sends a request to that server with that given IP address I mentioned, so the IP address belonging to that domain(eg www.google.com)
* That server will have your logic code then the server response back to the client.
* This response can be some html text, some html code which is then handled by the client but it could also be some other kind of data like a file, some json or xml data. 
* So this is how the web generally works and nodejs is the part we will focus on, it is the code that makes up that server in the end.
* Now that request and response transmission is done through some protocol (HTTP, HTTPS)
* This is how the web works

## Creating a Node Server

```js
const http = require('http');

const server =  http.createServer((req, res) => {
    console.log(req);
});

server.listen(8000);
```
* Listen now actually starts a process where nodejs will not immediately exit our script but where nodejs will instead keep this running to listen,
* listen will take couple of argument and the first one is the port . if we didn't specify it would take the default of port 80
* After this listen added  The cursor here in the terminal doesn't go back in a new line because this process here is now still running,
it didn't finish, this file execution didn't finish because we now get an ongoing looping process where this will keep on listening for requests and this is obviously what you want, right? You want to have a web server that keeps on listening for requests.

* go to http://localhost:8000/ and then come back to terminal you could see request logs

## The Node Lifecycle & Event Loop

* we never left that program, right ??. The reason for this is an important concept in nodejs called the event loop.
* this is basically a loop process which is managed by nodejs which keeps on running as long as there are event listeners registered
* So our core node application basically is managed by this event loop,
* nodejs uses such an event driven approach for all kinds of stuff, not just for managing that server but that is of course a crucial part
* nodejs uses this pattern because it actually executes single threaded javascript
* if you eventually were to unregister and you can do this with process.exit
```js
const http = require('http');

const server =  http.createServer((req, res) => {
    console.log(req);
    process.exit();
});

server.listen(8000);
```
* Process.exit basically hard exited our event loop and therefore the program shuts down because there was no more work to do,

## Sending Response

```js
const http = require('http');

const server =  http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hey !! this is my node server</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(8000);
```
* The following article provides a great overview of available headers and their role: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

##  Routing Requests

```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    fs.writeFileSync('message.txt', 'DUMMY');
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(3000);

```
## Parsing Request Bodies

* How to parse data ie "req.data" we don't have something like this..Instead the incoming data is basically sent as a stream of data 

 ### what is such a stream of data though? 
 * There is a connected concept, buffers and we'll have a look at both here.
 * the request is simply read by node in chunks you could say, in multiple parts and in the end at some point of time it's done (fully parsed)
 * so that we theoretically can start working on this, on the individual chunks without having to wait for the full request being read.
 * This is not need for simple request.. but consider a huge file being uploaded
 * Instead to organize these incoming chunks, you use a so-called buffer,
 * buffer is like a bus stop. If you consider buses, they're always driving but for users or customers being able to work with them, to climb on the bus and leave the bus, you need bus stops where you well you can track the bus basically and that is what a buffer is.
 * A buffer is simply a construct which allows you to hold multiple chunks and work with them before they are released once you're done

 ```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    // here we return to make sure this will get registered before execute next line of code but this callback will execute only after request done.
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFileSync('message.txt', message);
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    });
   
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(8000);

 ```

 ## Understanding Event Driven Code Execution

 * the order of execution of your code here is not necessarily the order in which you write it.
 * Node Js won't immediately run that function.Instead what it does when it first encounters line is it will simply add a new event listener internally it manages all these listeners internally.
 * In this case for the end event on the request which will be triggered automatically once node js is done.And it will then call that function for you. Once it is done so in the end you can think of this like some internal registry of events and listeners to these events
 *  so when node js is done parsing your request it will go through the registry and see. I'm done with the request so I should now send the end events.Let's see which listeners I have for that end event.but it will not pause the code execution and that is so important to understand.
 * you can register code functions which run sometime in the future but not necessarily right now. And therefore the next line of code can run or will run before this code simply because it is just a callback to be called sometime in the future.

##  Blocking and Non-Blocking Code

* "writeFileSync" here sync will block code execution untill message.txt is created. We block execution of next line of code untill writeFileSync done, to avoid we are changing writeFile async manner like below.
```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, err => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(8000);

```
## Node.js - Looking Behind the Scenes

* nodejs uses only one single javascript thread, a thread is basically like a process in your operating system .
* the obvious question is how is it then able to handle multiple requests ?? because if we're not able to assign a new thread for each request, they ultimately end up all running in one on the same thread and this of course poses a security question,
* here of course also is the question of does this not mean that if the request A is still doing work, request B can't be handled? 
* Now one important construct I already mentioned is that event loop, the event loop is automatically started by nodejs when your program starts,you don't have to do that explicitly,This is responsible for handling event callbacks
*  the event loop is responsible for basically running that code when a certain event occurs you could say, it's aware of all these callbacks and basically well, execute said code. 
* That doesn't help us with our long taking file operation though and it's important to understand that this operation is not handled by the event loop
* so basically the event loop will only handle callbacks that contain fast finishing code.

### Worker Pool

* Instead our file system operation and a couple of other long taking operations are sent to a worker pool which is also spun up and managed by nodejs automatically.
* This worker pool is responsible for all the heavy lifting,
* this worker pool is kind of totally detached of your javascript code you could say and it runs on different threads, it can spin up multiple threads, it's closely intervened with your operating system you're running the app on, so this is really detached from your code
*  The one connection to the event loop we will have is that once the worker is done, so for example once we read a file, it will trigger the callback for that read file operation and since the event loop is responsible for the events and the callbacks, this will in the end, end up in the event loop,
* Now this is a lot of behind the scenes stuff which is nice to know, you don't have to write any code to make this work, this is all built into nodejs

### Event Loop

#### Timer Callback
* At the beginning of each new iteration it checks if there are any timer callbacks it should execute
* a function that should be executed once that timer completes and nodejs is aware of this and at the beginning of each new loop iteration,
it executes any due timer callbacks,(just like set Intervals)

#### Pending Callback
* Then as a next step, it checks other callbacks,for example if we had write or read file, we might have a callback because that operation finished and it will then also execute these callbacks.
* Now it's important to understand that nodejs will leave that phase at a certain point of time and thatcan also mean that if there are too many outstanding callbacks, it will continue its loop iteration and postpone these callbacks to the next iteration to execute them
* After working on these open callbacks and hopefully finishing them all, it will enter a pull phase.

#### Pull Phase 
* The pull phase is basically a phase where nodejs will look for new IO eventsand basically do its best to execute their callbacks immediately if possible.

#### Defer execution and register as pending callback
* Now if that's not possible, it will defer the execution and basically register this as a pending callback,

#### Jump to timer call back 
* Important, it also will check if there are any timer callbacks due to be executed and if that is the case, it will jump to that timer phase and execute them right away

#### Check Phase
* next set immediate callbacks will be executed in a so-called check phase. Set immediate is a bit like set timeout or set interval, just that it will execute immediately but always after any open callbacks have been executed,

#### Close event phase
* Now we're nearing the end of each iteration cycle and now nodejs will execute all close event callbacks,

* So roughly spoken, we have timer callbacks, we then have any IO related callbacks and other event callbacks and set immediate followed by close event callbacks,

* we might exit the whole nodejs program but only if there are no remaining event handlers which are registered

* Internally nodejs keeps track of its open event listeners and it basically has a counter, references or refs which it increments by 1 for every new callback that is registered,every new event listener that is registered so every new future work that it has to do you could say and it reduces that counter by 1 for every event listener that it doesn't need anymore,every callback it finished

* create server and then listen to incoming requests with listen, this is an event which never is finished by default and therefore, we always have at least one reference

### Refer folders for routing and other exports.