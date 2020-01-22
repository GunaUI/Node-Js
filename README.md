# Node-Js

## Testing 

### What is testing ?? 

* Manual testing is super important but there also is a downside.It's easy to forget to test something.And that is where automated testing comes into picture that means we write code that tests our code.

* So we define steps that are executed. We define certain scenarios that are tested and we automatically run these tests on every change or
offer every important change we made.So we can run them whenever we want.We can even put them into our deployment process and run them right before our app gets deployed.

* The big advantage of automated testing therefore of course is that we can cover all core features and we can find all possible scenarios you want to test and therefore really make sure that we don't introduce
breaking changes.

* But of course there are downsides to automated testing too.If you ride the wrong tests then you might have a good feeling because all your tests are passing but maybe you're just testing for the wrong things for the wrong scenarios.Additionally while you only test what you define end it's also hard to test the user interface.

### Why & How?

* automated tests allows us to automatically test everything and there
is a star behind that because we only test what we define so only the tests we write.But in theory it allows you to test everything in your application.

* After every code adjustment after every code change therefore it's easy to detect breaking changes even in places you might not have expected to break upon your latest changes.

* And with automated tests we ensure that we have predictable clearly defined testing steps.

* Our tests obviously always run in the exact same ways and we define all the steps in code and that of course ensures that we can rely on the scenario always being the same.

* If you are manually testing your app you might think you're doing the same thing as you did the last time.But in reality you might not be doing that because you forgot a step.So that is why you should test.

* How do you then set up your node project for testing. for that you typically need a couple of tools.

* It should also give you a nice output that tells you whether your tests all pass or if a test failed.this is the first tool

* The second tool is one that does not just run our code but that also allows us to define certain conditions that have to be met.So we want to validate the test outcome.

* but for running these tests one popular framework is "mocha" and we'll use mocha.

* for asserting the results and defining conditions "Chai" is a popular choice and we'll use that in this module too.

* one other tool we need when it comes to managing side effects or working with external dependencies or certain complex scenarios.
There will use "sinon" which is a tool that allows us to create steps or mocha.

### Setup and Writing a First Test

* Now obviously testing different kinds of node applications like a graph QoL API all have their own specialties and special complexity and this is only an introductory module

* here the core ideas the core concepts the way of thinking about testing and the general setup that will always be the same no matter which node application you're building and therefore is the super important start into testing that you need to then really master testing.

* first of all have to set up our testing environment with mocha ("https://mochajs.org/")and chai ("https://www.chaijs.com/"). 

```js
npm install --save-dev mocha chai 
```
* These are two tools we need to get started. So let's install them here and let's wait for that to finish and with the installation process finished. Let's start writing our first tests now for that
First of all let's go to the package.json file in there you should have test script.

```js
 "scripts": {
    "test": "mocha",
    "start": "nodemon app.js"
  }
```
* This dependence you just installed without any other configuration.

* Now you can run

```js
npm test
```
* this will now run all your tests you defined in this project.But of course here it's going to complain that it didn't find any test files.
The reason for that is that mocha by default looks for a folder named test.So let's add one and it has to be named "test" not testssssss.

* Now let's start very simple and I'll name it starts.js.

```js
// start.js
// We import function of this named expect you do this by requiring chai and there the expect function.
const expect = require('chai').expect;
// it is a function provided by mocha

it('should add numbers correctly', function() {
    const num1 = 2;
    const num2 = 3;
    // chai object
    expect(num1 + num2).to.equal(5);
})

it('should not give a result of 6', function() {
    const num1 = 3;
    const num2 = 3;
    expect(num1 + num2).not.to.equal(6);
})
```
### "it"
* Now "it" might look like a strange function name but the idea here is that you give your tests name and they read like plain English sentences because indeed it takes two arguments and the first one is a string which simply describes your test.

* And this is something which you'll later see as an output for your test which will help you identify which tests failed and which tests succeeded.So obviously this should be a title that kind of describes what's happening in the test.

### "expect" chai condition

* So how can we now check if our tests exceed succeeded. How can we now define success condition.Well that happens with the help of Chai 

* mocha is responsible for running our tests and for giving us this it function that defines where we define our test code.

* Chai is responsible for defining our success conditions and for this we just need to import something from Chai here.

*  if you dive into the guide here or into the API docs well then of course you can learn all about expecting and you can see what you can change so that you can say to equal to B or whatever you want.

### Testing the Auth Middleware

* We're testing some dummy code and we're defining everything our test relies on directly in the test.They have this test runs stand alone totally detached from our application and whether the test succeeds or fails it only depends on the testing code itself which of course is a test you should admit. It's not a helpful test.

