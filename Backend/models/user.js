const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { tokens } = require('../config/cred');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    user_username: { type: String, required: true },
    user_email: { type: String, required: true, unique: true },
    user_password: { type: String, required: true, unique: true},
    admin_ref: { type: String, required: true,unique: true},
    branch_id: { type: mongoose.Schema.Types.ObjectId,ref:'branch', required: true},
    user_fullname: { type: String,},
    user_designation: { type: String,default:"Branch Manager"},
    user_role: { type: String ,default:"user" },
    user_status: { type: String },
    user_profile: { type: String},
    user_phone_number: { type: Number, default:7888593684},
    user_refreshToken:{type:String},
    user_company_name:{type:String,default:"My Anatomy"},
    
}, { timestamps: true });


userSchema.methods.generateAccessToken =  function(){
    //todo
    return  jwt.sign({
        _id: this._id,
        user_email: this.user_email,
        user_username: this.user_username,
        user_fullname: this.user_fullname
    },tokens.ACCESS_TOKEN_SECRET,{expiresIn:tokens.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshToken =  function(){
    const tokio = jwt.sign({
        _id:this._id
    },tokens.REFRESH_TOKEN_SECRET,{expiresIn:tokens.REFRESH_TOKEN_EXPIRY});
    console.log("tokio", tokio);
    return tokio;
}

module.exports = mongoose.model('user', userSchema);
