import { createSlice } from '@reduxjs/toolkit'

interface Image {
  public_id: string
  url: string
}
export interface Review {
  _id: string
  user: string
  name: string
  rating: number
  comment: string
}
export interface Product {
  _id: string
  name: string
  price: number
  description: string
  ratings: number
  images: Image[]
  category: string
  seller: string
  stock: number
  numOfReviews: number
  reviews: Review[]
  user: string
}

interface ProductState {
  loading: boolean
  products: Product[]
  product?: Product | null
  adminProducts: Product[]
  productReviews: Review[]
  productCount: number
  itemsPerPage: number
  error?: string | null
}
const initialState: ProductState = {
  loading: false,
  product: null,
  products: [],
  adminProducts: [],
  productReviews: [],
  productCount: 0,
  itemsPerPage: 0,
  error: null
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products
      state.productCount = action.payload.totalCount
      state.itemsPerPage = action.payload.itemsPerPage
    },
    setProductDetail: (state, action) => {
      state.product = action.payload
    },
    setProductReviews: (state, action) => {
      state.productReviews = action.payload
    },

    setAdminProducts: (state, action) => {
      state.adminProducts = action.payload.products
      state.productCount = action.payload.totalCount
      state.itemsPerPage = action.payload.itemsPerPage
    },
    addAdminProduct: (state, action) => {
      console.log('new admin produc', action.payload)
      state.adminProducts.push(action.payload)
    },
    updateAdminProduct: (state, action) => {
      state.adminProducts = state.adminProducts.map(product =>
        product._id === action.payload._id ? action.payload : product
      )
    },
    deleteAdminProduct: (state, action) => {
      state.adminProducts = state.adminProducts.filter(product => product._id !== action.payload)
    },

    addProductReview: (state, action) => {
      // state.productReviews.push(action.payload)
      state.product = action.payload
      // state.products = state.products.map(product =>
      //   product._id === action.payload._id ? action.payload : product
      // )
    },
    deleteProductReview: (state, action) => {
      state.productReviews = state.productReviews.filter(review => review._id !== action.payload)
    }
  }
})

export const {
  setProducts,
  setProductDetail,
  setProductReviews,
  setAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  addProductReview,
  deleteProductReview
} = productSlice.actions

export default productSlice.reducer
