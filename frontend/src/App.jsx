
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
import AllCourses from './pages/AllCourses.jsx'


import useGetCreatorCourse from './customHooks/useGetCreatorCourse.js'
import useGetPublishedCourse from './customHooks/useGetPublishedCourse.js'
import CreateLecture from './pages/Educator/CreateLecture.jsx'
import EditLecture from './pages/Educator/EditLecture.jsx'
import ViewCourse from './pages/ViewCourse.jsx'
import ScrollToTop from './Component/ScrollToTop.jsx'
import ViewLectures from './pages/ViewLectures.jsx'
import MyEnrolledCourses from './pages/MyEnrolledCourses.jsx'
import useGetAllReviews from './customHooks/useGetAllReviews.js'


export const serverUrl = "http://localhost:8000"
function App() {
    useGetCurrentUser();
    useGetCreatorCourse();
    useGetPublishedCourse();
    useGetAllReviews
    const {userData} = useSelector((state) => state.user);
    const navigate = useNavigate();
  return (
    <>
    <ToastContainer />
    <ScrollToTop/>
    <Routes>
        <Route path = "/" element={<Home />} />
        <Route path = "/signup" element={!userData ? <Signup /> : <Navigate to={"/"} />  } /> 

        <Route path = "/login" element={<Login />} />
        <Route path = "/profile" element={userData ? <Profile /> : <Navigate to={"/signup"} /> } />
        <Route path = "/forget" element={userData ? <ForgetPassword /> : <Navigate to={"/signup"} /> } />

        <Route path = "/editprofile" element={userData ? <EditProfile /> : <Navigate to={"/signup"} /> } />

        <Route path='/allcourses' element={userData ? <AllCourses/> :<Navigate to={"/signup"}/>}/>

        <Route path = "/dashboard" element={userData?.role === "educator" ? <Dashboard /> : <Navigate to={"/signup"} /> } />

        <Route path = "/courses" element={userData?.role === "educator" ? <Courses /> : <Navigate to={"/signup"} /> } />

        <Route path = "/createcourse" element={userData?.role === "educator" ? <CreateCourses /> : <Navigate to={"/signup"} /> } />

        <Route path = "/editcourse/:courseId" element={userData?.role === "educator" ? <EditCourse /> : <Navigate to={"/signup"} /> } />
        {/* //Dynamic Data v pass hua hai courseId variable me store ho jaega taki ... const {courseId} = useParams() kare to courseId jo enter kia wo mil jae */}

        <Route path = "/createlecture/:courseId" element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to={"/signup"} /> } />

        <Route path = "/editlecture/:courseId/:lectureId" element={userData?.role === "educator" ? <EditLecture/> : <Navigate to={"/signup"} /> } />

        <Route path = "/viewcourse/:courseId" element={userData ? <ViewCourse/> : <Navigate to={"/signup"} /> } />


        <Route path = "/viewlecture/:courseId" element={userData ? <ViewLectures/> : <Navigate to={"/signup"} /> } />

        <Route path = "/mycourses" element={userData ? <MyEnrolledCourses/> : <Navigate to={"/signup"} /> } />

    </Routes>
    </>
  )
}

export default App
