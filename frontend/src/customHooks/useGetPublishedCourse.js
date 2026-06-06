import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setCourseData } from '../redux/courseSlice'
const useGetPublishedCourse = () => {
const dispatch = useDispatch()
const {userData} = useSelector(state => state.user)

    useEffect(()=>{
       const getCourseData = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/course/getpublished" , {withCredentials:true})
             dispatch(setCourseData(result.data))
             console.log(result.data)
        } catch (error) {
            console.log(error)
        }
        
        }
       getCourseData()
    },[userData])

}

export default useGetPublishedCourse


// ye hook ka kaam hai published courses ko backend se fetch karke Redux me save karna.
 
// step 1 : api call Backend se saare published courses laata hai.
// Step 2: Redux me save -> dispatch(setCourseData(result.data))



// const { courseData } = useSelector(state => state.course)

// Redux ko kaise pata chala ki courseData naam ki state hai?

// Answer: courseSlice ke initialState se.

// Tera slice:

// initialState:{
//     creatorCourseData:null,
//     courseData:null,
//     selectedCourse:null
// }

// Yahan Redux state ka structure define ho gaya.

// Aur store me tune kuch aisa kiya hoga:

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//     course: courseReducer
//   }
// })

// To Redux state kuch aisi ban jaati hai:

// state = {
//   user: {
//     userData: ...
//   },

//   course: {
//     creatorCourseData: ...,
//     courseData: ...,
//     selectedCourse: ...
//   }
// }

// Isliye:

// state.course

// return karega:

// {
//   creatorCourseData: ...,
//   courseData: ...,
//   selectedCourse: ...
// }

// Aur:

// const { courseData } = state.course

// matlab:

// const courseData = state.course.courseData

// Jab ye code chalta hai:

// dispatch(setCourseData(result.data))

// to reducer run hota hai:

// setCourseData:(state,action)=>{
//     state.courseData = action.payload
// }

// Aur Redux state update ho jaati hai:

// course: {
//    creatorCourseData:null,
//    courseData: result.data,
//    selectedCourse:null
// }

// Phir kahin bhi:

// const { courseData } = useSelector(state => state.course)

// likhoge to wahi data mil jayega.
