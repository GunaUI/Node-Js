# Node-Js

## Express Js
* Alternatives plain vannila node js , Adonis.js inspired from laravel(php framework), koa , sails... etc

### Install Express
* install as production dependency
```js
npm install --save express
```
* Now use express(app.js)
```js
const http = require('http');

const express = require('express');

const app = express()

const server = http.createServer(app);

server.listen(8000);

```
### Adding Middleware
* Expressjs is all about middleware
  <img src="readmeimg/middleware" width="200" height="200">