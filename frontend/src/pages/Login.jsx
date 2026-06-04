import React,{useState} from 'react'
import logo from "/logo.jpg"
import { Navigate, useNavigate } from 'react-router-dom'
import signup from "./Signup"
import google from "/google.jpg"
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import {ClipLoader} from "react-spinners"
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import forget from "./ForgetPassword"
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase.js'



const Login = () => {
    const navigate = useNavigate()
    const [show , setShow] = useState(false)
    const dispatch = useDispatch();
    
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [loading , setLoading] = useState(false)
      
    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await axios.post(serverUrl +"/api/auth/login" , {
                email,password},
                 {withCredentials: true})// is line se token v store ho jaega cookie me and uske bad hum us token ko use krke protected route ko access kr skte hai
                 dispatch(setUserData(res.data));
                 toast.success("Login successful!");
                navigate("/");
        } catch (error) {
            console.error(error.response?.data?.message || "Login failed!");
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };


const googleLogin = async () => {
    try {
        const res = await signInWithPopup(auth, provider); 
        console.log(res);
            const user = res.user;
            const name = user.displayName;
            const email = user.email;
            let role = "";

        const result = await axios.post(serverUrl + "/api/auth/googleauth", {name , email , role}, { withCredentials: true });
        dispatch(setUserData(res.data));
        
        navigate("/");
        toast.success("Login successful!"); 
        
    } catch (error) {
        console.error("Error with Google Sign-In:", error);
        toast.error("Google Sign-In failed!");
    }
}



  return (
        <div className="bg-gray-100 w-screen h-screen flex items-center justify-center">
            <form className='w-[900%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex' onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }}>
                {/* left div */}
                <div className='w-[50%] h-full flex flex-col items-center justify-center'>
    
                    <div >
                        <h1 className='font-semibold text-black text-2xl'>Welcome back!</h1>
                        <h2 className='text-gray-400 text-18px'> Login your account</h2>
                    </div>
    
    
                    <div className='flex flex-col   w-[80%]'>
                        <label htmlFor="email" className='text-gray-400 text-14px mb-2'>Email</label>
                        <input id="email" type="email" name='email' placeholder='Enter your email' className='w-full h-10 
                         rounded-md border-gray-300 border-2  px-2'value={email}
                     onChange={(e) => setEmail(e.target.value)} />
                    </div> 
    
    
                    <div className='flex flex-col   w-[80%] relative'>
                        <label htmlFor="password" className='text-gray-400 text-14px mt-5 mb-2'>Password</label>
                        <input id="password" type={show ? 'text' : 'password'}name='password' placeholder='Enter your password' className='w-full h-10 
                         rounded-md border-gray-300 border-2  px-2' onChange={(e)=>setPassword(e.target.value)} value = {password}/>



                        { show ?
                            <IoEye className="absolute w-[20px] h-[20px] right-[5%] bottom-[10%]" onClick={() => setShow(!show)} />
                            :
                        <IoEyeOutline className="absolute w-[20px] h-[20px] right-[5%] bottom-[10%]" onClick={() => setShow(!show)} /> }
       
    
                    </div> 
    

    
                    <button className='w-[80%] h-10 bg-black text-white rounded-md mt-4 mb-4 hover:bg-gray-800 cursor-pointer  'onClick={handleLogin} disabled={loading}>
                        {loading ? <ClipLoader size={30} color='white'/> : "Login"}
                    </button>
                    
                    <span className='text-[13px] cursor-pointer  text-gray-400 ' onClick={()=> navigate("/forget")
                    }>
                            Forgot Password?
                    </span>

    
    
                    <div className='flex items-center gap-2 w-[80%] mt-4'>
                        <div className='w-[25%] h-[0.5px] bg-gray-300'></div>
                        <div className='w-[50%] text-[15px] text-gray-600 text-center'> Or continue</div>  
                        <div className='w-[25%] h-[0.5px] bg-gray-300'></div>
                    </div>       
    
                    <div className='flex items-center border-1 w-[80%] h-[40px] justify-center mt-3' onClick={googleLogin}>
                        <img src={google} alt="google" className='w-[25px] object-cover ' />
                        <span className='text-gray-600 text-14px cursor-pointer'>oogle</span>
                          
                    </div>
    
    
    
                    <div className='flex items-center gap-2 w-[80%] mt-4'>
                    <span className='text-gray-600 text-14px cursor-pointer' onClick={() => navigate("/signup")}>Create a new account 
                        <span className='underline underline-offset-1 text-blue-600' onClick={()=>navigate("/signup")}> Sign Up</span>
                    </span>
                    </div>
    
    
    
                </div>
    
    
                {/* right div jisme logo */}
                <div className='w-[50%] h-[100%] rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden'>
                    <img src={logo} alt="logo" className=' shadow-2xl h-[200px] object-cover' />
                    <span className='text-white text-2xl font-bold '>VIRTUAL COURSES
    
                    </span>
                </div>
            </form>
            
          
        </div>
  )
}

export default Login
