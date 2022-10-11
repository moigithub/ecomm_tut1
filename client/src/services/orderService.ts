import axios from 'axios'

export const getMyOrders = async () => {
  const { data } = await axios.get('http://localhost:4000/api/v1/orders/me', {
    headers: { 'content-type': 'application/json' },
    withCredentials: true
  })
  console.log('orders', data)
  return data
}

export const getOrders = async () => {
  let url = 'http://localhost:4000/api/v1/admin/orders'
  const { data } = await axios.get(url, { withCredentials: true })
  return data
}

export const updateOrder = async (id: string, order: any) => {
  const { data } = await axios.put(`http://localhost:4000/api/v1/admin/order/${id}`, order, {
    headers: { 'content-type': 'application/json' },
    withCredentials: true
  })
  return data
}

export const orderDetails = async (id: string) => {
  const { data } = await axios.get('http://localhost:4000/api/v1/order/' + id, {
    headers: { 'content-type': 'application/json' },
    withCredentials: true
  })
  return data.order
}

export const createOrder = async (order: any) => {
  const { data } = await axios.post('http://localhost:4000/api/v1/order/new', order, {
    headers: { 'content-type': 'application/json' },
    withCredentials: true
  })
  return data.order
}
