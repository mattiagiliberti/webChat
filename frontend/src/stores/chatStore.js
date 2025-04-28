import { defineStore } from 'pinia';
import { useSocketStore } from './socketStore';
import api from '@/services/api';
import { useUsersStore } from './userStore';

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [],
    activeChat: null, 
    messagesChat: [],
  }),
  actions: {
    async fetchChats(userId){
      const response = await api.getChatById(userId);
        if (response.status === 200) {
          this.chats = [...response.data];
          const userStore = useUsersStore();
          this.chats.forEach(chat => {
            userStore.setUsers(chat.otherParticipant);
          });
          localStorage.setItem("users", JSON.stringify(userStore.users));       
          localStorage.setItem("chats", JSON.stringify(this.chats));  
        }
    },
    addMessage(newMessage) {
      if (this.activeChat && (this.activeChat._id === newMessage.chatId)) {
        this.messagesChat = [...this.messagesChat, newMessage];
      }
      this.fetchChats(newMessage.receiverId);
    },
    async startNewChat(chat, from, to) {
        try {
          const response = await api.createChat(chat);
          if (response.status === 201) {

            this.fetchChats(from)
            
            const socketStore = useSocketStore();
            socketStore.socket.emit("chat:new", {
              from: from,
              to: to,
            });
          }
          return response
        } catch (error) {
          console.error("Errore nella creazione della chat:", error);
        }
    },

    sendMessage(receiverId, chatId, message, senderUser) {
      const socketStore = useSocketStore();
      socketStore.socket.emit(
        "message:send",
        {
          receiverId: receiverId,
          chatId: chatId,
          message: message,
          senderUser: senderUser,
        },
        (response) => {
          if (response?.status === "ok") {
            const timestamp = new Date().toISOString();
            const localMessage = {
              receiverId,
              chatId,
              message,
              timestamp,
              senderUser,
            };
            this.messagesChat.push(localMessage);
          } else {
            console.error("Errore nell'invio del messaggio", response);
          }
        }
      );
    },
    

    resetStore() {
      this.chats = [];
      this.messagesChat = [],
      this.activeChat = null;
      localStorage.removeItem("chats");
    },
  }
});
