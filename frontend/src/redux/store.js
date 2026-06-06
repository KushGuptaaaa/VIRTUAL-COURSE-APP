import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import courseSlice from './courseSlice.js'
import lectureSlice from "./lectureSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseSlice,
    lecture:lectureSlice,
  },
})


