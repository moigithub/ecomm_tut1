import { AnyAction } from 'redux'
import {
  CLEAR_ERRORS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  SET_STATUS,
  CLEAR_STATUS
} from '../constants/user'

interface Avatar {
  url: string
  public_id?: string
}
export interface User {
  _id: string
  name: string
  email: string
  createdAt: Date
  avatar: Avatar
  role: string
  isAuthenticated: boolean
}

export interface AuthState {
  loading: boolean
  error: string | null
  user: User | null
  isAuthenticated: boolean
}
const initialState: AuthState = {
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false
}

export const authReducer = (state = initialState, action: AnyAction): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case LOAD_USER_REQUEST:
      return { ...state, loading: true, isAuthenticated: false, user: null, error: null }
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case LOAD_USER_SUCCESS:
      return { ...state, loading: false, isAuthenticated: true, user: action.payload }
    case LOGOUT_SUCCESS:
      return { ...state, loading: false, isAuthenticated: false, user: null }

    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case LOAD_USER_FAIL:
      return { ...state, loading: false, isAuthenticated: false, user: null, error: action.payload }
    case LOGOUT_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

export const appStateReducer = (state = { message: '' }, action: AnyAction) => {
  switch (action.type) {
    case SET_STATUS:
      return { ...state, message: action.payload }
    case CLEAR_STATUS:
      return { ...state, message: '' }
    default:
      return { ...state }
  }
}
