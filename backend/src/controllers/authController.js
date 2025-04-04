const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");

const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username già in uso" });

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email già in uso" });
        
        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, email });

        newUser.image = "/uploads/noImage/no-image-profile.webp" 

        await newUser.save();

        res.status(201).json({ message: "Registrazione completata" });
    } catch (error) {        
        res.status(500).json({ message: "Errore nel server" });
    }
};

const login = async (req, res) => {
    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username }).select("-lastSeen -isOnline -createdAt -__v");
        
        if (!user) return res.status(400).json({ message: "Credenziali non valide. Riprova!" });
        console.log("eccomi");

        // Verifica la password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Credenziali non valide. Riprova!" });

        // Genera token JWT
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
        user.password = undefined;
        res.json({ token, user, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Errore nel server" });
    }
};

module.exports = { register, login };
