import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setSelectedCourse } from '../redux/courseSlice';
import { useEffect } from 'react';
import { FaStar } from "react-icons/fa6";
import img from "/empty.jpg"
import { FaPlayCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import Card from '../component/Card';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function ViewCourse() {
    const navigate = useNavigate()
    const {courseId} = useParams()
    const {courseData} = useSelector(state=>state.course)
    const {selectedCourse} = useSelector(state=>state.course)
    const {userData} = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const [selectedLecture,setSelectedLecture] = useState(null)
    const [creatorCourses,setCreatorCourses] = useState(null)
    const [isEnrolled,setIsEnrolled] = useState(false)
    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState("")
    const [loading,setLoading] = useState(false)

    const fetchCourseData = async () => {
        courseData?.map((course)=>{
            if(course._id === courseId){
               dispatch(setSelectedCourse(course)) 
               return null
            }
        })
    }

    const checkEnrollment = ()=>{
        const verify = userData?.enrolledCourses?.some(c => (typeof c === 'string' ? c : c._id).toString() === courseId?.toString())
        if(verify) setIsEnrolled(true)
    }

    useEffect(()=>{
      fetchCourseData()
      checkEnrollment()
    },[courseData, courseId, userData])

    useEffect(()=>{
      if(selectedCourse?.creator?._id && courseData?.length > 0){
        const creatorCourse = courseData.filter((course)=>
        course.creator?._id === selectedCourse?.creator?._id && course._id !== courseId)
        setCreatorCourses(creatorCourse)
      }
    },[selectedCourse, courseData])

    const handleEnroll = async (userId, courseId) => {
        try {
            
            const orderData = await axios.post(serverUrl + "/api/order/razorpay-order", {userId, courseId}, {withCredentials:true})
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.data.amount,
                currency: 'INR',
                name:"VIRTUAL COURSES",
                description:"COURSE ENROLLMENT PAYMENT",
                order_id:orderData.data.id,
                handler: async function (response) {
                try {
                    const verifyPayment = await axios.post(serverUrl + "/api/order/verifypayment",{
                        ...response, courseId, userId
                    }, {withCredentials:true})
                   setIsEnrolled(true)
                    toast.success(verifyPayment.data.message)
                } catch (error) {
                    toast.error(error.response.data.message)
                }
                }
            }
            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while enrolling.")
        }
    }

    const handleReview = async () => {
        setLoading(true)
        try {
           await axios.post(serverUrl + "/api/review/createreview", {rating, comment, courseId}, {withCredentials:true}) 
           setLoading(false)
           toast.success("Review Added")
           setRating(0)
           setComment("")
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message)
            setRating(0)
            setComment("")
        }
    }

    const calculateAvgReview = (reviews) =>{
       if(!reviews || reviews.length === 0) return 0
       const total = reviews.reduce((sum, review)=> sum + review.rating, 0)
       return (total / reviews.length).toFixed(1)
    }

    const avgRating = calculateAvgReview(selectedCourse?.reviews)

  return (
    <div className='min-h-screen bg-gray-100 py-10 px-4'>
      <div className='max-w-6xl mx-auto space-y-6'>

        {/* Back Button */}
        <button onClick={()=>navigate("/")} className='flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-all duration-200'>
          <FaArrowLeftLong /> Back to Home
        </button>

        {/* Top Section */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-8'>

          {/* Thumbnail */}
          <div className='w-full md:w-1/2'>
            <img
              src={selectedCourse?.thumbnail || img}
              alt="thumbnail"
              className='rounded-xl w-full h-[280px] object-cover shadow-md'
            />
          </div>

          {/* Course Info */}
          <div className='flex-1 flex flex-col justify-between gap-4'>
            <div className='space-y-2'>
              <span className='text-xs font-semibold uppercase tracking-widest text-gray-400'>{selectedCourse?.category}</span>
              <h2 className='text-2xl font-bold text-gray-900 leading-snug'>{selectedCourse?.title}</h2>
              <p className='text-gray-500 text-sm'>{selectedCourse?.subTitle}</p>
            </div>

            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1 text-amber-400 font-semibold text-sm'>
                <FaStar/> {avgRating}
              </div>
              <span className='text-gray-400 text-sm'>(1,200 Reviews)</span>
              <span className='text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium'>{selectedCourse?.level || "All Levels"}</span>
            </div>

            <div className='flex items-end gap-3'>
              <span className='text-3xl font-bold text-gray-900'>₹{selectedCourse?.price}</span>
              <span className='line-through text-gray-400 text-sm mb-1'>₹599</span>
            </div>

            <ul className='text-sm text-gray-600 space-y-1'>
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>
            </ul>

            {!isEnrolled
              ? <button
                  className='w-full md:w-fit bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                  onClick={()=>handleEnroll(userData._id, courseId)}
                >
                  Enroll Now
                </button>
              : <button
                  className='w-full md:w-fit bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                  onClick={()=>navigate(`/viewlecture/${courseId}`)}
                >
                  Watch Now →
                </button>
            }
            {isEnrolled && (
                <button
                    onClick={() => navigate(`/chat/${userData._id}_${selectedCourse?.creator?._id}`)}
                    className='w-full md:w-fit bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200'
                >
                    💬 Chat with Educator
                </button>
            )}
          </div>
        </div>

        {/* What You'll Learn + Who This Is For */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
            <h2 className='text-lg font-bold text-gray-800 mb-3'>What You'll Learn</h2>
            <ul className='list-disc pl-5 text-gray-600 text-sm space-y-1'>
              <li>Learn {selectedCourse?.category} from scratch</li>
              <li>Build real-world projects</li>
              <li>Industry-ready skills</li>
            </ul>
          </div>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
            <h2 className='text-lg font-bold text-gray-800 mb-3'>Who This Course is For</h2>
            <p className='text-gray-600 text-sm'>Beginners, aspiring developers, and professionals looking to upgrade their skills.</p>
          </div>
        </div>

        {/* Curriculum + Video Player */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-sm border border-gray-200'>
            <h2 className='text-lg font-bold text-gray-800 mb-1'>Course Curriculum</h2>
            <p className='text-xs text-gray-400 mb-4'>{selectedCourse?.lectures?.length} Lectures</p>
            <div className='flex flex-col gap-2'>
              {selectedCourse?.lectures?.map((lecture, index)=>(
                <button key={index}
                  disabled={!lecture.isPreviewFree}
                  onClick={()=>{ if(lecture.isPreviewFree) setSelectedLecture(lecture) }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200
                    ${lecture.isPreviewFree ? "hover:bg-gray-50 cursor-pointer border-gray-200 hover:border-gray-400" : "cursor-not-allowed opacity-50 border-gray-100"}
                    ${selectedLecture?.lectureTitle === lecture?.lectureTitle ? "bg-gray-100 border-gray-400 font-semibold" : ""}`}
                >
                  <span className={`text-base ${lecture.isPreviewFree ? "text-black" : "text-gray-400"}`}>
                    {lecture.isPreviewFree ? <FaPlayCircle/> : <FaLock/>}
                  </span>
                  <span className='text-sm text-gray-800'>{lecture?.lectureTitle}</span>
                </button>
              ))}
            </div>
          </div>

          <div className='bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-sm border border-gray-200'>
            <div className='aspect-video w-full rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center'>
              {selectedLecture?.videoUrl
                ? <video className='w-full h-full object-cover' src={selectedLecture?.videoUrl} controls/>
                : <div className='flex flex-col items-center gap-2 text-gray-400'>
                    <FaPlayCircle className='w-10 h-10'/>
                    <span className='text-sm'>Select a free preview lecture</span>
                  </div>
              }
            </div>
            {selectedLecture && (
              <p className='mt-3 text-sm font-medium text-gray-700'>Now Playing: {selectedLecture?.lectureTitle}</p>
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
          <h2 className='text-lg font-bold text-gray-800 mb-4'>Write a Review</h2>
          <div className='flex gap-2 mb-3'>
            {[1,2,3,4,5].map((star)=>(
              <FaStar key={star}
                onClick={()=>setRating(star)}
                className={`w-6 h-6 cursor-pointer transition-all duration-150 hover:scale-110 ${star <= rating ? "fill-amber-400" : "fill-gray-200"}`}
              />
            ))}
          </div>
          <textarea
            onChange={(e)=>setComment(e.target.value)}
            value={comment}
            className='w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black resize-none'
            placeholder='Write your review here...'
            rows={3}
          />
          <button
            className='mt-3 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60'
            disabled={loading}
            onClick={handleReview}
          >
            {loading ? <ClipLoader size={18} color='white'/> : "Submit Review"}
          </button>
        </div>

        {/* Creator Info */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-5'>
          <img
            src={selectedCourse?.creator?.photoUrl || img}
            alt="creator"
            className='w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm'
          />
          <div>
            <h2 className='text-base font-bold text-gray-900'>{selectedCourse?.creator?.name}</h2>
            <p className='text-sm text-gray-500'>{selectedCourse?.creator?.email}</p>
            <p className='text-sm text-gray-400 mt-0.5'>{selectedCourse?.creator?.description}</p>
          </div>
        </div>

        {/* Other Courses */}
        {creatorCourses?.length > 0 && (
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
            <h2 className='text-lg font-bold text-gray-800 mb-4'>Other Courses by this Educator</h2>
            <div className='flex flex-wrap gap-6 justify-start'>
              {creatorCourses?.map((course, index)=>(
                <Card key={index} thumbnail={course.thumbnail} id={course._id} price={course.price} title={course.title} category={course.category}/>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ViewCourse