const User = require('../models/Users');
const bcrypt = require("bcryptjs");
const upload = require('../../utils/multer');
const fs = require('fs');
const path = require('path');
const Chat = require('../models/Chats')

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }

            user.username = req.body.username || user.username;
            user.bio = req.body.bio || user.bio;

            if (req.file) {
                
                const uploadDir = path.join(__dirname, '../../uploads', req.params.id);

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                } else {
                    const files = fs.readdirSync(uploadDir);
                    files.forEach(file => fs.unlinkSync(path.join(uploadDir, file)));
                }

                const fileName = req.file.originalname.replace(/\s+/g, '');
                const filePath = path.join(uploadDir, fileName);
                fs.renameSync(req.file.path, filePath);

                user.image = `/uploads/${req.params.id}/${fileName}`;
            }

            const updatedUser = await user.save();
            if (!updatedUser) {
                return res.status(500).json({ message: 'Errore' });
            }
            res.status(200).send("Immagine profilo aggiornato con successo");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

// Update user password
const updatePasswordProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
                
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);

        if (!isMatch) return res.status(400).json({ message: "La vecchia password non è corretta. Riprova!" });
        user.password = await bcrypt.hash(req.body.newPassword, 10);

        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(500).json({ message: 'Errore' });
        }
        res.status(200).send("Password aggiornata con successo");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user profile
const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        await user.remove();
        res.json({ message: 'Utente eliminato' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search user by username
const searchUserByUsername = async (req, res) => {
    try {
        const users = await User.find({ username: new RegExp(req.params.query, 'i') }).select('_id username image isOnline lastSeen');
        
        if (!users.length) {
            return res.status(404).json({ message: 'Nessun utente trovato' });
        }
        
        const chats = await Chat.find({ "participants.userId": req.user.userId }).select('participants');
        
        // Estraggo id di utenti con cui ha una chat
        const chatUserIds = new Set(
            chats.flatMap(chat => chat.participants.map(p => p.userId.toString()))
        );
        
        // Elimino se stesso e quelli con cui ha gia una chat
        const filteredUsers = users.filter(user => 
            user._id.toString() !== req.user.userId && !chatUserIds.has(user._id.toString())
        );
        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    updatePasswordProfile,
    searchUserByUsername
};
