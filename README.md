# Node-Js

## GraphQL

* What is GraphQl ??

* To really explain this let us compare this with REST API , REST API is a state less client independent API for exchanging data.

* So it's a node express application or a node with any framework application of course that we build to exchange data. We don't render views we don't store sessions we don't care about the client. We only get requests parse the data and return responses with data.

* Graphql  API is generally not that different. It's also a stateless client independent API for exchanging data.But and that's the important part of course with higher Querrey flexibility.

* to understand that let's look at some rest API limitation , for example if we are fetching some data but we don't need entire data we just want few fields and at the other page we need other specific fields as response how can we do that ??

* One solution is simply we create more different end points for the same query table/document just for different response fields. Now obviously by the way you could also of course use the same endpoint all the time and just pars or filter out the data you need on the front end.

* But then you sending a lot of unnecessary data over the wire which is an issue especially when working with mobile devices.

* So our solution could be to simply create more endpoints that simply return the data you need for each of these endpoints. The problem is you'll have a lot of endpoints and you'll have to update them continuously and you also have a very unflexible solution here if you're front and engineers and in bigger projects you typically work in different teams if they need more data on a new page. They come to you as a back and developer and ask you to give him an endpoint that returns that data and their stack in their frantic development until you added this so fast iteration on the front end is made harder.

* So this is not the ideal solution to be to use query parameters on your existing endpoints.

* Now obviously that is an option but just as with the first solution you always have to add it so that your front and engineers can continue and you have this dependency between front end and back end.

* Additionally your API might become pretty hard to understand because it might not be clear which query parameter can I set which values can I set on these query parameters. So this is also not ideal ideal for apps

* where you often have different data requirements on different pages is to use GraphQl.

* You don't have the problems I described before because there as you will learn you have a rich query language that you use in your front end to send it to the backend which is then parsed on the back end and dynamically retrieves just the data you need.

* So it's almost like a database query language which you use on the back end like sequel or mongodb query language almost like something like this for the front end.(Refer GraphQl Image)

### How does GraphQL work ??

* Now what do you send from client to server in that graphQL world.

* You only send one kind of request and that is a POST request to slash graphQL.

* So you only have one single and point where you send your HTTP requests to even for getting data.

* Well for a POST request you can add a request body and that request body will contain that query expression.and you use that Query language you put it into a request body and you just can't send request bodies on GET requests.

* So you put your query language expression into that request body and data will be parsed on a server to then do some magic on it and return you just the data you want. That is the idea behind graphql.

```js
{
  query{            =====>  Operation Type
    user{           =====>  Operation "endpoint or commands"
      name          ======> fields we want to extract
      age           ======> fields we want to extract
    }
  }
}
```
* It's just an object like structure where you have an operation type query before getting data.

* Operation Type
  * Query =======> Getting data "GET", and we use a POST request for that.
  * mutation =====> editing/deleting/inserting (similar like POST, PUT, PATCH, DELETE)
  * Subcription =====> setting up real time data subscriptions using web sockets, we will not focus in this module will see this later in socketIO seperately

* endpoint or commands you can execute and you to find them as developer on your backend and the available endpoints and then the fields you want to extract and that is the flexible part because
you could in one place get the user with just a name and in another place you could get name age and email.(Refer Graphql big picture !!!!! important)

* this is how we will implement it.

* its a normal node and possibly express server.Of course you are also not limited to using Express J.S. you're also not limited to using node by the way graphql approach can be used with any programming language

* You have one single endpoint. Typically slash graph to l though you could change this of course.You only use post requests because you put that query expression into the request body and you have resolvers on the server side that analyze that request body and then do something with your data basedmon the query expression you had in that body and will use third party packages for that parsing and so on.

* So posting for getting data that is the most confusing thing you typically have when diving into graphs ( Refer How graphql works) Yes this is what we do.Does this what is ok here. Because we describe that data we want to get in the request body.

### Understanding the Setup & Writing our First Query

* First lets remove socket related changes in app.js and then install graphql package

```js
npm install --save graphql express-graphql
```
* Refer : https://graphql.org/

* Now lets write some express logic will see how do we do that ??

* schema.js ===> where I find the queries mutations and types I work with in my graph tool service

* resolver.js ===> where I will define the logic that is then executed for incoming queries.

