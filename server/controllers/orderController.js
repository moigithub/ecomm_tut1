import mongoose from 'mongoose'
import Order from '../models/orders.js'
import Product from '../models/product.js'
import { catchError } from '../utils/catchError.js'
import ErrorHandler from '../utils/errorHandler.js'

export const newOrder = catchError(async (req, res, next) => {
  const { orderItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } =
    req.body

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id
  })

  res.status(201).json({ success: true, order })
})

export const getOrder = catchError(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  res.status(200).json({ success: true, order })
})

export const myOrders = catchError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).lean()

  const totalAmount = orders.reduce((t, o) => t + o.totalPrice, 0)

  res.status(200).json({ success: true, orders, totalAmount })
})

export const getOrders = catchError(async (req, res, next) => {
  const orders = await Order.find().lean()

  const totalAmount = orders.reduce((t, o) => t + o.totalPrice, 0)

  res.status(200).json({ success: true, orders, totalAmount })
})

export const processOrder = catchError(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (order.orderStatus === 'delivered') {
    return next(new ErrorHandler('order already delivered', 400))
  }

  for (const item of order.orderItems) {
    console.log('itm', item)
    await updateStock(item.product, item.quantity)
  }

  order.orderStatus = req.body.status
  order.deliveredAt = Date.now()
  order.save()

  res.status(201).json({ success: true, order })
})

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId)
  product.stock = product.stock - quantity
  await product.save()
}

export const deleteOrder = catchError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id)
  if (!order) return next(new ErrorHandler('order not found', 404))

  res.status(200).json({ success: true, order })
})
