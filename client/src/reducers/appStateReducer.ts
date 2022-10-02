import { AnyAction } from 'redux'
import {
  SET_SUCCESS_STATUS,
  CLEAR_STATUS,
  SET_ERROR_STATUS,
  START_REQUEST
} from '../constants/user'

export interface AppState {
  loading: boolean
  error: string | null
  message: string | null
}
const initialState: AppState = {
  loading: false,
  error: null,
  message: null
}

export const appStateReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case START_REQUEST:
      return { ...state, loading: true }
    case SET_SUCCESS_STATUS:
      return { ...state, loading: false, message: action.payload }
    case SET_ERROR_STATUS:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_STATUS:
      return { ...state, message: null, error: null }
    default:
      return { ...state }
  }
}
