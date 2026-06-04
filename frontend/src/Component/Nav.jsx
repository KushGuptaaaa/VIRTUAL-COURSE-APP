import React, { Children, useState } from 'react'
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
import Dashboard from '../pages/Educator/Dashboard';


function Nav() {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [showHam, setShowHam] = useState(false)

    const handleLogOut = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            console.log(result.data)
            toast.success("Logout Successfully")

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)

        }
    }
    return (

        <div>
            <div className='w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047]  z-10'>
                <div className='lg:w-[20%] w-[40%] lg:pl-[50px] '>
                    <img src={logo} alt="" className='w-[60px]  rounded-[5px] border-2 border-white ' />
                </div>
                <div className='w-[30%] lg:flex items-center justify-center gap-4 hidden'>

                    {!userData && (
                        <IoPersonCircle className='w-[50px] h-[50px] fill-white cursor-pointer' onClick={() => setShow(prev => !prev)} />
                    )}

                    {userData && (
                        userData?.photoUrl
                            ? <img src={userData?.photoUrl} className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer' onClick={() => setShow(prev => !prev)} />
                            : <div className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer' onClick={() => setShow(prev => !prev)}>
                                {userData?.name.slice(0, 1).toUpperCase()}
                            </div>
                    )}

                    {userData?.role === "educator" && <div className='px-[20px] py-[10px] border-2 border-white  text-white bg-[black]  rounded-[10px] text-[18px] font-light cursor-pointer' onClick={() => navigate("/dashboard")}>Dashboard</div>}
                    {!userData ? <span className='px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] font-light cursor-pointer bg-[#000000d5]' onClick={() => navigate("/login")}>Login</span> :
                        <span className='px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer' onClick={handleLogOut}>LogOut</span>}


                    {show && (
                        <div className='absolute top-[110%] right-[15%] flex flex-col gap-2 bg-white px-3 py-3 rounded-2xl shadow-2xl border border-gray-100 z-50 min-w-[200px] animate-in fade-in duration-400'>

                            <span
                                className='w-full text-center text-sm font-semibold tracking-wide bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:from-gray-700 hover:to-gray-500 hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                                onClick={() => navigate("/profile")}
                            >
                                My Profile
                            </span>

                            <span
                                className='w-full text-center text-sm font-semibold tracking-wide bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:from-gray-700 hover:to-gray-500 hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                                onClick={() => navigate("/mycourses")}
                            >
                                My Courses
                            </span>

                        </div>
                    )}
                </div>

                <RxHamburgerMenu
                    className='w-[35px] h-[35px] lg:hidden text-white cursor-pointer transition-all duration-300 hover:scale-110'
                    onClick={() => setShowHam(prev => !prev)}
                />

                <div
                    className={`fixed top-0 left-0 w-screen h-screen bg-black/90 backdrop-blur-sm flex items-center justify-center flex-col gap-5 z-50 lg:hidden transition-all duration-500 ${showHam ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                        }`}
                >
                    <GiSplitCross
                        className='w-[35px] h-[35px] fill-white absolute top-5 right-[4%] cursor-pointer transition-all duration-300 hover:rotate-90'
                        onClick={() => setShowHam(prev => !prev)}
                    />

                    {!userData && (
                        <IoPersonCircle className='w-[60px] h-[60px] fill-white cursor-pointer transition-all duration-300 hover:scale-110' />
                    )}

                    {userData?.photoUrl ? (
                        <img
                            src={userData?.photoUrl}
                            className='w-[60px] h-[60px] rounded-full border-2 border-white object-cover cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg'
                            alt="profile"
                        />
                    ) : (
                        userData && (
                            <div className='w-[60px] h-[60px] rounded-full text-white flex items-center justify-center text-[22px] border-2 bg-black border-white cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg'>
                                {userData?.name.slice(0, 1).toUpperCase()}
                            </div>
                        )
                    )}

                    <div
                        className='w-[220px] h-[60px] border border-white/30 text-white bg-black rounded-xl flex items-center justify-center text-[18px] font-light cursor-pointer transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:scale-105'
                        onClick={() => navigate("/profile")}
                    >
                        My Profile
                    </div>

                    <div
                        className='w-[220px] h-[60px] border border-white/30 text-white bg-black rounded-xl flex items-center justify-center text-[18px] font-light cursor-pointer transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:scale-105'
                        onClick={() => navigate("/mycourses")}
                    >
                        My Courses
                    </div>

                    {userData?.role === "educator" && (
                        <div
                            className='w-[220px] h-[60px] border border-white/30 text-white bg-black rounded-xl flex items-center justify-center text-[18px] font-light cursor-pointer transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:scale-105'
                            onClick={() => navigate("/dashboard")}
                        >
                            Dashboard
                        </div>
                    )}

                    {!userData ? (
                        <span
                            className='w-[220px] h-[60px] border border-white/30 text-white bg-black rounded-xl flex items-center justify-center text-[18px] font-light cursor-pointer transition-all duration-300 hover:bg-green-500 hover:border-green-500 hover:text-white hover:shadow-lg hover:scale-105'
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    ) : (
                        <span
                            className='w-[220px] h-[60px] border border-white/30 text-white bg-black rounded-xl flex items-center justify-center text-[18px] font-light cursor-pointer transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:text-white hover:shadow-lg hover:scale-105'
                            onClick={handleLogOut}
                        >
                            Logout
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Nav
