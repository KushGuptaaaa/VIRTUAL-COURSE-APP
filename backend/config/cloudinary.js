import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();


const uploadOnCloudinary = async (filePath) => { 
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    // multer ka kam hai photo vdo ko public folder me store krna, aur ye function uske baad us file ko cloudinary pe upload krne ka kam karega


    try {
        if(!filePath) {
            return null;
        }
        const uploadResult = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
        
        //ye filpath ko delete kr dega, kyuki multer us file ko public folder me store krta hai, aur hume us file ki jarurat nhi hai, hume bas uska url chahiye hota hai
        fs.unlinkSync(filePath);
        return uploadResult.secure_url;
    } catch (error) {
        fs.unlinkSync(filePath);
        console.error('Error uploading to Cloudinary:', error);
        
    }
};

export default uploadOnCloudinary;