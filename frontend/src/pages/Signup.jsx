import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "/logo.jpg"
import google from "/google.jpg"
import { IoEyeOutline, IoEye } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from "react-spinners"
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../utils/firebase.js';

const Signup = () => {
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("student")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const handleSignup = async () => {
        setLoading(true);
        try {
            const res = await axios.post(serverUrl + "/api/auth/signup", { name, email, password, role }, { withCredentials: true })
            dispatch(setUserData(res.data));
            setLoading(false);
            navigate("/");
            toast.success("Signup successful!");
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Signup failed!");
        }
    };

    const googleSignUp = async () => {
        try {
            const res = await signInWithPopup(auth, provider);
            const user = res.user;
            const result = await axios.post(serverUrl + "/api/auth/googleauth", { name: user.displayName, email: user.email, role }, { withCredentials: true });
            dispatch(setUserData(result.data));
            navigate("/");
            toast.success("Signup successful!");
        } catch (error) {
            toast.error("Google Sign-In failed!");
        }
    }

    return (
        <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className='w-full max-w-3xl bg-white shadow-xl rounded-2xl flex overflow-hidden'>

                {/* Left Form */}
                <div className='w-full md:w-1/2 flex flex-col items-center justify-center gap-4 px-8 py-10'>

                    <div className='text-center'>
                        <h1 className='font-bold text-gray-900 text-2xl'>Let's get started</h1>
                        <p className='text-gray-400 text-sm mt-1'>Create your account</p>
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-gray-500 text-xs font-medium'>Name</label>
                        <input type="text" placeholder='Enter your name'
                            className='w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black'
                            value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-gray-500 text-xs font-medium'>Email</label>
                        <input type="email" placeholder='Enter your email'
                            className='w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black'
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className='flex flex-col gap-1 w-full relative'>
                        <label className='text-gray-500 text-xs font-medium'>Password</label>
                        <input type={show ? 'text' : 'password'} placeholder='Enter your password'
                            className='w-full h-10 rounded-lg border border-gray-200 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black'
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                        {show
                            ? <IoEye className="absolute right-3 top-[30px] w-4 h-4 text-gray-400 cursor-pointer" onClick={() => setShow(!show)} />
                            : <IoEyeOutline className="absolute right-3 top-[30px] w-4 h-4 text-gray-400 cursor-pointer" onClick={() => setShow(!show)} />
                        }
                    </div>

                    {/* Role Toggle */}
                    <div className='flex w-full gap-3'>
                        {["student", "educator"].map((r) => (
                            <button key={r} type="button"
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all duration-200 capitalize
                                    ${role === r ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                                {r}
                            </button>
                        ))}
                    </div>

                    <button
                        className='w-full h-10 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center'
                        onClick={handleSignup} disabled={loading}>
                        {loading ? <ClipLoader size={18} color='white' /> : "Sign Up"}
                    </button>

                    <div className='flex items-center gap-2 w-full'>
                        <div className='flex-1 h-px bg-gray-200'></div>
                        <span className='text-xs text-gray-400'>Or continue with</span>
                        <div className='flex-1 h-px bg-gray-200'></div>
                    </div>

                    <button
                        className='w-full h-10 flex items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all'
                        onClick={googleSignUp} type="button">
                        <img src={google} alt="google" className='w-5 h-5 object-contain' />
                        <span className='text-sm text-gray-600 font-medium'>Continue with Google</span>
                    </button>

                    <p className='text-sm text-gray-500'>
                        Already have an account?{" "}
                        <span className='text-blue-600 underline cursor-pointer font-medium' onClick={() => navigate("/login")}>Login</span>
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

export default Signup