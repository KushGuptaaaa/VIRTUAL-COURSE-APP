import React, { useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

const goals = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "AI/ML Engineer",
    "App Developer",
    "UI/UX Designer",
    "Ethical Hacker",
    "Data Analyst",
]

function RoadmapModal({ onClose }) {
    const [selectedGoal, setSelectedGoal] = useState("")
    const [customGoal, setCustomGoal] = useState("")
    const [roadmap, setRoadmap] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleGenerate = async () => {
        const goal = customGoal.trim() || selectedGoal
        if (!goal) return alert("Please select or type a goal")

        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/course/roadmap", { goal }, { withCredentials: true })
            setRoadmap(result.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>

                {/* Header */}
                <div className='sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between rounded-t-3xl'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900'>🗺️ AI Roadmap Generator</h2>
                        <p className='text-sm text-gray-400 mt-0.5'>Get a personalized learning path with course recommendations</p>
                    </div>
                    <button onClick={onClose} className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-500 text-lg'>✕</button>
                </div>

                <div className='px-6 py-5'>

                    {!roadmap ? (
                        <div className='space-y-5'>
                            {/* Dropdown */}
                            <div>
                                <label className='text-sm font-semibold text-gray-700 mb-2 block'>Select a Goal</label>
                                <div className='flex flex-wrap gap-2'>
                                    {goals.map((goal) => (
                                        <button
                                            key={goal}
                                            onClick={() => { setSelectedGoal(goal); setCustomGoal("") }}
                                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 
                                                ${selectedGoal === goal && !customGoal
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'}`}
                                        >
                                            {goal}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Input */}
                            <div>
                                <label className='text-sm font-semibold text-gray-700 mb-2 block'>Or Type Your Own Goal</label>
                                <input
                                    type="text"
                                    value={customGoal}
                                    onChange={(e) => { setCustomGoal(e.target.value); setSelectedGoal("") }}
                                    placeholder='e.g. Blockchain Developer, DevOps Engineer...'
                                    className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black'
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading || (!selectedGoal && !customGoal.trim())}
                                className='w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50'
                            >
                                {loading ? <ClipLoader size={18} color='white' /> : "✨ Generate My Roadmap"}
                            </button>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold text-gray-900'>{roadmap.title}</h3>

                            {roadmap.steps.map((step, index) => (
                                <div key={index} className='border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all duration-200'>
                                    <div className='flex items-start gap-3'>
                                        {/* Step Number */}
                                        <div className='w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0'>
                                            {step.step}
                                        </div>
                                        <div className='flex-1'>
                                            <div className='flex items-center justify-between'>
                                                <h4 className='font-semibold text-gray-900 text-sm'>{step.topic}</h4>
                                                <span className='text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full'>{step.duration}</span>
                                            </div>
                                            <p className='text-xs text-gray-500 mt-1'>{step.description}</p>

                                            {/* Related Courses */}
                                            {step.courses?.length > 0 && (
                                                <div className='mt-3 flex flex-wrap gap-2'>
                                                    {step.courses.map((course, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => { navigate(`/viewcourse/${course._id}`); onClose() }}
                                                            className='flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-indigo-100 transition-all'
                                                        >
                                                            {course.thumbnail && (
                                                                <img src={course.thumbnail} className='w-6 h-6 rounded-md object-cover' />
                                                            )}
                                                            <span className='text-xs font-medium text-indigo-700'>{course.title}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Connector line */}
                                    {index < roadmap.steps.length - 1 && (
                                        <div className='ml-4 mt-2 w-0.5 h-4 bg-gray-200'></div>
                                    )}
                                </div>
                            ))}

                            {/* Reset Button */}
                            <button
                                onClick={() => { setRoadmap(null); setSelectedGoal(""); setCustomGoal("") }}
                                className='w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all mt-2'
                            >
                                Generate Another Roadmap
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RoadmapModal