* In reality you want to test your application code and you want a test code that's not entirely defined here and your test instead in your tests you typically only define your success condition.

* You can by the way  have multiple success conditions multiple expectations and you might define any additional setup you need for that test.

* let's write a more realistic and more helpful test.

* of course want to call our off middleware manual here because we're not simulating a full request flow. We're not simulating a click of the user which then sends a request which then triggers the middleware.

* We just want to test our middleware function. This is called a unit test by the way we test one unit of our application.

* An integration test would be where we test a more complete flow.

* So where we maybe test whether your request is routed correctly and then all of the middleware and then also the controller function but you don't test that too often because it's very complex to test such long chains.

* There are multiple things that could fail. And by writing unit tests it's way easier to test different scenarios for each unit.

* And if all your unit tests succeed you have a great chance of your overall application working correctly. And data from writing unit test is very helpful. If a unit test fails it's also easy to find out why it failed. If you have a lot of steps and involved it might be harder to find out which step failed.

* So we're testing this middleware functional need and that of course means that we have to create a dummy request object we pass in because normally that's passed in by the Express middleware just like responds and next.

* But now since we're directly calling our middleware function we want to define our own request object and that is actually great because that allows us to define different scenarios.

* Now in reality this get method here provided by Express is way more complex of course it does not only scan headers it scans different parts of the incoming request

*  but our goal now is not to replicate the express framework,  but to test one specific scenario and here this scenario is that get authorisation does not return an authorisation header because that is what we want to test here.

```js
// auth-middleware.js

const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');

// But the first simple test could be that we want to make sure that we really get an error whenever this year does not have an authorization header

it('should throw an error if no authorization header is present', function() {
    // here I can create a request object 
  const req = {
      // headerName value of the Authorization header, but we don't really care about this.
    get: function(headerName) {
        // this means it does not return a value for our authorization call here.
      return null;
    }
  };
  // {} is empty response object
  // () => {} is next function we don't care about what it does because we're not really executing on next step here anyways.
  //.to.throw that's all just another utility method you can find official doc I expect dad to throw an error with the message

// we should not call authMiddleware directly by ourself , "bind" will enable mocha and chai to bind authMiddleware and call by themselves

  expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
    'Not authenticated.'
  );
});

```
* I don't want to call it myself.I want to let my testing framework. So want let mocha and Chai these two tools I want and let these. Call this function for me so that they can handle the flow

* So instead of calling off middleware directly ourselves here we instead only pass a reference to this function here to our expect function. we only want to bind the arguments we eventually want to pass in when our testing set up calls this function.

* Bind first of all requires input for the "this" keyword that can be this and then it has the free arguments. So we're not calling it ourselves here. We're instead passing a prepared reference to our function to expect.

* this will not succeed if we didn't throw error from our middleware
```js
// from middleware
if (!authHeader) {
    // this error message also should match with expect error message in test file,ie correct error message should be thrown
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
```

###  Organizing Multiple Tests

* Actually we are splitting token with space "bearer tokenstring" That is how we send our tokens. That is how we send that authorisation header 

```js
const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');
// describe functions there to group your tests and you can nest as many described function calls as you want. even inside describe you could add another describe with test cases.

// described grouping to make our code more readable and easier to understand.

describe('Auth middleware', function() {
  it('should throw an error if no authorization header is present', function() {
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });
  it('should throw an error if the authorization header is only one string', function() {
    const req = {
      get: function(headerName) {
          // Now it's not null anymore but it's only one string
        return 'xyz';
      }
    };
    // And I expect that to throw error now you could check for an exact error message but if you're not sure or if you only care about whether an error is thrown at all, just leave it like this without passing any argument to it. 
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});

```
###  What Not To Test!

* In is-auth middleware , what about our actual token verification now. How could we test this how can we make sure that this fails for incorrect tokens

```js
// ie here how can we test this ??
decodedToken = jwt.verify(token, 'somesupersecretsecret');
```
* Well there are a couple of important things to consider. 

* First one is, You should not test whether the verify function works correctly. Why should you not test for that ? Because this is not a function or a method owned by you.
This is coming from a third party package from json web token. We only want to test if our code behaves correctly

* Well if this is a valid token then decoded token so does object it returns us should have a user I.D.. Well if we test this it should yield a user I.D. after decoding the token if we want to recreate such
a test and we pass in our token and we hope that this is a valid token which it certainly is not just we us dummy value.

* But for this dummy value before check userId property this will throw JWT error.

* How can we shutting down that verify method ??

