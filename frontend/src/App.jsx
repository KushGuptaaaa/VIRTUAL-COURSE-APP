
import { Route ,Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import ForgetPassword from './pages/ForgetPassword'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import useGetCurrentUser from './customHooks/useGetCurrentUser.js';
import EditProfile from './pages/EditProfile'
import { Navigate , useNavigate } from 'react-router-dom';
import Dashboard from './pages/Educator/Dashboard.jsx'
import Courses from './pages/Educator/Courses.jsx'
import CreateCourses from './pages/Educator/CreateCourses.jsx'
import EditCourse from './pages/Educator/EditCourses.jsx'


import useGetCreatorCourse from './customHooks/useGetCreatorCourse.js'


export const serverUrl = "http://localhost:8000"
function App() {
    useGetCurrentUser();
    useGetCreatorCourse();
    const {userData} = useSelector((state) => state.user);
    const navigate = useNavigate();
  return (
    <>
    <ToastContainer />
    <Routes>
        <Route path = "/" element={<Home />} />
        <Route path = "/signup" element={!userData ? <Signup /> : <Navigate to={"/"} />  } /> 

        <Route path = "/login" element={<Login />} />
        <Route path = "/profile" element={userData ? <Profile /> : <Navigate to={"/signup"} /> } />
        <Route path = "/forget" element={userData ? <ForgetPassword /> : <Navigate to={"/signup"} /> } />

        <Route path = "/editprofile" element={userData ? <EditProfile /> : <Navigate to={"/signup"} /> } />

        <Route path = "/dashboard" element={userData?.role === "educator" ? <Dashboard /> : <Navigate to={"/signup"} /> } />

        <Route path = "/courses" element={userData?.role === "educator" ? <Courses /> : <Navigate to={"/signup"} /> } />

        <Route path = "/createcourse" element={userData?.role === "educator" ? <CreateCourses /> : <Navigate to={"/signup"} /> } />

        <Route path = "/editcourse/:curseId" element={userData?.role === "educator" ? <EditCourse /> : <Navigate to={"/signup"} /> } />


    </Routes>
    </>
  )
}

export default App
