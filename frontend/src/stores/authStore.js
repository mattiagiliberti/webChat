import { defineStore } from "pinia";
import { useSocketStore } from "./socketStore";
import api from "@/services/api";
import { useChatStore } from "./chatStore";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await api.login(credentials);
        if (response.status === 200) {
          this.token = response.data.token;
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);

          useSocketStore().initializeSocket(response.data.userId);
          useChatStore().fetchChats(response.data.userId)
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
      this.user = null;
      this.token = null;
      useSocketStore().disconnectSocket()
      useChatStore().resetStore();
    },
  },
});
