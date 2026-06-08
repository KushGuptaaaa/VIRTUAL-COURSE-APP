import express from "express"
import { updateProgress, getProgress } from "../controller/progressController.js"
import isAuth from "../middleware/isAuth.js"

const progressRouter = express.Router()

progressRouter.post("/update", isAuth, updateProgress)
progressRouter.get("/:courseId", isAuth, getProgress)

export default progressRouter