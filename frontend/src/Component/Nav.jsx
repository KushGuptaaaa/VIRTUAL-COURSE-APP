import React, { useState } from 'react'
import logo from "/logo.jpg"
import { IoPersonCircle } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { RxHamburgerMenu } from "react-icons/rx";
import { GiSplitCross } from "react-icons/gi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

function Nav() {
    const { userData } = useSelector(state => state.user)
    const { creatorCourseData } = useSelector(state => state.course)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [showHam, setShowHam] = useState(false)

    const totalStudents = creatorCourseData?.reduce((sum, course) =>
        sum + (course.enrolledStudents?.length || 0), 0) || 0

    const handleLogOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            toast.success("Logout Successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <div>
            <div className='w-full h-[70px] fixed top-0 px-6 flex items-center justify-between z-50'
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

                {/* Logo */}
                <div className='lg:pl-10 cursor-pointer' onClick={() => navigate("/")}>
                    <img src={logo} alt="" className='w-[52px] rounded-lg border border-white/20 shadow-md hover:scale-105 transition-all duration-300' />
                </div>

                {/* Desktop Nav */}
                <div className='lg:flex items-center gap-3 hidden'>

                    {/* Educator Badge */}
                    {userData?.role === "educator" && (
                        <span className='text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full'>
                            Educator
                        </span>
                    )}

                    {/* Chat Notification for Educator */}
                    {userData?.role === "educator" && (
                        <button
                            onClick={() => navigate("/chatlist")}
                            className='relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200'
                        >
                            <IoChatbubbleEllipsesOutline className='w-5 h-5 text-white' />
                            {totalStudents > 0 && (
                                <span className='absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold'>
                                    {totalStudents}
                                </span>
                            )}
                        </button>
                    )}

                    {/* Dashboard */}
                    {userData?.role === "educator" && (
                        <button
                            className='px-4 py-2 text-sm font-medium text-white/80 hover:text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200'
                            onClick={() => navigate("/dashboard")}
                        >
                            Dashboard
                        </button>
                    )}

                    {/* Avatar / Login */}
                    {!userData ? (
                        <button
                            className='px-5 py-2 text-sm font-semibold bg-white text-black rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95'
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    ) : (
                        <div className='flex items-center gap-3'>
                            <div className='relative cursor-pointer' onClick={() => setShow(prev => !prev)}>
                                {userData?.photoUrl
                                    ? <img src={userData?.photoUrl} className='w-10 h-10 rounded-full object-cover border-2 border-white/30 hover:border-white/60 transition-all duration-200' />
                                    : <div className='w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-base font-bold border-2 border-white/20 hover:border-white/50 transition-all duration-200'>
                                        {userData?.name?.slice(0, 1).toUpperCase()}
                                    </div>
                                }
                                <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black'></span>
                            </div>

                            <button
                                className='px-4 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/10 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all duration-200'
                                onClick={handleLogOut}
                            >
                                Logout
                            </button>
                        </div>
                    )}

                    {!userData && (
                        <IoPersonCircle className='w-10 h-10 fill-white/60 cursor-pointer hover:fill-white transition-all duration-200' onClick={() => setShow(prev => !prev)} />
                    )}

                    {/* Dropdown */}
                    {show && (
                        <div className='absolute top-[80px] right-[2%] flex flex-col gap-1.5 px-2 py-2 rounded-2xl z-50 min-w-[200px]'
                            style={{ background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

                            {userData && (
                                <div className='px-3 py-2 border-b border-white/10 mb-1'>
                                    <p className='text-white text-sm font-semibold'>{userData?.name}</p>
                                    <p className='text-white/40 text-xs'>{userData?.email}</p>
                                </div>
                            )}

                            <button
                                className='w-full text-left text-sm font-medium text-white/80 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 hover:bg-white/10 hover:text-white'
                                onClick={() => { navigate("/profile"); setShow(false) }}
                            >
                                👤 My Profile
                            </button>

                            <button
                                className='w-full text-left text-sm font-medium text-white/80 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 hover:bg-white/10 hover:text-white'
                                onClick={() => { navigate("/mycourses"); setShow(false) }}
                            >
                                🎓 My Courses
                            </button>
                        </div>
                    )}
                </div>

                {/* Hamburger */}
                <RxHamburgerMenu
                    className='w-[30px] h-[30px] lg:hidden text-white cursor-pointer hover:scale-110 transition-all duration-200'
                    onClick={() => setShowHam(prev => !prev)}
                />

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center flex-col gap-4 z-50 lg:hidden transition-all duration-500 ${showHam ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
                    style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}>

                    <GiSplitCross
                        className='w-[30px] h-[30px] fill-white absolute top-5 right-5 cursor-pointer hover:rotate-90 transition-all duration-300'
                        onClick={() => setShowHam(prev => !prev)}
                    />

                    {/* Mobile Avatar */}
                    {!userData
                        ? <IoPersonCircle className='w-[60px] h-[60px] fill-white/50' />
                        : userData?.photoUrl
                            ? <img src={userData?.photoUrl} className='w-16 h-16 rounded-full border-2 border-white/30 object-cover' alt="profile" />
                            : <div className='w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold'>
                                {userData?.name?.slice(0, 1).toUpperCase()}
                            </div>
                    }

                    {userData && (
                        <div className='text-center'>
                            <p className='text-white font-semibold'>{userData?.name}</p>
                            <p className='text-white/40 text-xs'>{userData?.email}</p>
                        </div>
                    )}

                    {[
                        { label: "👤 My Profile", path: "/profile", show: true },
                        { label: "🎓 My Courses", path: "/mycourses", show: true },
                        { label: "📊 Dashboard", path: "/dashboard", show: userData?.role === "educator" },
                        { label: "💬 Messages", path: "/chatlist", show: userData?.role === "educator" },
                    ].filter(item => item.show).map((item, i) => (
                        <button key={i}
                            className='w-[220px] h-[52px] border border-white/10 text-white rounded-xl flex items-center justify-center text-base font-medium cursor-pointer transition-all duration-200 hover:bg-white hover:text-black hover:scale-105'
                            onClick={() => { navigate(item.path); setShowHam(false) }}
                        >
                            {item.label}
                        </button>
                    ))}

                    {!userData
                        ? <button className='w-[220px] h-[52px] bg-white text-black rounded-xl font-semibold hover:bg-green-400 transition-all duration-200 hover:scale-105' onClick={() => navigate("/login")}>Login</button>
                        : <button className='w-[220px] h-[52px] border border-red-500/30 text-red-400 rounded-xl font-medium hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-105' onClick={handleLogOut}>Logout</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Nav