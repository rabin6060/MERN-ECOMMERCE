import jwt from 'jsonwebtoken'
import { UserModel } from '../models/userModel.js';
import { errorHandler } from '../utils/errorHandling.js';
import { catchErrorFunc } from './catchAsyncError.js';


export const UserVerify = catchErrorFunc( async(req,res,next) => {
    const {token} = req.cookies
    if(!token) return next(errorHandler(401,"user not authorised"))
    jwt.verify(token,process.env.SECRET_KEY,async (err,payload)=>{
        if(err) return next(errorHandler(403,"token not valid"))
        req.user = await UserModel.findById(payload.id)
        next()
    })
})

export const AuthorizedRole = (...roles) => {
    return (req,res,next)=>{
        const {role} = req.user
        if(!roles.includes(role)) return next(errorHandler(403,`Role: ${role} is not allowed to change things.`))
        next()
    }
}