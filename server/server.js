import app from './app.js'
import connectDatabase from './config/database.js'

connectDatabase()

const server = app.listen(process.env.PORT, () => {
  console.log('listening', process.env.PORT)
})

server.on('unhandledRejection', err => {
  console.error('Error', err)

  server.close(() => {
    process.exit(1)
  })
})