###  Using Stubs

* we essentially replace this verify method with a simpler method.

* we could manually override the jwt verify by calling below code before authMiddleware call
```js
jwt.verify = function(){
    return { userId : 'abc'}
}

 authMiddleware(req, {}, () => {});
```
* However instead of manually overriding Id like this there is a more elegant way because this has a huge downside.

* downside is if we override jwt.verify that will be like global overide that will affect other test cases followed by this.

* therefore instead of manually stopping or mocking functionalities and replacing them it's good to use packages that also allow you to restore the original setup for that we need sinon package

```js
npm install --save-dev sinon
```
* sinon is a package that allows us to create a so-called stub, which is a replacement for the original function where we can easily restore the original function

```js

const jwt = require('jsonwebtoken');
// we need to import sinon
const sinon = require('sinon');

it('should yield a userId after decoding the token', function() {
    const req = {
      get: function(headerName) {
          // we know that this is not a valid token
        return 'Bearer djfkalsdjfaslfjdlas';
      }
    };

    // we need some way of shutting down that verify method, otherwise for our dummy token this will throw JWT error

    // instaed of manual replace I pass in the object where I have the method I want to replace that is JWT

    // So I have two arguments here. JWT is the object that has the method verify is the actual method.Now sign and will replace that.

    sinon.stub(jwt, 'verify');

    // returns - this is now a method that was added by sinon and  returns allows us to configure what this function should return.

    jwt.verify.returns({ userId: 'abc' });

    // we are calling authMiddleware manully here
    authMiddleware(req, {}, () => {});
    // after execute authMiddleware we expect property userId in req
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    // this stub also registers things like function calls. So if you want to find out if this has been called at all.
    expect(jwt.verify.called).to.be.true;
    // after checking our expectation here we can now call JWT verify restore and this will now restore the original function.
    jwt.verify.restore();
  });
```

###  Testing Controllers

* I want to move on to our controllers which of course also house a lot of our core logic.

* for that feed controller. We have routes where we need to be authenticated.For example we need to be authenticated for creating posts.We need to be authenticated essentially for all our post related rulings.We need to be authenticated

* before we take care about that let's have a look at our auth controller. Therefore because these routes don't require us to be authenticated though does it really matter too

* how we reach our controller functions here like sign up or log in. We of course reached them through our routes which are defined in the routes.So these are the API and points we're exposing in router.

* Well we are writing units tests. We are testing units in our code just as the middleware do you auth middleware.And therefore what will not test is routing, because that entire for forwarding of the request the execution of this method is all handled by express.And as I mentioned earlier you don't want to test our libraries.

* but we could test our controller which is our own code of logics like login action
```js
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
```
* We can test whether we're able to extract e-mail and password from the incoming request though that's a test that's not too useful because we will simulate the request that's coming in. So we decide whether that is set or not but we can then test if it behaves correctly if no e-mail is set for example or if we already have a user with that e-mail.

* However there is one new complexity added. Now we have a database now we're interacting with the User model here and the User model of course is
based on our Mongoose models here. That's our user model and that behind the scenes uses Mongo D.B. and that of course brings one important question to the focus how can we test our database.How can we handle this now.

* And turns out there are two main strategies we can follow.

* strategy number one for testing code that involves database operations is that we stub or mock the parts that actually rely on database access.

*  what would this mean ?

* This could mean for example that here when we execute find one we again create a step that returns a predefined result and we then test if our code behaves correctly.

* So for example we might be interested here in finding out how our code behaves when find one throws an error. So if we're having trouble interacting with the database or how our code behaves if we don't have a user with that e-mail address when logging in.

* These are two different scenarios and we can write two different tests for that. Both scenarios should actually throw an error eventually.

```js
const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function() {
    // added done - to tell mocha to wait
    it('should throw an error with code 500 if accessing the database fails', function(done) {
         // the first tactic we can apply we can simply stub that a ways that we don't make a real database access.

         // And the important thing here of course is I'm faking that data base fail because I completely replace to find one method with a stub that will throw an error 
        sinon.stub(User, 'findOne');
        // because the actual thing I want to check is of course that we should throw an error with code 500. So I want to check whether our default status code in auth controller login action really gets applied correctly.
        User.findOne.throws();
        // So let's create our dummy Request object here 
        const req = {
            body: {
            email: 'test@test.com',
            password: 'tester'
            }
        };

        // let's have a look at the off controller again and you should now recognize that we have to async keyword in front of that.

        // It's not a normal function it's an async function and that means in the end we use promises in there.

        // You might remember async await is just a more elegant syntax for using promises.

        //So actually we have Asynchronous code in auth controller login which is a navigate complexity will have to deal with because the execution of that code will not happen synchronous.

        // And that means that by default our expectation you won't work the way you might expect it to work.
        // Now I can add then here because when you return a promise, then should now be executed once promise is done
        AuthController.login(req, {}, () => {}).then(result => {
            // here the expection is AuthController.login should throw error
            expect(result).to.be.an('error');
            // this statusCode 500 should match with controller login action status code.
            expect(result).to.have.property('statusCode', 500);
            // here done(), I signal that I want mocha to wait for this to execute because before it treats this test case as done 
            done();
        });
        // in the end I also want to call restore here.
        User.findOne.restore();
        });
});
```

