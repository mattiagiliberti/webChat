const Chat = require("../models/Chats");
const mongoose = require("mongoose");
const User = require("../models/Users");

const createChat = async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).send(chat);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getChatById = async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: "Accesso negato" });
    }
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const chat = await Chat.find({ "participants.userId": userId })
      .sort({ "lastMessage.timestamp": -1 })
      .select("-_id -participants._id"); 
      const userIds = chat.map(c => c.participants.find(p => p.userId.toString() !== req.params.id).userId);
      const users = await User.find({ _id: { $in: userIds } }).select("image");
      const userImageMap = users.reduce((map, user) => {
        map[user._id.toString()] = user.image;
        return map;
      }, {});
      const otherParticipant = chat.map(c => {
        const participant = c.participants.find(p => p.userId.toString() !== req.params.id);
        return {
          ...participant._doc,
          image: userImageMap[participant.userId.toString()]
        };
      });
      chat.forEach((c, index) => {
        c._doc.otherParticipant = otherParticipant[index];
        delete c._doc.participants;
      });
      
    if (!chat || chat.length === 0) {
      return res.status(404).json({ message: "Chat non trovata" });
    }
    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const updateChatById = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!chat) {
      return res.status(404).send();
    }
    res.status(200).send(chat);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteChatById = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) {
      return res.status(404).send();
    }
    res.status(200).send(chat);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createChat,
  getChatById,
  updateChatById,
  deleteChatById,
};
