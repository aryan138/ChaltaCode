const express = require('express');
const app = express();
const admin = require('../models/admin')
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const {tokens} = require('../config/cred');
const mail = require('../helper/sendMail')
const sms = require('../helper/smsService')
const whatsapp = require('../helper/whatsapp');
const { log } = require('console');
const user = require('../models/user');


const generateAccessToken = async (userId) => {
  try {
    console.log("Inside generateAccessToken", userId);
    
    // Validate user ID
    const newAdmin = await admin.findById(userId);
    if (!newAdmin) {
      console.error("Admin not found for ID:", userId);
      return null; // Return null to indicate failure
    }

    // Generate JWT access token
    const accessToken = jwt.sign(
      {
        _id: newAdmin._id,
        admin_email: newAdmin.admin_email,
        username: newAdmin.username,
        role: "admin"
      },
      tokens.ACCESS_TOKEN_SECRET ,
      { expiresIn: tokens.ACCESS_TOKEN_EXPIRY }
    );

    console.log("Created token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error while creating access token:", error.message);
    return null; // Return null to indicate failure
  }
};


const register = async (req, res) => {
  try {
    const inputData = req.body;

    // Input validation
    if (!inputData || !inputData.username || !inputData.admin_email || !inputData.admin_password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const { username, admin_email, admin_password } = inputData;

    // Check if admin already exists
    const userExist = await admin.findOne({
      $or: [{ username }, { admin_email }],
    });

    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "Admin with email or username already exists",
      });
    }

    // Hash password
    const encryptPassword = await bcrypt.hash(admin_password, 10);
    if (!encryptPassword) {
      return res.status(500).json({
        success:false,
        message:"error occured while encrypting password please try again"
       })
    }

    // Create new admin
    const createAdmin = new admin({
      username,
      admin_email,
      admin_password: encryptPassword,
    });

    await createAdmin.save();

    console.log("New admin created:", createAdmin);

    // Generate access token
    const accessToken = await generateAccessToken(createAdmin._id);

    if (!accessToken) {
      return res.status(500).json({
        success: false,
        message: "Internal server error while creating access token",
      });
    }

    // Update admin with access token
    const finalData = await admin.findByIdAndUpdate(
      createAdmin._id,
      { $set: { accessToken } },
      { new: true }
    ).select("-admin_password -accessToken");

    // await mail.SendGreetMail({
    //   email: admin_email,
    //   name: username,
    // });

    const options = {
      httpOnly: true,
      secure: true,
      //isme abh hamari cookie sirf server se hi modifiable hogi frontend par koi ese modify nhi kr skta.
  }

    return res.status(200).cookie("accessToken",accessToken,options).json({
      success: true,
      data: finalData,
      message: `Hey ${finalData.username}, you have registered successfully`,
    });
  } catch (err) {
    console.error("Error in register function:", err.message);
    return res.status(500)
    .json({
      success: false,
      message: "An error occurred while creating the admin. Please try again.",
    });
  }
};


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



const sendWhatsapp = async (req, res) => {
  try {
    const sendMessage = await whatsapp.sendAccountCreateGreetWhatsapp();
    res.json({
      status: 200,
      message: `Register successful`,
      messageSent: sendMessage
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// loginn

const loginAdmin = async(req,res)=>{
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
      return res.json({
        success: false,
        status: 400,
        message: "please fill the form completely"
      });
    }
    //data coming
    const {admin_email,admin_password}=inputData;
    //check if every entry is valid
    if(!admin_email || !admin_password ){
      return res.json({
        success: false,
        status: 400,
        message: "please fill the missed columns"
      });
    }
    //valid hai bhai

    //find user in db
    const checkData = await admin.findOne({
      admin_email
    });
    if (!checkData){
      return res.json({
        success: false,
        status: 500,
        error: "admin not found"
      });
    };
    //user hai 
    const checkPass = await bcrypt.compare(admin_password,checkData.admin_password);
    if (!checkPass){
      return res.json({
        success: false,
        status: 500,
        error: "Wrong Credentials"
      });
    };
    // console.log(checkPass);

    //access and refresh token bnao
    let accessToken = checkData.accessToken;
    if (!checkData.accessToken || checkData.accessToken==null){
      accessToken = await generateAccessToken(checkData._id);
      if (!accessToken){
        return res.status(409).json({
          success:false,
          message:"while login not able to create your session token"
        });
      }
      await admin.findByIdAndUpdate(
        createAdmin._id,
      { $set: { accessToken } },
      { new: true });
    }
    // const accessToken = await generateAccessToken(checkData._id);
    // console.log(refreshToken);
    // console.log(accessToken);

    const finalAdmin = await admin.findById(checkData._id).select("-admin_password -accessToken");

    console.log(finalAdmin);
    
    const options = {
      httpOnly: true,
      secure: true,
      //isme abh hamari cookie sirf server se hi modifiable hogi frontend par koi ese modify nhi kr skta.
  }
  return res.
  status(200).cookie("accessToken",accessToken,options)
  .json({
    success:true,
    status:200,
    data:finalAdmin,
    message: "user sign in succesfully"
  })

    
  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message,
    })
  }
}

const logoutAdmin = async (req,res)=>{
  try {
    await admin.findByIdAndUpdate(
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
    message: "admin sucessfully logged out",
  })
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
  })
  }
}


const createUser = async(req,res)=>{
  try {
    const adminn = req.user;
    const {user_email,user_designation} = req.body;
    // console.log(adminn);
    console.log("adminnnnnnnn",adminn);

    //check if user already exists
    const checkUser = await user.findOne({user_email});
    if (checkUser){
      return res.status(400).json({
        success:false,
        message:"user already exist"
      })
    }
    const encryptPassword = await bcrypt.hash("user1234", 10);
    if (!encryptPassword) {
     return res.status(500).json({
      success:false,
      message:"error occured while encrypting password please try again"
     })
    }
    const newUser = await user.create({
      user_email: user_email,
      user_designation: user_designation,
      user_admin:adminn._id,
      user_password:encryptPassword,
      user_status:"active"
    });
    if (!newUser){
      return res.status(409).json({
        success:false,
        message:"can't create user please try again",
      })
    }
    await admin.findByIdAndUpdate(
      adminn._id,{
        $push: {
            users: newUser._id
        }
    },
    {
        new: true
    }
    )
    return res.status(200).json({
      success:true,
      message:"user created successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"error occured while creating user"
    })
  }
}

const getAllUsersUnderAdmin = async (req, res) => {
  try {
      const adminn = await admin.findById(req.user._id).populate('users');

      if (!adminn) {
          return res.status(404).json({ message: 'Admin not found' });
      }

      // Return the users
      res.status(200).json({
          message: 'Users retrieved successfully',
          users: adminn.users
      });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};



const getUsers = async (req, res) => {
  try {
    const getData = await admin.find();
    res.json({
      status: 200,
      message: 'Users Found',
      data: getData
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const updateUser = async (req, res) => {
  try {
    const id = req.params._id;
    const inputData = req.body;
    const updateData = await admin.findByIdAndUpdate(id, inputData, {
      new: true
    });
    res.json({
      status: 200,
      message: 'User Updated',
      data: updateData
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const deleteUser = async (req, res) => {
  try {
    const id = req.params._id;
    const deleteData = await admin.findByIdAndDelete(id);
    res.json({
      status: 200,
      message: 'User Deleted',
      data: deleteData
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = { register,createUser, getUsers, updateUser, deleteUser, sendMessage, sendWhatsapp,loginAdmin,logoutAdmin,getAllUsersUnderAdmin };
