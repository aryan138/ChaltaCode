
// const jwt = require('jsonwebtoken');
// const { tokens } = require('../config/cred');
// const user = require('../models/user');

// const verifyJwt = async (req,res,next)=>{
//     try {
//         //req se cookie ka access lelo
//         //access ko decode karo verify kro
//         //db se user find karlo 
//         //res mai update krdo
//         // console.log("hello i am here feat middleware");
//         // console.log("object",req.cookies)
//         const accesstoken = req.cookies?.accessToken;
//         // console.log("access token: " + accesstoken);
//         if (!accesstoken){
//             //check refresh hai
//             const refreshtoken = req.cookies?.refreshToken;
//             console.log(refreshtoken);
//             if (!refreshtoken){
//                 console.log("hello 403")
//                 return res.status(403).json({
//                     success: false,
//                     status:403,
//                     message:"You are not authorized to access"
//                 })
//             }
//             const decodeToken  = jwt.verify(refreshtoken,tokens.REFRESH_TOKEN_SECRET);
//             const findUser = user.findById(decodeToken?._id).select("-user_password -user_refreshToken");
//             if (!findUser){
//                 return res.status(409).json({
//                     success: false,
//                     status:409,
//                     message:"invalid token credentials"
//                 })
//             }
//             req.user = findUser;
            

//         }
//         else{
//             const decodeToken  = jwt.verify(accesstoken,tokens.ACCESS_TOKEN_SECRET);
//             const findUser = await user.findById(decodeToken?._id).select("-user_password -user_refreshToken");
//             console.log("tyson: ", findUser);
//             if (!findUser){
//                 return res.status(409).json({
//                     success: false,
//                     status:409,
//                     message:"invalid token credentials"
//                 })
//             }
//             req.user = findUser;
//         }
        
//         next();
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message + ": aryan"
//         })
//     }
// }

// module.exports = {verifyJwt};

const jwt = require('jsonwebtoken');
const { tokens } = require('../config/cred');
const User = require('../models/user');
const { log } = require('console');

const verifyJwt = async (req, res, next) => {
    try {
        // Extract tokens from cookies
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;
        console.log(accessToken);
        console.log(refreshToken);
        

        // If no tokens are present
        if (!accessToken && !refreshToken) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "No authentication tokens found"
            });
        }

        let user;

        // Verify access token first
        if (accessToken) {
            try {
                const decodedAccessToken = jwt.verify(accessToken, tokens.ACCESS_TOKEN_SECRET);
                user = await User.findById(decodedAccessToken?._id).select("-user_password -user_refreshToken");
                
                if (!user) {
                    return res.json({
                        success: false,
                        status: 401,
                        message: "Invalid access token"
                    });
                }
            } catch (accessTokenError) {
                // If access token is expired or invalid, check refresh token
                if (!refreshToken) {
                    return res.status(401).json({
                        success: false,
                        status: 401,
                        message: "Access token expired and no refresh token found"
                    });
                }
            }
        }

        // If no user found via access token, verify refresh token
        if (!user && refreshToken) {
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, tokens.REFRESH_TOKEN_SECRET);
                user = await User.findById(decodedRefreshToken?._id).select("-user_password -user_refreshToken");

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        status: 401,
                        message: "Invalid refresh token"
                    });
                }

                // Generate new access token
                const newAccessToken = jwt.sign(
                    { _id: user._id },
                    tokens.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                );

                // Set new access token in cookies
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000 // 15 minutes
                });
            } catch (refreshTokenError) {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: "Invalid or expired refresh token"
                });
            }
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication",
            error: error.message
        });
    }
};

module.exports = { verifyJwt };