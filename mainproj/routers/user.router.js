const router = require('express').Router();
const UserController = require("../controller/user.controller");

router.post('/registration',UserController.register);
//when reg path hit by client with a req.body json , the register function in UserController is called

module.exports = router;