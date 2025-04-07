const User = require('../models/userModel')
const Task = require('../models/task')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const axios = require('axios')

const userRegisterController = async(req,res) => {
    try{
        const {name,email,password} = req.body;

        if(!name||!email||!password){
            return res.status(400).json({
                message:'Fill All details',
                success:false
            })
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message:'User already exists',
                success:false
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({name,email,password:hashedPassword}) 
        await newUser.save();

        res.status(201).json({
            message:'User Created Successfully',
            success:true,
        })
    }
    catch(error){
        console.log('Error while Register',error);
        res.status(500).json({
            success:false,
            message:'Failed to Register User'
        })
    }
}
const userLoginController = async(req,res) => {
    try{
        const {email,password} = req.body;

        if(!email||!password){
            return res.status(400).json({
                message:'Fill All details',
                success:false
            })
        }

        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                message:'User not found',
                success:false
            })
        }

        const isMatch = await bcrypt.compare(password,existingUser.password)
        if(!isMatch){
            return res.status(400).json({
                message:'Invalid credentials',
                success:false
            })
        }

        const token = jwt.sign({
            id:existingUser._id,
            name:existingUser.name,
            email:existingUser.email
        },process.env.JWT_SECRET);
        

        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_MODE === 'production',
            maxAge: 30*24*60*60*1000
        })
        return res.status(201).json({
            message:"User login successfully",
            success:true,
            existingUser,
            token,
        })
    }
    catch(error){
        console.log('Error while Login',error);
        res.status(500).json({
            success:false,
            message:'Failed to Login User'
        })
    }
}
const userLogoutController = async(req,res) => {
    try{
        res.clearCookie('token',{
            secure: process.env.NODE_ENV === "production" 
        })
        res.status(201).json({
            success:true,
            message:"Logout Successfully"
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"failed to logout"
        })
    }
}
const userForgotPasswordController = async(req,res) =>{
    try{
        const {email} = req.body;

        if(!email){
            return res.status(400).json({
                message:'Fill All details',
                success:false
            })
        }

        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                message:'User not found',
                success:false
            })
        }
              
        const otp  = (Math.floor(Math.random() * 1000000)).toString();
        const otpExpiry = Date.now() + 5*60*1000;

        existingUser.otp=otp;
        existingUser.otpExpiry=otpExpiry;
        await existingUser.save();

        const transporter = nodemailer.createTransport({
            host:process.env.SENDGRID_HOST,
            port:process.env.SENDGRID_PORT,
            secure:false,
            auth:{
                user: process.env.SENDGRID_USER,
                pass: process.env.SENDGRID_PASS,
            }
        })

        try {
            await transporter.sendMail({
                from: process.env.SENDER_EMAIL,
                to:existingUser.email,
                subject:'Password Reset OTP',
                text:`Your OTP is: ${otp}`,
                html:`<h1>
                        Your OTP is: <strong>${otp}</strong>
                      </h1>
                      <p>This OTP will expire in 5 minutes.</p>`
            });
    
            return res.status(201).send({ 
                success: true,
                message: 'OTP sent successfully' 
            });
        } 
        catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(201).send({
                success: false,
                message: 'Failed to send OTP' 
            });
        }
    }
    catch(error){
        console.log('Error while Processing forgot Password',error);
        res.status(500).json({
            success:false,
            message:'Failed to process forgot password'
        })
    }
}
const userVerifyOtpController = async(req,res) => {
    try{
        const {email,otp} = req.body;

        if(!email){
            return res.status(400).json({
                message:'Fill All details',
                success:false
            })
        }

        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                message:'User not found',
                success:false
            })
        }

        if(!otp){
            return res.status(400).json({
                message:'Enter OTP',
                success:false
            })
        }

        if(existingUser.otp!==otp || Date.now()>existingUser.otpExpiry){
            return res.status(400).json({
                message:'Invalid or Expired OTP',
                success:false
            })
        }
        
        existingUser.otp =undefined;
        existingUser.otpExpiry =undefined;
        await existingUser.save();
        
        const token = jwt.sign(otp,process.env.JWT_SECRET);
        return res.status(201).json({
            success:true,
            message:"OTP verified successfully",
            token
        })
    }
    catch(error){
        console.log('Error while verifying OTP',error);
        res.status(500).json({
            success:false,
            message:'Failed to verify OTP'
        })
    }
}
const userResetPasswordController = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email){
            return res.status(400).json({
                message:'Fill All details',
                success:false
            })
        }

        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                message:'User not found',
                success:false
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        existingUser.password=hashedPassword;
        await existingUser.save();

        return res.status(201).json({
            message:"password reset successfully",
            success:true
        })
    }   
    catch(error){
        console.log('Error while Reseting Passowrd',error);
        res.status(500).json({
            success:false,
            message:'Failed to Reset password'
        })
    } 
}
const getUserSummary = async(req,res)=>{
    try{
        const userId = req.user.id;
        // console.log(userId);
        const tasks = await Task.find({user:userId});
        const pendingTasks = tasks.filter((t)=> t.status === 'pending').length;
        const missedTasks = tasks.filter((t)=> t.status === 'missed').length;
        const completedTasks = tasks.filter((t)=> t.status === 'completed').length;

        const coins = Math.max(0,(completedTasks*10) - (missedTasks*2))

        const categoryInfo = {}

        for(const task of tasks){
            if(!categoryInfo[task.category]) categoryInfo[task.category] =0;
            categoryInfo[task.category]++;
        }
        
        const prompt = `
                I want you to act as a life coach analyzing a user's productivity based on their tasks.
                Here is the data:
                - Completed Tasks: ${completedTasks}
                - Missed Tasks: ${missedTasks}
                - Pending Tasks: ${pendingTasks}
                - Task Categories with Frequency: ${JSON.stringify(categoryInfo, null, 2)}

                Based on this, write a personalized, encouraging and insightful summary (6 to 8 lines) of the user productivity, strengths, and areas for improvement. Be supportive, inspiring, and detailed.
                `;

        const summaryRes = await axios.post('https://openrouter.ai/api/v1/chat/completions',
            {
                model: "openai/gpt-3.5-turbo",
                messages: [
                { role: "system", content: "You are a motivational productivity coach." },
                { role: "user", content: prompt }]
            },
            {
                headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
                }
            }
        );
        const summary = summaryRes.data.choices[0].message.content;

        res.status(200).json({
            success:true,
            pendingTasks,
             completedTasks, 
             missedTasks, 
             coins, 
             summary 
        });
    }   
    catch(error){
        console.log('Error while getting summary',error);
        res.status(500).json({
            success:false,
            message:'Failed to get user summary'
        })
    } 
}
const getMotivation = async(req,res)=>{
    try{
        const data = await axios.get('https://zenquotes.io/api/random');

        const motivation = data.data[0].q;
        res.status(200).json({
            success:true,
            motivation
        })
    }   
    catch(error){
        console.log('Error while getting motivation',error);
        res.status(500).json({
            success:false,
            message:'Failed to get Motivation quote'
        })
    } 
}

module.exports = {userRegisterController,userLoginController,userVerifyOtpController,userResetPasswordController,userForgotPasswordController,userLogoutController,getUserSummary,getMotivation}