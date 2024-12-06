const user = require("../models/user");
const bcrypt = require("bcryptjs");
const mail = require('../helper/sendMail')
const mongoose = require('mongoose');
const admin = require("../models/admin");



const generateRefreshToken =async (userId)=>{
  try {
    //find data
    //create refresh token
    // const banda = await user.findById(userId);
    // console.log("banda", banda);
    // if (!banda) return "banda not found";
    const newUser = await user.findById(userId);
    const refreshToken = newUser.generateRefreshToken();
    console.log("refresh token generated", refreshToken);
    newUser.user_refreshToken = refreshToken;
    await newUser.save({validateBeforeSave: false});
    console.log("refreshed user", userId);
    return refreshToken;
  } catch (error) {
    console.log("error generating refresh token", error);
    // return res.status(500).json({
    //   success:false,
    //   messgae: "error generating refresh token",error,
    // })
  }
}
const generateAccessToken =async (userId)=>{
  try {
    //find data
    //create access token
    const banda = await user.findById(userId);
    if (!banda) return res.status(400).json({success:false,messgae: "banda not found"});
    const accessToken = banda.generateAccessToken();
    return accessToken;
  } catch (error) {
    // return res.status(500).json({
    //   success:false,
    //   messgae: "error generating Access token",error,
    // })
  }
}

