import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import courseSlice from './courseSlice.js'
import lectureSlice from "./lectureSlice"
import reviewSlice from "./reviewSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseSlice,
    lecture:lectureSlice,
    review:reviewSlice
  },
})


