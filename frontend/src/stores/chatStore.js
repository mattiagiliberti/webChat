import { defineStore } from 'pinia';
import { useSocketStore } from './socketStore';
import api from '@/services/api';
import { useUsersStore } from './userStore';

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [],
    activeChat: null, 
  }),
  actions: {
    async fetchChats(userId){
      const response = await api.getChatById(userId);
        if (response.status === 200) {
          this.chats = response.data;
          const userStore = useUsersStore();
          this.chats.forEach(chat => {
            userStore.setUsers(chat.otherParticipant);
          });
          localStorage.setItem("users", JSON.stringify(userStore.users));
          localStorage.setItem("chats", JSON.stringify(this.chats));          
        }
    },
    addMessage(chatId, message) {
      const chat = this.chats.find(c => c.id === chatId);
      if (chat) {
        chat.messages.push(message);
      } else {
        this.chats.push({ id: chatId, messages: [message] });
      }
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

    resetStore() {
      this.chats = [];
      localStorage.removeItem("chats");
    },
  }
});
