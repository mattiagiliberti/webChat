const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../utils/db");
const authRoutes = require("./routes/auth");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);


server.listen(process.env.PORT, () => {
    console.log(`Server avviato sulla porta ${process.env.PORT}`);
});
