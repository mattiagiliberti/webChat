const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users"  },
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Chats"  },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ["inviato", "letto"], default: "inviato" }
}, { collection: "Messages" });

module.exports = mongoose.model("Messages", MessageSchema);
