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
        auth: {
          token: localStorage.getItem('token'),
        }
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
      this.socket.on('message:receive', (message) => {
        const chatStore = useChatStore();
        console.log("ricevuto");
        chatStore.addMessage(message);
      });

      // Ascolta cambi di stato degli utenti
      this.socket.on('user:online', ({ userId }) => {
        const usersStore = useUsersStore();
        usersStore.updateUserStatus(userId, true);
      });
      this.socket.on('user:offline', ({ userId }) => {
        const usersStore = useUsersStore();
        usersStore.updateUserStatus(userId, false);
      });

      // Aggiorna lista alla ricezione di una nuova chat
      this.socket.on("chat:update", (to) => {
        console.log("Nuova chat ricevuta");
        useChatStore().fetchChats(to);
      });

      this.socket.on("connect_error", (err) => {
        alert(err.message);
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
