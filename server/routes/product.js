import express from 'express'
import {
  createProductReview,
  deleteProduct,
  deleteProductReview,
  getAdminProducts,
  getProduct,
  getProductReviews,
  getProducts,
  newProducts,
  updateProduct
} from '../controllers/productController.js'
import { isAdmin, isAuthenticated } from '../middlewares/auth.js'
import multer from 'multer'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    console.log('filename', file)
    cb(null, String(Date.now()) + file.originalname)
  }
})
const upload = multer({ storage: storage })

const router = express.Router()

router.route('/products').get(getProducts)

router.route('/product/:productId/review').post(isAuthenticated, createProductReview)
router
  .route('/admin/product/:productId/reviews/:reviewId')
  .delete(isAuthenticated, isAdmin, deleteProductReview)
router.route('/product/:productId/reviews').get(isAuthenticated, getProductReviews)
router.route('/product/:id').get(getProduct)

router.route('/admin/products').get(isAuthenticated, isAdmin, getAdminProducts)
router
  .route('/admin/product/new')
  .post(isAuthenticated, isAdmin, upload.array('images'), newProducts)
router
  .route('/admin/product/:id')
  .put(isAuthenticated, isAdmin, upload.array('images'), updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct)

export default router
