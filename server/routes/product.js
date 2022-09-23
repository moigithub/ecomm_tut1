import express from 'express'
import {
  createProductReview,
  deleteProduct,
  deleteProductReview,
  getProduct,
  getProductReviews,
  getProducts,
  newProducts,
  updateProduct
} from '../controllers/productController.js'
import { isAdmin, isAuthenticated } from '../middlewares/auth.js'
const router = express.Router()

router.route('/products').get(getProducts)
router.route('/product/:productId/review').post(isAuthenticated, createProductReview)
router.route('/product/:productId/reviews/:reviewId').delete(isAuthenticated, deleteProductReview)
router.route('/product/:productId/reviews').get(isAuthenticated, getProductReviews)
router.route('/product/:id').get(getProduct)

router.route('/admin/product/new').post(isAuthenticated, isAdmin, newProducts)
router
  .route('/admin/product/:id')
  .put(isAuthenticated, isAdmin, updateProduct)
  .delete(deleteProduct)

export default router
