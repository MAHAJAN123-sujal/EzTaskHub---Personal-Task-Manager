const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type:String,
    },
    otpExpiry:{
        type:Date
    }
})

const User = mongoose.model('users',userSchema);
module.exports = User