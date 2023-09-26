import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
   
    name:{
        type:String,
        required:[true,'Please enter the name of the product'],
        trim:true
    },
    desc:{
        type:String,
        required:[true,'please enter product description']
    },
    price:{
        type:Number,
        required:[true,'please enter product price'],
        maxLength:[8,'price should not exceed 8 figure']
    },
    ratings:{
        type:Number,
        default:0
    },
    photos:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
        }
    ],
    category:{
        type:String,
        required:[true,'please enter product category']
    },
    stock:{
        type:Number,
        required:[true,'please enter product stock'],
        maxLength:[4,'cannot exceed 4 figures.'],
        default:1,
    },
    numOfReviews:{
        type:Number,
        required:true,
        default:0
    },
    reviews:[
        {
            userId:{
                type:mongoose.Schema.ObjectId,
                ref: "auth" ,
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comments:{
                type:String,
                required:true
            }
        }
    ],
            
},{timestamps:true})

export const ProductModel = mongoose.model('Product',ProductSchema)