import express from 'express'
import { deleteUser, ForgetPassword, getAllUsers, getSingleUser, getUser, Login, Logout, Register, ResetPassword, updatePassword, updateUserProfile, updateUserRole } from '../controllers/authController.js'
import { AuthorizedRole, UserVerify } from '../middleware/authVerify.js'

const router = express.Router() 

router.post('/register',Register)
router.post('/login',Login)
router.post('/logout',Logout)

router.post('/password/forgot',ForgetPassword)
router.put('/password/reset/:token',ResetPassword)
router.put('/password/update',UserVerify,updatePassword)
router.put('/me/update',UserVerify,updateUserProfile)

router.get('/me',UserVerify,getUser)
router.get('/admin/users',UserVerify,AuthorizedRole("admin"),getAllUsers)

router.route('/admin/user/:id')
.get(UserVerify,AuthorizedRole("admin"),getSingleUser)
.put(UserVerify,AuthorizedRole("admin"),updateUserRole)
.delete(UserVerify,AuthorizedRole("admin"),deleteUser)

export default router

