import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function Certificate() {
    const { courseId } = useParams()
    const { userData } = useSelector(state => state.user)
    const { courseData } = useSelector(state => state.course)
    const navigate = useNavigate()
    const certificateRef = useRef(null)

    const course = courseData?.find(c => c._id === courseId)
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    const handleDownload = async () => {
        const canvas = await html2canvas(certificateRef.current, { scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('landscape', 'mm', 'a4')
        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210)
        pdf.save(`${userData?.name}-${course?.title}-certificate.pdf`)
    }

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4'>

            {/* Back + Download */}
            <div className='flex items-center justify-between w-full max-w-4xl mb-6'>
                <button
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-all'
                >
                    <FaArrowLeftLong /> Back
                </button>
                <button
                    onClick={handleDownload}
                    className='px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all active:scale-95'
                >
                    ⬇️ Download PDF
                </button>
            </div>

            {/* Certificate */}
            <div
                ref={certificateRef}
                className='w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden'
                style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 100%)',
                    border: '2px solid #e0e7ff'
                }}
            >
                {/* Top Border Design */}
                <div className='h-3 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600' />

                <div className='px-16 py-12 flex flex-col items-center text-center'>

                    {/* Logo / Icon */}
                    <div className='w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-4 shadow-lg'>
                        <span className='text-white text-2xl'>🎓</span>
                    </div>

                    <p className='text-indigo-500 text-sm font-semibold tracking-[4px] uppercase mb-2'>Virtual Courses</p>

                    <h1 className='text-4xl font-bold text-gray-800 mb-1'
                        style={{ fontFamily: 'Georgia, serif' }}>
                        Certificate of Completion
                    </h1>

                    <div className='w-24 h-0.5 bg-indigo-400 rounded-full my-4' />

                    <p className='text-gray-500 text-base mb-6'>This is to certify that</p>

                    <h2 className='text-5xl font-bold text-indigo-700 mb-4'
                        style={{ fontFamily: 'Georgia, serif' }}>
                        {userData?.name}
                    </h2>

                    <p className='text-gray-500 text-base mb-3'>has successfully completed the course</p>

                    <h3 className='text-2xl font-bold text-gray-800 mb-2'
                        style={{ fontFamily: 'Georgia, serif' }}>
                        {course?.title}
                    </h3>

                    <p className='text-sm text-gray-400 mb-8'>Category: {course?.category} • Level: {course?.level || "All Levels"}</p>

                    <div className='w-24 h-0.5 bg-indigo-400 rounded-full mb-8' />

                    {/* Footer */}
                    <div className='flex items-center justify-between w-full mt-4'>
                        <div className='text-center'>
                            <p className='text-sm font-semibold text-gray-700'>{course?.creator?.name}</p>
                            <div className='w-32 h-0.5 bg-gray-300 mt-1 mb-1' />
                            <p className='text-xs text-gray-400'>Instructor</p>
                        </div>

                        <div className='flex flex-col items-center'>
                            <div className='w-16 h-16 rounded-full bg-indigo-50 border-4 border-indigo-200 flex items-center justify-center'>
                                <span className='text-2xl'>✅</span>
                            </div>
                            <p className='text-xs text-gray-400 mt-1'>Verified</p>
                        </div>

                        <div className='text-center'>
                            <p className='text-sm font-semibold text-gray-700'>{date}</p>
                            <div className='w-32 h-0.5 bg-gray-300 mt-1 mb-1' />
                            <p className='text-xs text-gray-400'>Date of Completion</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Border */}
                <div className='h-3 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600' />
            </div>
        </div>
    )
}

export default Certificate