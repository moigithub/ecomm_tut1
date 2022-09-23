import { AnyAction } from 'redux'

import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_FAIL,
  CLEAR_ERRORS,
  REVIEW_FAIL,
  REVIEW_REQUEST,
  REVIEW_RESET,
  REVIEW_SUCCESS
} from '../constants/product'

interface Image {
  public_id: string
  url: string
}
interface Review {
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
  products: Product[] | []
  productCount: number
  itemsPerPage: number
  error?: string | null
}
const initialState: ProductState = {
  loading: false,
  products: [],
  productCount: 0,
  itemsPerPage: 0,
  error: null
}

export const productReducer = (state = initialState, action: AnyAction): ProductState => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST:
      return {
        loading: true,
        products: [],
        productCount: 0,
        itemsPerPage: 0,
        error: null
      }
    case ALL_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        productCount: action.payload.totalCount,
        itemsPerPage: action.payload.itemsPerPage
      }
    case ALL_PRODUCTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

interface ProductDetailState {
  loading: boolean
  product: Product | null
  error?: string | null
}
const initialStateProductDetail: ProductDetailState = {
  loading: false,
  product: null,
  error: null
}

export const productDetailReducer = (
  state = initialStateProductDetail,
  action: AnyAction
): ProductDetailState => {
  switch (action.type) {
    case PRODUCT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        product: null,
        error: null
      }
    case PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload.product
      }
    case PRODUCT_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

//--
interface ReviewState {
  loading: boolean
  success?: string | null
  error?: string | null
}
const initialStateReview: ReviewState = {
  loading: false,
  success: null,
  error: null
}

export const newReviewReducer = (state = initialStateReview, action: AnyAction): ReviewState => {
  switch (action.type) {
    case REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null
      }
    case REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload
      }
    case REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case REVIEW_RESET:
      return {
        ...state,
        loading: false,
        error: null,
        success: null
      }
    default:
      return state
  }
}
