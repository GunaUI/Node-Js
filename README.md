# Node-Js

## Node.js as a Build Tool & Using npm

### Build tool

* But Node NPM the package manager we get for free when installing node js can also be used as a build tool.

* So as a tool that runs utility scripts on your computer and can help you with building any mostly javascript driven project and that does not have to be a web application or a service side web application, it could be a front and web application too.Like do you react app as frontend for REST and Graphql

* in this module will briefly dive into that and I'll explain why that is to case what exactly NPM is and how we can use it and how we can use node as a built tool.

### npm & Node.js

* when we install node js we get two tools or things for the price of one you could say we get node js and we get NPM node package manager.

* And remember that this was the tool we used for installing packages into our project or when I share my project like with all the code attachments that you could re-install all dependencies required by that project.

* Even though I did not shared a node modules folder because we have that package.json, where we see all the dependencies.

* so node js is a programming language we used to execute code to execute javascript code based on that node js runtime with all the features that gives us and especially important when we look at it from a built tool perspective.We have to remember that with note J.S. we were able to interact with files and this will become important.

* NPM as I said is node's package manager. So we manage packages with it and with that I mean we can install packages download them manage their versions and so on and we can also run scripts.We did that with NPM start for example to start our server so that we don't have to write or type the
full command for that.

* Now let's have a closer look at these two pieces and see what else they can do or how that can be helpful to use them in the context of build tooling so in the context of utilities scripts and not in the context of spinning up a web server.

### Using NPM

* Let's first of all understand NPM a bit better. It's notes package manager as you learn and in the end it's a CLI command line interface.

* We always used it from the command line from the terminal by running NPM and then some command mostly NPM install in this course the idea behind packages or tools like NPM.

* And every programming language has a similar concept you could say is that we might have some isolated functionality some code that we wrote or did we came up with that does something useful. Let's say it generates a random number.

* Now we can use that in our web application but maybe we want to use it in other applications as well because this isolated functionality does not depend on our business logic 

* Or maybe we want to share it with the public. Well if we want to share it internally or externally we can put it into a package with the help of NPM.

* You can use NPM not just to install packages but also to create and share packages through that NPM repository which is a cloud service where you don't have to pay for it. where you can host package as you created and does all the service where you will and you can fetch packages from with the NPM install command.

* So in this repository which is managed globally you'll find the thousands of packages obviously 

* you now have some node project you can use any of that you can use any of those packages with the NPM install command through CLI, And that is how you add packages to your project.

* No matter if that is a package shared by you and you can also have private repositories or private packages on NPM. By the way that is something you do have to pay for but you can always use public packages and share packages with the public. That's the idea behind NPM.

* you can find different versions of packaged in the npmjs.com, you can install specific version of package by below command

```js
npm install express@4.16.3
```
* If you didn't mention it will pick latest one as default

* when you put a project under control of NPM that you do with help of  "npm init"  command. that will ask you couple of questions and that will give you package.json , which you can use to configure a project and there you can not only keep a list of your dependencies. You can also add certain scripts and you can run these scripts either with NPM start to run the start script or npm run and then any script name you configured in there.

* And that is very powerful especially when it comes to using NPM in node js to build projects.

### Versioning in package.json

* When installing a package with npm install --save or --save-dev (or --save-prod, which replaces --save), you end up with entries in your package.json file, that look something like this:

```js
"express": "^4.16.3"
```
* What does the ^ mean?

* You can learn about all available version annotations/ syntaxes here: https://docs.npmjs.com/misc/semver#versions This post on Stackoverflow provides a great summary: https://stackoverflow.com/a/25861938

### What is a Build Tool?

* Node js we primarily used to spin up a web server and write code that runs on the server side

* But we have to remember that theoretically you can run any javascript code with node js and specifically you can also interact with your local file system.You can read and write files after all. And that opens up a new door a new opportunity

* We could use node js to execute utility's scripts that for example parse certain files manipulate the content and output the manipulated content back into the original file or into a new file.

* And that is the idea behind so-called built tools and that is something node js as capable of being used for.

* And it's important pointing out here that when we talk about built tooling and build workflows we mostly talk about front end web development like for example with our re-act application here this re-act application is not a node Js app but still we use a package.js file and we use NPM to install packages.

* These packages are all holding code that runs in the browser though,  and in the end the code we write here in the source older will also end up in the browser.

* But let me point out that the way we write it in our react app would not run in browsers at least not in all browsers.

* We react we are spliting our code into different component  ie  multiple files and we're using it as module import syntax for merging these files together.

* Now this does not natively work in all browsers only in very modern browsers and therefore it does is indeed not the code that will end up in the browser.

* This is the code we work though, But we use a built tool to build workflow which is stardate during development with NPM start and for production with NPM run build.

* this build workflow we'll take our code and kind of merge it together and transform it into code that runs in older browsers too. And that is also  minified and optimized, because that's all important we use build tools to optimize our code.

* we also have code that is not only too big but dad is using next gen features like here to spread operator or arrow functions and we want to work this to code that runs an older browsers too.

* If you run "npm run build" in your project here you actually start such a production of workflow which means now it's creating an optimized production bundle. And this is all done by NPM which started the script and by node.

*  now indeed if we look into this build folder this now holds our app code.So the code we wrote and source. But in an optimized way they are in the static folder we have javascript code and if we look into that this in the end is our code Just minified a lot.

* of course not the code we would like to write. It's very hard to dig through that but it is to code want to output and we use NPM and node to transform our code.

###  Using Node.js in Build Processes

* NPM is useful because we can install packages we can manage this project with our package.js file and we can of course install packages that run in the browser too.

* we can install these packages and we can import them and our files with a slightly different syntax that just happens to be primarily used for frontend development.

* Import Export syntax. With that as module style because that is actually the style that is supported in modern browsers too.

* now we also want to start a script with NPM,and now NPM's work is over and node js takes over.

### END !!!!!

* Refer slide.pdf related to this course