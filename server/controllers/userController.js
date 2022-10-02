import mongoose from 'mongoose'
import fs from 'fs'
import User from '../models/user.js'
import { catchError } from '../utils/catchError.js'
import ErrorHandler from '../utils/errorHandler.js'
const COOKIE_EXPIRE_TIME = parseInt(process.env.COOKIE_EXPIRE_TIME) || 1
// import cloudinary from 'cloudinary'
// cloudinary.config({
//   cloud_name: process.env.CLOUD,
//   api_key: process.env.CLOUD_KEY,
//   api_secret: process.env.CLOUD_SECRET
// })

// /api/v1/register
export const newUser = catchError(async (req, res, next) => {
  const { name, email, password } = req.body
  // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: 'uploads',
  //   width: 150,
  //   crop: 'scale'
  // })

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: req.file.filename,
      url: 'uploads/' + req.file.filename
    }
  })
  const token = user.getJwtToken()
  // auth cookie
  const options = {
    path: '/',

    maxAge: COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000, //n days
    sameSite: 'none',
    secure: true,
    httpOnly: true
  }

  res.status(201).cookie('token', token, options).json({ success: true, user, token })
})

export const loginUser = catchError(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) return next(new ErrorHandler('enter email and password', 401))

  const user = await User.findOne({
    email: email
  }).select('+password')

  if (!user) return next(new ErrorHandler('invalid credentials'), 400)
  if (!user.checkPassword(password)) return next(new ErrorHandler('invalid credentials', 401))

  const token = user.getJwtToken()

  // auth cookie
  const options = {
    path: '/',
    maxAge: COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000, //n days
    sameSite: 'none',
    secure: true,
    httpOnly: true
  }

  return res.status(200).cookie('token', token, options).json({ success: true, user, token })
})

// /api/v1/logout
export const logoutUser = catchError(async (req, res, next) => {
  const options = {
    path: '/',
    maxAge: 0, //n days
    // expires: new Date(),
    sameSite: 'none',
    secure: true,
    httpOnly: true
  }

  return res
    .status(200)
    .clearCookie('token', options)
    .json({ success: true, message: 'logout successfully' })
})

// /api/v1/forgotPassword
export const forgotPassword = catchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return next(new ErrorHandler('invalid credentials', 401))

  const token = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${req.protocol}://${req.hostname}/api/v1/password/reset/${token}`

  const message = `Click here to reset your password ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Forgot Password',
      message
    })

    return res.status(200).json({ success: true, message: 'reset password email sent' })
  } catch (err) {
    user.resetPasswordToken = null
    user.resetPasswordExpire = null
    await user.save({ validateBeforeSave: false })
    return res.status(500).json({ success: false, message: 'couldnt sent the email' })
  }
})

// /api/v1/resetPassword
export const resetPassword = catchError(async (req, res, next) => {
  const resetPwdToken = req.params.token
  const resetPasswordToken = crypto.createHash('sha256').update(resetPwdToken).digest('hex')

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
  if (!user) return next(new ErrorHandler('invalid token', 400))
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('invalid password', 400))
  }
  const token = user.getJwtToken()

  user.password = req.body.password
  user.resetPasswordToken = null
  user.resetPasswordExpire = null
  await user.save()

  return res.status(200).json({ success: true, message: 'reset password success', token })
})

// /api/v1/password/update
export const updatePassword = catchError(async (req, res, next) => {
  const userId = req.user.id
  const user = await User.findById(userId).select({ password: true })
  if (!user) return next(new ErrorHandler('not found', 404))

  console.log('pass', req.body)
  if (!user.checkPassword(req.body.oldPassword)) {
    return next(new ErrorHandler('invalid password', 400))
  }

  user.password = req.body.password
  await user.save()

  return res.status(200).json({ success: true, message: 'Password updated' })
})

// /api/v1/me
export const userProfile = catchError(async (req, res, next) => {
  const userId = req.user.id
  const user = await User.findById(userId)
  if (!user) return next(new ErrorHandler('not found', 404))

  return res.status(200).json({ success: true, user })
})

// PUT /api/v1/me
export const updateProfile = catchError(async (req, res, next) => {
  const userId = req.user.id

  //TODO: find teh avatar file and delete, replace on db. new file url
  const newData = {
    name: req.body.name,
    email: req.body.email
  }

  // check if user uploaded new avatar image, and delete old one if so
  console.log('file avatar', req.file)
  if (req.file) {
    const oldAvatarImage = req.user.avatar.url
    console.log('trying to delete avatar image', oldAvatarImage)
    try {
      fs.unlinkSync('./uploads/' + oldAvatarImage)
      //file removed
    } catch (err) {
      console.error('err removing avatar file', err)
    }

    newData.avatar = {
      public_id: req.file.filename,
      url: 'uploads/' + req.file.filename
    }
  }

  const user = await User.findByIdAndUpdate(userId, newData, {
    new: true,
    runValidators: true
  })
  if (!user) return next(new ErrorHandler('not found', 404))

  return res.status(200).json({ success: true, message: 'Profile updated', user })
})

// GET /api/v1/admin/users
export const getUsers = catchError(async (req, res, next) => {
  const users = await User.find()

  return res.status(200).json({ success: true, users })
})

// GET /api/v1/admin/user/:id
export const getUser = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) return next(new ErrorHandler('not found', 404))

  return res.status(200).json({ success: true, users: user })
})

// PUT /api/v1/admin/user/id
export const updateUser = catchError(async (req, res, next) => {
  const userId = req.params.id
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }
  const user = await User.findByIdAndUpdate(userId, newData, {
    new: true,
    runValidators: false
  })
  if (!user) return next(new ErrorHandler('not found', 404))

  return res.status(200).json({ success: true, message: 'Profile updated', user })
})

// DELETE /api/v1/admin/user/id
export const deleteUser = catchError(async (req, res, next) => {
  const userId = req.params.id

  if (userId === req.user.id) {
    return next(new ErrorHandler('cant self delete user', 401))
  }

  const user = await User.findById(userId)
  if (!user) return next(new ErrorHandler('not found', 404))

  try {
    fs.unlinkSync('./uploads/' + user.avatar.public_id)
    //file removed
  } catch (err) {
    console.error('err removing avatar file', err)
  }

  user.delete()
  return res.status(200).json({ success: true, message: 'user deleted', user })
})
