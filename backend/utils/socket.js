const { Server } = require("socket.io");
const Message = require("../src/models/messageModel");
const User = require("../src/models/Users");
const Chat = require("../src/models/Chats");
const { createMessageInDB } = require("../src/services/messageService");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Mappa per tracciare gli utenti connessi
  const connectedUsers = new Map();

  io.on("connection", async (socket) => {
    // Registrazione utente connesso in automatico
    const userId = socket.handshake.query.userId;

    console.log("Un utente si è connesso", socket.id + " " + userId);

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: new Date(),
    });

    io.emit("user:online", userId);
    connectedUsers.set(userId, socket.id);
    console.log(`Utente ${userId} registrato con socket ${socket.id}`);

    // Invio di un messaggio privato
    socket.on("message:send", async ({ senderId, receiverId, message, chatId, senderUser }) => {
        const receiverSocketId = connectedUsers.get(receiverId);
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
        } catch (error) {
          console.log(error);
        }

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message:recieve", { senderId, message });
        }
      }
    );

    // Aggiornamento nuova chat
    socket.on("chat:new", ({ from, to, chat }) => {
      console.log(`Nuova chat tra ${from} e ${to}`);
      const receiverSocketId = connectedUsers.get(to);
      io.to(receiverSocketId).emit("chat:update", to);
    });

    // Disconnessione dell'utente
    socket.on("disconnect", () => {
      let disconnectedUserId = null;
      for (let [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          disconnectedUserId = userId;
          break;
        }
      }
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
