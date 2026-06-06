import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
    name:"course",
    initialState:{
        creatorCourseData:null,
        courseData:null,
        selectedCourse:null
    },
    reducers:{
        setCreatorCourseData:(state,action)=>{
            state.creatorCourseData = action.payload
        },
        setCourseData:(state,action)=>{
            state.courseData = action.payload
        },
        setSelectedCourse:(state,action)=>{
            state.selectedCourse = action.payload
        }

    }
})
 
export const {setCreatorCourseData} = courseSlice.actions
export const {setCourseData} = courseSlice.actions
export const {setSelectedCourse} = courseSlice.actions
export default courseSlice.reducer

// creatorCourseData → Educator ke saare courses
// courseData → Published courses ya courses list
// selectedCourse → Jo course currently open/edit/view ho raha hai
 




// redux me kiu save karna database me karna hai na

// Bilkul bhai, final data to database me hi save hota hai. 👍

// Redux aur Database ka role alag hai.

// Database (Permanent Storage)

// Jab tu course create/edit karta hai:

// await axios.post(...)

// Backend:

// Course.findByIdAndUpdate(...)

// MongoDB me save ho jata hai.

// Ye permanent hai.

// Redux (Temporary Frontend Storage)

// Maan le Dashboard page par courses dikhane hain.

// Option 1:

// Har component me API call:

// GET /courses
// GET /courses
// GET /courses

// Bar bar server hit hoga. ❌

// Option 2:

// Ek baar API call:

// GET /courses

// Aur Redux me save:

// dispatch(setCourseData(data))

// Ab kisi bhi page me:

// const { courseData } = useSelector(state => state.course)

// use kar sakte ho. ✅

// Example

// Course edit hua:

// Database update hua.
// Backend updated course return karta hai.
// Redux bhi update kar dete ho.

// Isliye page refresh kiye bina UI me naya data dikh jata hai.

// Agar Redux update na karo:

// DB me naya data hoga.
// Frontend me purana data dikhega jab tak dobara API call na ho.
// Simple line me

// Database = permanent source of truth.
// Redux = frontend ka temporary cache/state, taaki UI fast rahe aur baar-baar API call na karni pade. 🚀