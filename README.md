# Node-Js

## Application Type

### Which kind of application ??

* 1. Server side rendered view - Vannila HTML, Template Engine(EJS)

* 2. API - GraphQL, REST

* when we look at it from a technical perspective. In both kinds of applications we start a normal node server and we use a node framework.
In this case the most popular one express and therefore these types of applications have the same hosting requirements.

* We dont have to make a difference here because in the end when we move our code to a web server then, there we also just want to do the exact same thing we did locally will start our node server and wait
for incoming requests and therefore we dont have to differentiate between these kinds of applications.

* When it comes to deployment we simply deploy our code start to know its server and we are good to go.

### Deployment Preparations

* Now this obviously always depends on the kind of application you're building.

* In general you want to use something which is called environment variables - use environment variables instead of hard coding
certain values like API keys. port numbers passwords and so on into your code.

* Also make sure that if you are using some third party services like stripe that you use the production API keys and not the development keys.

* Now we also might have some mechanisms to handle errors or log something and there we want to make sure that we reduce the error output details. We don't want to send sensitive info to our users.

* Regarding the responses your application sends you want to make sure that you set secure response headers. There are some response headers you can add to any response which don't hurt, which prevent the declines from doing certain things and so on and they are for setting these headers won't hurt.we will see that shortly...

* Now in a typical node application you might also be serving some assets some javascript some CSS files and they're adding compression can be a good idea because that will reduce your response size or therefore also your response time because the client has to download less.

* You also want to configure logging so that you are aware of what's happening on your server. Since we're now not testing the testing anymore but real users do interact with it we certainly want to log interactions into log files that we can look into at any time. We feel like it.

* And last but not least SSL/TLS. So encryption off data in transit is also something we will see shortly.. for our learning we used HTTP server and therefore our communication with the server was not encrypted for testing this is obviously fine. Now for a production ready app it's strongly recommended that you do encrypt your connections and therefore we will see how to turn data on in your node express application.

* It's also worth mentioning that the last free points year compression logging and SSL are off the handled by your hosting provider and I will talk about that when we choose a hosting provider because often are typically you want to use some managed service where these things are all managed for you so that
you don't have to worry too much about that.I'll still show you how to enable it manually but it might be worth noting that you probably don't have
to do that when deploying your application.

### Using Environment Variables

* So does this not the rest API does not grant you an API. This is a shop(ejs) as we built it.Let's first of all explored that environment variables thing I was talking about.

* what would we control in an environment variable. And what is an environment variable 

* Now environment variables are a concept supported by no chase where we can pass certain configurations certain values into our node application from outside.So we don't hard code certain values into our node code.

* Instead the values will be injected when our node service starts and that allows us to use different
values in development and production and also to conveniently change the values in production without having to redeploy our entire code. 

* eg : MONGODB_URI here we are hardcoding password and user name, and also in app listening port. but in production we want to let our server or our hosting provider set this port details and another example is stripe API key

* So let's use some environment variables and using them is straight forward.

* And now here we can access environments variables on the "process" object and this object is not defied by us but this is globally available in the node app.

* Now on this proses object we have the env object , that is now an object with all the environment variables.

* This node process knows there are a bunch of default env variables but we can also set our own ones.

```js
const MONGODB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ntrwp.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
```

* regarding port 

```js
mongoose
  .connect(MONGODB_URI)
  .then(result => {
      // 3000 is default value
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
```

* Now for stripe

```js
const stripe = require('stripe')(process.env.STRIPE_KEY);
```

* Now we do try to read these environment variables in our node code. How can we now pass them into node ? while we do that when we run our node application, with nodemon we can provide a configuration file.

```js
// nodemon js
{
    "env": {
        "MONGO_USER": "guna",
        "MONGO_PASSWORD": "0987654334567",
        "MONGO_DEFAULT_DATABASE": "shop",
        "STRIPE_KEY": "sk_test_T8OE02SHDZWLwk4TYtrWlsat"
    }
}
```
* Now these are still the development values but nonetheless we have that set up.

* Now of course we're not always using gnomon and especially when deploying to app will not be using it because there we don't want to restart the server on every change because it will not change to code anyways, what I'll do is I'll add a new start script to my package.js

```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js",
    "start-server": "node app.js",
    "start:dev": "nodemon app.js"
},
```
* And typically when using a hosting provider you can set up the environment variables in the dashboard
of your hosting provider.That is something we'll see later.

* But if you're not using that(nodemon) well then you can. As a simple solution simply take decide value pairs you want to set up and add them in your package.json in front of the start script.

```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "NODE_ENV=production MONGO_USER=maximilian MONGO_PASSWORD=9u4biljMQc4jjqbe MONGO_DEFAULT_DATABASE=shop STRIPE_KEY=sk_test_T8OE02SHDZWLwk4TYtrWlsat node app.js",
    "start-server": "node app.js",
    "start:dev": "nodemon app.js"
  }
```

