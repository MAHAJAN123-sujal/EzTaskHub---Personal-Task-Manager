const Task = require('../models/task')
const User = require('../models/userModel')
const nodemailer = require('nodemailer')

const addTaskController = async(req,res)=>{
    try{
        const {name,category,deadline} = req.body;

        if(!name|| !category|| !deadline){
            return res.status(400).json({
                success:false,
                message:'Fill all the details'
            })
        }

        if(new Date(deadline)<new Date()){
            return res.status(400).json({
                success:false,
                message:'Choose deadline in the future'
            })
        }

        const newTask = new Task({
            name,
            category,
            status:'pending',
            deadline,
            user:req.user.id
        });

        await newTask.save();
        res.status(201).send({
            success:true,
            message:"Task added Successfully",
            newTask
        })
    }
    catch(error){
        console.log(error)
        return res.status(400).json({
            message:'Failed to add new task',
            success:false
        })
    }
}
const fetchTasksByStatusController = async(req,res) =>{
    try{
        const {status} = req.body;
        if(!status ){
            return res.status(400).json({
                success:false,
                message:'Status is required'
            })
        }

        const tasks = await Task.find({status,user:req.user.id});
        
        res.status(201).json({
            success:true,
            message:`All ${status} tasks loaded successfully`,
            tasks
        })
    }
    catch(error){
        console.log(error)
        res.status(400).json({
            message:'Failed to fetch all tasks',
            success:false
        })
    }
}
const fetchTasksByCategoryController = async(req,res) =>{
    try{
        const {category} = req.body;
        if(!category ){
            return res.status(400).json({
                success:false,
                message:'Category is required'
            })
        }

        const tasks = await Task.find({category,user:req.user.id});
        
        res.status(201).json({
            success:true,
            message:`All ${category} tasks loaded successfully`,
            tasks
        })
    }
    catch(error){
        console.log(error)
        res.status(400).json({
            message:'Failed to fetch all tasks',
            success:false
        })
    }
}
const editTaskController = async(req,res)=>{
    try{
        const {taskId} = req.params;
        const {name,category,deadline} = req.body;

        const task = await Task.findById(taskId);
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        
        if(new Date(deadline)<new Date()){
            return res.status(400).json({
                success:false,
                message:'Choose deadline in the future'
            })
        }
        
        // console.log(deadline);

        task.name=name||task.name;
        task.category = category||task.category;
        task.deadline = deadline||task.deadline;
        await task.save();

        res.status(201).json({
            success:true,
            message:"Task editted Successfully"
        })
    }
    catch(error){
        console.log(error)
        res.status(400).json({
            message:'Failed to edit task',
            success:false
        })
    }
}
const deleteTaskController = async(req,res)=>{
    try{
        const {taskId} = req.params;

        const task = await Task.findByIdAndDelete(taskId);
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }

        res.status(201).json({
            success:true,
            message:'Task Deleted Successfully'
        })
    }
    catch(error){
        console.log(error)
        res.status(400).json({
            message:'Failed to delete task',
            success:false
        })
    }
}
const markTaskCompletedController = async(req,res)=>{
    try{
        const {taskId} = req.params;

        const task = await Task.findById(taskId);
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }

        task.status='completed';
        task.completedAt=new Date();
        await task.save();

        res.status(201).json({
            success:true,
            message:"Task added to Complete List"
        })
    }
    catch(error){
        console.log(error)
        res.status(400).json({
            message:'Failed to delete task',
            success:false
        })
    }
}
const moveToMissed = async() =>{
    try{
        const currTime = new Date();

        const missedTasks = await Task.find({
            status:'pending',
            deadline:{$lt:currTime}
        })

        await Task.updateMany({
            _id:{$in:missedTasks.map((task)=>task._id)}
        },{$set:{status:'missed'}})

        console.log(`added ${missedTasks.length} to missed list`);
    }
    catch(error){
        console.log(error);
    }
}
const sendRemainder = async() =>{
    try{
        // console.log("Entered send remainder ");
        const currTime = new Date();
        const oneHrLater = new Date(currTime.getTime()+3600000)
        const tasks = await Task.find({
            status:'pending',
            remainderCnt:1,
            deadline:{$gte:currTime , $lte:oneHrLater}
        });
        
        const transporter = nodemailer.createTransport({
            host:process.env.SENDGRID_HOST,
            port:process.env.SENDGRID_PORT,
            secure:false,
            auth:{
                user: process.env.SENDGRID_USER,
                pass: process.env.SENDGRID_PASS,
            }
        })

        for(const task of tasks){
            // console.log(task);
            const user = await User.findOne({_id:task.user});
            if(!user) continue;

            try {
                await transporter.sendMail({
                    from: process.env.SENDER_EMAIL,
                    to:user.email,
                    subject: `Reminder: Your task "${task.title}" is due in 1 hour!`,
                    text: `Hey ${user.name},\n\nJust a reminder: Your need to complete your task "${task.name}".\n\nStay on track and complete it before the time! 💪\n\n--- EzTaskHub (Your Personal Task Manager)`
                });

                task.remainderCnt=0;
                await task.save();
            } 
            catch (error) {
                console.error('Error sending remainder:', error);
            }
        }

        console.log(`Remainder is sent for ${tasks.length} tasks`)
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {addTaskController,editTaskController,deleteTaskController,fetchTasksByStatusController,fetchTasksByCategoryController,markTaskCompletedController,moveToMissed,sendRemainder};