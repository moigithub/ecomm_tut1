import express from 'express'
import {
  getOrder,
  getOrders,
  newOrder,
  processOrder,
  deleteOrder,
  myOrders
} from '../controllers/orderController.js'

import { isAdmin, isAuthenticated } from '../middlewares/auth.js'
const router = express.Router()

router.route('/order/new').post(isAuthenticated, newOrder)
router.route('/orders/me').get(isAuthenticated, myOrders)
router.route('/order/:id').get(isAuthenticated, getOrder)
router.route('/admin/orders').get(isAuthenticated, isAdmin, getOrders)
router
  .route('/admin/order/:id')
  .put(isAuthenticated, isAdmin, processOrder)
  .delete(isAuthenticated, isAdmin, deleteOrder)

export default router
