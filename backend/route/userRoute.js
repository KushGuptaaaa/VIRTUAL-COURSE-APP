import express from "express";
import isAuth  from "../middleware/isAuth.js";
import { getCurrentUser } from "../controller/userController.js";
import { updateProfile } from "../controller/userController.js";
import upload from "../middleware/multer.js";


const userRouter = express.Router();


userRouter.get("/getcurrentuser", isAuth , getCurrentUser)

userRouter.post("/profile", isAuth , upload.single("photoUrl"), updateProfile)



// upload.single("photoUrl") multer middleware hai
// frontend se aayi "photoUrl" file ko receive karta hai
// uploaded file ko req.file me store karta hai
// baad me req.file.path se Cloudinary par upload kar sakte hain

export default userRouter;