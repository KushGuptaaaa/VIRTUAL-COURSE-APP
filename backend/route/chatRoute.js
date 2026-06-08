import express from "express"
import { getMessages, saveMessage } from "../controller/chatController.js"
import isAuth from "../middleware/isAuth.js"

const chatRouter = express.Router()

chatRouter.get("/:roomId", isAuth, getMessages)
chatRouter.post("/send", isAuth, saveMessage)

export default chatRouter