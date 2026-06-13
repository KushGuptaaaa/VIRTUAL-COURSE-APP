import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectdb.js";
import cookieParser from "cookie-parser";
import authRoute from "./route/authRoute.js";
import cors from "cors";
import userRouter from "./route/userRoute.js";
import courseRouter from "./route/courseRoute.js";
import paymentRouter from "./route/paymentRoute.js";
import reviewRouter from "./route/reviewRoute.js";
import chatRouter from "./route/chatRoute.js";          // add
import { createServer } from "http";                    // add
import { Server } from "socket.io";                    // add
import progressRouter from "./route/progressRoute.js"



dotenv.config();

const port = process.env.PORT;
const app = express();
const server = createServer(app);                      // add
const io = new Server(server, {                        // add
  cors: {
    origin: "https://virtual-course-app-1.onrender.com",
    credentials: true,
  }
});

app.use(cors({
  origin: "https://virtual-course-app-1.onrender.com",
  credentials: true,
}))

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/order", paymentRouter)
app.use("/api/review", reviewRouter)
app.use("/api/chat", chatRouter)                       // add
app.use("/api/progress", progressRouter)



app.get("/", (req, res) => {
  res.send("Hello from server");
});

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId)
    console.log(`Joined room: ${roomId}`)
  })

  socket.on("sendMessage", (data) => {
    io.to(data.roomId).emit("receiveMessage", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})

server.listen(port, () => {                            // app.listen → server.listen
  console.log("Server Started");
  connectDb();
});
