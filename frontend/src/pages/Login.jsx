import React, { useState } from 'react'
import logo from "/logo.jpg"
import { useNavigate } from 'react-router-dom'
import google from "/google.jpg"
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { ClipLoader } from "react-spinners"
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase.js'
import { FaArrowLeftLong } from "react-icons/fa6";

const Login = () => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const dispatch = useDispatch();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await axios.post(serverUrl + "/api/auth/login", { email, password }, { withCredentials: true })
            dispatch(setUserData(res.data));
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async () => {
        try {
            const res = await signInWithPopup(auth, provider);
            const user = res.user;
            const result = await axios.post(serverUrl + "/api/auth/googleauth", {
                name: user.displayName,
                email: user.email,
                role: ""
            }, { withCredentials: true });
            dispatch(setUserData(result.data));
            navigate("/");
            toast.success("Login successful!");
        } catch (error) {
            toast.error("Google Sign-In failed!");
        }
    }

    return (
        <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className='w-full max-w-3xl bg-white shadow-xl rounded-2xl flex overflow-hidden relative'>

                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className='absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all z-10'
                >
                    <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
                </button>

                {/* Left Form */}
                <div className='w-full md:w-1/2 flex flex-col items-center justify-center gap-4 px-8 py-10'>

                    <div className='text-center'>
                        <h1 className='font-bold text-gray-900 text-2xl'>Welcome back!</h1>
                        <p className='text-gray-400 text-sm mt-1'>Login to your account</p>
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-gray-500 text-xs font-medium'>Email</label>
                        <input
                            type="email"
                            placeholder='Enter your email'
                            className='w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col gap-1 w-full relative'>
                        <label className='text-gray-500 text-xs font-medium'>Password</label>
                        <input
                            type={show ? 'text' : 'password'}
                            placeholder='Enter your password'
                            className='w-full h-10 rounded-lg border border-gray-200 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {show
                            ? <IoEye className="absolute right-3 top-[30px] w-4 h-4 text-gray-400 cursor-pointer" onClick={() => setShow(!show)} />
                            : <IoEyeOutline className="absolute right-3 top-[30px] w-4 h-4 text-gray-400 cursor-pointer" onClick={() => setShow(!show)} />
                        }
                    </div>

                    <div className='w-full text-right'>
                        <span
                            className='text-xs text-blue-600 cursor-pointer hover:underline'
                            onClick={() => navigate("/forget")}
                        >
                            Forgot Password?
                        </span>
                    </div>

                    <button
                        className='w-full h-10 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center'
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={18} color='white' /> : "Login"}
                    </button>

                    <div className='flex items-center gap-2 w-full'>
                        <div className='flex-1 h-px bg-gray-200'></div>
                        <span className='text-xs text-gray-400'>Or continue with</span>
                        <div className='flex-1 h-px bg-gray-200'></div>
                    </div>

                    <button
                        className='w-full h-10 flex items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all'
                        onClick={googleLogin}
                        type="button"
                    >
                        <img src={google} alt="google" className='w-5 h-5 object-contain' />
                        <span className='text-sm text-gray-600 font-medium'>Continue with Google</span>
                    </button>

                    <p className='text-sm text-gray-500'>
                        Don't have an account?{" "}
                        <span
                            className='text-blue-600 underline cursor-pointer font-medium'
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </span>
                    </p>
                </div>

                {/* Right Logo */}
                <div className='hidden md:flex w-1/2 bg-black rounded-r-2xl flex-col items-center justify-center gap-4'>
                    <img src={logo} alt="logo" className='shadow-2xl h-[180px] object-cover rounded-xl' />
                    <span className='text-white text-xl font-bold tracking-wide'>VIRTUAL COURSES</span>
                </div>
            </div>
        </div>
    )
}

export default Login