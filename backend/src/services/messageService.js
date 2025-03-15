const Message = require("../models/messageModel");
const Chat = require("../models/Chats");

const createMessageInDB = async ({ senderId, receiverId, chatId, message, senderUser }) => {
    const newMessage = new Message({ senderId, receiverId, chatId, message });

    try {
        const savedMessage = await newMessage.save();
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: {
                senderId: savedMessage.senderId,
                senderUser, 
                text: savedMessage.message,
                timestamp: savedMessage.timestamp
            }
        });
        return savedMessage;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createMessageInDB };
