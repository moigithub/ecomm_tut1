import axios from 'axios'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import {
  ALL_USERS_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  CLEAR_ERRORS,
  GET_USER_FAIL,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  SET_ERROR_STATUS,
  SET_SUCCESS_STATUS,
  START_REQUEST
} from '../constants/user'
import { RootState } from '../store'

export const login: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (email = '', password = '') =>
  async dispatch => {
    try {
      dispatch({ type: LOGIN_REQUEST })
      let url = `http://localhost:4000/api/v1/login`

      const { data } = await axios.post(
        url,
        { email, password },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      )
      dispatch({ type: LOGIN_SUCCESS, payload: data.user })
    } catch (error: any) {
      dispatch({ type: LOGIN_FAIL, payload: error.response.data.message })
    }
  }

export const registerUser: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (name = '', email = '', password = '', avatar = null) =>
  async dispatch => {
    try {
      dispatch({ type: REGISTER_REQUEST })
      let url = `http://localhost:4000/api/v1/register`

      const formData = new FormData()
      formData.set('name', name)
      formData.set('email', email)
      formData.set('password', password)
      formData.set('avatar', avatar)
      const { data } = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
      dispatch({ type: REGISTER_SUCCESS, payload: data.user })
    } catch (error: any) {
      console.error('error', error)
      dispatch({ type: REGISTER_FAIL, payload: error.response.data.message })
    }
  }

export const loadUser: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  () => async dispatch => {
    try {
      dispatch({ type: LOAD_USER_REQUEST })
      let url = `http://localhost:4000/api/v1/me`

      const { data } = await axios.get(url, { withCredentials: true })
      dispatch({ type: LOAD_USER_SUCCESS, payload: data.user })
    } catch (error: any) {
      console.error('error', error)
      dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message })
    }
  }

export const updateUser: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (id = '', name = '', email = '', role = '') =>
  async dispatch => {
    try {
      dispatch({ type: START_REQUEST })
      let url = `http://localhost:4000/api/v1/admin/user/${id}`

      const userData = {
        name,
        email,
        role
      }
      const { data } = await axios.put(url, userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      dispatch({ type: SET_SUCCESS_STATUS, payload: 'Update Successful' })
    } catch (error: any) {
      console.error('error', error)
      dispatch({ type: SET_ERROR_STATUS, payload: error.response.data.message })
    }
  }

export const updatePassword: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (oldPassword = '', password = '') =>
  async dispatch => {
    try {
      dispatch({ type: START_REQUEST })
      let url = `http://localhost:4000/api/v1/password/update`

      const { data } = await axios.post(
        url,
        { oldPassword, password },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      )
      dispatch({ type: SET_SUCCESS_STATUS, payload: 'Password updated successfully' })
    } catch (error: any) {
      dispatch({ type: SET_ERROR_STATUS, payload: error.response.data.message })
    }
  }

export const forgotPassword: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (email = '') =>
  async dispatch => {
    try {
      dispatch({ type: START_REQUEST })

      let url = `http://localhost:4000/api/v1/forgotPassword`

      const { data } = await axios.post(
        url,
        { email },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      )
      dispatch({ type: SET_SUCCESS_STATUS, payload: 'Email was sent to reset ur password' })
    } catch (error: any) {
      dispatch({ type: SET_ERROR_STATUS, payload: error.response.data.message })
    }
  }

export const logout: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  () => async dispatch => {
    try {
      let url = `http://localhost:4000/api/v1/logout`

      await axios.post(url, { withCredentials: true })
      dispatch({ type: LOGOUT_SUCCESS, payload: null })
    } catch (error: any) {
      console.error('error', error)
      dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message })
    }
  }

export const clearError = () => (dispatch: Dispatch<Action>) => {
  return dispatch({ type: CLEAR_ERRORS })
}

export const loadAllUsers: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  () => async dispatch => {
    try {
      dispatch({ type: ALL_USERS_REQUEST })
      let url = `http://localhost:4000/api/v1/admin/users`

      const { data } = await axios.get(url, { withCredentials: true })
      dispatch({ type: ALL_USERS_SUCCESS, payload: data.users })
    } catch (error: any) {
      console.error('error', error)
      dispatch({ type: ALL_USERS_FAIL, payload: error.response.data.message })
    }
  }

export const getUserDetail: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (id: string) => async dispatch => {
    try {
      dispatch({ type: GET_USER_REQUEST })
      let url = `http://localhost:4000/api/v1/admin/user/${id}`

      const { data } = await axios.get(url, { withCredentials: true })
      dispatch({ type: GET_USER_SUCCESS, payload: data.users })
    } catch (error: any) {
      console.error('error', error)
      dispatch({ type: GET_USER_FAIL, payload: error.response.data.message })
    }
  }

export const deleteUser: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (id = '') =>
  async dispatch => {
    try {
      dispatch({ type: START_REQUEST })

      let url = `http://localhost:4000/api/v1/admin/user/${id}`

      const { data } = await axios.delete(url, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      dispatch({ type: SET_SUCCESS_STATUS, payload: 'User deleted' })
    } catch (error: any) {
      dispatch({ type: SET_ERROR_STATUS, payload: error.response.data.message })
    }
  }
