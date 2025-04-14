import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/lib/features/auth/authSlice"
import leadsReducer from "@/lib/features/leads/leadsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
