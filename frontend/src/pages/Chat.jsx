import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import socket from '../socket.js'
import { FaArrowLeftLong } from "react-icons/fa6"
import img from "/empty.jpg"

function Chat() {
    const { roomId } = useParams()
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const bottomRef = useRef(null)

    // Join room aur purane messages fetch karo
    useEffect(() => {
        socket.emit("joinRoom", roomId)

        const fetchMessages = async () => {
            try {
                const result = await axios.get(serverUrl + `/api/chat/${roomId}`, { withCredentials: true })
                setMessages(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchMessages()

        // Naya message aane pe
        socket.on("receiveMessage", (data) => {
            setMessages(prev => [...prev, data])
        })

        return () => {
            socket.off("receiveMessage")
        }
    }, [roomId])

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const messageData = {
            roomId,
            message: input,
            sender: {
                _id: userData._id,
                name: userData.name,
                photoUrl: userData.photoUrl
            }
        }

        // Socket se real-time bhejo
        socket.emit("sendMessage", messageData)

        // Database mein save karo
        try {
            await axios.post(serverUrl + "/api/chat/send", { roomId, message: input }, { withCredentials: true })
        } catch (error) {
            console.log(error)
        }

        setInput("")
    }

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col'>

            {/* Header */}
            <div className='bg-black text-white px-6 py-4 flex items-center gap-4 shadow-md'>
                <FaArrowLeftLong className='cursor-pointer hover:text-gray-300' onClick={() => navigate(-1)} />
                <h1 className='text-lg font-semibold'>Chat</h1>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3'>
                {messages.map((msg, index) => {
                    const isMe = msg.sender?._id === userData?._id || msg.sender === userData?._id
                    return (
                        <div key={index} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                            {!isMe && (
                                <img src={msg.sender?.photoUrl || img} className='w-8 h-8 rounded-full object-cover' />
                            )}
                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe ? "bg-black text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"}`}>
                                {!isMe && <p className='text-xs font-semibold text-gray-500 mb-1'>{msg.sender?.name}</p>}
                                <p>{msg.message}</p>
                                <p className='text-[10px] mt-1 text-right opacity-50'>
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                </p>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className='px-4 py-3 bg-white border-t flex items-center gap-3'>
                <input
                    type="text"
                    className='flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black'
                    placeholder='Type a message...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                />
                <button
                    onClick={handleSend}
                    className='bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95'
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat