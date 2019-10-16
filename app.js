const http = require('http');

const express = require('express');

const app = express()

app.use((req, res, next)=>{
    console.log("In the middleware!!");
    next(); //Allow the request to travel on to the next middleware in line
})

app.use((req, res, next)=>{
    console.log("In the another middleware!!")
    res.send('<h1>Hello From Express</h1>')
})

const server = http.createServer(app);

server.listen(8000);