* because express js we'll actually use that by default to determine the environment mode and if you set that to production express js will change certain things. And for example it will reduce the details for errors it throws and in general optimized some things for deployment.So you want to set those when running your app in production.And again hosting providers typically do that for you.

###  Using Production API Keys

* Now I did mention that you also want to exchange testing keys for production keys, Now you need to activate your account to production mode , for that you have to fill out some information including some payment information.and once you filled it out you will be able to switch that toggle from test to production for life data production ready

### Setting Secure Response Headers with Helmet

* Now we already prepared some things for production.

* Let me now dive into that secure a header's thing and for will use a third party package which is called helmet and you can use it to secure your node express applications.("https://github.com/helmetjs/helmet")

* And in the end what this will do is this package will add certain headers to the responses you sent back and it follows best practices for doing so.

* You'll see which attack patterns or which security issues these are against which it protects you by
setting the right headers.("https://helmetjs.github.io/")

```js
npm install --save helmet
```
* you can use by simply including it as a middleware and then it will automatically run on all incoming requests 

```js
const helmet = require('helmet');

app.use(helmet());
```

* Then run our app in terminal

```js
npm run start:dev
```
* Then if you inspect developer tool we could some special header which were added by helmet.

### Compressing Assets

* Now with response headers added let's make sure we serve optimized assets and for that we can use another
package.("https://github.com/expressjs/compression#readme")

```js
npm install --save compression
```
* Add this in app.js

```js
const compression = require('compression');
// Now you can configure it as mentioned in the official docs but you can just run it like this.
app.use(compression());
```
* This will reduce file size, So this is compression in action and this is worth considering especially in apps where you have a lot of CSS and javascript code you are serving to your users or in general where a lot of files are served to your users by the way. Image files are not compressed here because that actually makes it longer to load them. But this is a nice addition.

* I also want to note that again most hosting providers you might want to use have some support of compression built in or might at least offer this compression support which you can conveniently add there.

* So then they will compress assets on the fly and you don't have to do it with your own middleware and then you actually shouldn't do it.But in case your hosting provider does not support it or you're building your own server then this is a nice middleware which you can add.

### Setting Up Request Logging

* For logging i will install a new package called morgan.("https://github.com/expressjs/morgan#readme")

```js
npm install --save morgan
```
* Let us import morgan and use it as a middleware

```js
const fs = require('fs');

const morgan = require('morgan');

// Now you find more in the official docs that simply defines which data is being locked and how it's formatted all go with combined.

// flags 'a' means append

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// accessLogStream - file to save logs..

app.use(morgan('combined', { stream: accessLogStream }));
```
* But also as mentioned on the slide often logging is done by our hosting providers. So then this might not matter for you if you want or have to do it manually though this is a nice package where you can of course configure more as you can see in their official docs which allows you to log.

* For a more advanced/ detailed approach on logging (with higher control), see this article: https://blog.risingstack.com/node-js-logging-tutorial/

### Setting Up a SSL Server

* Now lets see SSL/TLS and TLS is simply newer version of SSL, SSL is the term  more people know however both is about securing your data that is sent from a client to the server 

* because when we communicate between client server we typically exchange data. Now we can have an attacker third party whose ease dropping on that data is technically possible.therefore does attack or could read your data which you're sending from the client to the server(Eavesdropping) which is of course a problem. If we're talking about credit card data or anything like that.

* Hence we want to protect that data and we do that with SSL/TLS encryption.

* Now one such encryption is in place eavesdropping is not possible anymore,because while the data is unreadable as long as it is in transit.

* now to enable that encryption and to be able to decrypt it we work with a public private key pair.Both is known to the server.

* Now that public key is as the name suggest not something we have to protect the private key is however the private key will ever only be known by the server because the private key will later be important for decrypting the data. The public key will be used for encrypting.

* now in SSL certificate. We bind that public key to the server identity.

* The server identity is simply something like the domain the admin email address you set that data when you create a certificate

* That SSL certificate therefore connects a public key and a server and send that
to the client to the browser so that the client also aware of the public key and know that it is belongs to that server.

* you can create your own SSL certificates too and will do that in this module.

* But when you create your own keys then the browser does not actually trust you that information in there is correct and that is when you get informations or warnings like hey does page uses SSL but doesn't seem to be secure. Do you really want to visit it.

* Hence in production you would use the certificate provided by a known certificate authority which browser trusts and therefore you have a real secure and trusted protection.

* We have that public key part of that certificate,  certificate idealy is not created by you, but by a trusted authority we will create it on our own though because that will be free.

