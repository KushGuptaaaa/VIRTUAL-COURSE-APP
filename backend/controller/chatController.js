import Message from "../models/messageModel.js"

export const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params
        const messages = await Message.find({ roomId })
            .populate("sender", "name photoUrl")
            .sort({ createdAt: 1 })
        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get messages ${error}` })
    }
}

export const saveMessage = async (req, res) => {
    try {
        const { roomId, message } = req.body
        const sender = req.userId
        const newMessage = await Message.create({ roomId, sender, message })
        await newMessage.populate("sender", "name photoUrl")
        return res.status(201).json(newMessage)
    } catch (error) {
        return res.status(500).json({ message: `Failed to save message ${error}` })
    }
}