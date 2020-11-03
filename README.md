# Node-Js

## Modern JavaScript & NodeJS

* What are ES Modules?

* Well, in the end, it's a concept coming from the browser side JavaScript code.

* There we can also import and export files. And it's relatively new that we can do that there. Six years ago, that wasn't really a thing in the browser side. But now, we can import and export there,

* in modern JavaScript in the browser, the import/export syntax does not look like the syntax we use in Node JS.

* Instead, in the browser, we export something from one file to another file, with this syntax, and we then import it in that other file with this syntax.

```js
export const doSomething = () => { ... };
```
* Once export we then import in other file with this syntax.

```js
import { doSomething } from 'my-file';
```
* Refer Node Es Modeule : https://nodejs.org/api/esm.html

## Working with ES Modules & Node

```js
//Response Handler
const fs = require('fs');

const resHandler = (req, res, next) => {
  fs.readFile('my-page.html', 'utf8', (err, data) => {
    res.send(data);
  });
};

module.exports = resHandler; 
```
* In App.js we could use response handler as

```js
//app.js
const express = require('express');

const resHandler = require('./response-handler');

app.get('/', resHandler);

app.listen(3000);
```
* Till now this is the usual way of handling..

* Now, how can we switch to the more modern or alternative new syntax?

* There's one important thing I wanna draw your attention to though. You see the stability is experimental at least at the point of time we are using now.

* This means that the exact implementation could change. It also means that you should reconsider whether you want to use this in production or no. That is the reason why the vast majority of projects don't use the syntax.

* You can use a though, it should work and it is definitely worth a closer look because you'll see pretty much the same import export syntax on the client side in the browser

* hence whatever you learn here will also be useful for browser side JavaScript code. Or if you already learned about ES module there, it'll be easy to get started with them in node projects.

* Now, how do we get started? To get started we first of all need to enable this syntax and there, we got two main ways We've got three ways, but we can ignore the third one for now.

* One way of using these imports is that we rename our files from .js to .mjs, where the m stands for a module.

* Instead the second alternative is that we keep dot js as a file extension, which I'd like to do here and instead in the nearest package dot json file, we should make sure that the type property or the type configuration is set to module.

```js
{
  "name": "complete-guide",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module", // type module
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  }
}
```
* Now let us us module import

```js
// app.js

// const express = require('express');
import express from 'express';

// const resHandler = require('./response-handler');
import { resHandler } from './response-handler.js'; // here we do have to add .js extention not to the third-party library but our own files we have to add.

const app = express();

app.get('/', resHandler);

app.listen(3000);
```
* similar we could change export also 

* Instead of exporting with module exports we now use the export keyword, which exists in modern JavaScript,

```js
// const fs = require('fs');
import fs from 'fs';

export const resHandler = (req, res, next) => {
  fs.readFile('my-page.html', 'utf8', (err, data) => {
    res.send(data);
  });
};

// module.exports = resHandler;
// export default resHandler;
```
* and we export it to response-handler. However, we can't use it like this. Instead, we now either have to add it a right in the line where we define the function or the variable which we want to export or we use exports default. So this variation of the export down there.

* If we have multiple things that we want to export, we can't use export default because that is only usable once per file So if you got only one thing you want to export, you can use it. If you've got multiple things, you can't use it. A little bit like module exports, we can also only use this once and if you have multiple things, we need this exports dot syntax if you remember.

* we can export one thing with a default, but we can always export one but all the multiple things by adding export right into line where we define the variable or constant that we want to export.

* when we don't use default, we have to change our import syntax. Instead of importing like this, we now have to remove this name here and use curly braces instead, and between those curly braces, you repeat the name of the constant or variable or whatever it is,which you want to import.

```js
import { resHandler } from './response-handler.js';
```
* With a named export, so where you have the export keyword right in the line where you define a constant or variable, the name is no longer up to you. Now you need to curly braces and you need to use the exact name of what was exported then.

### More on ES Modules

* Now the new import export syntax becomes interesting once we use some node J-S globals. sNow what do I mean by that?

