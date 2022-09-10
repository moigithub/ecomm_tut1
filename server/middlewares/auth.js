import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import ErrorHandler from '../utils/errorHandler.js'

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token
  console.log('isauth', token)

  if (!token) return next(new ErrorHandler('unauthorized', 401))

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id)

  next()
}

export const isAdmin = async (req, res, next) => {
  if (req.user?.role !== 'admin') return next(new ErrorHandler('unauthorized', 401))

  next()
}
