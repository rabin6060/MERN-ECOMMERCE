import { catchErrorFunc } from "../middleware/catchAsyncError.js"
import { OrderModel } from "../models/orderModel.js"
import { errorHandler } from "../utils/errorHandling.js"
import {ProductModel} from '../models/productModel.js'
export const newOrder = catchErrorFunc(
    async (req,res,next) => {
        const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}  =req.body
        const order =  await OrderModel.create({
            shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paidAt:Date.now(),userId:req.user._id
        })
        res.status(200).json({
            success:true,
            order
        })
    }
)
//get a single order
export const singleOrder = catchErrorFunc(
    async (req,res,next) => {
        const userOrder = await OrderModel.findById(req.params.id).populate("userId","username email")
        if(!userOrder) return next(errorHandler(400,"no order found with this id."))
        res.status(200).json({success:true,userOrder})
    }
)
//get all orders of a logged in user.
export const allOrder = catchErrorFunc(
    async (req,res,next) => {
        const orders = await OrderModel.find({userId:req.user._id})
        if(!orders) return next(errorHandler(400,"no order yet"))
        res.status(200).json({success:true,orders})
    }
)
//get all order --admin
export const getAllOrder = catchErrorFunc(
    async (req,res,next) => {
        const orders = await OrderModel.find()

        let totalAmount = 0
        orders.forEach(order=>{
            totalAmount+=order.totalPrice
        })

        if(!orders) return next(errorHandler(400,"no order yet"))
        res.status(200).json({success:true,totalAmount,orders})
    }
)
//update order status --admin
export const updateOrderStataus = catchErrorFunc(
    async (req,res,next) => {
        const order = await OrderModel.findById(req.params.id)
        if(!order) return next(errorHandler(404,"no order yet"))

        if(order.orderStatus==="Delivered") return next(errorHandler(400,"order has been delivered."))
        order.orderItems.forEach(async order=>{
           await updateStock(order.productId,order.quantity)
        })
        order.orderStatus = req.body.status
        if(order.orderStatus==="Delivered") {
            order.deliveredAt = Date.now()
        }
        await order.save({validateBeforeSave:false})
       
        res.status(200).json({success:true,message:"order has been updated."})
    }
)

const updateStock = async (id,quantity) =>{
    const product = await ProductModel.findById(id)

    product.stock -= quantity

    await product.save({validateBeforeSave:false})
}

//delete order
export const deleteOrder = catchErrorFunc(
    async (req,res,next) => {
        const order = await OrderModel.findByIdAndDelete(req.params.id)

        if(!order) return next(errorHandler(404,"no order exist"))
        res.status(200).json({success:true,message:"order deleted."})
    }
)