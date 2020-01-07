# Node-Js

## REST Practical

* For this we added a new folder React-REST-Practical, here we are using REACT as frontend for that we will write API.

* here we have our API related canges inside our frontend folder(Node Js) , currently our backend changes running in 8080 port and our frontend changes running in default 3000, two ends of my application are served by different servers

* which is a pretty common scenario since frontend only applications like react can be served on so-called static hosts which are optimized for applications that only consist of html, javascript and css and hence you might indeed have two different servers even if you created both the backend and the frontend.

* We actually got two routes already, /posts and /post for creating a new post and for getting existing posts and now let's add some logic so to our controller actions to actually return something useful and to enable the user to create new posts

```js
// Current/existing dummy data

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl: 'images/download.png',
                creator: {
                    name: 'Guna'
                },
                createdAt: new Date()
            }
        ]
    });
};

```
* We can actually get this post through http://localhost:8080/feed/posts

* Now we can use this in our frontend fetch post

```js
loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    fetch('http://localhost:8080/feed/posts')
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch posts.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          posts: resData.posts,
          totalPosts: resData.totalItems,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };
```
* Now fetching data works but still this is dummy data.

###  Adding a Create Post Endpoint

* we can actually add a new post, for now without the image upload. So let me go back to my rest API

```js
// in our create post API

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { _id: new Date().toISOString(), title: title, content: content, creator:{name: 'Guna'},createdAt: new Date()
  });
};

```

* Now we can use this in our frontend 

```js
finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    // Set up data (with image!)
    // here we are passing our URL
    let url = 'http://localhost:8080/feed/post';
    // API method
    let method = 'POST';
    if (this.state.editPost) {
      url = 'URL';
    }

    fetch(url, {
        method: method,
        // to send this request in a way that the server understands it, we need to add some headers
        headers: {
            //  to inform the server that I do indeed send some json data.
            'Content-Type': 'application/json'
        }
        // I will also need to add a body, the data which I want to set and that has to be json data so I will use json stringify to convert a javascript object to json
        body: JSON.stringify({
            // this javascript object in the end should hold the code which I want to, well send to my backend
            title: postData.title,
            content: postData.content
        })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        const post = {
          _id: resData.post._id,
          title: resData.post.title,
          content: resData.post.content,
          creator: resData.post.creator,
          createdAt: resData.post.createdAt
        };
        this.setState(prevState => {
          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else if (prevState.posts.length < 2) {
            updatedPosts = prevState.posts.concat(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false
          };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  };
```
* New post created fine.

### Adding Server Side Validation

* npm install --save express-validator

* Server side router validation

```js
const express = require('express');
// express-validator
const {body} = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
// server side validator
router.post('/post', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
],feedController.createPost);

module.exports = router;
```

* controller changes

```js
const { validationResult } = require('express-validator');

exports.createPost = (req, res, next) => {
  //this will automatically extract errors 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    // validation failed error
    return res.status(422).json({message: 'validation failed, entered data is in-correct.', errors: errors.array()})
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { _id: new Date().toISOString(), title: title, content: content, creator:{name: 'Guna'},createdAt: new Date()
  }
  });
};

```
### Setting Up a Post Model

* So time to add some database logic and I will again use mongodb and mongoose

```js
npm install --save mongoose
```
* now first of all let's connect. For this let's open the app.js file and let's import mongoose.

```js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

mongoose
    .connect(
    'mongodb+srv://guna:0987654321@nodemongo-jwgkk.mongodb.net/messages?retryWrites=true&w=majority'
    )
    .then(result => {
    app.listen(8080);
    })
    .catch(err => console.log(err));
```
* Now we can contruct our post schema model logic

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
{
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: true
    }
},

// mongoose will then automatically add timestamps when a new version is added to the database, when a new object is added to the database. So we automatically get a createdAt and updatedAt timestamp out of the box

{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);

```

### Storing Posts in the Database

```js
const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  //this will automatically extract errors 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    // validation failed error
    return res.status(422).json({message: 'validation failed, entered data is in-correct.', errors: errors.array()})
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/download.png',
    creator:{name: 'Guna'}
  })

  post.save().then(result => {
    console.log(result)
    // Create post in db
    res.status(201).json({
      message: 'Post created successfully!',
      post: result
    });
  }).catch(err => {
    console.log(err)
  });
};
```

### Static Images & Error Handling

* In app.js,I want to set up static serving of my images folder

```js
const path = require('path');

const express = require('express');

