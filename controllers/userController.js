const User=require('../models/userModel')
exports.registerUser=async(req,res,next)=>{
     const{name,email,password}=req.body
   const user= await User.create({
        name,
        email,
        password
    });
    res.status(201).json({
        success:true,
        user
    })
}
exports.loginUser=async(req,res,next)=>{
    const{email}=req.body
    if(!email)
    {
        return next("please enter email",400)
    }
    const user=await User.findOne({email})
     if(!user)
     {
        return next('Invalid email',400)
     }
     res.status(201).json({
        success:true,
        user
     })
}
exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
         success: true,
         users
    })
 }