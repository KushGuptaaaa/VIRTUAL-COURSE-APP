import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setCreatorCourseData } from '../redux/courseSlice'

const useGetCreatorCourse = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
  
    useEffect(()=>{
       const creatorCourses = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/course/getcreator" , {withCredentials:true})
            console.log(result.data)
            dispatch(setCreatorCourseData(result.data))
            
        } catch (error) {
            console.log(error)
            
        }
       }
       creatorCourses()
    },[userData])
  
}

export default useGetCreatorCourse


// hai is hook ka main kaam hai:

// 👉 Creator (teacher/instructor) ke saare courses server se fetch karke Redux me store karna.