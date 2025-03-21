import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { useChatStore } from './chatStore';
import { useUsersStore } from './userStore';
const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null,
    connected: false
  }),

  actions: {
    initializeSocket(userId) {
      if (this.socket) return; 

      this.socket = io(serverUrl, {
        query: { userId }
      });

      this.socket.on('connect', () => {
        this.connected = true;
        console.log('Connesso al server con ID:', userId);
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
        console.log('Disconnesso dal server');
      });

      // Ascolta nuovi messaggi e aggiornali nello store della chat
      this.socket.on('new_message', (message) => {
        const chatStore = useChatStore();
        chatStore.addMessage(message.chatId, message);
      });

      // Ascolta cambi di stato degli utenti
      this.socket.on('user:online', ({ userId, status }) => {
        const usersStore = useUsersStore();
        usersStore.updateUserStatus(userId, status);
      });
      this.socket.on('user:offline', ({ userId, status }) => {
        const usersStore = useUsersStore();
        usersStore.updateUserStatus(userId, status);
      });

      // Aggiorna lista alla ricezione di una nuova chat
      this.socket.on("chat:update", (to) => {
        console.log("Nuova chat ricevuta");
        useChatStore().fetchChats(to);
      });
    },

    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
        this.connected = false;
      }
    },
  }
});
