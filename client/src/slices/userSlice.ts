import { createSlice } from '@reduxjs/toolkit'

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
  selectedUser: User | null
  users: User[]

  isAuthenticated: boolean
}
const initialState: AuthState = {
  loading: false,
  error: null,
  user: null,
  selectedUser: null,
  users: [],
  isAuthenticated: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    loginUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logoutUser: state => {
      state.user = null
      state.isAuthenticated = false
    },
    setUserMe: (state, action) => {
      state.user = action.payload
    },
    updatePassword: (state, action) => {},
    forgotPassword: (state, action) => {},
    setAdminUsers: (state, action) => {
      state.users = action.payload
    },
    setAdminUserDetail: (state, action) => {
      state.selectedUser = action.payload
    },
    updateAdminUser: (state, action) => {
      state.selectedUser = action.payload
      state.users = state.users.map(user => (user._id = action.payload._id ? action.payload : user))
    },
    deleteAdminUser: (state, action) => {
      state.users = state.users.filter(user => user._id !== action.payload)
    }
  }
})

export const {
  registerUser,
  loginUser,
  logoutUser,
  setUserMe,
  updatePassword,
  forgotPassword,
  setAdminUsers,
  setAdminUserDetail,
  updateAdminUser,
  deleteAdminUser
} = userSlice.actions

export default userSlice.reducer
