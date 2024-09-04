const express = require('express');
const app = express();
const admin = require('../models/admin')
const bcrypt = require('bcryptjs');

const mail = require('../helper/sendMail')
const sms = require('../helper/smsService')
const whatsapp = require('../helper/whatsapp')

const register = async (req, res) => {
  try {
    const inputData = req.body;
    if (!inputData) {
      return res.json({
        message: "failed",
        status: "400",
        error: "please fill the form completely"
      });
    }

    const { admin_id, user_name, admin_email, admin_password, admin_mobile_number } = inputData;

    if (!admin_id || !user_name || !admin_email || !admin_password || !admin_mobile_number) {
      return res.json({
        message: "failed",
        status: "400",
        error: "please fill the missed columns"
      });
    }

    // Check if data already exists
    const userExist = await admin.findOne({
      $or: [{ user_name }, { admin_email }, { admin_id }]
    });

    if (userExist) {
      return res.json({
        message: "failed",
        status: 409,
        message: 'User already exists'
      });
    }

    // Hashing password 
    const encryptPassword = await bcrypt.hash(admin_password,10);
    if (!encryptPassword) {
      return res.json({sucess: false,message:"dikkat aari hai"});
    }

    const createUser = await admin.create({
      admin_id,
      user_name,
      admin_email,
      admin_password: encryptPassword,
      admin_mobile_number
    });

    // Send email
    await mail.SendGreetMail({
      email:admin_email,
        name:user_name,
        pno:admin_mobile_number
    });

    return res.json({
      message: "success",
      status: 200,
      data: createUser,
      msg: `Hey ${user_name}, you have registered successfully`
    });
  } catch (err) {
    res.status(500).send("Error occurred while registering the admin: " + err);
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

module.exports = { register, getUsers, updateUser, deleteUser, sendMessage, sendWhatsapp };
