const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const db = require('../config/db');

const {Schema} = mongoose;
//it means same as -> const Schema = mongoose.Schema; It access the Schema property of Mongoose class

//now we edit the Schema property 
const userSchema = new Schema({
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

userSchema.pre('save',async function(){
    try{
        var user = this;
        const salt = await(bcrypt.genSalt(10));
        const hashpass = await bcrypt.hash(user.password,salt);

        user.password = hashpass;

    }
    catch(error){
        throw error;
    }
});


const UserModel = db.model('user',userSchema);

module.exports = UserModel;