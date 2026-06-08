
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { FaArrowLeftLong } from "react-icons/fa6"
import img from "/empty.jpg"

function ChatList() {
    const { userData } = useSelector(state => state.user)
    const { creatorCourseData } = useSelector(state => state.course)
    const navigate = useNavigate()
    const [students, setStudents] = useState([])

    useEffect(() => {
        // Saare enrolled students nikalo
        const allStudents = []
        const seen = new Set()

        creatorCourseData?.forEach(course => {
            course.enrolledStudents?.forEach(studentId => {
                const id = typeof studentId === 'string' ? studentId : studentId._id
                if (!seen.has(id)) {
                    seen.add(id)
                    allStudents.push({ _id: id })
                }
            })
        })

        // Har student ka data fetch karo
        const fetchStudents = async () => {
            try {
                const results = await Promise.all(
                    allStudents.map(s =>
                        axios.post(serverUrl + "/api/course/creator", { userId: s._id }, { withCredentials: true })
                    )
                )
                setStudents(results.map(r => r.data))
            } catch (error) {
                console.log(error)
            }
        }

        if (allStudents.length > 0) fetchStudents()
    }, [creatorCourseData])

    return (
        <div className='min-h-screen bg-gray-50'>

            {/* Header */}
            <div className='bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm'>
                <button onClick={() => navigate("/dashboard")} className='flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-all'>
                    <FaArrowLeftLong /> Back
                </button>
                <h1 className='text-lg font-bold text-gray-800'>Student Messages</h1>
            </div>

            <div className='max-w-2xl mx-auto px-4 py-8 space-y-3'>

                {students.length === 0 ? (
                    <div className='flex flex-col items-center gap-3 mt-20 text-gray-400'>
                        <span className='text-5xl'>💬</span>
                        <p className='text-lg'>No students enrolled yet</p>
                    </div>
                ) : (
                    students.map((student, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(`/chat/${student._id}_${userData._id}`)}
                            className='bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200'
                        >
                            <img
                                src={student?.photoUrl || img}
                                className='w-12 h-12 rounded-full object-cover border-2 border-gray-100'
                                alt={student?.name}
                            />
                            <div className='flex-1'>
                                <h2 className='font-semibold text-gray-800'>{student?.name}</h2>
                                <p className='text-sm text-gray-400'>{student?.email}</p>
                            </div>
                            <span className='text-indigo-500 text-sm font-medium'>Chat →</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ChatList