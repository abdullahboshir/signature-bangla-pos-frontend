import { configureStore } from '@reduxjs/toolkit'
import {reducer} from './rootReducer'
import { baseApi } from '../api/base/baseApi'

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware)
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
