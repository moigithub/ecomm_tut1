import axios from 'axios'

export const getProduct = async (id: string, quantity: number) => {
  const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`, {
    withCredentials: true
  })
  return {
    _id: id,
    name: data.product.name,
    price: data.product.price,
    image: data.product.images[0].url,
    stock: data.product.stock,
    quantity
  }
}

export const getPaymentData = async (paymentData: any) => {
  const res = await axios.post('http://localhost:4000/api/v1/payment/process', paymentData, {
    headers: { 'content-type': 'application/json' },
    withCredentials: true
  })
  return res
}

export const getStripeApiKey = async () => {
  const { data } = await axios.get('http://localhost:4000/api/v1/stripeapi', {
    withCredentials: true
  })
  console.log('stripe key', data)
  return data.stripe
}