### Testing Asynchronous Code

* It passes because marker doesn't wait for this test case to finish because we actually have async code in there and by default it does not wait for that async code to resolve.

*  it executes this code synchronously step by step and does not wait for this promise to resolve no matter how fast is this.

* Now of course we can tell mocha to wait we do this by adding extra argument in this function we pass to it and that's the done argument.(check above code we added done!!)

* Note this is optional and it is indeed a function which you can call so mocha gives you a function here which you can call once this test case is done. by default it's done once the execute the code top to bottom.

* I called done() and I signal that I want mocha to wait for this code to execute because before it treats this test case as done.

### Setting up a Testing Database

* But I also mentioned that there is more than one way of dealing with code that access a database. The way we deal with it thus far is that we simply stub it away.

* We create a stub for to find one method and then define what this should do for this test case and then I restore it.And that is absolutely fine.It prevents the real database access from happening here.

* And that of course might be what we want because it allows us to run our test faster and of course important.

* It also doesn't impact the database because your tests could still write data to the database and you definitely don't want this to happen in your production database at least.

* It is however a valid setup to use a dedicated testing database because of course the downside is that your tests will run a bit longer.

* The upside is that you have a very realistic testing environment.If you really hit a database and you really write data to that database and you read it from there you have a bit of more.

* You don't just have a unit test you have kind of a integration test because you have a full flow of control you have a test under very realistic circumstance

* in some cases this might be what you want and it might be easier than stubbing everything and writing a lot of stubbing code 

* therefore let me show you how you could set up a testing environment for Mongo db where you use a dedicated testing database 

* because that's important.You definitely don't want to use your production database for testing.

* You don't want to mess with your users data for testing and accidentally deleted or anything like that.

* So let's actually create a new test you're still related to the auth controller

* let's now move on to the get user status method actually to get user status controller action.

```js
exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
```
* Here test case is if there is no user status for user id throw error else just return empty.

* we need a request that has a user I.D. field because we're finding a user by that user I.D. and then we alter the response object by calling a status method on it an adjacent method.

```js
// first of all we need to connect to the database.
const mongoose = require('mongoose');

it('should send a response with valid user status for an existing user', function(done) {
    // this again needs done keyword because we used async in controller  ..

    mongoose
    .connect(
        // here i changed database to test database test-messages And that's super important. Don't use the production database.
        'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/test-messages?retryWrites=true'
    )
    .then(result => {
        // here we will write our test case
        // first of all I need that dummy user as per model
        const user = new User({
            email: 'test@test.com',
            password: 'tester',
            name:'test',
            post: [],
            _id : '5c0f66b979af55031b34728a'
        })
        return user.save()
    })
    .then(() => {
        // with that dummy setup we can add our testing logic
        const req = {
            userId : '5c0f66b979af55031b34728a',
        }
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code){
                this.statusCode = code;
                return this;
            },
            json: function(data){
                this.userStatus = data.status;
            }
        };

        AuthController.getUserStatus(req, res, ()=>{}).then(()=>{
            expect(res.statusCode).to.be.equal(200);
            // default status 'I am new!' as per user model
            expect(res.userStatus).to.be.equal('I am new!');
            done();
        })
    })
    .catch(err => console.log(err));

    })

```

* If test case timeout you could add longer timeout in package.json

```js
//  because this is in milliseconds. by default this is 2 sec we increased to 5 sec
"scripts": {
    "test": "mocha --timeout 5000",
    "start": "nodemon app.js"
  },
```
* if you run test you could see test database

###  Clean Up

* Now first of all why do I need to quit this process with control C.

* The reason for it is is that despite me calling done mocha detects that there is still some open process in the event loop and indeed there is our database connection which we open but never close.

* So one thing we should do here is when we're done with our expectations we might want to call Mongoose disconnect and only when this is done.

