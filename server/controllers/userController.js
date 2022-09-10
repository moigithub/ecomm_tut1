import mongoose from 'mongoose'
import User from '../models/user.js'
import { catchError } from '../utils/catchError.js'
import ErrorHandler from '../utils/errorHandler.js'

// /api/v1/register
export const newUser = catchError(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'aaa',
      url: 'aaa'
    }
  })
  const token = user.getJwtToken()

  res.status(201).json({ success: true, user, token })
})

export const loginUser = catchError(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) return next(new ErrorHandler('enter email and password', 401))

  const user = await User.findOne({
    email: email
  }).select('+password')

  if (!user) return next(new ErrorHandler('invalid credentials'))
  if (!user.checkPassword(password)) return next(new ErrorHandler('invalid credentials', 401))

  const token = user.getJwtToken()

  // auth cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000), //n days
    httpOnly: true
  }

  return res.status(200).cookie('token', token, options).json({ success: true, user, token })
})

// /api/v1/logout
export const logoutUser = catchError(async (req, res, next) => {
  res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true })

  return res.json({ success: true, message: 'logout successfully' })
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

  if (!user.checkPassword(req.body.oldPassword)) {
    return next(new ErrorHandler('invalid password', 400))
  }

  if (req.body.password !== req.body.confirmPassword) {
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

// PUT /api/v1/profile
export const updateProfile = catchError(async (req, res, next) => {
  const userId = req.user.id
  const newData = {
    name: req.body.name,
    email: req.body.email
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

  const user = await User.findByIdAndDelete(userId)
  if (!user) return next(new ErrorHandler('not found', 404))

  return res.status(200).json({ success: true, message: 'user deleted', user })
})
