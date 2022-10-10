import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

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

export const appStateSlice = createSlice({
  name: 'app-state',
  initialState,
  reducers: {
    setSuccess: (state, action) => {
      state.message = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearStatus: state => {
      state.message = null
      state.error = null
    }
  }
})

export const { setSuccess, setError, clearStatus } = appStateSlice.actions

export default appStateSlice.reducer
