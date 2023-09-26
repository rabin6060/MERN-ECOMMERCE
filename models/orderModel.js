import mongoose from "mongoose";


const OrderSchema = mongoose.Schema({

    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'auth',
        required:true
    },

   
    shippingInfo:{
        address:{type:String,required:true},
        city:{type:String,required:true},
        states:{type:String,required:true},
        country:{type:String,required:true},
        pinCode:{type:Number,required:true},
        phone:{type:Number,required:true}
    },
    orderItems:[
       {
        name:
        {
            type:String,
            required:true
        },
        quantity:
        {
            type:Number,
            required:true
        },
        price:
        {
            type:Number,
            required:true
        },
        image:
        {
            type:String,
            required:true
        },
       productId:
       {
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true
        },
       },
    ],
    paymentInfo:
    {
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
    },
    paidAt:{
        type:Date,
        required:true
    },
    itemsPrice:{
        type:Number,
        default:0
    },
    taxPrice:{
        type:Number,
        default:0
    },
    shippingPrice:{
        type:Number,
        default:0
    },
    totalPrice:{
        type:Number,
        default:0
    },
    orderStatus:{
        type:String,
        required:true,
        default:"processing"
    },
    deliveredAt:Date
    

},{timestamps:true})


export const OrderModel = mongoose.model('order',OrderSchema)