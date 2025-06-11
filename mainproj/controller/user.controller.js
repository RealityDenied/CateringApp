const UserService = require("../services/user.services");


exports.register = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        //It’s a shortcut to grab the email and password properties 
        // from the object req.body and assign them to variables named email and password.


        //Since the registerUser is a static method of the UserService class,
        //it can be called directly on the class without needing to create an instance of UserService.
        const successRes = await UserService.registerUser(email,password);
        //primarily waits for the registerUser promise function in UserService to complete its execution.
        //successRes is an object representing the newly created and saved user, assigned after the Promise from save() resolves successfully.
        //here await waits for the promise to resolve and then assigns the resolved value to successRes
        //Also await waits for the db operation to complete before moving to the next line of code
        //if the db operation fails, it will throw an error and the code will not reach this line

        res.json({status:true,success:"User successfully registered"});
    }
    catch(error){
        throw error;
    }
}