```js
// Schema.js

const { buildSchema } = require('graphql');
// query are the part of where we get data
// RootQuery or any user defined name we can use
// This is now a very basic schema where we can send a "hello" query to get back some text.
// if we add ! it become mandatory if we didn't return string it will throw error
// FYI there is no comma in schema
module.exports = buildSchema(`

  type TestData {
        name: String!
        views: Int!
  }

  type RootQuery {
        hello: TestData
  }

  schema {
        query: RootQuery
    }
`);
```
```js
// Resolver

module.exports = {
  // "hello" function name should match with the schema name "hello" which is defined inside the RootQuery type
  hello(){
    // we need to return a string. Right ? We expect the string as per schema
    return {
      text: "Hello World",
      views: 20
    }
}
```
* So you need a method for every query or mutation. You define your schema and the name has to match of course.
* Now we have valid resolver and valid schema
* Now we need to expose it to the public and that can be done with the express graphql package
* In app.js we now import that

```js
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

...
...

// let's add another middleware so that all the words do apply here.
// Here we used /graphql but you could change that but that is the common convention to use
// And also we deliberately used app.use not app.post will see why we used in few second
// graphqlHttp which is provided by express-graphql , now we pass javascript object inside that
// this needs two items to work one is schema and rootValue

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver
  })
);
```
* Now we can npm start and check this graphql in POSTMAN
```js
// URL :=> http://localhost:8080/graphql
// Format :=> raw application Json. 
{
  // You send a javascript object with a "query" and this does not mean that we send a query and not mutation. It simply is something which the Express graphical package will look for 
  // hello query is from schema, hello query has TestData as type
  // type TestData has name and views 
  // Now we need to find which data we want to get back for that query 
  // here if i specify as name alone i will get only name not views in response
  // if we add a space and spcify views also the you will get both name and views
  "query": "{ hello { name views}"
}
```
* And this shows you the flexibility already. It's one and the same endpoint but we find which data we want to get on the front end. And it's important to understand that we don't filter the data on the front and it gets filtered on the server by express graph.

* we simply define our schema and the resolver in the resolver. We return all the data but then graphed you all on the server will filter out just the data that was requested.

* Now lets see how can we add mutation.

### Defining a Mutation Schema

* We edit our first graphQl query which allowed us to get data. Let's now add a query that allows us to save data 

* Why don't we start with our Front-End which we used and make sure that we can actually sign up users, so that we can create users because that sounds like a mutation to me.

* Now how do we create a mutation ??

```js
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    // *** ID! specifies the unique ID

    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    // *** here we used input not type because here data that is used as the input for those data we need to specify as input.

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {

      // *** userInput, postInput are argument 
      // *** UserInputData, PostInputData type of userInput and postInput respectively

      // *** User! and Post! are the response we get back after createUser 

        createUser(userInput: UserInputData): User!
        
    }

    schema {
        mutation: RootMutation
    }
`);

```

### Adding a Mutation Resolver & GraphiQL


* In resolvers files we need to add this createUser

```js
// we need bcrypt to hash the password
const bcrypt = require('bcryptjs');
// First of all let's import the mongooses user model. Because I'll still interact with the database of course.
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
  // createUser(args, req){
  // we can also use destructuring
  //I want to use the async awaits syntax 

  // So now I can use a async await that is purely optional though. You could also use the normal then catch approach with your promises

  createUser: async function({ userInput }, req) {

    //const email = args.userInput.email;
    const email = userInput.email;
    // First of all I want to find out if that user already exists 
    const existingUser = await User.findOne({ email: userInput.email });
    // Now one super important note if you're not using a async await you need to return your find one query which you're executing here where you'd then add then because if you don't return your promise in the resolver, graphQL will not wait for it to resolve. when using async await it's automatically returned. We don't see the return statement here but it is there. So that is super important.
    if (existingUser) {
        const error = new Error('User exists already!');
        throw error;
    }
    // Now again I'll use async await here. So I'll get my hashed password eventually ofter awaiting this to finish.
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
        email: userInput.email,
        name: userInput.name,
        password: hashedPw
    });
    // Now I need to save that to the database and I do care about the created user
    const createdUser = await user.save();
    // As per schema i need to retrun user schema as response data
    // ..createdUser._doc just contain user data without meta data
    // _id field by adding it as a separate property and therefore it will override the one I'm pulling out of createdUser._id, because I need to convert it from an object id field to a string field as per schema. Otherwise it will fail.
    // this is now the response we are getting on create user 
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  }
};  
```
* I can go to the app.js Where I register or set up my graphical endpoint besides setting the schema and root value. You can also set graphical written graphiQL to true.

```js
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
...
....
app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    // enabling graphiql to run in browser
    graphiql: true
  })
);
```
* This gives you a special tool and this is the reason why I'm not listening for a app.post requests only here we used app.use because now with your running server. Try visiting localhost:8080/graphql and this will send a get request if you enter something in the browser you sent a get request and you will get this screen which allows you to play around with your graphical API.(Refer graphiql image)

* In that graphiql playground we can send data for createUser

```js
mutation{
  createUser(userInput : {email : "abc@gmail.com", name : "Guna", password: "test"}){
    // And now we can find the data we want to return after this query is done 
    _id
    email
  }
}
```
* if we press play button we could see response

### Adding Input Validation

* Now we added our first mutation and mutation of course also means that we store data in the database.

* Previously we validate our API with express validator in routes, but here we cant do that because he have only one route /graphql.

* This one does the only endpoint we have and we certainly don't want to validate all requests in exactly the same way.

* So to change that and to adjust it to our needs we want to move validation into our resolvers.

* There we have our endpoints and there is a place where we can now validate our incoming request data

* to do validation let us install a new package 

```js
npm install --save validator
```
* Now in our resolver we could import this package and add our validator logic

```js
const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');

