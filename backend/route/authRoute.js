import express from "express";
import { signUp } from "../controller/authController.js";
import { login, logout } from "../controller/authController.js";
import { sendOtp, verifyOtp, resetPassword , googleAuth } from "../controller/authController.js";

const authRoute = express.Router();

authRoute.post("/signup", signUp)
authRoute.post("/login", login)
authRoute.get("/logout", logout)

authRoute.post("/sendotp", sendOtp)
authRoute.post("/verifyotp", verifyOtp)
authRoute.post("/resetpassword", resetPassword)
authRoute.post("/googleauth", googleAuth);


export default authRoute;