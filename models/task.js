const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:['sports','academics','work','personal','other'],
        required:true
    },
    status:{
        type:String,
        enum:['pending','missed','completed'],
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    completedAt:{
        type:Date,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    remainderCnt:{
        type:Number,
        default:1
    }
},{timestamps:true})

const Task = mongoose.model('tasks',taskSchema)
module.exports=Task;