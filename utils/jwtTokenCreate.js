import jwt from 'jsonwebtoken'
export const jwtCreateToken = (user,res,status) => {
    const option={
        expiresIn:new Date(Date.now() + process.env.COOKIE_EXPIRES*24*60*60*1000),
        httpOnly:true
    }
    const token=jwt.sign({username:user.username,id:user._id,email:user.email},process.env.SECRET_KEY,{expiresIn:process.env.EXPIRES})
    return res.cookie('token',token,option).status(status).send({success:true,user,token})
}