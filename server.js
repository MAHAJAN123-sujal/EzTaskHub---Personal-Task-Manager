const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cron = require('node-cron');
const {moveToMissed,sendRemainder} = require('./controllers/taskController')
dotenv.config();

const app = express();
app.use(express.json())
app.use(morgan('dev'))
app.use(cors({
    origin:'https://eztaskhub.netlify.app/',
    credentials:true,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}))
app.use(cookieParser())

const userRouter = require('./routes/userRoute')
app.use('/api/user',userRouter);

const taskRouter = require('./routes/taskRoute')
app.use('/api/task',taskRouter);

const connectDB =async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected successfully");
    }

    catch(error){
        console.log("Failed to connect to Database",error);
        process.exit(1);
    }
}   

const startServer = async() =>{
    await connectDB();

    const PORT = process.env.PORT||5000
    app.listen(PORT,()=>{
        console.log('Server running on port', PORT);
    })
}

startServer();

cron.schedule('*/1 * * * *',async()=>{
    console.log('checking for missed tasks')
    await moveToMissed()
})

cron.schedule('*/5 * * * *',async()=>{
    console.log('checking for sending task remainder')
    await sendRemainder()
})