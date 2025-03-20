const mongoose = require("mongoose");
mongoose.set("debug", true);

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    participants: [
      new Schema(
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Users",
          },
          username: { type: String, required: true },
        },
        { _id: false } 
      ),
    ],
    lastMessage: {
      senderId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
      senderUser: {
        type: String,
      },
      text: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }, 
  },
  { collection: "Chats" }
);

module.exports = mongoose.model("Chats", chatSchema);
