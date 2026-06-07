import User from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";


export const getCurrentUser = async (req, res) => {
    try{
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `getCurrentUsererror${error.message}` })
    }
};    
export default getCurrentUser;

//Iska kaam hai user apna name, description aur profile photo update kar sake.
export const updateProfile = async (req, res) => {
    try {
        
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        console.log("USERID:", req.userId);
        const userId = req.userId;
        // req.body me se description aur name ko extract karenge, kyuki user apne profile me description aur name ko update kar sakta hai, aur photoUrl ko bhi update kar sakta hai, lekin photoUrl ko hum req.file se uploadOnCloudinary function ke through upload karenge, kyuki multer ke through file upload hoti hai, aur us file ka path req.file.path me hota hai, aur us file ko cloudinary pe upload karne ke baad hume uska url milta hai, jo ki photoUrl me store karenge, aur us url ko user ke profile me update karenge

        //Ye req.userId kahan se aaya?
        //Tumhare isAuth middleware se: Matlab currently login user ki id mil gayi.

        const {description, name} = req.body;
        let photoUrl;
        if(req.file) {
            // photourl me cloudinary pa url hoga kaha pe store hua hai, aur us url ko user ke profile me update karenge
            photoUrl = await uploadOnCloudinary(req.file.path);
        }
        const user = await User.findByIdAndUpdate(
            userId,
            {  name, description, photoUrl },
            { new: true }
        )        .select("-password");
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        return res.status(200).json(user)
    }
     catch (error) {
        console.log("user profile error:",error);
        return res.status(500).json({ message: `updateProfile error ${error.message}` })
    }
};