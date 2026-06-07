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

dotenv.config();
console.log(process.env.MONGO_URI);

const port = process.env.PORT;
const app = express();

// cors sabse pahle hona  chahiye  
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
// jitne bhi authROute hai unke age /api/auth lag jayega
app.use("/api/user", userRouter) // jitne bhi userRoute hai unke age /api/user lag jayega

app.use("/api/course" , courseRouter)
app.use("/api/order", paymentRouter)
app.use("/api/review", reviewRouter)


app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(port, () => {
  console.log("Server Started");
  connectDb();
});
