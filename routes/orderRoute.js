import express from "express"
import { allOrder, deleteOrder, getAllOrder, newOrder, singleOrder, updateOrderStataus } from "../controllers/orderController.js"
import {AuthorizedRole, UserVerify} from '../middleware/authVerify.js'
const router = express.Router()

router.post('/new',UserVerify,newOrder)
router.get('/order/:id',UserVerify,singleOrder)
router.get('/myOrders',UserVerify,allOrder)
router.get('/admin/allorders',UserVerify,AuthorizedRole("admin"),getAllOrder)
router.route('/admin/order/:id')
.put(UserVerify,AuthorizedRole("admin"),updateOrderStataus)
.delete(UserVerify,AuthorizedRole("admin"),deleteOrder)
export default router