import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";
    
export const signUp = async (req, res) => {
    try {
        const {name , email , password , role} = req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const existUser = await User.findOne({email});


        if(existUser){
            return res.status(400).json({ message: "User already exists" });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({ message: "Please provide a valid email" });
        }

        if(password.length < 8){
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        });
        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json(user);
    }
        catch (error) {
        res.status(500).json({ message: "Error signing up user", error: error.message });
    }  
};



export const login = async (req, res) => {
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({ message: "User Not Found" });
        }

        let isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json(user);
    } catch (error) {

        return res.status(500).json({ message: "Error logging in user", error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        await res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error logging out user", error: error.message });
    }   
};

export const sendOtp = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({ message: "User Not Found" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save();

        // send mail to user with otp
        await sendMail(email, otp);
        return res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        return res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
};


export const verifyOtp = async (req, res) => {
    try {
        const {email, otp} = req.body;
        const user = await User.findOne({email});

        if(!user || user.resetOtp !== otp || user.otpExpires < Date.now()){
            return res.status(404).json({ message: "Invalid or expired OTP" });
        }   
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        

        await user.save();
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user || !user.isOtpVerified){
            return res.status(404).json({ message: "User Not Found or OTP not verified" });
        }    
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.isOtpVerified = false;
        
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};



export const googleAuth = async (req, res) => {
    try {
        const {name, email , role} = req.body;
       let user = await User.findOne({email});

        if(!user){
            user = await User.create({
                name,
                email,
                role
            });
        }
        //login ho ya na ho token generate krke cookie me store krdo
        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "fal",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Error with Google authentication", error: error.message });
    }
}; 
