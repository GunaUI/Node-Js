# Node-Js

## Real-Time webservices with websocket

* Pushing data from server to client

### Intro

* We'll dive into a very exciting technology that you can use in node applications web sockets

* web sockets are a nice way a protocol essentially which allows us to build real time web services.Now what exactly does that mean and how does that work.

### What Are Websockets & Why Would You Use Them?

* Refer websocket image

* We got our client we got our server the client would be our browser mobile phone or something like that. The server is of course essentially what we built our node application.

* Now thus far we always sent the request from the client.We waited for his request on the server.We set up some routes to handle different kinds of requests. And once we're done doing something on the server for example reach out to a database we send back a
response to the client.So first request then response.

* This is a fine pattern because a lot of resources on the Internet should be available because pull approach.So you pull information from the client you tell the server that you want something.Does the typical approach and is a fine approach.

* Now User A sends a request to the server that contains the message and this serve restores the message in the database and the server can return a response to user.

* But User B the person with whom user chats does not send the request to the server asking for the message or at least that is unlikely to happen.

* You could certainly use some patterns where you send the request every second to see if there are new messages.

* But you'll then hammer your server with requests were most requests will not yield new messages. So instead it would be nice to have some push way off informing User B about the new message.And that is exactly the scenario we're looking at here.

* What if something changed on the server and we actively want to inform a client, well we can use web socket instead of HTTP.

* Now HTTP is a protocal we used thus far, Where we send the request and we get a response

* Web sockets built up on HTTP, they are established via HTTP, They use a so-called HTTP handshake to upgrade the HTTP protocol to the Web sockets protocol.

* websockets protocol that simply talks about how data is exchanged. Right.

* So this protocol is something you don't have to manage.Actually the browser and the server communicate through a protocol and protocol defines how the communication can happen 

* With HTTP It's request response and with  websockets it push data are actually it's both.We can also send data from the client to the server does is still included.

* But most importantly and that's the feature I really want to highlight here. We can push data from the server to declined and you can and you typically will use both together in one in the same nodes.

* So it's not like you have to decide do I build an app with web sockets or do a build one with HTTP

* You still have a lot of places where you want to use that request response pattern.
For example if you were sending a message or if you're creating a user. These are operations where you do send some information from the browser to the server. So there is a request response narrow makes perfect sense.

* But if you have some active notification you want to get to your users then you all want to integrate web sockets.

### Websocket Solutions - An Overview

* Socket IO https://socket.io/ dive deep into this , this is very important

### Setting Up Socket.io on the Server

* We want to use socket.io And we have to add it on both the server and the client.

* So both on the node appier and on the re-act up because client server will communicate through web sockets so we have to establish that communication channel on both ends on the frontend react and on the backend node

* Now let's start on the back end, I will install this socket IO package with NPM

```js
npm install --save socket.io
```
* Now how do we use it. Now lets go to our app.js , app.js is the first file run on our server and there we should setup our socke.io connection

* keep in mind socketIO uses a different protocol Web sockets and therefore web sockets requests will not interfere with the normal HTTP requests which are sent by default by the browser.

* once we connect to our database when we start up our server there I also want to establish my socket IO connection.

```js
mongoose
  .connect(
    'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/shop?retryWrites=true&w=majority', { useNewUrlParser: true , useUnifiedTopology: true }
  )
  .then(result => {
    const server = app.listen(8080);
    // socketIO connection
    // we are passing our server to socket.io function
    //  I mentioned that web sockets built up on HTTP.since this server here uses HTTP we used that HTTP server to establish our web socket connection
    const io = require('socket.io')(server);
    // So this is the connection between our server and the client which connected and this function will be executed for every new client that connects.
    // So not only one time but as often as required as many clients as connect.
    io.on('connection', socket =>{
      console.log('client Connected');
    })
  })
```
* And right now if I run NPM start will never see client connected in the console. You don't see it here because we established all that on the service side. We now got a waiting socket connection or port. You could say but we got no client which would connect .

### Establishing a Connection From the Client

* In client side we have to install socket.io-client, it's a different package name, because it is to code that will run on the client.

```js
npm install --save socket.io-client
```
* Then in our frontend import socket io client (/frontend/pages/Feed/Feed.js)

```js
//openSocket -you can name it however
import openSocket from 'socket.io-client'

componentDidMount() {
    fetch('http://localhost:8080/auth/status', {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch user status.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ status: resData.status });
      })
      .catch(this.catchError);

    this.loadPosts();
    // in openSocket we have to give URL of the socket server
    // please note you do use HTTP in your URL because web sockets build up on that.
    openSocket('http://localhost:8080');
  }
```
* save and start our frontend too !!!

### Identifying Realtime Potential

