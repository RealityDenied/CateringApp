const UserModel = require('../model/user.model')

//here we create a static function inside the class UserService bcz we dont want to create an
// instance of UserService to use this function
class UserService{
    static async registerUser(email,password){
        try{
            const createUser = new UserModel({email,password});
            return await createUser.save();
        }
        catch(err){
            throw err;
        }
    }

}

module.exports = UserService;
