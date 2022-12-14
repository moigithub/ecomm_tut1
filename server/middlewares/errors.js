const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV !== 'production') {
    res
      .status(err.statusCode)
      .json({ success: false, error: err, message: err.message, stack: err.stack })
  } else {
    res.status(err.statusCode).json({ success: false, message: err.message })
  }
}

export default errorHandler
