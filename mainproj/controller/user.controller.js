const UserService = require("../services/user.services");


exports.register = async(req,res,next)=>{
    try{
        const {email,password} = req.body;

        const successRes = await UserService.registerUser(email,password);

        res.json({status:true,sucess:"User successfully registered"});
    }
    catch(error){
        throw error;
    }
}