* that public key is then received by the client through the certificate and now the client can encrypt the data which it sends to the server and the server can decrypt the data with that private key and only that private key can decrypt that data.

* And this is how that works and how that secures your data in transit.(Refer SSL Image)

* Now let us see how it works in practice, Now to set up a SSL connection on your own server with their own certificate.Again you should get one from an authority once to apply that to production but for testing this we can definitely play around with our own one.

* We need to create a certificate and we do it with a command

```js
// on mac and linux you have that available by default. On Windows you don't. But you can find it by googling for open SSL windows
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```
* On enter this will ask couple of questions. And one important value is just common name.You must set this to localhost otherwise the certificate will not work because this has to be set to your domain.

* So if you were to use your self-signed certificate on the server you deploy your app to and you host this app on example.com then then you would have to set this to example.com

* Again typically you request a certificate for your domain by some authority and then they will do this for you. But if you create your own one used the domain your app is running on and locally that is localhost and this certificate will be denied and he will not be accepted, If you set this to another value.

* you'll find two new files and folder service cert which is the certificate and server key which is the private key, now  a private key will always stay on your server.The certificate is what we send to the client in the end.

```js
// in app.js

// Thus far we directly or indirectly through app listen to http , Now we'll use HTTPS 

const https = require('https');

// you can read a file synchronously. Now this will block code execution until the file is read, and we learned that typically this is not what we want to do.

// But here I actually don't want to continue with starting the server unless I have read that file.So here I will read  file synchronously

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

mongoose
  .connect(MONGODB_URI)
  .then(result => {
      // here we will not use app.listen we wil use https listen
    https
      // createServer to create https server
      .createServer({ key: privateKey, cert: certificate }, app)
      .listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
```
* browser does not accept that custom or that Self-Signed Certificate as you learned. But if you click on advanced your you can proceed to localhost and now again the browser does warn us because it does not like our self-signed certificate. But technically we are now using SSL protection and this is how you enable it.

* typically you would set this up differently.You would let your hosting provider set this up because technically the hosting provider often also has its own service in front of yours and the servers of the hosting provider then use SSL and the traffic between your app and the in-between servers that use HTTP because it's blocked or it's not available to the public anyways and the hosting providers front services would implement this logic

* so you wouldn't write that code on your own. And indeed here I will fall back to my old code where I just had app listen because we'll need that later when we deployed because we will let our hosting provider manage SSL. But if you ever need to do it manually is how you do start a node server in HTTPS Mode.

### Using a Hosting Provider

* Let's finally deploy and for that I will use a hosting provider called Heroku.

* But let me also say that there are dozens hundreds thousands of hosting providers you could use and it's impossible to cover them all.
So I will try my best to show you the general steps of the alignment and to explain how it works in general.

* You can created account by simply signing up again. That is free.("https://www.heroku.com/"). Hiroko is a hosting provider.

* we typically use hosting providers like Heroku but also like AWS For example, there we take our code and we deploy it on it to managed spaces on their computers also often called word virtual servers

* and this means that these providers have very large and powerful machines in their data centers and you typically dont rent an entire machine though you could do that.

* But apart on that machine.So part of the hard drive and some resources which are then provisioned for your managed space and your
code runs totally separated from the other apps which might be running on the same computer on the same server.

* Your app runs separated from them and now you of course want to connect your app running on that virtual servers with your users

* Now typically you don't directly connect your space on that machine to your servers though that is also possible on some providers.

* But instead a lot of providers manage a lot of the heavy lifting for you and they give you their own managed service you could say in front of your server where you can conveniently add SSL interruption compression logging or load balancing which means that when you have multiple virtual servers because you wrapped this really doing well and you need more resources

* that in such a case incoming requests are sent to service with available capacities in an efficient way.So that is all handled by so-called managed service which are typically invisible to you which you don't configure  but which are part of the hosting provider package.

* and you just use a nice user interface provided by the hosting provider to set up how your app behaves.Regarding SSL or regarding logging and so on.

* Now this all runs in a private network which means that your own server and your code is not directly exposed to the web but it's exposed to that managed server which then in turn talks to the web and they offer to your users through a public server a gateway.

* And that essentially is like a door where requests can come in there and then forward it to your server to your virtual server.

* So this is how this works. This is how most hosting providers work.
That is what happens behind the scene

* Just important for you to know. Not really a lot of stuff you have to do on that. Now that is the behind the scenes stuff. Now let me show you how Heroku works and how we can play with it.(Refer Hosting Provider image)

### Understanding the Project & the Git Setup

* Click on sign up create a new account enter your data and you should end up on a similar dashboard  "create new app "

* First of all we can ignore the pipeline feature here. The deployment method will use Hiroko get. Now what does get get is a tool which is not part of Heroku but used by Heroku get a version control system and as such it's a tool which you can use. It's totally optional but it helps a lot with saving and managing your source code.

