import '../config/loadenv.js'
import Product from '../models/product.js'
import connectDatabase from '../config/database.js'
import products from '../data/product.json' assert { type: 'json' }

connectDatabase()

const seedProducts = async () => {
  try {
    await Product.deleteMany()
    console.log('products deleted')

    await Product.insertMany(products)
    console.log('products added')
  } catch (e) {
    console.error('error seeding products', e)
  } finally {
    process.exit(0)
  }
}

seedProducts()
