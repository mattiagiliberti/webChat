const { Server } = require("socket.io");
const Message = require("../src/models/messageModel");
const User = require("../src/models/Users");
const Chat = require("../src/models/Chats");
const { createMessageInDB } = require("../src/services/messageService");
const jwt = require('jsonwebtoken');
module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });


  // Middleware per autenticazione JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log(token);
    
    if (!token) {      
      return next(new Error("Token mancante. Effettua nuovamente il login."));
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = decodedToken.userId; 
      console.log("decodedToken", decodedToken);
      
      next();
    } catch (err) {
      return next(new Error("Token non valido. Effettua nuovamente il login."));
    }
  });

  // Mappa per tracciare gli utenti connessi
  const connectedUsers = new Map();

  io.on("connection", async (socket) => {
    // Registrazione utente connesso in automatico
    const userId = socket.data.userId;

    console.log("Un utente si è connesso", socket.id + " " + userId);

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: new Date(),
    });

    io.emit("user:online", userId);
    connectedUsers.set(userId, socket.id);
    console.log(`Utente ${userId} registrato con socket ${socket.id}`);

    // Invio di un messaggio privato
    socket.on("message:send", async ({ receiverId, message, chatId, senderUser }, callback) => {
        const receiverSocketId = connectedUsers.get(receiverId);
        const senderId = socket.data.userId;
        console.log(`Messaggio privato da ${senderId} a ${receiverId}: ${message}` );

        try {
            const newMessage = await createMessageInDB({
                senderId: senderId,
                receiverId: receiverId,
                chatId: chatId,
                message: message,
                senderUser: senderUser
            });
            console.log(`Messaggio salvato nel database`);
            callback({
              status: "ok"
            });
            if (receiverSocketId) {
              io.to(receiverSocketId).emit("message:receive", newMessage);
            }
        } catch (error) {
          console.log(error);
        }
      }
    );

    // Aggiornamento nuova chat
    socket.on("chat:new", ({ from, to }) => {
      console.log(`Nuova chat tra ${from} e ${to}`);
      const receiverSocketId = connectedUsers.get(to);
      io.to(receiverSocketId).emit("chat:update", to);
    });

    // Disconnessione dell'utente
    socket.on("disconnect", () => {
      let disconnectedUserId = socket.data.userId;
      connectedUsers.delete(disconnectedUserId);

      if (disconnectedUserId) {
        setTimeout(async () => {
          const user = await User.findById(disconnectedUserId);
          if (user && !connectedUsers.has(disconnectedUserId)) {
            io.emit("user:offline", disconnectedUserId);
            await User.findByIdAndUpdate(disconnectedUserId, {
              isOnline: false,
              lastSeen: new Date(),
            });
            console.log(`Utente ${disconnectedUserId} disconnesso`);
          }
        }, 3000);
      }
    });
  });

  return io;
};
