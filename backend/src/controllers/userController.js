const User = require('../models/Users');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        user.username = req.body.username || user.username;
        user.bio = req.body.bio || user.bio;
        user.image = req.body.image || user.image;

        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(500).json({ message: 'Errore' });
        }
        res.status(200).send("Profilo aggiornato con successo");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
const updatePasswordProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
                
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);

        if (!isMatch) return res.status(400).json({ message: "Password non corrispondono" });
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
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    updatePasswordProfile
};