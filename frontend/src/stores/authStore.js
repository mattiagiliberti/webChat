import { defineStore } from "pinia";
import { useSocketStore } from "./socketStore";
import api from "@/services/api";
import { useChatStore } from "./chatStore";
import { useUsersStore } from "./userStore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.login(credentials);
        if (response.status === 200) {
          this.token = response.data.token;
          this.username = response.data.username;

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("username", response.data.username);

          useSocketStore().initializeSocket(response.data.userId);
          useChatStore().fetchChats(response.data.userId);
          return { success: true };
        }
      } catch (error) {
        console.error("Errore di login:", error);

        const errorMessage =
          error.response?.data?.message || "Errore sconosciuto";
        return { success: false, message: errorMessage };
      }
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");

      this.user = null;
      this.token = null;
      this.username = null;

      useSocketStore().disconnectSocket();
      useUsersStore().resetStore();
      useChatStore().resetStore();
    },
  },
});
