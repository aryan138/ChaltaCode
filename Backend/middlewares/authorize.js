
const jwt = require('jsonwebtoken');
const { tokens } = require('../config/cred');
const user = require('../models/user');

const verifyJwt = async (req,res,next)=>{
    try {
        //req se cookie ka access lelo
        //access ko decode karo verify kro
        //db se user find karlo 
        //res mai update krdo
        // console.log("hello i am here feat middleware");
        // console.log("object",req.cookies)
        const accesstoken = req.cookies?.accessToken;
        // console.log("access token: " + accesstoken);
        if (!accesstoken){
            //check refresh hai
            const refreshtoken = req.cookies?.refreshToken;
            console.log(refreshtoken);
            if (!refreshtoken){
                console.log("hello 403")
                return res.status(403).json({
                    success: false,
                    status:403,
                    message:"You are not authorized to access"
                })
            }
            const decodeToken  = jwt.verify(refreshtoken,tokens.REFRESH_TOKEN_SECRET);
            const findUser = user.findById(decodeToken?._id).select("-user_password -user_refreshToken");
            if (!findUser){
                return res.status(409).json({
                    success: false,
                    status:409,
                    message:"invalid token credentials"
                })
            }
            req.user = findUser;
            

        }
        else{
            const decodeToken  = jwt.verify(accesstoken,tokens.ACCESS_TOKEN_SECRET);
            const findUser = await user.findById(decodeToken?._id).select("-user_password -user_refreshToken");
            console.log("tyson: ", findUser);
            if (!findUser){
                return res.status(409).json({
                    success: false,
                    status:409,
                    message:"invalid token credentials"
                })
            }
            req.user = findUser;
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message + ": aryan"
        })
    }
}

module.exports = {verifyJwt};