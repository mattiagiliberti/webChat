const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    image: { type: String },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
}, { collection: "Users" });

module.exports = mongoose.model("Users", userSchema);