module.exports = {
    createUser: async function({ userInput }, req) {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'E-Mail is invalid.' });
        }
        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })
        ) {
            errors.push({ message: 'Password too short!' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    }
};
```
### Handling Errors

* We added validation and we see that a failing validation and hence of an error. As we were doing it here leads to a response that actually has null in the data it gives us back but that has an error or a key with an array of all the errors. you also see that it sets a status code of 500.

* Nice But sometimes you want to add more detailed information. You can set your own status code though. But we could add more information to the errors we have returned

* For that you can go to the app.js file and there where you configure your graphql api and then you can add another configuration option which is called format error which is actually a method which receives the error detected by graphQl and allows you to return your own format.

```js
app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);
```

### Connecting the Frontend to the GraphQL API

* Now it's finally time to work on that re-act application

```js
signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    // we will provide this graphqlQuery to the the body of the request
    const graphqlQuery = {
      // this will be a javascript object where you need to have a query key that is required even for mutations.
      // here you add mutation to define that you you're running a mutation 
      query: `
        mutation {
          createUser(
              userInput: {
                email: "${authData.signupForm.email.value}", 
                name:"${authData.signupForm.name.value}",
                password: "${authData.signupForm.password.value}"
              }
            ){
              _id
              email
            }
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // this is the object i want to stringify
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        // here we will check if response data has errors
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          throw new Error('User creation failed!');
        }
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
* In case of option error

* Well the reason for this error is we get this error. Actually as a response to our options request here not to our post request.

* Now you might remember that I explained that the browser sends an options request before it sends the post patch put delete or so on request.

* The problem is expressed graphql automatically declines anything which is not a post or get request.So the options request is denied.

* The solution is to go to that middleware where I set up my headers and there I check if my request method is equal to options and if it is all options request then here I'll return status 200.

```js
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // 
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
});
```
* So I'll simply send an empty response with a status code of 200.

I return so that this code is not executed and therefore options requests never make it to graphql

### Adding a Login Query & a Resolver

* How does authentication work in the graphical world.Does it work in a similar way to rest API, Do we use sessions again ?? 

* a graphql API is also stateless and client independent. well generally we still authenticate by using such a token which we then attached to every request, that should be able to access protected resources.

* and a log in action is in the end just their normal query where we send some user data and then we want to get back a token.

* Lets add schema for login graphql API

```js
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

```
* Here we are passing email and password and we expect AuthData object as response, which has token and userId
* We need a login resolver for this..

```js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
login: async function({ email, password }) {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('User not found.');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Password is incorrect.');
            error.code = 401;
            throw error;
        }
        const token = jwt.sign(
            {
            userId: user._id.toString(),
            email: user.email
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
        );
        return { token: token, userId: user._id.toString() };
    }
}
```
* now with that we have a log in query place where we send like a get request to log the user into gets the token.now we need to wired it up to the front and in the next step.

### Adding Login Functionality

* in the front and we need to go to the log in handler

```js
loginHandler = (event, authData) => {
    event.preventDefault();
    const graphqlQuery = {
      // login query from schema same as before, here it will return token and userId
      query: `
        {
          login(email: "${authData.email}", password: "${authData.password}") {
            token
            userId
          }
        }
      `
    };
    this.setState({ authLoading: true });
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          throw new Error('User login failed!');
        }
        console.log(resData);
        this.setState({
          isAuth: true,
          token: resData.data.login.token,
          authLoading: false,
          userId: resData.data.login.userId
        });
        localStorage.setItem('token', resData.data.login.token);
        localStorage.setItem('userId', resData.data.login.userId);
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