* Let me show you. I'm sending back the content of my my page html file and I'm doing this by reading it in with the file system. We can absolutely do that, it works as you can tell, but we could also send back the file in a different way.

```js

// Alternatively it just turns out that the path module does two things.
// It exports the entire path object so that we can import it like this basically as a default
// but alternatively it also exports all the methods we can call on path as standalone named functions.

// So first your default import and then separated with a comma the named imports this would all be possible.

import path, { dirname } from 'path'; // import path and dirname(standalone named functions) from path core module 

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // import.meta.url is basically a globally available variable you could say which gives you the path to this file name.(current file name ie response-handler.js)

// fileURLToPath just converts that URL to a path with which the path package then is able to work.

const __dirname = dirname(__filename); // __dirname the path to the current working directory

// And the dirname function provided by the path package just takes such a path to the current file to basically give you the path to the current folder in which this file sits

export const resHandler = (req, res, next) => {
  res.sendFile(path.join(__dirname, 'my-page.html')); // construct such a absolute path join then we concatenate the different path segments. 
};
```
* we cant directly give file path in the senFile function the path must be absolute in the end. Now we learned how we can build an absolute path throughout this app because we had various places in our code where we needed such an absolute path.

* "__dirname" of course was a global variable reused multiple times

* With the modern ES module syntax, it does not work anymore because there are no globals anymore with this syntax.

* So these global variables like dirname or file name which you could use with the other import export syntax with the require function, that does not exist here anymore.

* What we need is more imports from core node modules and then we can construct our own dirname variable in the end based on this (import.meta.url) special pseudo global variable we can access 

* Now why did I show you this? Because it's important to be aware of the fact that those global variables which you can use with the other import export syntax are not available with this new syntax but that you also understand how you can rebuild them and still use them.

* And that's the modern E-S modules import export syntax.

* I also mentioned already is experimental at the moment as the node team says itself in the official docs and that the vast majority of node projects out there will use that other syntax. So if you're joining a team working on some node project you need to be aware of that other syntax.

* Nonetheless this modern syntax is also pretty nice and it's not too difficult to switch to it 

### Node Core Modules & Promises

* I mentioned one other modern feature which we can use a node now, which I didn't use

* And that would be promises in core APIs. And that's important. I did use promises we have whole modules dedicated to promises and async await. So you absolutely should know what promises are, how they work and why we use them by now. We use them because a lot of third party libraries and also our own code can of course utilize promises to handle potentially asynchronous operations.

* Now there is one part of the node apps we wrote thus far, which doesn't really leverage promises and that would be the core APIs baked into node.

* I'm talking about things like read file from the file system module. There we use this callback based approach.

* And the reason for that is very simple, when Node.js was created, promises simply weren't a thing, they didn't land in mainstream JavaScript yet, that's why Node.js and its core APIs are callback based.

* Now, of course, here, we're using a different approach of sending the file back anyways.But if we switch back to the previous approach, and if you had some operation that needs to read a file or do anything else with a core node module, you might wish to be able to use a promise instead of this callback approach which you're forced to use unfortunately,

* while there are good news, a lot of core APIs baked into node now also have promise support.

* In documentation we see that there is a fs Promises API.And essentially, that's all the file system features here, now available in a promise based version.

* So for example, we also have a write file method now, which actually embraces promises so that we can use promises with these core APIs. And a lot of the built in core APIs have such a promise version.

* How do we use that?

* Well, we need to import the file system slightly differently. Instead of from fs, we import from fs/promises.

```js
// const fs = require('fs/promises');
import fs from 'fs/promises';
export const resHandler = (req, res, next) => {
    
  fs.readFile('my-page.html', 'utf8') // And instead use then and catch or async await whatever you prefer,
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
```
* And that's of course pretty nice because now we can use all the promise advantages, like promise chaining to escape callback hell, on core APIs like this one as well.

* We again see our file being served here, we see our page being loaded, but now with the promise based version of this core node module. Now just as the new import syntax, it's 100% optional. It's not better than the average approach, you might simply prefer it because you might prefer promises, especially if you chain multiple promises for example.