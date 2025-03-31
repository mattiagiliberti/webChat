const Chat = require("../models/Chats");
const mongoose = require("mongoose");
const User = require("../models/Users");

const createChat = async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json({ message: "Chat creata con successo!" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getChatById = async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: "Accesso negato" });
    }
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const chats = await Chat.find({ "participants.userId": userId })
      .sort({ "lastMessage.timestamp": -1 })
      .lean();

    if (!chats.length) {
      return res.status(404).json({ message: "Chat non trovata" });
    }

    const userIds = chats
      .map((chat) =>
        chat.participants.find((p) => !p.userId.equals(userId))?.userId
      )
      .filter(Boolean);

    const users = await User.find({ _id: { $in: userIds } }).select(
      "username image lastSeen isOnline"
    );

    const userMap = Object.fromEntries(
      users.map((user) => [user._id.toString(), user])
    );

    const formattedChats = chats.map((chat) => {
      const participant = chat.participants.find((p) => !p.userId.equals(userId));
      const userData = userMap[participant.userId.toString()] || {};

      return {
        _id: chat._id,
        lastMessage: chat.lastMessage,
        otherParticipant: {
          userId: participant.userId,
          username: userData.username || "Utente sconosciuto",
          image: userData.image || "/uploads/noImage/no-image-profile.webp",
          lastSeen: userData.lastSeen || null,
          isOnline: userData.isOnline || false,
        },
      };
    });

    res.status(200).json(formattedChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore interno del server" });
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
    res.status(200).json(chat);
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
