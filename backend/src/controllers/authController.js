const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");

const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        // Controlla se l'utente esiste già
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username già in uso" });

        // Controlla se l'email esiste già
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email già in uso" });
        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creazione utente
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();

        res.status(201).json({ message: "Registrazione completata" });
    } catch (error) {        
        res.status(500).json({ message: "Errore nel server" });
    }
};

const login = async (req, res) => {
    try {
        //console.log(req);
        const { username, password } = req.body;
        // Trova l'utente
        const user = await User.findOne({ username });
        
        if (!user) return res.status(400).json({ message: "Credenziali non valide" });

        // Verifica la password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Credenziali non valide" });

        // Genera token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: "Errore nel server" });
    }
};

module.exports = { register, login };
