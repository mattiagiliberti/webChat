import { defineStore } from 'pinia';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    setUsers(userList) {
      this.users = userList;
    },

    updateUserStatus(userId, status) {
      const user = this.users.find(u => u.id === userId);
      if (user) user.status = status;
    }
  }
});