* We now need to add some routes for some endpoints for getting posts and for adding posts , And we then also want to use that token we do get to protect certain but not all graphql endpoints.

### Adding a Create Post Mutation

* we have users in place let's work on posts.

* And for now I will add posts without a real image because the image upload is something all managed differently

* in my schema here and I will add a new mutation create post.

```js
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

```

* Now with this createPost we can already move on to resolvers and add a new resolver createPost

```js
const Post = require('../models/post');

// postInput argument is the one we just defined in our schema
createPost: async function({ postInput }, req) {
        const errors = [];
        if (
            validator.isEmpty(postInput.title) ||
            !validator.isLength(postInput.title, { min: 5 })
        ) {
            errors.push({ message: 'Title is invalid.' });
        }
        if (
            validator.isEmpty(postInput.content) ||
            !validator.isLength(postInput.content, { min: 5 })
        ) {
            errors.push({ message: 'Content is invalid.' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const post = new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl
        });
        const createdPost = await post.save();
        // Add post to users' posts
        return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString(),
            updatedAt: createdPost.updatedAt.toISOString()
        };
    }
```
* I'll just have this resolver added this create post resolver for the respective mutation.

* Let's try it out in graphical.

```js
mutation{
  createPost(postInput : {title : "tdasdasdasd  asdasdad", content : "asdasdasd asdasd asdad", imageUrl: "http://dfsdfsdfsdffsdf"}){
    // And now we can find the data we want to return after this query is done 
        _id
        title
  }
}
```

* On execute this in graphiql you will get error message as "creator missing" from DB post model.

### Extracting User Data From the Auth Token

* The basic create post mutation is in place. But now we need to be able to validate our token and extract the user from it.

* First of all we need to ensure that we sent a token in a header off our incoming request.

```js
finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    // const formData = new FormData();
    // formData.append('title', postData.title);
    // formData.append('content', postData.content);
    // formData.append('image', postData.image);

    let graphqlQuery = {
      query: `
        mutation {
          createPost(postInput: {title: "${postData.title}", content: "${
        postData.content
      }", imageUrl: "some url"}) {
            _id
            title
            content
            imageUrl
            creator {
              name
            }
            createdAt
          }
        }
      `
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        // here we are passing our token 
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          throw new Error('User login failed!');
        }
        console.log(resData);
        const post = {
          _id: resData.data.createPost._id,
          title: resData.data.createPost.title,
          content: resData.data.createPost.content,
          creator: resData.data.createPost.creator,
          createdAt: resData.data.createPost.createdAt
        };
        this.setState(prevState => {
          return {
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
* Previouly in backend we will receive this token from frontend using a middleware now we will tweek it little bit 

```js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    // if authHeader is not set i will not throw error instead on my request i wil set isAuth to false
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    // if error i will not throw error instead on my request i wil set isAuth to false
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    // same here
    req.isAuth = false;
    return next();
  }
  req.userId = decodedToken.userId;
  req.isAuth = true;
  next();
};

```
* Now does tweak middleware is something I add an app.js before my graphQL endpoint.

```js
const auth = require('./middleware/auth');

app.use(auth);
```
*  It will run on every request that reaches my graphQL endpoint but it will not deny the request. If there is no token. the only thing it will do is, it will set off to false and then I can decide in my resolver whether I want to continue or not.

* Then in my resolver for create Post i need auhentication ie token so.

```js
createPost: async function({ postInput }, req) {
        // here we are checking isAuth
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const errors = [];
        if (
            validator.isEmpty(postInput.title) ||
            !validator.isLength(postInput.title, { min: 5 })
        ) {
            errors.push({ message: 'Title is invalid.' });
        }
        if (
            validator.isEmpty(postInput.content) ||
            !validator.isLength(postInput.content, { min: 5 })
        ) {
            errors.push({ message: 'Content is invalid.' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        // before we create the post we can now also get the user from the database because remember that we do store the user id in our request as well 
        const user = await User.findById(req.userId);
        if (!user) {
          const error = new Error('Invalid user.');
          error.code = 401;
          throw error;
        }

        const post = new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
            // And now in the newly created post I can set the creator equal to my extracted user.
            creator: user
        });
        const createdPost = await post.save();
        // once I created the post I can now also use that user and access the posts of that user to push the created post onto that list of posts.
        user.posts.push(createdPost);
        await user.save();
        // Add post to users' posts
        return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString(),
            updatedAt: createdPost.updatedAt.toISOString()
        };
    }
