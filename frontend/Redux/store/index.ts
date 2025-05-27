import { configureStore } from '@reduxjs/toolkit'
import signupReducer from '../features/auth/signupslice';
import loginReducer  from '../features/auth/loginslice';
import generateContent from '../features/generatecontent/generatecontent';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    login: loginReducer,
    content: generateContent,
    
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
