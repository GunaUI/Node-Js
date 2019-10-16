# Node-Js

## NPM Script

* npm init
```js
"scripts": {
    "start": "node app.js"
    "guna-start-server": "node app.js"
  },
```
* npm start
* For custom name "npm run guna-start-server"

## Nodemon
* npm install nodemon --save-dev
```js
"scripts": {
    "start": "nodemon app.js"
  },
```
* npm start

## Debug
* Always make sure stop npm start before debug and also select app.js(main file) before click start debug.

##  Restarting the Debugger Automatically After Editing our App
* Make sure you installed nodemon globally also
```js
npm install nodemon -g  
```
* Make sure your debug config (launch.json) have restart value as true and runtimeExecutable as nodemon not to node
```js
{
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/app.js",
      "restart": true,
      "runtimeExecutable": "nodemon",
     "console": "integratedTerminal"
  }
```
* Ref :  https://code.visualstudio.com/docs/nodejs/nodejs-debugging
