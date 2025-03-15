const mongoose = require('mongoose');
mongoose.set("debug", true);

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    participants: {
        type: [{
            userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users', },
            username: { type: String, required: true }
        }],
        required: true
    },
    lastMessage: {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        senderUser: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
}, { collection: "Chats" });

module.exports = mongoose.model('Chats', chatSchema);;