import * as dotenv from 'dotenv'
dotenv.config({ path: 'server/config/config.env' })

import express from 'express'
import products from './routes/product.js'
import user from './routes/user.js'
import order from './routes/order.js'
import errorMiddleware from './middlewares/errors.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1', products)
app.use('/api/v1', user)
app.use('/api/v1', order)
app.use(errorMiddleware)

export default app
