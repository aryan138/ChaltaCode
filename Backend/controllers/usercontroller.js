const user = require("../models/user");
const bcrypt = require("bcryptjs");
const mail = require('../helper/sendMail')
const mongoose = require('mongoose')



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
  
      const {user_username,user_email,user_password,admin_ref,branch_id} = inputData;
  
      if (!user_username || !user_email || !user_password || !admin_ref || !branch_id) {
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
      const encryptPassword = await bcrypt.hash(user_password,10);
      if (!encryptPassword) {
        return res.json({sucess: false,message:"dikkat aari hai"});
      }
    
  
      const createUser = new user({
        user_username: user_username,
        user_email: user_email,
        user_password:encryptPassword,
        admin_ref:admin_ref,
        branch_id:new mongoose.Types.ObjectId(branch_id),
      });
      await createUser.save();
      
      const refreshToken = await generateRefreshToken(createUser._id);
      console.log(refreshToken,"refreshToken");
      // console.log("null values",await user.find());
      // await createUser.save();

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
      await mail.SendGreetMail({
        email:user_email,
        name:user_username,
        pno:createUser.user_phone_number
      });

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
          status: "500",
          error: "user not found!!"
        });
      };
      //user hai 
      const checkPass = await bcrypt.compare(user_password,checkData.user_password);
      if (!checkPass){
        return res.status(400).json({
          success: false,
          status: "500",
          error: "Wrong Credentials!!"
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
      console.log("aagya andar");
        const {_id} = req.user;
        const id = _id;
      
        const { 
            user_username, 
            user_email, 
            user_password, 
            user_fullname, 
            user_designation, 
            user_role, 
            user_status, 
            user_profile, 
            user_phone_number 
        } = req.body;

        let user = await user.findOne({ id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        
        if (user_password) {
            const salt = await bcrypt.genSalt(10);
            user.user_password = await bcrypt.hash(user_password, salt);
        }

        
        if (user_username) user.user_username = user_username;
        if (user_email) user.user_email = user_email;
        if (user_fullname) user.user_fullname = user_fullname;
        if (user_designation) user.user_designation = user_designation;
        if (user_role) user.user_role = user_role;
        if (user_status) user.user_status = user_status;
        if (user_profile) user.user_profile = user_profile;
        if (user_phone_number) user.user_phone_number = user_phone_number;

        
        await user.save();

        return res.status(200).json({ message: "User details updated successfully", user });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error });
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
  

  module.exports= {register,loginUser,logoutUser,updateUserDetails,getDetails};

