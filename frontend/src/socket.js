import { io } from "socket.io-client"

const socket = io(import.meta.env.VITE_SERVER_URL || "https://virtual-course-app.onrender.com", {
  withCredentials: true,
})

export default socket
