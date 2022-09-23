import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import products from './routes/product.js'
import user from './routes/user.js'
import order from './routes/order.js'
import payment from './routes/payment.js'
import errorMiddleware from './middlewares/errors.js'

const app = express()

// const whitelist = ['http://localhost:5173', 'http://localhost:4000']
const corsOptions = {
  credentials: true,
  origin: [/localhost/]
  // allowedHeaders: ['content-type', 'Set-Cookie'],
  // exposedHeaders: ['Set-Cookie']
}

app.use('/uploads', express.static('uploads'))
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/v1', user)
app.use('/api/v1', products)
app.use('/api/v1', order)
app.use('/api/v1', payment)
app.use(errorMiddleware)

export default app
