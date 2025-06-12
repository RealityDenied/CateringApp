const app = require('./app');  //anything exported in app will get imported in index.js
const db = require('./config/db.js');
const UserModel = require('./model/user.model');

const port = 3000;

//root route
app.get('/' , (req,res)=>{
    res.send("Hello World .. Test code");

});

app.listen(port,()=>{
    console.log(`It is working in localhost ${port}`);
});


