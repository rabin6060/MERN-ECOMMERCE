
import express from 'express'
import { createProduct, createUpdateReview, deleteProduct, deleteReviews, getAllReviews, Products, singleProduct, updateProduct } from '../controllers/productController.js'
import {AuthorizedRole, UserVerify} from "../middleware/authVerify.js"
const router  = express.Router()

router.get('/allproducts',Products)
router.get('/singleProduct/:id',singleProduct)
router.route('/reviews')
.get(getAllReviews)
.delete(UserVerify,deleteReviews)
router.post('/createProduct',UserVerify,AuthorizedRole("admin"),createProduct)
router.put('/update/:id',UserVerify,AuthorizedRole("admin"),updateProduct)
router.delete('/delete/:id',UserVerify,AuthorizedRole("admin"),deleteProduct)
router.put('/review',UserVerify,createUpdateReview)
export default router