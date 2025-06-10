const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb://localhost:27017').on('open',()=>{
   console.log("Mongodb connected.."); 
}).on('error',()=>{
   console.log("Mongodb connection error..");
});

module.exports = connection;

