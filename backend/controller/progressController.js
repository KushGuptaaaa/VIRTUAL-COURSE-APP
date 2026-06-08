import Progress from "../models/progressModel.js"
import Course from "../models/courseModel.js"

export const updateProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body
        const userId = req.userId

        let progress = await Progress.findOne({ user: userId, course: courseId })

        if (!progress) {
            progress = await Progress.create({
                user: userId,
                course: courseId,
                completedLectures: [lectureId]
            })
        } else {
            if (!progress.completedLectures.includes(lectureId)) {
                progress.completedLectures.push(lectureId)
            }
        }

        // Check karo sab lectures complete hue ya nahi
        const course = await Course.findById(courseId)
        if (course.lectures.length === progress.completedLectures.length) {
            progress.isCompleted = true
        }

        await progress.save()
        return res.status(200).json(progress)

    } catch (error) {
        return res.status(500).json({ message: `Failed to update progress ${error}` })
    }
}

export const getProgress = async (req, res) => {
    try {
        const { courseId } = req.params
        const userId = req.userId

        const progress = await Progress.findOne({ user: userId, course: courseId })
        return res.status(200).json(progress)

    } catch (error) {
        return res.status(500).json({ message: `Failed to get progress ${error}` })
    }
}