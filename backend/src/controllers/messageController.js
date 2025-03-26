const Message = require('../models/messageModel');
const Chat = require('../models/Chats');
const { createMessageInDB } = require('../services/messageService');

const getAllMessagesByChat = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const chatId = req.params.id;    
        const chat = await Chat.findOne({ _id: chatId, 'participants.userId': userId });

        if (!chat) {
            return res.status(403).json({ error: "Accesso negato" });
        }

        const messages = await Message.find({chatId: chatId}).select('-__v -status -chatId').sort({createdAt: 1});
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMessage = async (req, res) => {
    console.log(req.body);
    
    if (!req.body.senderId || !req.body.receiverId || !req.body.chatId || !req.body.message) {
        return res.status(400).json({ message: 'Inserisci tutti i campi' });
    }
    if (req.body.senderId !== req.user.userId) {
        return res.status(403).json({ message: 'Accesso negato' });
    }
    const message = new Message({
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        chatId: req.body.chatId,
        message: req.body.message
    });

    try {
        // const newMessage = await message.save();
        // await Chat.findByIdAndUpdate(req.body.chatId, { 
        //     lastMessage: {
        //         senderId: newMessage.senderId,
        //         senderUser: req.user.username, 
        //         text: newMessage.message,
        //         timestamp: newMessage.timestamp
        //     }
        // });
        await createMessageInDB({
            senderId: req.body.senderId,
            receiverId: req.body.receiverId,
            chatId: req.body.chatId,
            message: req.body.message,
            senderUser: req.user.username
        });
        res.status(201).json("Nuovo messaggio creato");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.text = req.body.text || message.text;
        const updatedMessage = await message.save();
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.remove();
        res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllMessagesByChat,
    createMessage,
    updateMessage,
    deleteMessage
};