import React from 'react'
import Nav from '../Component/Nav'
import home from "/home1.jpg"
import { SiViaplay } from "react-icons/si";
import ai from "/ai.png"
import ai1 from "/searchAi.png"
import Logos from '../Component/Logos';
import ExploreCourses from '../Component/ExploreCourses';
import CardPage from '../Component/CardPage';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate()
  return (
<div className='w-[100%] overflow-hidden'>
     <div className='w-[100%] lg:h-[140vh] h-[70vh] relative'>
      <Nav/>
      <img src={home} className='object-cover md:object-fill   w-[100%] lg:h-[100%] h-[50vh]' alt="" />

      <span className='lg:text-[70px] absolute  md:text-[40px]  lg:top-[10%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold text-[20px]'>Grow Your Skills to Advance </span>
      <span className='lg:text-[70px] text-[20px] md:text-[40px] absolute lg:top-[18%] top-[20%] w-[100%] flex items-center justify-center text-white font-bold'>Your Career path</span>
      <div className='absolute lg:top-[30%] top-[75%]  md:top-[80%] w-[100%] flex items-center justify-center gap-3 flex-wrap'>
        <button
            className="
            group relative overflow-hidden
            px-6 py-3

            border border-black/20 lg:border-white/20
            bg-white lg:bg-white/5

            backdrop-blur-md
            rounded-xl
            flex items-center gap-2
            cursor-pointer

            shadow-md lg:shadow-none

            transition-all duration-300 ease-out
            hover:-translate-y-1
            hover:scale-105
            hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]
            "
            onClick={() => navigate('/allcourses')}
            >
  {/* Shine Effect */}
            <span
                className="
                absolute inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent
                via-white/10
                to-transparent
                group-hover:translate-x-full
                transition-transform
                duration-1000
                "
            />

            <span
            className="
            relative z-10
            text-lg font-medium

            text-black lg:text-white

            transition-all duration-300
            group-hover:bg-gradient-to-r
            group-hover:from-cyan-400
            group-hover:to-purple-500
            group-hover:bg-clip-text
            group-hover:text-transparent
            "
            >
            View All Courses
            </span>

            <SiViaplay
            className="
            relative z-10
            w-7 h-7

            fill-black lg:fill-white

            transition-all duration-300
            group-hover:fill-cyan-400
            group-hover:scale-110
            "
            />
            </button>

            <button
            className="
            group relative overflow-hidden
            px-6 py-3
            rounded-xl
            bg-gradient-to-r
            from-purple-600
            to-cyan-500
            text-white
            group relative z-0 overflow-hidden 
            flex items-center justify-center gap-2
            cursor-pointer

            transition-all duration-300 ease-out
            hover:-translate-y-1
            hover:scale-105
            hover:shadow-[0_0_35px_rgba(168,85,247,0.5)]
            "
            onClick={() => navigate('/search')}
            >
  {/* Shine Effect */}
  <span
    className="
    absolute inset-0
    -translate-x-full
    bg-gradient-to-r
    from-transparent
    via-white/20
    to-transparent
    group-hover:translate-x-full
    transition-transform
    duration-1000
    "
  />

  <span
    className="
    relative z-10
    text-lg font-medium tracking-wide
    transition-all duration-300
    group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]
    "
  >
    Search With AI
  </span>

  <img
    src={ai}
    className="
    relative z-10
    w-8 h-8 rounded-full hidden lg:block
    transition-transform duration-300
    group-hover:rotate-12 group-hover:scale-110
    "
    alt=""
  />

  <img
    src={ai1}
    className="
    relative z-10
    w-9 h-9 rounded-full lg:hidden
    transition-transform duration-300
    group-hover:rotate-12 group-hover:scale-110
    "
    alt=""
  />
</button>
      </div>
      
     </div>
     <Logos/>
     <ExploreCourses/>
     <CardPage/>
    </div>
  )
}

export default Home
