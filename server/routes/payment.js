import express from 'express'
import { processPayment, sendStripeApi } from '../controllers/paymentController.js'

import { isAdmin, isAuthenticated } from '../middlewares/auth.js'
const router = express.Router()

router.route('/payment/process').post(isAuthenticated, processPayment)
router.route('/stripeapi').get(isAuthenticated, sendStripeApi)

export default router