* important features commits are basically snapshots of your code which you can take.But when you can always switch so you can always go back to the older worship of your code.

* But when you can always switch so you can always go back to the older worship of your code and have a look at it and then go back to your most recent one or rollback to an older commit.So this allows you to revert to older snapshots easily or while safely edit your code because you can always go back.

* Branches also allow you to not just have one history of snapshots but multiple histories for different workings of your code.

* ###### GIT version control tool ######

#### A Deployment Example with Heroku

* First step install heroku 

```js
brew install heroku/brew/heroku
```

* Next step is login cmd

```js
heroku login
```

* the next step is to turn your codebase. So your project you have been working on in a git repository so that you can add git as a remote git repository and apply to it.

* Just follow heroku git cmd.

* Make sure that you also add a new file and that is Heroko specific.
The proc file without a file extension

```js
// Procfile
web: node app.js
```
* this will instruct you Heroku to execute your app.js file when it tries to run your application.

* Now for different hosting providers this might differ of course and there you simply have to check their documentation

* Make sure you add a dot. Good ignore file because this will tail get which folders.It should not actually include in its snapshots.

* do commit and push

* Now with that you can go back to your dashboard and click on over there and you should see that succeeded build and you can now click on open app. This will open your app in a new tab and most likely this will not really succeed.

* because all our node environment variables which we rely on for example to connect to the database are now not set anymore because in the proc file we instruct app.js

* And this will not pass the environment variables only one environment variable is passed by default by Heroko and that is actually node env.And this will be set to production. That is something they do for you but all the environment variables are not set.

* Now we have to do it on our own by simply grabbing these names and going back toward dashboard and there on the dashboard. You want to go to settings for your app and then go to "Config Vars"

* and there you can now add your own config vars which are essentially the environment variables that are passed into your application.You simply add them here step by step as key value pairs.

* And now we have all these environment variables added here.

* we also need to change something on our mongoDb to set up in our case here because we are using that hosted mongo db atlus solution if you remember and there you have to remember that under security you have to white list IPs which are allowed to connect.

* Now you need two white list IP off your running application.

* And the thing about Heroku and its basic version here is that we don't have a static IP assigned to our project.

* Instead it's a dynamic range.

* Now attached you find some resources that help you for example assign a static IP if you have such a range. We only can do one thing on an IP address.

* We can allow access from anywhere.Keep in mind we are still secure by username and password but still for a better set up I would recommend that you also ensure that you sign a static IP.

* Now if that changed go back to your overview dashboard of your app and restart your server there by going to more restart

* So essentially you should be able to interact with it just as you were able to do with that locally.But now it's running remotely.
And as you can see it's automatically served by https

### Storing User-generated Files on Heroku

* Here's one important note about hosting our app on Heroku!

* The user-generated/ uploaded images, are saved and served as intended. But like all hosting providers that offer virtual servers, your file storage is not persistent!

* Your source code is saved and re-deployed when you shut down the server (or when it goes to sleep, as it does automatically after some time in the Heroku free tier).

* But your generated and uploaded files are not stored and re-created. They would be lost after a server restart!

* Therefore, it's recommended that you use a different storage place when using such a hosting provider.

* In cases where you run your own server, which you fully own/ manage, that does of course not apply.

* What would be alternatives?

* A popular and very efficient + affordable alternative is AWS S3 (Simple Storage Service): https://aws.amazon.com/s3/

* You can easily configure multer to store your files there with the help of another package: https://www.npmjs.com/package/multer-s3

* To also serve your files, you can use packages like s3-proxy: https://www.npmjs.com/package/s3-proxy

* For deleting the files (or interacting with them on your own in general), you'd use the AWS SDK: https://aws.amazon.com/sdk-for-node-js/

### Deploying APIs

* Now this of course was our shop application. It was not the rest API and not graphql API. actually deploying these does not differ there. we can deploy it in exactly the same way.

* The only thing that will differ is that we can't really click Open app anymore.since this is just API 

* Well we can but then on the starting page will not see much because there are no service side rendered views.

* Instead we have the API running where we can send requests to and will then be our front end application or our mobile application where we have to adjust.You are able to send the request to our now running hosted application and not to localhost anymore.

* And then the front end app or the mobile app is deployed differently anyways.

* A mobile app is sent to your users for the app stores as a front end application as this one built with react typically is deployed as a static web application and that is something you can learn 

* You simply built this project with the build script you can find in package.json

```js
npm run build
```
* And then you would take that code. In this case in the build folder and shipped that to a static web post like for example AWS as free and then serve your app on a totally different server then your node application is running on because as you learn many times in this course there is no strong relation between your node API and your Front-End mobile app whatever it is.

