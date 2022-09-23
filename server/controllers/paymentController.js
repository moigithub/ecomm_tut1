import stripe from 'stripe'
import { catchError } from '../utils/catchError.js'
console.log('stripe sekret', process.env.STRIPE_SECRET)
const stripeApi = stripe(process.env.STRIPE_SECRET)

// post api/v1/payment/process
export const processPayment = catchError(async (req, res, next) => {
  const paymentIntent = await stripeApi.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    metadata: {
      'integration-check': 'accept_a_payment'
    }
  })

  res.status(200).json({ success: true, client_secret: paymentIntent.client_secret })
})

// GET api/v1/stripeapi
export const sendStripeApi = catchError(async (req, res, next) => {
  res.status(200).json({ stripe: process.env.STRIPE_KEY })
})
