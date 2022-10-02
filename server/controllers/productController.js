import mongoose from 'mongoose'
import Product from '../models/product.js'
import { catchError } from '../utils/catchError.js'
import ErrorHandler from '../utils/errorHandler.js'
import fs from 'fs'

// /api/v1/product/new
export const newProducts = catchError(async (req, res, next) => {
  const images = req.files.map(file => ({
    public_id: file.filename,
    url: 'uploads/' + file.filename
  }))

  const newProduct = {
    ...req.body,
    images,
    user: req.user.id
  }
  const product = await Product.create(newProduct)

  res.status(200).json({ success: true, product })
})

// /api/v1/products
export const getProducts = catchError(async (req, res, next) => {
  const keyword = req.query.keyword
  const itemsPerPage = 4
  const currentPage = Number.parseInt(req.query.page, 10) || 1
  const skip = itemsPerPage * (currentPage - 1)
  const minPrice = Number.parseInt(req.query.minprice, 10)
  const maxPrice = Number.parseInt(req.query.maxprice, 10)
  const category = req.query.category
  // page=1 ... items 1 .. 4
  // page=2 ... items 5 ..8
  // page=3 ... items 9 ..12
  // page=4 ... items 13 ..16
  console.log('price filter', minPrice, maxPrice, category)

  const filter = {
    ...(keyword && { name: { $regex: keyword, $options: 'i' } }),
    ...(category && { category: { $eq: category } }),
    ...(minPrice &&
      maxPrice && { $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }] })
  }
  const products = await Product.find(filter).skip(skip).limit(itemsPerPage)
  const totalCount = await Product.countDocuments(filter)

  res.status(200).json({ success: true, products, totalCount, itemsPerPage })
})

// /api/v1/product/:id
export const getProduct = catchError(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      return res.status(200).json({ success: true, product })
    } else {
      return next(new ErrorHandler('Not found', 404))
    }
  } catch (err) {
    return next(new ErrorHandler('Not found', 404))
  }
})

// /api/v1/admin/product/:id
export const updateProduct = catchError(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404).json({ success: false, message: 'Not found' })
    }

    let images
    if (req.files.length > 0) {
      // delete product images

      for (const image of product.images) {
        try {
          fs.unlinkSync('./uploads/' + image.public_id)
        } catch (err) {
          console.log('image not found', err)
        }
      }

      images = req.files.map(file => ({
        public_id: file.filename,
        url: 'uploads/' + file.filename
      }))
    }

    const productData = {
      ...req.body
    }

    if (images) {
      productData.images = images
    }

    const udpatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true
    })
    return res
      .status(200)
      .json({ success: true, product: udpatedProduct, message: 'Product updated' })
  } catch (err) {
    res.status(400).json({ success: false, message: 'Not found', err })
  }
})

// /api/v1/admin/product/:id
export const deleteProduct = catchError(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      res.status(400).json({ success: false, message: 'Not found' })
    }

    // delete product images
    for (const image of product.images) {
      try {
        fs.unlinkSync('/uploads/' + image.public_id)
      } catch (err) {
        console.log('image not found', err)
      }
    }

    product.remove()
    return res.status(200).json({ success: true, product, message: 'Deleted successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: 'Not found', err })
  }
})

export const createProductReview = catchError(async (req, res, next) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.productId)
  const isReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

  if (isReviewed) {
    for (const review of product.reviews) {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment
        review.rating = Number(rating)
      }
    }
  } else {
    const newReview = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    }
    product.reviews.push(newReview)
    product.numOfReviews = product.reviews.length
  }

  product.ratings =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length

  await product.save()

  return res.status(200).json({ success: true, product })
})

export const getProductReviews = catchError(async (req, res, next) => {
  const product = await Product.findById(req.params.productId)

  if (!product) {
    return res.status(404).json({ success: false, message: 'Not found' })
  }

  return res.status(200).json({ success: true, reviews: product.reviews })
})

export const deleteProductReview = catchError(async (req, res, next) => {
  const product = await Product.findById(req.params.productId)
  if (!product) {
    return res.status(404).json({ success: false, message: 'Not found' })
  }

  const reviews = product.reviews.filter(review => review._id.toString() !== req.params.reviewId)
  const numOfReviews = reviews.length
  let ratings = 0
  if (numOfReviews > 0) {
    ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews
  }

  await Product.findByIdAndUpdate(
    req.params.productId,
    {
      reviews,
      ratings,
      numOfReviews
    },
    { new: true, runValidators: true }
  )

  return res.status(200).json({ success: true, message: 'Review deleted' })
})

///admin/products

// /api/v1/products
export const getAdminProducts = catchError(async (req, res, next) => {
  const products = await Product.find()

  res.status(200).json({ success: true, products })
})
