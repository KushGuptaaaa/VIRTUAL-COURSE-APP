import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import img from "/empty.jpg"

function Dashboard() {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const { creatorCourseData } = useSelector(state => state.course)

    const CourseProgressData = creatorCourseData?.map((course) => ({
        name: course.title?.slice(0, 10) + "...",
        lectures: course.lectures?.length || 0
    })) || [];

    const EnrollData = creatorCourseData?.map((course) => ({
        name: course.title?.slice(0, 10) + "...",
        enrolled: course.enrolledStudents?.length || 0
    })) || [];

    const totalEarning = creatorCourseData?.reduce((sum, course) => {
        const studentCount = course.enrolledStudents?.length || 0;
        const courseRevenue = course.price ? course.price * studentCount : 0
        return sum + courseRevenue;
    }, 0) || 0

    const totalStudents = creatorCourseData?.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0) || 0
    const totalCourses = creatorCourseData?.length || 0
    const totalLectures = creatorCourseData?.reduce((sum, course) => sum + (course.lectures?.length || 0), 0) || 0

    return (
        <div className='min-h-screen bg-gray-50'>

            {/* Header */}
            <div className='bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm'>
                <button onClick={() => navigate("/")} className='flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-all'>
                    <FaArrowLeftLong /> Back
                </button>
                <h1 className='text-lg font-bold text-gray-800'>Educator Dashboard</h1>
            </div>

            <div className='max-w-6xl mx-auto px-6 py-8 space-y-8'>

                {/* Profile Card */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-6'>
                    <img
                        src={userData?.photoUrl || img}
                        className='w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-md'
                        alt="Educator"
                    />
                    <div className='flex-1 text-center md:text-left space-y-1'>
                        <h1 className='text-2xl font-bold text-gray-800'>Welcome, {userData?.name || "Educator"} 👋</h1>
                        <p className='text-gray-500 text-sm'>{userData?.description || "Start Creating Courses for Your Students"}</p>
                        <p className='text-gray-400 text-xs'>{userData?.email}</p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <button
                            onClick={() => navigate("/courses")}
                            className='px-6 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95'
                        >
                            + Create Course
                        </button>
                        <button
                            onClick={() => navigate("/chatlist")}
                            className='px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all active:scale-95'
                        >
                            💬 Student Messages
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {[
                        { label: "Total Earning", value: `₹${totalEarning.toLocaleString()}`, color: "bg-green-50 border-green-200 text-green-700" },
                        { label: "Total Students", value: totalStudents, color: "bg-blue-50 border-blue-200 text-blue-700" },
                        { label: "Total Courses", value: totalCourses, color: "bg-purple-50 border-purple-200 text-purple-700" },
                        { label: "Total Lectures", value: totalLectures, color: "bg-orange-50 border-orange-200 text-orange-700" },
                    ].map((stat, i) => (
                        <div key={i} className={`rounded-2xl border p-5 ${stat.color}`}>
                            <p className='text-xs font-medium opacity-70 mb-1'>{stat.label}</p>
                            <p className='text-2xl font-bold'>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                    <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                        <h2 className='text-base font-bold text-gray-800 mb-4'>Course Progress (Lectures)</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={CourseProgressData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="lectures" fill="#111827" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                        <h2 className='text-base font-bold text-gray-800 mb-4'>Students Enrollment</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={EnrollData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="enrolled" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Course Table */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-base font-bold text-gray-800'>Your Courses</h2>
                        <button onClick={() => navigate("/courses")} className='text-sm text-indigo-600 hover:underline'>View All</button>
                    </div>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b text-left text-gray-400 text-xs uppercase'>
                                <th className='pb-3 pr-4'>Course</th>
                                <th className='pb-3 pr-4'>Students</th>
                                <th className='pb-3 pr-4'>Lectures</th>
                                <th className='pb-3 pr-4'>Revenue</th>
                                <th className='pb-3'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creatorCourseData?.map((course, index) => (
                                <tr key={index} className='border-b hover:bg-gray-50 transition-all'>
                                    <td className='py-3 pr-4 font-medium text-gray-800'>{course.title?.slice(0, 25)}{course.title?.length > 25 ? "..." : ""}</td>
                                    <td className='py-3 pr-4 text-gray-600'>{course.enrolledStudents?.length || 0}</td>
                                    <td className='py-3 pr-4 text-gray-600'>{course.lectures?.length || 0}</td>
                                    <td className='py-3 pr-4 text-gray-600'>₹{((course.enrolledStudents?.length || 0) * (course.price || 0)).toLocaleString()}</td>
                                    <td className='py-3'>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.isPublished ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                                            {course.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Dashboard