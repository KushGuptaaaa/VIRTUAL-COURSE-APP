import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import img from "/empty.jpg"

function ViewLectures() {
    const { courseId } = useParams()
    const { courseData } = useSelector(state => state.course)
    const { userData } = useSelector(state => state.user)
    const selectedCourse = courseData?.find((course) => course._id === courseId)
    const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null)
    const [progress, setProgress] = useState(null)
    const [completedLectures, setCompletedLectures] = useState([])
    const navigate = useNavigate()

    // Progress fetch karo
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const result = await axios.get(serverUrl + `/api/progress/${courseId}`, { withCredentials: true })
                if (result.data) {
                    setProgress(result.data)
                    setCompletedLectures(result.data.completedLectures || [])
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchProgress()
    }, [courseId])

    // Video khatam hone pe progress update karo
    const handleVideoEnd = async () => {
        if (!selectedLecture?._id) return
        if (completedLectures.includes(selectedLecture._id)) return

        try {
            const result = await axios.post(serverUrl + "/api/progress/update", {
                courseId,
                lectureId: selectedLecture._id
            }, { withCredentials: true })
            setProgress(result.data)
            setCompletedLectures(result.data.completedLectures || [])
        } catch (error) {
            console.log(error)
        }
    }

    const totalLectures = selectedCourse?.lectures?.length || 0
    const completedCount = completedLectures.length
    const progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0
    const isCompleted = progress?.isCompleted

    return (
        <div className='min-h-screen bg-gray-50 p-4 md:p-6 flex flex-col md:flex-row gap-6'>

            {/* Left - Video Player */}
            <div className='w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>

                <div className='mb-4'>
                    <h2 className='text-xl font-bold flex items-center gap-3 text-gray-800'>
                        <FaArrowLeftLong className='text-black w-5 h-5 cursor-pointer hover:text-gray-500 transition-all' onClick={() => navigate("/")} />
                        {selectedCourse?.title}
                    </h2>
                    <div className='mt-1 flex gap-4 text-xs text-gray-400 font-medium'>
                        <span>{selectedCourse?.category}</span>
                        <span>{selectedCourse?.level}</span>
                    </div>
                </div>

                {/* Video */}
                <div className='aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-200'>
                    {selectedLecture?.videoUrl
                        ? <video
                            className='w-full h-full object-cover'
                            src={selectedLecture?.videoUrl}
                            controls
                            onEnded={handleVideoEnd}  // video khatam hone pe progress update
                        />
                        : <div className='flex items-center justify-center h-full text-white text-sm'>Select a lecture to start watching</div>
                    }
                </div>

                <h2 className='text-lg font-semibold text-gray-800 mb-6'>{selectedLecture?.lectureTitle}</h2>

                {/* Progress Bar */}
                <div className='bg-gray-50 border border-gray-200 rounded-2xl p-5'>
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-sm font-bold text-gray-700'>Course Progress</h3>
                        <span className='text-sm font-semibold text-indigo-600'>{progressPercent}%</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2.5 mb-2'>
                        <div
                            className='bg-indigo-600 h-2.5 rounded-full transition-all duration-500'
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className='text-xs text-gray-400'>{completedCount} of {totalLectures} lectures completed</p>

                    {/* Certificate Button */}
                    {isCompleted && (
                        <button
                            onClick={() => navigate(`/certificate/${courseId}`)}
                            className='mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all active:scale-95'
                        >
                            🎓 Get Your Certificate
                        </button>
                    )}
                </div>
            </div>

            {/* Right - Lectures List */}
            <div className='w-full md:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit'>
                <h2 className='text-lg font-bold mb-1 text-gray-800'>All Lectures</h2>
                <p className='text-xs text-gray-400 mb-4'>{totalLectures} Lectures</p>

                <div className='flex flex-col gap-2 mb-6'>
                    {selectedCourse?.lectures?.length > 0
                        ? selectedCourse?.lectures?.map((lecture, index) => {
                            const isDone = completedLectures.includes(lecture._id)
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedLecture(lecture)}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${selectedLecture?._id === lecture._id
                                        ? 'bg-indigo-50 border-indigo-300'
                                        : 'hover:bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <div className='flex items-center gap-2'>
                                        {isDone
                                            ? <FaCheckCircle className='text-green-500 text-base flex-shrink-0' />
                                            : <FaPlayCircle className='text-gray-400 text-base flex-shrink-0' />
                                        }
                                        <span className={`text-sm font-medium ${isDone ? 'text-green-600' : 'text-gray-800'}`}>
                                            {lecture.lectureTitle}
                                        </span>
                                    </div>
                                </button>
                            )
                        })
                        : <p className='text-gray-500 text-sm'>No lectures available.</p>
                    }
                </div>

                {/* Educator Info */}
                <div className='border-t pt-4'>
                    <h3 className='text-sm font-bold text-gray-700 mb-3'>Educator</h3>
                    <div className='flex items-center gap-3'>
                        <img
                            src={selectedCourse?.creator?.photoUrl || img}
                            alt=""
                            className='w-12 h-12 rounded-full object-cover border-2 border-gray-100'
                        />
                        <div>
                            <h2 className='text-sm font-semibold text-gray-800'>{selectedCourse?.creator?.name}</h2>
                            <p className='text-xs text-gray-500'>{selectedCourse?.creator?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewLectures