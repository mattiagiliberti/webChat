import { defineStore } from 'pinia';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    setUsers(user) {
      this.users.push(user);
    },

    isInChat(userId) {
      return this.users.some(u => u.userId === userId);
    },

    updateUserStatus(userId, status) {
      const user = this.users.find(u => u.id === userId);
      if (user) user.status = status;
    }
  }
});
