<template>
  <v-list lines="two">
    <template v-for="item in loadChats" :key="item._id" :value="item._id">
      <v-list-item
        :prepend-avatar="serverUrl + item.otherParticipant.image"
        class="py-3"
         @click="openChat(item)"
      >
        <v-list-item-title>{{
          item.otherParticipant.username
        }}</v-list-item-title>
        <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">{{
          item.lastMessage.username
        }}</v-list-item-subtitle>
        <template v-if="!item.lastMessage.text">
          <v-list-item-subtitle class="text-high-emphasis truncate-text" style="font-style: italic"
            >Inizia la chat</v-list-item-subtitle
          >
        </template>
        <template v-else-if="item.lastMessage.senderId == userId">
          <v-list-item-subtitle class="text-high-emphasis truncate-text"
            >Tu: {{ item.lastMessage.text }}</v-list-item-subtitle
          >
        </template>
        <template v-else>
          <v-list-item-subtitle class="text-high-emphasis truncate-text"
            >{{ item.lastMessage.senderUser }}:
            {{ item.lastMessage.text }}</v-list-item-subtitle
          >
        </template>

        <template v-slot:append>
          <v-list-item-action class="flex-column align-end">
            <small class="mb-4 text-high-emphasis opacity-60">{{
              formatDate(item.lastMessage.timestamp)
            }}</small>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-divider inset></v-divider>
    </template>
  </v-list>
</template>

<script>
import { useRouter } from "vue-router";
import { formatDate } from "@/utils/date";
import { useChatStore } from "@/stores/chatStore";

export default {
  data() {
    return {
      activeChat: null,
    };
  },
  setup() {
    const router = useRouter();
    const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;
    const chatStore = useChatStore();
    const userId = localStorage.getItem("userId");

    return { serverUrl, userId, chatStore };
  },
  computed: {
    loadChats() {
      return this.chatStore.chats;
    },
  },
  mounted() {
    // Chiamata API per ottenere la lista di persone con chat attiva
    const userId = localStorage.getItem("userId");
    const chatStore = useChatStore();
    if (!chatStore.chats.length) {    
      chatStore.fetchChats(userId);
    }
  },
  methods: {
    openChat(item) {
        const chatStore = useChatStore();
        chatStore.activeChat = item
        this.$emit("close-drawer");
        this.$router.push("/chats")
    },
    formatDate,
  },
};
</script>
<style scoped>
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  padding-bottom: 2px;
}
</style>
