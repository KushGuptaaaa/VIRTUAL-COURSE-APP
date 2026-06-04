import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "/logo.jpg"
import google from "/google.jpg"
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
import {ClipLoader} from "react-spinners"
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from '../utils/firebase.js';

const Signup = () => {
    const [show , setShow] = useState(false)
    const navigate = useNavigate()
    const [name , setName] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [role , setRole] = useState("student")
    const [loading , setLoading] = useState(false)
    const dispatch = useDispatch();

    const handleSignup = async () => {
        setLoading(true);
        try {
            const res = await axios.post(serverUrl +"/api/auth/signup" , {
                name,email,password,role},
                 {withCredentials: true})
            
            dispatch(setUserData(res.data));
            setLoading(false);
            navigate("/");
            toast.success("Signup successful!"); 
        } catch (error) {
            console.error("Error signing up:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Signup failed!"); 
        }
    };

    const googleSignUp = async () => {
        try {
            const res = await signInWithPopup(auth, provider); 
            console.log(res);
             const user = res.user;
             const name = user.displayName;
             const email = user.email;
            

            const result = await axios.post(serverUrl + "/api/auth/googleauth", {name , email , role}, { withCredentials: true });
            dispatch(setUserData(result.data));
            
            navigate("/");
            toast.success("Signup successful!"); 
            
        } catch (error) {
            console.error("Error with Google Sign-In:", error);
            toast.error("Google Sign-In failed!");
        }
    }

  return (
    <div className="bg-gray-100 w-screen h-screen flex items-center justify-center">
        <form className='w-full md:w-[800px] h-[600px] bg-white shadow-xl rounded-2xl flex' onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
        }}>
            {/* left div */}
            <div className='w-[50%] h-full flex flex-col items-center justify-center gap-3'>

                <div>
                    <h1 className='font-semibold text-black text-2xl'>let's get started</h1>
                    <h2 className='text-gray-400 text-[18px]'>Create your account</h2>
                </div>

                <div className='flex flex-col gap-1 w-[80%]'>
                    <label htmlFor="name" className='text-gray-400 text-[14px]'>Name</label>
                    <input id="name" type="text" placeholder='Enter your name' className='w-full h-10 
                     rounded-md border-gray-300 border-2 px-2'
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     />
                </div>

                <div className='flex flex-col gap-1 w-[80%]'>
                    <label htmlFor="email" className='text-gray-400 text-[14px]'>Email</label>
                    <input id="email" type="email" name='email' placeholder='Enter your email' className='w-full h-10 
                     rounded-md border-gray-300 border-2 px-2'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     />
                </div>

                <div className='flex flex-col gap-1 w-[80%] relative'>
                    <label htmlFor="password" className='text-gray-400 text-[14px]'>Password</label>
                    <input id="password" type={show ? 'text' : 'password'} name='password' placeholder='Enter your password' className='w-full h-10 
                     rounded-md border-gray-300 border-2 px-2 pr-10'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     />
                    { show ?
                        <IoEye className="absolute w-[20px] h-[20px] right-3 top-[38px] cursor-pointer" onClick={() => setShow(!show)} />
                        :
                    <IoEyeOutline className="absolute w-[20px] h-[20px] right-3 top-[38px] cursor-pointer" onClick={() => setShow(!show)} /> }
                </div>

                <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
                    <span className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black hover:shadow-md text-[14px] ${role === "student" ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("student")}>Student</span>
                    <span className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black hover:shadow-md text-[14px] ${role === "educator" ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("educator")}>Educator</span>
                </div>

                <button className='w-[80%] h-10 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center' onClick={handleSignup} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white' /> : "Sign Up"}
                </button>

                <div className='flex items-center gap-2 w-[80%]'>
                    <div className='w-[25%] h-[0.5px] bg-gray-300'></div>
                    <div className='w-[50%] text-[15px] text-gray-600 text-center'>Or continue</div>
                    <div className='w-[25%] h-[0.5px] bg-gray-300'></div>
                </div>

                <div className='flex items-center border border-gray-300 w-[80%] h-[40px] justify-center gap-1 rounded-md cursor-pointer hover:bg-gray-50' onClick={googleSignUp}>
                    <img src={google} alt="google" className='w-[25px] object-cover' />
                    <span className='text-gray-600 text-[14px] cursor-pointer'>oogle</span>
                </div>

                <div className='flex items-center gap-2 w-[80%]'>
                    <span className='text-gray-600 text-[14px] cursor-pointer' onClick={() => navigate("/login")}>Already have an account? 
                        <span className='underline underline-offset-1 text-blue-600' onClick={()=>navigate("/login")}> Login</span>
                    </span>
                </div>

            </div>

            {/* right div jisme logo */}
            <div className='w-[50%] h-[100%] rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden'>
                <img src={logo} alt="logo" className='shadow-2xl h-[200px] object-cover' />
                <span className='text-white text-2xl font-bold'>VIRTUAL COURSES</span>
            </div>

        </form>
    </div>
  )
}

export default Signup