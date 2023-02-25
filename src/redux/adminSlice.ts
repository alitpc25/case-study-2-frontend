import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AdminState {
  jwtToken: string | null,
}

// Define the initial state using that type
const initialState: AdminState = {
    jwtToken: null,
}

export const adminSlice = createSlice({
  name: 'admin',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateAdminInfo: (state, action: PayloadAction<AdminState>) => {
      state.jwtToken = action.payload.jwtToken
    }
  }
})

export const { updateAdminInfo } = adminSlice.actions

export default adminSlice.reducer