```js
// in test controller

AuthController.getUserStatus(req, res, ()=>{}).then(()=>{
    expect(res.statusCode).to.be.equal(200);
    // default status 'I am new!' as per user model
    expect(res.userStatus).to.be.equal('I am new!');
    // this deleteMany we used to clear db to avoid duplicate dummy data
    User.deleteMany({}.then(() => {
        mongoose.disconnect().then(() => {
            done();
        })
    })
})
```
### Hook

* That cleaner solution comes in the form of lifecycle hooks provided by mocha

* We have "describe" and "it", it are our test cases, describe allows us to group them instead of describe.

* We have certain extra functions we can call that actually will run before all tests or before each tests at the same for after and after each.

* Well let's say connecting to the database and creating one dummy user is something we want to do when
our tests run not before every test

* So we don't want to reconnect and recreate a user before every test.

```js
const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', function() {
    // before will simply run before your test cases
    before(function(done) {
        mongoose
        .connect(
            'mongodb+srv://maximilian:fmFLrH6d0DjMxWcg@cluster0-ntrwp.mongodb.net/test-messages?retryWrites=true'
        )
        .then(result => {
            const user = new User({
            email: 'test@test.com',
            password: 'tester',
            name: 'Test',
            posts: [],
            _id: '5c0f66b979af55031b34728a'
            });
            return user.save();
        })
        .then(() => {
            done();
        });
    });

    beforeEach(function() {});

    afterEach(function() {});

    it('should throw an error with code 500 if accessing the database fails', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
        body: {
            email: 'test@test.com',
            password: 'tester'
        }
        };

        AuthController.login(req, {}, () => {}).then(result => {
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
        done();
        });

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', function(done) {
        const req = { userId: '5c0f66b979af55031b34728a' };
        const res = {
        statusCode: 500,
        userStatus: null,
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            this.userStatus = data.status;
        }
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('I am new!');
        done();
        });
    });
    // After will simply run after all your test cases
    after(function(done) {
        User.deleteMany({})
        .then(() => {
            return mongoose.disconnect();
        })
        .then(() => {
            done();
        });
    });
});

```
* Besides before and after. There also are before each and after each noted differences that before each is initialization work that it runs before every test case.

* and there are all those after each in case there is some functionality which need to run after every test case.

* It could be fine to really use a database. It just should be a dedicated testing database. Now of course it's all the fine to use Stubbs as we did here.
In case you don't really need or want that database access in case you want to speed up your tests you can step functionalities.

* And you can even change it on a per test basis depending on a test needs to be faster or really doesn't care about the database access or if checking that data base code might be useful too.

* To create post we need userID , which we getting it from middleware, and we using userID as one of the object of create post param. ie it needs authentication to do create post how can we test that ?? we want to test just the controller not the entire flow.

* we can just fake that and we can pass on a request object that simply has a userID and we're done.

* So let's now write a test for a create post and let's interact with the database and also we create post sucessfully. and also validations like really this post added to our users post array

```js
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
    const savedUser = await user.save();
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: user._id, name: user.name }
    });
    // here we are returning savedUser for testing purpose
    return savedUser
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
```

* In test file

```js
const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {
    before(function(done) {
        mongoose
        .connect(
            'mongodb+srv://guna:fmFLrH6d0DjMxWcg@cluster0-ntrwp.mongodb.net/test-messages?retryWrites=true'
        )
        .then(result => {
            const user = new User({
            email: 'test@test.com',
            password: 'tester',
            name: 'Test',
            posts: [],
            _id: '5c0f66b979af55031b34728a'
            });
            return user.save();
        })
        .then(() => {
            done();
        });
    });

    beforeEach(function() {});

    afterEach(function() {});

    it('should add a created post to the posts of the creator', function(done) {
        // We need this requred fields as controller create action
        const req = {
          body: {
              title: 'Test Post',
              content: 'A Test Post'
          },
          file: {
              path: 'abc'
          },
          userId: '5c0f66b979af55031b34728a'
        };
        // *** we are not actually testing this response just to align with controller action we added this here
        const res = {
        status: function() {
          // json method applied to not on the response object but on the status object, that is why we returning 'this'

          // so that we are returning other reference of the entire object and  then has below Json function.
            return this;
        },
        json: function() {}
        };

        FeedController.createPost(req, res, () => {}).then(savedUser => {
          // savedUser is the returned data which we get from Create user controller action response
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(1);
        done();
        });
    });

    after(function(done) {
        User.deleteMany({})
        .then(() => {
            return mongoose.disconnect();
        })
        .then(() => {
            done();
        });
    });
});

```

