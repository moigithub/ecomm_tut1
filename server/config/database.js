import mongoose from 'mongoose'
console.log('db', process.env.DB_LOCAL_URI)
const connectDatabase = () => {
  mongoose
    .connect('mongodb://0.0.0.0:27017/shop')
    .then(conn => {
      console.log('mongodb connected', conn.connection.host)
    })
    .catch(err => console.log('mongodb connection error: ', err))
}

export default connectDatabase
