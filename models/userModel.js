import mongoose from "mongoose";
import validator from 'validator'
import crypto from 'crypto'

const Auth = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please enter the username."],
        maxLength:[30,"username should not exceed more than 30 character."],
        minLength:[4,"username should not be less than 4 character. "]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Please enter your email."],
        validate:[validator.isEmail,"Please enter the valid email."]
    },
    password:{
        type:String,
        required:[true,"Please enter password."],
        minLength:[8,"password must be or greater than 8 characters."],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
},{timestamps:true})

Auth.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex")

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    this.resetPasswordExpire = Date.now() + 15*60*1000
    return resetToken
}

export const UserModel = mongoose.model('auth',Auth)