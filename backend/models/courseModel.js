import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    subTitle:{
        type:String
    },
    description:{
        type:String
    },
    category:{
        type:String,
        required:true
    },
    level:{
        type:String,
        enum:["Beginner" , "Intermediate", "Advanced" , ""]
        // yaha se ek error arha tha
        // ki if koi 
    },
    price:{
        type:Number
    },
    thumbnail:{
        type:String
    },
    enrolledStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        // user model se reference le rahe hai 
    }],
    lectures:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lecture"
    }],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }]

},{timestamps:true})

// model create karne ke liye mongoose.model function ka use karte hai, jisme pehla argument model ka naam hota hai, aur dusra argument schema hota hai,
const Course = mongoose.model("Course" , courseSchema)

export default Course
