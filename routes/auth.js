const express=require('express');
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');
const router=express.Router();
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/users').get( getAllUsers);



module.exports=router