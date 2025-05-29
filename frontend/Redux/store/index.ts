import { configureStore } from '@reduxjs/toolkit'
import signupReducer from '../features/auth/signupslice';
import loginReducer from '../features/auth/loginslice';
import generateContent from '../features/generatecontent/generatecontent';
import BlogContent from '../features/BlogContent/blog';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    login: loginReducer,
    content: generateContent,
    blogContent: BlogContent,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
