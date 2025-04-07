const jwt = require('jsonwebtoken');

const authMiddleware = async(req,res,next) =>{
    try{
        const token = req.cookies.token || req.headers('Authorization')?.split(' ')[1];
        // console.log("from authmiddleware : ", token)
        if(!token){
            return res.status(402).json({
                success:false,
                message:"No Token found"
            })
        }

        const user = jwt.verify(token,process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Authentication failed!, Invalid Token"
        })
    }
}

module.exports = authMiddleware