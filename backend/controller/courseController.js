import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";


export const createCourse = async (req, res) => {
    try {
        const { title, category } = req.body;
        if(!title || !category) {
            return res.status(400).json({ error: "Title and category are required" });
        }
        const course = await Course.create({
             title,
            category,
            
            creator: req.userId
            // req.userId is coming from isAuth middleware, jisme humne user ki id ko req.userId me store kiya hai, to yaha pe hum course ke creator field me req.userId ko store karenge, taki hume pata chale ki ye course kisne create kiya hai

            // ye middleware ke through hi possible hai, kyuki jab tak user login nhi karega, tab tak uske paas token nhi hoga, aur jab tak token nhi hoga, tab tak wo course create nhi kar sakta, to is tarah se hum ensure kar sakte hai ki sirf logged in user hi course create kar sakta hai
        });
        return res.status(201).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Error creating course: ${error.message}` });
    }
};


export const getPublishedCourses = async (req, res) => { try {
        const courses = await Course.find({ isPublished: true }).populate("creator", "name");
        if(!courses) {
            return res.status(404).json({ message: "No published courses found" });
        }
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching published courses: ${error.message}` });
    }
}

export const getCreatedCourses = async (req, res) => {
    try {
        const userId = req.userId; // Ye userId isAuth middleware se aayega, jisme humne user ki id ko req.userId me store kiya hai
        const courses = await Course.find({ creator: userId })
        
        if(!courses) {
            return res.status(404).json({ message: "No created courses found" });
        }
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching created courses: ${error.message}` });
    }
}

export const editCourse = async (req, res) => {
    try {
        const {courseId} = req.params;
        const { title, subTitle, description, category, level, isPublished ,price} = req.body;
        let thumbnail
        if(req.file){
            thumbnail = await uploadOnCloudinary(req.file.path);
            // agar thumbnail update karna hai, to pehle course ko find karna padega, taki hume uska thumbnail url mil jaye, aur us url ko delete kar sake,            
        }
        let course = await Course.findById(courseId);

        if(!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const updateData = { title, subTitle, description, category, price, level , isPublished , thumbnail };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Error editing course: ${error}` });
    } 
};



export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message:"Course is not found"})
        }
        return res.status(200).json(course)

    } catch (error) {
        return res.status(500).json({message:`failed to get Course by id ${error}`})
    }
}

export const removeCourse = async (req,res) => {
    try {
        const {courseId}= req.params
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message:"Course is not found"})
        }
        course = await Course.findByIdAndDelete(courseId , {new:true})
        return res.status(200).json({message:"Course removed"})
    } catch (error) {
        return res.status(500).json({message:`failed to delete Course by id ${error}`})
    }
}

//for Lecture

export const createLecture = async (req,res) => {
    try {
       const {lectureTitle} = req.body
       const {courseId} = req.params
       if(!lectureTitle || !courseId){
        return res.status(400).json({message:"lectureTitle is required"})
       }
       const lecture = await Lecture.create({lectureTitle})
       const course = await Course.findById(courseId)
       if(course){
        course.lectures.push(lecture._id)
       }
       // taki course me course me sare lectures store ho jae
       await course.populate("lectures")
       await course.save()
       return res.status(201).json({lecture , course})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`failed to create Lecture ${error}`})
    }
}

// get lectures thorough courses ,// Course ki details aur uske saare lectures frontend ko bhejta hai , populate() existing course object ko modify kar deta hai.
export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId)
        if(!course){
          return res.status(404).json({message:"Course is not found"})
        }
       await course.populate("lectures")
       await course.save()
       return res.status(200).json(course)


    } catch (error) {
         return res.status(500).json({message:`failed to getCourseLecture ${error}`})
    }
} 

export const editLecture = async (req,res) => {
    try {
        const {lectureId} = req.params
        const {isPreviewFree , lectureTitle} = req.body
        const lecture = await Lecture.findById(lectureId)
        if(!lecture){
            return res.status(404).json({message:"Lecture is not found"})
        }
        let videoUrl
        if(req.file){
            videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }
        if(lectureTitle){
            lecture.lectureTitle= lectureTitle
        }
        lecture.isPreviewFree = isPreviewFree

        await lecture.save()
        return res.status(200).json(lecture)
    } catch (error) {
          return res.status(500).json({message:`failed to edit Lecture ${error}`})
    }
}


export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.userId
        const courses = await Course.find({creator:userId})
        if(!courses){
             return res.status(400).json({message:"Courses are not found"})
        }
         return res.status(200).json(courses)

    } catch (error) {
        return res.status(500).json({message:`failed to get Creator Courses ${error}`})
    }
}



export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if(!lecture){
             return res.status(404).json({message:"Lecture not found"})
        }

        await Course.updateOne(
            {lectures: lectureId},
            {$pull:{lectures: lectureId}}
        )
        return res.status(200).json({message:"Lecture Remove Successfully"})
        }
    
     catch (error) {
        return res.status(500).json({message:`Failed to remove Lectures ${error}`})
    }
}

// get Creator
 
export const getCreatorById = async (req,res) => {
    try {
        const {userId} = req.body

        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(404).json({message:"User is not Found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`Failed to get Creator ${error}`})
    }
    
}