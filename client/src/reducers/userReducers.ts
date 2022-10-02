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
  ALL_USERS_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  GET_USER_FAIL,
  GET_USER_REQUEST,
  GET_USER_SUCCESS
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

export interface AllUsersState {
  loading: boolean
  error: string | null
  users: User[]
}
const initialStateAllUser: AllUsersState = {
  loading: false,
  error: null,
  users: []
}

export const allUserReducer = (state = initialStateAllUser, action: AnyAction): AllUsersState => {
  switch (action.type) {
    case ALL_USERS_REQUEST:
      return { ...state, loading: true, users: [], error: null }

    case ALL_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload }

    case ALL_USERS_FAIL:
      return { ...state, loading: false, users: [], error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

export interface UserState {
  loading: boolean
  error: string | null
  user: User | null
}
const initialStateUser: UserState = {
  loading: false,
  error: null,
  user: null
}
export const userDetailReducer = (state = initialStateUser, action: AnyAction): UserState => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return { ...state, loading: true, user: null, error: null }

    case GET_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload }

    case GET_USER_FAIL:
      return { ...state, loading: false, user: null, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}