const register = async (req, res) => {
    try {
      const inputData = req.body;
      console.log(inputData);
      if (!inputData) {
        return res.json({
          message: "failed",
          status: "400",
          error: "please fill the form completely"
        });
      }
      // console.log(inputData);
  
      const {user_username,user_email,user_password} = inputData;
  
      if (!user_username || !user_email || !user_password) {
        return res.json({
          message: "failed",
          status: "400",
          error: "please fill the missed columns"
        });
      }
      // console.log(inputData);
  
      // Check if data already exists
      const userExist = await user.findOne({
        $or: [{ user_username }, { user_email }]
      });
  
      if (userExist) {
        return res.json({
          message: "failed",
          status: 409,
          message: 'User already exists'
        });
      }
      // Hashing password 
      const encryptPassword = await bcrypt.hash(user_password,7);
      if (!encryptPassword) {
        return res.json({sucess: false,message:"dikkat aari hai"});
      }
    
  
      const createUser = new user({
        user_username: user_username,
        user_email: user_email,
        user_password:encryptPassword,
      });
      await createUser.save();
      
      const refreshToken = await generateRefreshToken(createUser._id);
      console.log(refreshToken,"refreshToken");

      if (!refreshToken){
        res.status(500).json({
            sucess: false,
            message: "internal server error while creating refresh token"
        })
      }
      //token aagya
      const finalData  = await user.findByIdAndUpdate(
        createUser._id,
        {
          $set: {
              user_refreshToken: refreshToken 
          }
      },
      {
          new: true
      }
      )
      console.log(finalData,"finalData");
  
      // Send email
      // await mail.SendGreetMail({
      //   email:user_email,
      //   name:user_username,
      //   pno:createUser.user_phone_number
      // });

      const registerUser = await user.findById(createUser._id).select("-user_password -user_refreshToken");
  
      return res.json({
        success:"true",
        status: 200,
        data: registerUser,
        msg: `Hey ${registerUser.user_username}, you have registered successfully`
      });
    } catch (err) {
      console.log("Error in ref", err);
      res.status(500).send("Error occurred while registering the user: " + err);
    }
  }
  
  const sendMessage = async (req, res) => {
    try {
      const sendMessage = await sms.sendAccountCreateGreetSms();
      res.json({
        status: 200,
        message: `Register successful`,
        messageSent: sendMessage
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  // ------------------------------------login--------------------------------------
  const loginUser = async(req,res)=>{
    try {
      //take email and password
      //find user whether user exist
      //verify password using bcrypt
      //generate access token and refresh token
      //send cookies

      //data
      const inputData = req.body;
      //verify
      if (!inputData) {
        return res.status(400).json({
          success: false,
          status: "400",
          error: "please fill the form completely"
        });
      }
      //data coming
      const {user_email,user_password}=inputData;
      //check if every entry is valid
      if(!user_email || !user_password ){
        return res.status(400).json({
          success: false,
          status: "400",
          error: "please fill the missed columns"
        });
      }
      //valid hai bhai

      //find user in db
      const checkData = await user.findOne({
        user_email
      });
      if (!checkData){
        return res.status(500).json({
          success: false,
          status: 401,
          error: "user not found!!"
        });
      };
      //user hai 
      const checkPass = await bcrypt.compare(user_password,checkData.user_password);
      if (!checkPass){
        console.log("glt glt lgt");
        return res.json({
          success: false,
          status: 409,
          error: "Wrong Credentials!!"
        });
      };

      if (checkData.user_status=="Inactive"){
        return res.status(409).json({
          success: false,
          status: 409,
          error: "User Inactive!!"
        });
      };
      // console.log(checkPass);

      //access and refresh token bnao
      const accessToken = await generateAccessToken(checkData._id);
      const refreshToken = checkData.user_refreshToken;
      // console.log(refreshToken);
      // console.log(accessToken);
      const finalUser = await user.findById(checkData._id).select("-user_password -user_refreshToken");

      console.log(finalUser);
      
      const options = {
        httpOnly: true,
        secure: true,
        //isme abh hamari cookie sirf server se hi modifiable hogi frontend par koi ese modify nhi kr skta.
    }
    return res.
    status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options).json({
      success:true,
      status:200,
      data:finalUser,
      message: "user sign in succesfully"
    })

      
    } catch (error) {
      res.status(500).json({
        success:false,
        error:error.message,
      })
    }
  }

  const logoutUser = async (req,res)=>{
    try {
      await user.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                user_refreshToken: undefined 
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      status: 200,
      message: "user sucessfully logged out",
    })
      
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
    })
    }
  }


  const updateUserDetails = async (req, res) => {
    try {
      console.log("inside update user");
        const {_id} = req.user;
        const id = _id;
        // console.log(_id);
      
        const { 
            user_username, 
            user_email,  
            user_fullname, 
            user_designation, 
            user_company_name,  
            user_phone_number 
        } = req.body;
        console.log("now need to find user");
        const userr = await user.findById(_id);

        if (!userr) {
          console.log("can't find user");
            return res.json({status:404, message: "User not found" });
        }

        if (user_username) userr.user_username = user_username;
        if (user_email) userr.user_email = user_email;
        if (user_fullname) userr.user_fullname = user_fullname;
        if (user_designation) userr.user_designation = user_designation;
        if (user_company_name) userr.user_company_name = user_company_name;
        if (user_phone_number) userr.user_phone_number = user_phone_number;  
        await userr.save();

        return res.json({ status:200, message: "User details updated successfully", user });

    } catch (error) {
        return res.json({ status:500,message: "Server Error", error });
    }
};

const getDetails = async (req,res)=>{
  try {
    const {_id} = req.user;
    const userData = await user.findOne({_id}).select("-refreshToken -user_password");
    if (!userData) return res.status(404).json({success:false, message:"User not found"});
    return res.status(200).json({success:true,message:"successfully fetched user details",data:userData});
  } catch (error) {
    return res.status(500).json({ message: "error while fetching data of user", error });
  }
};

const getAdmin = async (req, res)=>{
  try {
    const admin_id = req.user.user_admin;
    const findAdmin = await admin.findById(admin_id);
    if (!findAdmin) return res.status(404).json({success:false,message:"admin not found"});
    return res.status(200).json({success:true,message:"successfully found admin",admin:findAdmin});
  } catch (error) {
    return res.status(500).json({message: "error while fetching your admin"});
  }
}
  

  module.exports= {register,loginUser,logoutUser,updateUserDetails,getDetails,getAdmin};

