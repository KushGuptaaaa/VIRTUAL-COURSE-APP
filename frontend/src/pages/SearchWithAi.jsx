import React, { useState, useRef } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import ai from '/ai.png'
import { RiMicAiFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import img from "/empty.jpg"

function SearchWithAi() {
    const navigate = useNavigate()
    const [input, setInput] = useState("")
    const [recommendations, setRecommendations] = useState([])
    const [listening, setListening] = useState(false)
    const [loading, setLoading] = useState(false)
    const recognitionRef = useRef(null)

    const handleRecommendation = async (query) => {
        if (!query.trim()) return
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/course/search", { input: query }, { withCredentials: true })
            setRecommendations(result.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.")
            return
        }

        if (listening) {
            recognitionRef.current?.stop()
            setListening(false)
            return
        }

        const recognition = new SpeechRecognition()
        recognitionRef.current = recognition
        recognition.lang = 'en-US'
        recognition.interimResults = false

        recognition.onstart = () => setListening(true)
        recognition.onresult = async (e) => {
            const transcript = e.results[0][0].transcript.trim()
            setInput(transcript)
            setListening(false)
            await handleRecommendation(transcript)
        }
        recognition.onerror = () => setListening(false)
        recognition.onend = () => setListening(false)
        recognition.start()
    }

    const suggestedQueries = [
        "I want to learn Web Development",
        "Suggest me AI/ML courses",
        "Best courses for beginners",
        "I want to learn Data Science",
    ]

    return (
        <div className='min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white flex'>

            {/* Sidebar */}
            <div className='hidden md:flex w-[260px] min-h-screen bg-white/5 border-r border-white/10 flex-col p-5 gap-4'>
                <div className='flex items-center gap-2 mb-4'>
                    <img src={ai} className='w-8 h-8' />
                    <span className='font-bold text-lg'>Chat History</span>
                </div>
                <button className='w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold transition-all'>+ New</button>
                <p className='text-gray-500 text-sm text-center mt-10'>No chat history yet.<br />Start a conversation!</p>
            </div>

            {/* Main */}
            <div className='flex-1 flex flex-col'>

                {/* Header */}
                <div className='flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'>
                    <div className='flex items-center gap-3'>
                        <button onClick={() => navigate("/")} className='text-white/70 hover:text-white transition-all'>
                            <FaArrowLeftLong className='w-5 h-5' />
                        </button>
                        <div className='w-9 h-9 rounded-full bg-white/20 flex items-center justify-center'>
                            <img src={ai} className='w-6 h-6' />
                        </div>
                        <div>
                            <p className='font-semibold text-sm'>Course Finder AI</p>
                            <p className='text-white/60 text-xs'>Describe what you want to learn</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setRecommendations([]); setInput("") }}
                        className='text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition-all'
                    >
                        + New Chat
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center'>

                    {recommendations.length === 0 && !loading && (
                        <div className='flex flex-col items-center gap-4 mt-10'>
                            <span className='text-5xl'>👋</span>
                            <h1 className='text-2xl font-bold text-white'>Hello! I'm your AI course finder.</h1>
                            <p className='text-gray-400 text-sm'>Tell me what you want to learn and I'll suggest the best courses for you.</p>

                            <div className='flex flex-wrap gap-3 justify-center mt-4 max-w-lg'>
                                {suggestedQueries.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setInput(q); handleRecommendation(q) }}
                                        className='px-4 py-2 rounded-full border border-indigo-400/50 text-indigo-300 text-sm hover:bg-indigo-500/20 transition-all'
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className='flex flex-col items-center gap-3 mt-16'>
                            <div className='w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
                            <p className='text-gray-400 text-sm'>Finding best courses for you...</p>
                        </div>
                    )}

                    {recommendations.length > 0 && !loading && (
                        <div className='w-full max-w-5xl'>
                            <p className='text-gray-400 text-sm mb-6 text-center'>🎯 {recommendations.length} courses found</p>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
                                {recommendations.map((course, index) => (
                                    <div
                                        key={index}
                                        onClick={() => navigate(`/viewcourse/${course._id}`)}
                                        className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300'
                                    >
                                        <img
                                            src={course.thumbnail || img}
                                            alt={course.title}
                                            className='w-full h-40 object-cover'
                                        />
                                        <div className='p-4'>
                                            <span className='text-xs font-semibold uppercase tracking-widest text-indigo-400'>{course.category}</span>
                                            <h2 className='text-sm font-bold text-white mt-1 leading-snug'>{course.title}</h2>
                                            <div className='flex items-center justify-between mt-3'>
                                                <span className='text-white font-semibold text-sm'>₹{course.price}</span>
                                                <span className='text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full'>{course.level || "All Levels"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Bar */}
                <div className='px-4 py-4 border-t border-white/10 bg-white/5'>
                    <div className='flex items-center gap-3 max-w-4xl mx-auto bg-white/10 border border-white/20 rounded-2xl px-4 py-3'>

                        <button
                            onClick={handleSearch}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${listening ? 'bg-red-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            <RiMicAiFill className={`w-5 h-5 ${listening ? 'text-white' : 'text-indigo-300'}`} />
                        </button>

                        <input
                            type="text"
                            className='flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm'
                            placeholder='What do you want to learn? (e.g. AI, MERN, Cloud...)'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleRecommendation(input) }}
                        />

                        <button
                            onClick={() => handleRecommendation(input)}
                            className='w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                    <p className='text-center text-xs text-gray-600 mt-2'>Press Enter to send • Shift+Enter for new line</p>
                </div>
            </div>
        </div>
    )
}

export default SearchWithAi