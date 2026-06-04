import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../App.jsx';

const ForgetPassword = () => {
    const [step, setStep] = React.useState(1)
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const sendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(serverUrl + "/api/auth/sendotp", { email }, { withCredentials: true });
            toast.success("OTP sent to email");
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending OTP");
        } finally {
            setLoading(false);
        }
    }

    const verifyOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(serverUrl + "/api/auth/verifyotp", { email, otp }, { withCredentials: true });
            toast.success("OTP verified successfully");
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error verifying OTP");
        } finally {
            setLoading(false);
        }
    }

    const resetPassword = async () => {
        if(newPassword !== confirmPassword){
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await axios.post(serverUrl + "/api/auth/resetpassword", { email, password: newPassword }, { withCredentials: true });
            toast.success("Password reset successfully");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error resetting password");
        } finally {
            setLoading(false);
        }
    }

    return (
    <div className='w-screen min-h-screen flex items-center justify-center bg-gray-100 px-4'>

        {/* step 1 - Email */}
        {step === 1 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
            <h2 className='text-2xl font-semibold mb-2 text-gray-800 text-center'>Forgot Password</h2>
            <p className='text-gray-500 mb-6 text-center text-sm'>Enter your email to receive an OTP</p>
            <form className='space-y-4' onSubmit={(e) => { e.preventDefault(); sendOtp(); }}>
                <div>
                    <label htmlFor="email" className='text-gray-600 text-sm mb-1 block'>Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder='you@gmail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black border-gray-300 border-2 px-3 py-2 rounded-md mb-2'
                        required
                    />
                </div>
                <button type='submit' className='w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300' disabled={loading}>
                    {loading ? <ClipLoader size={25} color='white'/> : "Send OTP"}
                </button>
            </form>
            <div className='text-center mt-4 text-sm text-gray-500 cursor-pointer hover:text-black' onClick={() => navigate("/login")}>
                Back to Login
            </div>
        </div>}

        {/* step 2 - OTP */}
        {step === 2 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
            <h2 className='text-2xl font-semibold mb-2 text-gray-800 text-center'>Enter OTP</h2>
            <p className='text-gray-500 mb-6 text-center text-sm'>Enter the 4 digit OTP sent to your email</p>
            <form className='space-y-4' onSubmit={(e) => { e.preventDefault(); verifyOtp(); }}>
                <div>
                    <label htmlFor="otp" className='text-gray-600 text-sm mb-1 block'>OTP</label>
                    <input
                        type="text"
                        id="otp"
                        placeholder='* * * *'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className='w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black border-gray-300 border-2 px-3 py-2 rounded-md mb-2'
                        required
                    />
                </div>
                <button type='submit' className='w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300' disabled={loading}>
                    {loading ? <ClipLoader size={25} color='white'/> : "Verify OTP"}
                </button>
            </form>
            <div className='text-center mt-4 text-sm text-gray-500 cursor-pointer hover:text-black' onClick={() => navigate("/login")}>
                Back to Login
            </div>
        </div>}

        {/* step 3 - Reset Password */}
        {step === 3 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
            <h2 className='text-2xl font-semibold mb-2 text-gray-800 text-center'>Reset Password</h2>
            <p className='text-gray-500 mb-6 text-center text-sm'>Enter your new password below.</p>
            <form className='space-y-4' onSubmit={(e) => { e.preventDefault(); resetPassword(); }}>
                <div>
                    <label htmlFor="newPassword" className='text-gray-600 text-sm mb-1 block'>New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder='*************'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className='w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black border-gray-300 border-2 px-3 py-2 rounded-md mb-2'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className='text-gray-600 text-sm mb-1 block'>Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder='*************'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black border-gray-300 border-2 px-3 py-2 rounded-md mb-2'
                        required
                    />
                </div>
                <button type='submit' className='w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300' disabled={loading}>
                    {loading ? <ClipLoader size={25} color='white'/> : "Reset Password"}
                </button>
            </form>
            <div className='text-center mt-4 text-sm text-gray-500 cursor-pointer hover:text-black' onClick={() => navigate("/login")}>
                Back to Login
            </div>
        </div>}

    </div>
    )
}

export default ForgetPassword