import { ThunkAction } from 'redux-thunk'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Product, Review } from '../interfaces/product'
import * as productService from './../services/productService'

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

interface ProductPayload {
  products: Product[]
  totalCount: number
  itemsPerPage: number
}
interface GetProductsFilter {
  page: number
  keyword: string
  price: number[]
  category: string
}
interface ThunkApi {
  rejectValue: { message: string }
}

export const getProducts = createAsyncThunk<ProductPayload, GetProductsFilter, ThunkApi>(
  'product/getProducts',
  async (filter, thunkApi) => {
    try {
      const { page, keyword, price, category } = filter
      return await productService.getProducts(page, keyword, price, category)
    } catch (error: any) {
      console.error('getProducts', error)
      return thunkApi.rejectWithValue({ message: error.message })
    }
  }
)

export const getProductDetails = createAsyncThunk<Product, string, ThunkApi>(
  'product/getProduct',
  async (id, thunkApi) => {
    try {
      return await productService.getProduct(id)
    } catch (error: any) {
      console.error('getProduct', error)
      return thunkApi.rejectWithValue({ message: error.message })
    }
  }
)

export const productSlice = createSlice({
  name: 'product',
  initialState,
  extraReducers: builder => {
    builder.addCase(getProducts.pending, state => {
      state.loading = true
    })
    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.error = action.payload.message
      } else {
        state.error = action.error.message
      }
    })
    builder.addCase(getProducts.fulfilled, (state, { payload }) => {
      state.loading = false
      state.products = payload.products
      state.productCount = payload.totalCount
      state.itemsPerPage = payload.itemsPerPage
    })
    //----
    builder.addCase(getProductDetails.pending, state => {
      state.loading = true
    })
    builder.addCase(getProductDetails.rejected, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.error = action.payload.message
      } else {
        state.error = action.error.message
      }
    })
    builder.addCase(getProductDetails.fulfilled, (state, { payload }) => {
      state.loading = false
      state.product = payload
    })
  },
  reducers: {
    // setProducts: (state, action) => {
    //   state.products = action.payload.products
    //   state.productCount = action.payload.totalCount
    //   state.itemsPerPage = action.payload.itemsPerPage
    // },
    // setProductDetail: (state, action) => {
    //   state.product = action.payload
    // },
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
