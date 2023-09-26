import { UserModel } from "../models/userModel.js"
import { catchErrorFunc} from '../middleware/catchAsyncError.js'
import { errorHandler } from "../utils/errorHandling.js"
import bcrypt from 'bcryptjs'
import { jwtCreateToken } from "../utils/jwtTokenCreate.js"
import sendEmail from '../utils/sendEmail.js'
import crypto from 'crypto'

export const Register =catchErrorFunc( async (req,res,next) => {
  const {username,email,password} = req.body
  const hash = bcrypt.hashSync(password,10)
  const user = await UserModel.create({
    username,email,password:hash,avatar:{public_id:"something",url:"something"}
  })
  jwtCreateToken(user,res,200)

})

export const Login = catchErrorFunc(async(req,res,next)=>{
  const {email,password} = req.body
  if(!email || !password) return next(errorHandler(403,"please enter email and password both."))

  const user = await UserModel.findOne({email}).select("+password")
  if(!user) return next(errorHandler(401,"email or password invalid."))

  const match = bcrypt.compareSync(password,user.password)
  if(!match) return next(errorHandler(401,"email or password invalid"))
  jwtCreateToken(user,res,200)
})

export const Logout =catchErrorFunc( (req,res) => {
  res.clearCookie('token',null,{
    expiresIn:new Date(Date.now()),
    httpOnly:true
  }).status(200).json({success:true,message:"logout success"})
})

//forget Password
export const ForgetPassword = catchErrorFunc(
  async(req,res,next)=>{
    const user = await UserModel.findOne({email:req.body.email})
    if(!user) return next(errorHandler(404,"User not found."))
    //get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave:false})
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/auths/password/reset/${resetToken}`
    const message = `your reset password link is. \n\n click here ${resetPasswordUrl}`

    try {
     sendEmail({
        email:user.email,
        subject:'ecommerce password reset.',
        message
      })
      res.status(200).js65081294ad9074bb56c116cbon({
        success:true,
        message:`email successfully send to the ${user.email}`
      })
      
    } catch (error) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save({validateBeforeSave:false})
      return next(errorHandler(404,error.message))
    }
  }
)

//reset password or simply update password.
export const ResetPassword = catchErrorFunc(
  async (req,res,next)=>{
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt: Date.now()}
    })
    if(!user) return next(errorHandler(404,"reset token is invalid or has been expired.."))
    if(req.body.password!==req.body.confirmPassword) return next(errorHandler(400,"password not matched . Please re-enter the new password"))

    user.password = bcrypt.hashSync(req.body.password,10)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    jwtCreateToken(user,res,200)
  }
)
//get user details.
export const getUser = catchErrorFunc(
  async (req,res,next) => {
    const user = await UserModel.findById(req.user.id)
    res.status(200).json({
      success:true,
      user
    })
  }
)

//update password.
export const updatePassword = catchErrorFunc(
  async (req,res,next) => {
    const user = await UserModel.findById(req.user.id).select('+password')
    const isPasswordMatched =  bcrypt.compareSync(req.body.password,user.password)
    if(!isPasswordMatched) return next(errorHandler(401,"old password invalid"))
    if(req.body.newPassword!==req.body.confirmNewPassword) return next(errorHandler(402,"password doesnot match."))
    user.password = bcrypt.hashSync(req.body.newPassword,10)
    await user.save()
    jwtCreateToken(user,res,200)
  }
)
//update user profile.
export const updateUserProfile = catchErrorFunc(
  async (req,res,next) => {
    const updateInfo = {
      username:req.body.username,
      email:req.body.email
    }
    await UserModel.findByIdAndUpdate(req.user.id,updateInfo,{
      new:true,
      runValidators:true,
    })

    res.status(200).json({
      success:true,
      message:"user profile updated successfully."
    })
  }
)
//get all users --admin
export const getAllUsers = catchErrorFunc(
  async (req,res,next)=>{
    const users = await UserModel.find()
    res.status(200).json({
      success:true,
      users
    })
  }
)
//get all users --admin
export const getSingleUser = catchErrorFunc(
  async (req,res,next)=>{
    const users = await UserModel.findById(req.params.id)
    if(!users) return next(errorHandler(404,"User not found."))
    res.status(200).json({
      success:true,
      users
    })
  }
)
//update user role.
export const updateUserRole = catchErrorFunc(
  async (req,res,next) => {
    const updateInfo = {
      username:req.body.username,
      email:req.body.email,
      role:req.body.role
    }
    await UserModel.findByIdAndUpdate(req.params.id,updateInfo,{
      new:true,
      runValidators:true,
    })

    res.status(200).json({
      success:true,
      message:"user role updated successfully."
    })
  }
)
//delete a user
export const deleteUser = catchErrorFunc(
    async (req,res,next) => {
      await UserModel.findByIdAndDelete(req.params.id)
      res.status(200).json({
        success:true,
        message:"user deleted updated successfully."
      })
    }
  
)
