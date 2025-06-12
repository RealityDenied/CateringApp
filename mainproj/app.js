const express = require('express');  //installing express
const body_parser = require('body-parser');
const userRouter = require('./routers/user.router');


const app = express();  //Creating instance of it

app.use(body_parser.json());
app.use('/',userRouter);

module.exports = app; //now app will be accessible anywhere in the project
