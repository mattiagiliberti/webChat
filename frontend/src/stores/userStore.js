import { defineStore } from 'pinia';
import { useChatStore } from './chatStore';
export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    setUsers(user) {
      if (!this.users.some(u => u.userId === user.userId)) {
        this.users.push(user);
      }
    },

    isInChat(userId) {
      return this.users.some(u => u.userId === userId);
    },

    updateUserStatus(userId, status) {
      var user = this.users.find(u => u.userId === userId);
      const chatStore = useChatStore();   
      if (user) {
        user.isOnline = status;
        chatStore.chats.forEach(chat => {
          if (chat.otherParticipant.userId === userId) {
            chat.otherParticipant.isOnline = status;
          }
        });
      }
      if (chatStore.activeChat){
        chatStore.activeChat.otherParticipant.isOnline = status;
      }
    },

    resetStore(){
      this.users = [];
      localStorage.removeItem("users");
    }
  }
});
