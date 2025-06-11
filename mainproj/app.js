const express = require('express');
const body_parser = require('body-parser');
const userRouter = require('./routers/user.router');
const cors = require('cors');

const app = express();      // ✅ create app first!

app.use(cors());            // ✅ now use cors
app.use(body_parser.json());
//It creates objects from JSON data in the request body and makes them available in req.body.
app.use('/', userRouter);

module.exports = app;