const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));
```

* We can set up a general error handling function in expressjs and we want to use that function

```js
// in create controller
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // here we are throwing error message
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/duck.jpg',
    creator: { name: 'Maximilian' }
  });
  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    // Now you learned that since I'm inside of a promise chain, so inside of an async code snippet, throwing an error will not do the trick,this will not reach the next error handling middleware. Instead you have to use the next function here ********
      next(err);
    });
};

```
* Now what does throwing an error do here? It will automatically since I'm not doing this in an asynchronous code snippet or anything like that, it will automatically exit the function execution here and instead try to reach the next error handling function or error handling middleware provided in the express application.

* Now the last step is that we register that middleware and we do so in app.js.

```js
// in app.js
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});
```

### Fetching a Single Post

* In router

```js
router.get('/post/:postId', feedController.getPost);
```

* In controller 

```js
exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', posts: posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
```
* Now we can use this url in our frontend

```js
const postId = this.props.match.params.postId;
fetch('http://localhost:8080/feed/post/'+ postId)
```

### Uploading Images

* On server side the logic is still same.. let us do it again.

* I want to accept uploaded files, lets install a special body parser, a special middleware and that was multer.

* Lets add logic in app.js
```js
// app.js
const multer = require('multer');

// I will configure the file storage with multer disk storage to control where the files get stored

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      //images folder
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    // if valid return true this is again something we learned in the file upload module
    cb(null, true);
  } else {
    cb(null, false);
  }
};


