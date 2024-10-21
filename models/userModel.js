const mongoose=require('mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter name']
    },
    email:{
        type:String,
        required:[true,'please enter email'],
        unique:true,
        validate:[validator.isEmail,'please enter email']
    },
    password:{
        type:String,
        
    },

    createdAt:{
        type:Date,
        default:Date.now
    }
})
let model=mongoose.model('NewUser',userSchema);
module.exports=model;