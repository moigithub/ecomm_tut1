import axios from 'axios'

export const getProducts = async (
  page: number,
  keyword: string,
  price: number[],
  category: string
) => {
  let url = `http://localhost:4000/api/v1/products?page=${page}&keyword=${keyword}&minprice=${price[0]}&maxprice=${price[1]}`

  if (category) {
    url += `&category=${category}`
  }

  const { data } = await axios.get(url, { withCredentials: true })

  return data
}

export const getProduct = async (id: string) => {
  const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`, {
    withCredentials: true
  })
  return data.product
}

export const getAdminProducts = async () => {
  let url = 'http://localhost:4000/api/v1/admin/products'
  const { data } = await axios.get(url, { withCredentials: true })
  return data
}

export const sendReview = async (id: string, rating: number, comment: string) => {
  const { data } = await axios.post(
    `http://localhost:4000/api/v1/product/${id}/review`,
    {
      rating,
      comment
    },
    { headers: { 'content-type': 'application/json' }, withCredentials: true }
  )

  return data.product
}

export const deleteReview = async (productId: string, reviewId: string) => {
  const { data } = await axios.delete(
    `http://localhost:4000/api/v1/admin/product/${productId}/reviews/${reviewId}`,
    { withCredentials: true }
  )
  //  return data
  return reviewId
}

export const getProductReviews = async (id: string) => {
  let url = `http://localhost:4000/api/v1/product/${id}/reviews`
  const { data } = await axios.get(url, { withCredentials: true })

  return data.reviews
}

export const deleteProduct = async (id: string) => {
  const { data } = await axios.delete(`http://localhost:4000/api/v1/admin/product/${id}`, {
    headers: { 'content-type': 'application/json' },
    withCredentials: true
  })
  console.log('delete product', data)

  return id
}

export const newProduct = async (productData: any) => {
  const { data } = await axios.post(`http://localhost:4000/api/v1/admin/product/new`, productData, {
    headers: { 'content-type': 'multipart/form-data' },
    withCredentials: true
  })
  console.log('new product', data)
  return data.product
}

export const updateProduct = async (id: string, productData: any) => {
  const { data } = await axios.put(
    `http://localhost:4000/api/v1/admin/product/${id}`,
    productData,
    { headers: { 'content-type': 'multipart/form-data' }, withCredentials: true }
  )
  return data
}