```
* And now we need to work on the front end to send the request to the frontend.

### Sending the "Create Post" Query

* On the frontend in the finishEditHandler function I'll ignore the image upload for now. I want to now reach my graphql endpoint and create a new user.

```js
finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    // for creator response as per schema we will fetch user object, in that user object i need only name alone so that we could specify that alone I don't care about the ID or email... anything

    let graphqlQuery = {
      query: `
        mutation {
          createPost(postInput: {title: "${postData.title}", content: "${
        postData.content
      }", imageUrl: "some url"}) {
            _id
            title
            content
            imageUrl
            creator {
              name
            }
            createdAt
          }
        }
      `
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          throw new Error('User login failed!');
        }

        const post = {
          _id: resData.data.createPost._id,
          title: resData.data.createPost.title,
          content: resData.data.createPost.content,
          creator: resData.data.createPost.creator,
          createdAt: resData.data.createPost.createdAt
        };
        this.setState(prevState => {
          return {
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
* this shows the power of graphQl really well, we get exactly the data we need.

### Adding a "Get Post" Query & Resolver

* Let's make sure we can also get all posts in for that I'll start on the backend in my schema again

* of course is a normal root query 

* I'll name it posts you can name it however you want. I don't need any arguments here.I instead can directly define my return type and that will actually not be an array of posts. As you might have expected.

* But actually I'll create a new type for that because remember that in the rest API We also did not just return an array of posts but for pagination also a number that specified our total amount of posts in the database.

```js
type PostData {
    posts: [Post!]!
    totalPosts: Int!
}

type RootQuery {
    login(email: String!, password: String!): AuthData!
    posts: PostData!
}
```
And now we need a resolver for that. So let's head over to resolvers.

```js
posts: async function(args, req) {
    if (!req.isAuth) {
        const error = new Error('Not authenticated!');
        error.code = 401;
        throw error;
    }
    // total posts
    const totalPosts = await Post.find().countDocuments();
    // skip and limit for pagination
    // I will also populate my creator to fetch the full user data with the name and so on 
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('creator');
    return {
      // i should return posts with post array object and totalPosts 
        posts: posts.map(p => {
            return {
                ...p._doc,
                _id: p._id.toString(),
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString()
            };
        }),
        totalPosts: totalPosts
    };
}
```
* Now let's test this on graphiql.
```js
// posts in an array of complex object
query{
  posts {
    posts{
      _id
      title
      content
    }
    totalPosts
  }
}
```
* On click it will through "Not authenticated" error since we are not sending token here (graphiql), but frontend we are sending token.. it will not throw error

### Sending "Create Post" and "Get Post" Queries

* So let's use that query from the frontend.

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
    const graphqlQuery = {
      query: `
        {
          posts {
            posts {
              _id
              title
              content
              creator {
                name
              }
              createdAt
            }
            totalPosts
          }
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Fetching posts failed!');
        }
        this.setState({
          posts: resData.data.posts.posts.map(post => {
            return {
              ...post,
              imagePath: post.imageUrl
            };
          }),
          totalPosts: resData.data.posts.totalPosts,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };
```
### Adding Pagination

 * Now we're able to fetch our posts through graphQl lets at pagination again. How does that work with graphql ? 

 * We start on our graphical schema again because there will need to change something on our posts query because it is that query where we want to add pagination right.

 * Therefore to posts query needs an argument it needs an argument that allows us to define the page we are on and I'll name that page.
 ```js

type RootQuery {
    login(email: String!, password: String!): AuthData!
    posts(page: Int): PostData!
}

 ```
 * In resolver

 ```js
 // here we pass page as argument
 posts: async function({ page }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        if (!page) {
            page = 1;
        }
        const perPage = 2;
        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('creator');
        return {
            posts: posts.map(p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString(),
                    updatedAt: p.updatedAt.toISOString()
                };
            }),
            totalPosts: totalPosts
        };
    }
 ```
 * in frontend request

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
    const graphqlQuery = {
      query: `
        {
          posts(page: ${page}) {
            posts {
              _id
              title
              content
              creator {
                name
              }
              createdAt
            }
            totalPosts
          }
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Fetching posts failed!');
        }
        this.setState({
          posts: resData.data.posts.posts.map(post => {
            return {
              ...post,
              imagePath: post.imageUrl
            };
          }),
          totalPosts: resData.data.posts.totalPosts,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };
```

### Uploading Images

* How does uploading data work.

* Now the thing is graphQL only works with Json data.

* You can find a couple of third party packages that help you with getting data from graphQL.

* But in the end one of the cleanest solutions is to use a classic endpoint like a rest endpoint where you send your image to and then let the endpoint store the image and return the path of the image and
then send another request with that image path and your other data to your graphQl endpoint.

* This is the solution i will implement here because you could outsource this into a separate file.But it'll be the only route we add here and there.

```js
const path = require('path');
const fs = require('fs');

// I'll register a new route on my app for incoming put requests because I plan to send an image with a put request to slash.

app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated!');
  }
  if (!req.file) {
    // first of all check if we don't have a file. Now how can I check that. Well we still have multer in place.

    // We added that and REST API module and multer is the package which takes our multipart form data requests and extracts a file and stores it in the image folder

    // So all my files still will be extracted and multer then populates the file object with information about the extracted file.

    // Now if this is not set then I'll just return a response here with the status of 200 and a message 

    // But actually this scenario is fine for me as you will see when we later edit a post because there we might or might not add a new image. Maybe we stick to the old one or Maybe we did choose a new one.And then this is one way of handling both cases.

    return res.status(200).json({ message: 'No file provided!' });
  }
  if (req.body.oldPath) {
  // I'll check for the existence of a body field which is named oldPath which simply means that an oldPath was passed with the incoming request in which case I want to clear my old image then we added a new image.

  // Instead we delete the old image here and then only keep the new image which was stored by multer 
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    //  this is the path where milters stored the image. And this is the path we can then use the frontend
    .json({ message: 'File stored.', filePath: req.file.path });
});

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
```
* We can now work on the frontend to use the rest API endpoint and this also shows you that you can use rest and graftQL concepts together.

* Now we want to use this in finishEditHandler

```js
finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    // FormData append image
    const formData = new FormData();
    formData.append('image', postData.image);

    if (this.state.editPost) {
      // if edit append oldPath
      formData.append('oldPath', this.state.editPost.imagePath);
    }
    // Normal REST ENDPOINT, in backend /post-image we used PUT method, same URL we are using here
    fetch('http://localhost:8080/post-image', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      },
      body: formData
    })
      .then(res => res.json())
      .then(fileResData => {
        // From PUT response we will get filePath
        const imageUrl = fileResData.filePath;
        // we will pass this imageUrl in graphQL schema
        let graphqlQuery = {
          query: `
          mutation {
            createPost(postInput: {title: "${postData.title}", content: "${
            postData.content
          }", imageUrl: "${imageUrl}"}) {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
          }
        `
        };

        return fetch('http://localhost:8080/graphql', {
          method: 'POST',
          body: JSON.stringify(graphqlQuery),
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'
          }
        });
      })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          throw new Error('User login failed!');
        }
        console.log(resData);
        const post = {
          _id: resData.data.createPost._id,
          title: resData.data.createPost.title,
          content: resData.data.createPost.content,
          creator: resData.data.createPost.creator,
          createdAt: resData.data.createPost.createdAt,
          imagePath: resData.data.createPost.imageUrl
        };
        this.setState(prevState => {
          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else {
            updatedPosts.pop();
            updatedPosts.unshift(post);
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
### Viewing a Single Post

* So let's make sure we can also fetch a single post and for that I'll go to my schema again

```js
type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page: Int): PostData!
        // single post schema fetch using id
        post(id: ID!): Post!
    }
```

* Resolver changes 
```js
post: async function({ id }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const post = await Post.findById(id).populate('creator');
        if (!post) {
            const error = new Error('No post found!');
            error.code = 404;
            throw error;
        }
        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString()
        };
    }
```
* Frontend API request

```js
componentDidMount() {
    const postId = this.props.match.params.postId;
    const graphqlQuery = {
      query: `{
          post(id: "${postId}") {
            title
            content
            imageUrl
            creator {
              name
            }
            createdAt
          }
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Fetching post failed!');
        }
        this.setState({
          title: resData.data.post.title,
          author: resData.data.post.creator.name,
          image: 'http://localhost:8080/' + resData.data.post.imageUrl,
          date: new Date(resData.data.post.createdAt).toLocaleDateString('en-US'),
          content: resData.data.post.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
```
###  Updating Posts

* Now we can load a single post let's make sure we can add a post

```js
input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
}
type RootMutation {
      updatePost(id: ID!, postInput: PostInputData): Post!
}
```
* In resolver 

```js
updatePost: async function({ id, postInput }, req) {
  if (!req.isAuth) {
    const error = new Error('Not authenticated!');
    error.code = 401;
    throw error;
  }
  const post = await Post.findById(id).populate('creator');
  if (!post) {
    const error = new Error('No post found!');
    error.code = 404;
    throw error;
  }
  if (post.creator._id.toString() !== req.userId.toString()) {
    const error = new Error('Not authorized!');
    error.code = 403;
    throw error;
  }
  const errors = [];
  if (
    validator.isEmpty(postInput.title) ||
    !validator.isLength(postInput.title, { min: 5 })
  ) {
    errors.push({ message: 'Title is invalid.' });
  }
  if (
    validator.isEmpty(postInput.content) ||
    !validator.isLength(postInput.content, { min: 5 })
  ) {
    errors.push({ message: 'Content is invalid.' });
  }
  if (errors.length > 0) {
    const error = new Error('Invalid input.');
    error.data = errors;
    error.code = 422;
    throw error;
  }
  post.title = postInput.title;
  post.content = postInput.content;
  if (postInput.imageUrl !== 'undefined') {
    post.imageUrl = postInput.imageUrl;
  }
  const updatedPost = await post.save();
  return {
    ...updatedPost._doc,
    _id: updatedPost._id.toString(),
    createdAt: updatedPost.createdAt.toISOString(),
    updatedAt: updatedPost.updatedAt.toISOString()
  };
}
```
* Lets go to our frontend react app 

```js
finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    const formData = new FormData();
    formData.append('image', postData.image);
    if (this.state.editPost) {
      formData.append('oldPath', this.state.editPost.imagePath);
    }
    fetch('http://localhost:8080/post-image', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      },
      body: formData
    })
      .then(res => res.json())
      .then(fileResData => {
        const imageUrl = fileResData.filePath;
        let graphqlQuery = {
          query: `
          mutation {
            createPost(postInput: {title: "${postData.title}", content: "${
            postData.content
          }", imageUrl: "${imageUrl}"}) {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
          }
        `
        };
        //   Edit queryschema

        if (this.state.editPost) {
          graphqlQuery = {
            query: `
              mutation {
                updatePost(id: "${this.state.editPost._id}", postInput: {title: "${postData.title}", content: "${
                postData.content
              }", imageUrl: "${imageUrl}"}) {
                  _id
                  title
                  content
                  imageUrl
                  creator {
                    name
                  }
                  createdAt
                }
              }
            `
          };
        }

        return fetch('http://localhost:8080/graphql', {
          method: 'POST',
          body: JSON.stringify(graphqlQuery),
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'
          }
        });
      })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          throw new Error('User login failed!');
        }
        let resDataField = 'createPost';
        if (this.state.editPost) {
          resDataField = 'updatePost';
        }
        const post = {
          _id: resData.data[resDataField]._id,
          title: resData.data[resDataField].title,
          content: resData.data[resDataField].content,
          creator: resData.data[resDataField].creator,
          createdAt: resData.data[resDataField].createdAt,
          imagePath: resData.data[resDataField].imageUrl
        };
        this.setState(prevState => {
          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else {
            updatedPosts.pop();
            updatedPosts.unshift(post);
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

###  Deleting Posts

```js
// delete schema 
deletePost(id: ID!): Boolean
```
* delete resolvers

```js
const { clearImage } = require('./util/file');

deletePost: async function({ id }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const post = await Post.findById(id);
        if (!post) {
            const error = new Error('No post found!');
            error.code = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error('Not authorized!');
            error.code = 403;
            throw error;
        }
        // clearImage function is derived from Util file
        clearImage(post.imageUrl);
        await Post.findByIdAndRemove(id);
        const user = await User.findById(req.userId);
        user.posts.pull(id);
        await user.save();
        return true;
    }
```
* Delete Frontend changes

```js
deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    const graphqlQuery = {
      query: `
        mutation {
          deletePost(id: "${postId}")
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Deleting the post failed!');
        }
        console.log(resData);
        this.loadPosts();
        // this.setState(prevState => {
        //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };
```
### Managing the User Status

* We're almost done.Let's make sure we can.Also the you are user status and delete it  

```js
type RootQuery {
  // Query is for getting the status
    user: User!
}

type RootMutation {
    updateStatus(status: String!): User!
}
```
* In resolver 

```js
user: async function(args, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found!');
      error.code = 404;
      throw error;
    }
    return { ...user._doc, _id: user._id.toString() };
},
updateStatus: async function({ status }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found!');
      error.code = 404;
      throw error;
    }
    user.status = status;
    await user.save();
    return { ...user._doc, _id: user._id.toString() };
}
```
* Frontend request

```js
componentDidMount() {
    const graphqlQuery = {
      query: `
        {
          user {
            status
          }
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Fetching status failed!');
        }
        this.setState({ status: resData.data.user.status });
      })
      .catch(this.catchError);

    this.loadPosts();
    
  }

// statusUpdateHandler request 
  statusUpdateHandler = event => {
    event.preventDefault();
    const graphqlQuery = {
      query: `
        mutation {
          updateStatus(status: "${this.state.status}") {
            status
          }
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
    .then(res => {
      return res.json();
    })
    .then(resData => {
      if (resData.errors) {
        throw new Error('Fetching posts failed!');
      }
      console.log(resData);
    })
    .catch(this.catchError);
  };
```

### Using Variables

* Now finally before we leave that module there's one thing we can optimize now

* Whenever we pass a dynamic value to our graph all the queries , we currently do use the interpellation syntax like below

```js
const graphqlQuery = {
      query: `
        mutation {
          updateStatus(status: "${this.state.status}") {
            status
          }
        }
      `
    };
```

* But this is indeed not the recommended way of adding variables into our graph kilocalories.There is a better way.

* Maybe you all to remember that for mutations we had to add mutation like above.but we won't add 'query' like 'mutation'.if you would have added a query like i said we would have got an error.

* Well now I will add it, because now I will also add something else.
I'll gift this query a name.

* a name that does not really make a difference it does not make it behave differently.

* So here we are of course getting all posts so here all named as fetch posts and you can give us any name you want. So this year is totally up to you.

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
  const graphqlQuery = {
    // this is graphQL syntax here. This will be parsed on the server. This is not javascript code that runs on a client.

    // This will only tell our graphQL server that we have a query which will use an internal variable.

    // it has to start with the dollar sign
        query: `
          query FetchPosts($page: Int) {
            posts(page: $page) {
              posts {
                _id
                title
                content
                imageUrl
                creator {
                  name
                }
                createdAt
              }
              totalPosts
            }
          }
        `,
        // second property which passes page variable, we are passing this page variable to query
        variables: {
          page: page
        }
      };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Fetching posts failed!');
        }
        this.setState({
          posts: resData.data.posts.posts.map(post => {
            return {
              ...post,
              imagePath: post.imageUrl
            };
          }),
          totalPosts: resData.data.posts.totalPosts,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };
```
* similaly we will use in all other places

```js
statusUpdateHandler = event => {
    event.preventDefault();
    const graphqlQuery = {
      query: `
        mutation UpdateUserStatus($userStatus: String!) {
          updateStatus(status: $userStatus) {
            status
          }
        }
      `,
      variables: {
        userStatus: this.state.status
      }
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Fetching posts failed!');
        }
        console.log(resData);
      })
      .catch(this.catchError);
  };
```
* Similarly ...

```js
// !!!!! important **** types here we assigning with variable should match with the schema
let graphqlQuery = {
          query: `
          mutation CreateNewPost($title: String!, $content: String!, $imageUrl: String!) {
            createPost(postInput: {title: $title, content: $content, imageUrl: $imageUrl}) {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
          }
        `,
          variables: {
            title: postData.title,
            content: postData.content,
            imageUrl: imageUrl
          }
        };

        if (this.state.editPost) {
          graphqlQuery = {
            query: `
              mutation UpdateExistingPost($postId: ID!, $title: String!, $content: String!, $imageUrl: String!) {
                updatePost(id: $postId, postInput: {title: $title, content: $content, imageUrl: $imageUrl}) {
                  _id
                  title
                  content
                  imageUrl
                  creator {
                    name
                  }
                  createdAt
                }
              }
            `,
            variables: {
              postId: this.state.editPost._id,
              title: postData.title,
              content: postData.content,
              imageUrl: imageUrl
            }
          };
        }
```



