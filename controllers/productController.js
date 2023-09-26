import { ProductModel } from "../models/productModel.js"
import {errorHandler} from '../utils/errorHandling.js'
import {catchErrorFunc} from '../middleware/catchAsyncError.js'
import { ApiFeatures } from "../utils/apiFeatures.js"
//add a new product --admin
export const createProduct = catchErrorFunc(async (req,res,next)=>{
    req.body.userId=req.user._id
    const product = await ProductModel.create(req.body)
    product.save()
    res.status(201).json({
        success:true,
        product
    })

})
//get all products
export const Products =catchErrorFunc( async (req,res) => {
    const resultPerPage = 3
    const productCount = await ProductModel.countDocuments()
    const apiFeature=new ApiFeatures(ProductModel.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    const products =await apiFeature.query
    res.status(200).send({success:true,productCount,products})
})
//get product details
export const singleProduct =catchErrorFunc( async (req,res,next) => {
    const product = await ProductModel.findById(req.params.id)
    if(!product) return next(errorHandler(500,"product not found"))
    res.status(200).send({success:true,product})
})


//update products --admin
export const updateProduct =catchErrorFunc( async (req,res,next) => {
    try {
        let product = await ProductModel.findById(req.params.id)
        if(!product) return next(errorHandler(500,"product not found"))
        product = await ProductModel.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
        })
        res.status(200).json({success:true,product})
    } catch (error) {
        console.log(error);
    }
})
//delete product --admin
export const deleteProduct =catchErrorFunc( async (req,res,next) => {
    const product = await ProductModel.findById(req.params.id)
    if(!product) return next(errorHandler(500,"product not found"))
    await ProductModel.findByIdAndDelete(req.params.id)
    res.status(200).json({success:true,message:'deleted'})
})

//create a review or update it.
export const createUpdateReview =catchErrorFunc( async (req,res,next) => {
    const {rating,comments,productId} = req.body
    const review = {
        userId:req.user._id,
        name:req.user.username,
        rating:Number(rating),
        comments
    }
    const product = await ProductModel.findById(productId)
    if(!product) return next(errorHandler(404,"product not found."))
    const isReviewed = product.reviews.find(rev=>rev.userId.toString()===req.user._id.toString())
    if(isReviewed){
       
        product.reviews.forEach(rev=>{
            if(product.reviews.find(rev=>rev.userId.toString()===req.user._id.toString()))
            rev.rating = Number(rating)
            rev.comments = comments
        })
        
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }
    let avg = 0;
    (product.reviews.forEach(review => avg+=review.rating))
    product.ratings = avg/product.reviews.length
    await product.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        message:"review added or updated."
    })
})

//get all reviews of single product.
export const getAllReviews = catchErrorFunc(
    async ( req,res,next) => {
        const product = await ProductModel.findById(req.query.id)
        if (!product) return next(errorHandler(404,"product not found."))
        res.status(200).json({
            success:true,
            reviews:product.reviews
        })
    }
)
//delete reviews of single product.
export const deleteReviews = catchErrorFunc(
    async ( req,res,next) => {
        const product =  await ProductModel.findById(req.query.productId)
        if (!product) return next(errorHandler(404,"product not found."))
        const reviews = product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString())
        let avg = 0;
        (reviews.forEach(review => avg+=review.rating))
        const ratings = avg/reviews.length

        const numOfReviews = reviews.length

        await ProductModel.findByIdAndUpdate(product._id,{
            reviews,numOfReviews,ratings
        },{
            new:true,
            runValidators:true,
        })

        res.status(200).json({
            success:true,
            message:'reviews deleted !!'
        })
    }
)