// register multer
app.use(
  // single image and 'image' refers to field name
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

```
*  With that, multer is registered and now we can use the file in our controller where we create a new post

```js
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(422).json({
    //   message: 'Validation failed, entered data is incorrect.',
    //   errors: errors.array()
    // });
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
    creator: { name: 'Maximilian' }
  });
  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
```

* We need to tweak UI changes to adopt file upload API changes..

*  we won't use json data anymore because json data is only text so only data that can be represented as a text which a file can't be or not easily, it will be very big quickly and very big files are a huge issue or impossible to upload like this. So we can't use json for data where we have both a file and normal text data, instead we'll again use form data.
```js
finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    // image is the field name
    formData.append('image', postData.image);
    let url = 'http://localhost:8080/feed/post';
    let method = 'POST';
    if (this.state.editPost) {
      url = 'http://localhost:8080/feed/post/' + this.state.editPost._id;
      method = 'PUT';
    }

    fetch(url, {
      method: method,
      body: formData
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        const post = {
          _id: resData.post._id,
          title: resData.post.title,
          content: resData.post.content,
          creator: resData.post.creator,
          createdAt: resData.post.createdAt
        };
        this.setState(prevState => {
          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else if (prevState.posts.length < 2) {
            updatedPosts = prevState.posts.concat(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false
          };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  };
```

### Updating Posts

```js
// Routes
router.put(
  '/post/:postId',
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);

```
* In controller

```js
const fs = require('fs');
const path = require('path');

exports.updatePost = (req, res, next) => {
  // postId is a param object
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
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// while uploading new image we need to unlink old image
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
```
* We need to tweak UI to adopt this update API changes


```js
loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    fetch('http://localhost:8080/feed/posts')
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch posts.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          //
          posts: resData.posts.map(post => {
            return {
              ...post,
              // this is imageUrl without base URL.. we will baseURL while display
              imagePath: post.imageUrl
            };
          }),
          totalPosts: resData.totalItems,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };
```
### Deleting Posts

* router changes

```js
router.delete('/post/:postId', feedController.deletePost);
```
* controller changes

```js
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      // Check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
```

* In frontend we could this API to delete post

```js
deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    fetch('http://localhost:8080/feed/post/'+postId,{
      method : 'DELETE'
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState(prevState => {
          const updatedPosts = prevState.posts.filter(p => p._id !== postId);
          return { posts: updatedPosts, postsLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };
```
###  Adding Pagination

* on the backend, I need to return different data, I need to paginate my data. For that, where I fetch all posts of course and that is where I want to implement pagination

* In frontend we already passing page in param

```js
loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    fetch('http://localhost:8080/feed/posts?page=' + page)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch posts.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          posts: resData.posts,
          totalPosts: resData.totalItems,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };
```

* We need to extract this page param in backend API controller

```js
exports.getPosts = (req, res, next) => {
  // here we are setting 1 as default value (if undefined it will assign 1 as default value) for query page
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    //to find out how many documents I actually have this will not retrieve the documents, it will just count them
    .countDocuments()
    .then(count => {
      totalItems = count;
      // here we are fetching paginated value with skip and limit
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res
        .status(200)
        .json({
          message: 'Fetched posts successfully.',
          // once we fetched the paginated value we are just forwarding the data items and its count
          posts: posts,
          totalItems: totalItems
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
```

### Adding a User Model

```js
//models/user.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        // default value for status
        default: 'I am new!'
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);

```
* so now I got my model set up. We can now use that model to set up a sign up and later, also a login route.

```js
// routes/auth.js
const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            // so I will return promise reject and that will cause the validation to fail, all other scenarios will cause it to succeed and then I'll return email address already exists
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;

```
* Now we have to register auth.js router to our app.js

```js
const authRoutes = require('./routes/auth');

...

app.use('/auth', authRoutes);
```
### Adding User Signup Validation

* To store passport secure we will use bcrypt make sure you installed bcrypt package, which allows us to hash a password in a secure way

```js
npm install --save bcryptjs
```
* In auth.js controller 
```js
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // if validation returns error we are throwing error here, this will follow common error handler in app.js
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        // Make sure we are passing data too in our common error handler in app.js
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
    // here 12 is strength, ie with the salt of 12
    .hash(password, 12)
    .then(hashedPw => {
      // So in here, I'll now create a new user with the help of my user constructor, so my user model created through mongoose and I'll set the fields I need to set on the user, so that would be email, password, name,
        const user = new User({
        email: email,
        password: hashedPw,
        name: name
        });
        // here we are saving user data
        return user.save();
    })
    .then(result => {
        // once we saved the user we will return data
        res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch(err => {
        if (!err.statusCode) {
        err.statusCode = 500;
        }
        next(err);
    });
};
```
* In common error handler

```js
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    //here... we are fetching an passing original error to frontend with error status
    const data = error.data
    res.status(status).json({ message: message, data: data });
});
```
### Signing Users Up

```js
signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch('http://localhost:8080/auth/signup', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      // here we are sending Json data to the backend in request body
      body: JSON.stringify({
        email: authData.signupForm.email.value,
        password: authData.signupForm.password.value,
        name: authData.signupForm.name.value
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Creating a user failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({ isAuth: false, authLoading: false });
        this.props.history.replace('/');
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });
  };
```
### How Does Authentication Work?

* So how does authentication work in a rest API

* Well we obviously still have our client and server and the client still sends authentication data to the server,

* In the past, we then would have checked that data on the server and if it is valid, we would have established a session. Now we don't use a session anymore because restful APIs are stateless they don't care about the client,you learned about that strict decoupling of server and client and every request should be treated standalone,

*  The server will not store anything about any client, so we don't store sessions on a rest API and therefore this approach will not be used anymore.

* Obviously we will still validate the input on the server, we'll still check for the validity of the e-mail password combination but then instead, we return a so-called token to the client. That token will be generated on the server and will hold some information which can only be validated by the server and this token will then be stored in the client

* so there in storage in the browser,there are specific storage mechanisms for this and the client can then attach this token to every subsequent request it sends to the server.

* So this stored token is then attached to every request that targets a resource on the server which requires authentication. That token can only be validated by the server which created the token.

* and if you change that token on the frontend or you try to create it to fake that you are authenticated,that will be detected because the server used a certain algorithm for generating the token which you can't fake because you don't know it or you don't know the private key (Refer authWork image) used by that server for generating the token to be precise.

* That token contains json data or javascript data in the end plus a signature which as I mentioned is generated on the server with a special private key which is only stored on the server
and this gives us a so-called json web token. This json web token is then returned to the client and the signature as I explained can only be verified by the server, so you can't edit or create the token on the client.

* Well you can but then the server will detect this and will treat the token as invalid. This is how we generate the token or how we do authentication in rest APIs. We have the token which can be checked by the server but which does not to be stored on the server and this gives us an elegant way of authenticating requests in a rest API world.

### Starting with User Login

* In auth.js router

```js
router.post('/login', authController.login);
```
* before doing changes in controller please make sure you installed json web token

```js
npm install --save jsonwebtoken
```
* controller login logic

```js
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
        }
      // this creates a new signature and packs that into a new json web token. We can add any data we want into the token, like for example we could store the user email, so access the loaded user e-mail and the user id and since it's a mongodb object ID here, let's convert that to a string.

      // So now I'm storing some user data in the token,of course you should not store the raw password in here because that would be returned to the frontend,to the user to whom the password belongs but still not ideal, email and user ID should be fine however
        const token = jwt.sign(
        {
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        },
        // and then you need to pass a second argument which is that secret, so that private key which is used for signing and that is now only known to the server and therefore you can't fake that token on the client.
        'somesupersecretsecret',
        // I'll set an expiry time of one hour with this syntax so that the token becomes invalid after one hour.
        { expiresIn: '1h' }
        );
        // Now we returning token to the client
        res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
        if (!err.statusCode) {
        err.statusCode = 500;
        }
        next(err);
    });
};
```

* now with that, let's go back to the frontend and work on the code there as well.

```js
loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch('http://localhost:8080/auth/login',{
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate you!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({
          isAuth: true,
          token: resData.token,
          authLoading: false,
          userId: resData.userId
        });
        // here we are setting token and userId to local storage
        localStorage.setItem('token', resData.token);
        localStorage.setItem('userId', resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });
  };
```
* how could we attach it? to other API request there are a couple of options. You could add a query parameter, You could include it in the request body but that is not ideal because for example get requests have no body,so that is not a solution you should use unless you never have authenticated get requests

* A great solution is however that you use a header. It keeps your urls beautiful and a header makes a lot of sense for meta information like well the token which it is in the end.

* for every API request first argument we pass url and for second argument there to the fetch method and here I will add some headers to this request. Now I will not add the content type because I'm notsending any data here but I will add the authorization header.

* Theoretically you can add any header you want but this is an official header, a header you officially use for passing authentication information to the backend and please remember that on the backend in the app.js file where we added our course headers, I did enable the authorization header, you need to have that enabled for this to work.

```js
//For our refernece, we already added this in app.js middleware

res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```
* In our API call

```js
fetch('http://localhost:8080/feed/posts?page=' + page,{
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
```
* but actually bearer whitespace and then this props token allows you to get the token in the react app.

* Why bearer? Well this is just a convention to kind of identify that the type of token you have and the bearer token is simply an authentication token, you typically use bearer for json web tokens.


### Using & Validating the Token

* we need to make sure that the client can pass back the token to the backend, to the rest API and we then check for the A, existence and B, validity of the token before we allow the request to continue.

* So for example on our feed routes, on all these routes, none of these routes should be public,
so if no token is attached to the incoming request, we should simply block access here and this is what I'll work on now. For that I'll add a new middleware

```js
// we need this package to validate jsonwebtoken
const jwt = require('jsonwebtoken');

// now I first of all need to extract the token from an incoming request.

// Now currently we are not attaching the token to any requests,

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    // to get token alone without "Bearer" we are splitting here with whitespace
    const token = authHeader.split(' ')[1];
    let decodedToken;
    // here we used try catch block beacuse this could fail
    try {
        // here we are trying to verify secrect key with the token that will result in decodedToken value
        decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    // so now I'll just extract some information from the token, the user id and I will store it in the request so that I can use it in other places where this request will go, like in my routes 

    // So there I can now access my user ID field which I stored in the token, this will be useful for later, authorizing access to for example deleting posts because now I know the user ID stored in the token and that should match the user id of the post

    req.userId = decodedToken.userId;
    next();
};

```
* Now we can add that middleware to our routes 

```js
...
...
const isAuth = require('../middleware/is-auth');
 ....
 ....

router.get('/posts',isAuth, feedController.getPosts);
```
* We added this isAuth middleware on the server, let's now protect all feed routes with it. and also make sure we are passing authorisation headers in our request whereever it needs

### Connecting Posts & Users

* We need to do changes in post model to accomodate user(creator) object

```js
//model/post.js
creator: {
        type: Schema.Types.ObjectId,
        ref : 'User',
        required: true
}
```
* Then in our create post we need to update this changes

```js
exports.createPost = (req, res, next) => {
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
  let creator;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    //previouly ===> creator: { name: 'Maximilian' } now we have changed our model and also we can access to the userId
    creator: req.userId
  });
  // here we saving our post data in post model document
  post
    .save()
    .then(result => {
      // Once data saved we are returing userdata based on the userId 
      return User.findById(req.userId);
    })
    .then(user => {
      // then we are saving user model document with the post details
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(result => {
      // Once user and post details updated we need to send back corresponding details in the response
      res.status(201).json({
        message: 'Post created successfully!',
        post: post,
        creator: { _id: creator._id, name: creator.name }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
```

### Clearing Post-User Relations

```js
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
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
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      // Here we pull (remove) post details from user document model using post ID
      user.posts.pull(postId);
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
```
