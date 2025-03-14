const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../utils/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use("/api/auth", authRoutes);

app.use("/api/chats", chatRoutes);

app.use("/api/user", userRoutes);

server.listen(process.env.PORT, () => {
    console.log(`Server avviato sulla porta ${process.env.PORT}`);
});
