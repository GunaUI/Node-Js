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

* Now let's actually start with the client. Let's say we want to react to a new post being created and we then want to render it in the client instantly.

* For that in react app after component did mount function before loads lets say i will add a new function addPost

```js
  addPost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      if (prevState.postPage === 1) {
        if (prevState.posts.length >= 2) {
          updatedPosts.pop();
        }
        updatedPosts.unshift(post);
      }
      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1
      };
    });
  };
```
* Now we got ADD post but we're never calling it. My idea is that I want to call it whenever we do create a new post on some other client. Now how do we do that well. For that let's go back to the node code. We have to go to the place that's runs or to the code that runs when a new post is created. There we want to use socket.

* I owed the already existing connection we have set up to basically inform all connected clients about the new host that is the idea

* Now for that however we need to share that connection which we currently set up. How do we get that connection out of actually into feature.

### Sharing the IO Instance Across Files

* To be able to read was one and the same I O object that manages the same connection that is exposed.

```js
// socket.js
let io;

module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
```
* Now we have to use this functions in our app.js to initiate connections

```js
mongoose
  .connect(
    'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/messages?retryWrites=true'
  )
  .then(result => {
    const server = app.listen(8080);
    // here we are using socket.js and its init function to initiate socket io
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected');
    });
  })
```
* we can import this in all the places of our app where we need to be able to interact with IO

### Synchronizing POST Additions

* Now we have a way of sharing our I O connections across multiple files.

* In feed.js controller i want to use socket.js file

```js
const io = require('../socket');

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    // here we are emitting post created socket from backend 
    // now there are a couple of helpful methods socketio gives us, one of them is emit and broadcast
    // emit will now send a message to all connected users.
    // broadcast will send data to all connected sockets except the one that originally emitted the event
    // posts is event name
    io.getIO().emit('posts', 
    // below is data channel we want to send to front end
    {
      // create - action name
      action: 'create',
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
    }
    );
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: user._id, name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
```
* Now server side changes done, we have receive this emitted changes in our front end code.

```js
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

    // So in component did mount ofter opening my socket I would actually store something which is returned by open socket and that is my socket.

    const socket = openSocket('http://localhost:8080');
    socket.on('posts', data => {
      if (data.action === 'create') {
        this.addPost(data.post);
      }
    });
  }

  addPost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      if (prevState.postPage === 1) {
        if (prevState.posts.length >= 2) {
          updatedPosts.pop();
        }
        updatedPosts.unshift(post);
      }
      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1
      };
    });
  };

```
###  Updating Posts On All Connected Clients

```js
exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    // socket IO
    io.getIO().emit('posts', { action: 'update', post: result });
    res.status(200).json({ message: 'Post updated!', post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
```

* In frontend

```js
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
    const socket = openSocket('http://localhost:8080');
    socket.on('posts', data => {
      if (data.action === 'create') {
        this.addPost(data.post);
      }else if (data.action === 'update') {
        this.updatePost(data.post);
      }
    });
  }

  addPost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      if (prevState.postPage === 1) {
        if (prevState.posts.length >= 2) {
          updatedPosts.pop();
        }
        updatedPosts.unshift(post);
      }
      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1
      };
    });
  };

  updatePost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      const updatedPostIndex = updatedPosts.findIndex(p => p._id === post._id);
      if (updatedPostIndex > -1) {
        updatedPosts[updatedPostIndex] = post;
      }
      return {
        posts: updatedPosts
      };
    });
  };
```

###  Deleting Posts Across Clients

* delete post controller action 

```js
exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    io.getIO().emit('posts', { action: 'delete', post: postId });
    res.status(200).json({ message: 'Deleted post.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
```

* In Frontend

```js
 socket.on('posts', data => {
      if (data.action === 'create') {
        this.addPost(data.post);
      }else if (data.action === 'update') {
        this.updatePost(data.post);
      } else if (data.action === 'delete') {
        this.loadPosts();
      }
    });
```

