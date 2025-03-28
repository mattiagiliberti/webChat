<template>
  <div>
    <div v-if="activeChat" class="chat-container">
      <div v-for="message in messages" :key="message._id" 
           :class="{'message-sent': message.senderId !== activeChat.otherParticipant.userId,
           'message-received': message.senderId === activeChat.otherParticipant.userId}">
        <p>{{ message.message }}</p>
        <small>{{ formatDate(message.timestamp) }}</small>
      </div>

      <div class="message-input">
        <v-text-field 
          v-model="message"
          :append-icon="message ? 'mdi-send' : 'mdi-microphone'"
          clear-icon="mdi-close-circle"
          label="Message"
          type="text"
          variant="filled"
          clearable
        ></v-text-field>
      </div>
    </div>
    <div v-else>
      <h1>Benvenuto nell'app di messaggistica! Seleziona una chat per iniziare a chattare.</h1>
    </div>
  </div>
</template>


<script>
import api from "@/services/api";
import { formatDate } from "@/utils/date";
export default {
  name: "ChatsView",
  data() {
    return {
      messages: [],
      message: "",
    };
  },
  async mounted() {
    // Recupera le chat salvate in localStorage
    const userString = localStorage.getItem("chats");
    if (userString) {
      const chats = JSON.parse(userString);
      console.log("Chat salvate:", chats);
    }
  },
  props: {
    activeChat: {
      type: Object,
      default: null
    }
  },
  watch: {
    async activeChat() {
      console.log("Caricamento messaggi per la chat:", this.activeChat);
      try {
        const response = await api.getAllMessagesByChat(this.activeChat._id);
        this.messages = response.data;
        console.log("Messaggi caricati:", this.messages);
      } catch (error) {
          console.error("Errore nel caricamento dei messaggi:", error);
      }
    }
  },
  methods:{
    formatDate,
  }
};
</script>


<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.message-sent {
  align-self: flex-end;
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
  text-align: right;
}

.message-received {
  align-self: flex-start;
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
  text-align: left;
}

.message-input {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  padding: 10px;
  border-top: 1px solid #ccc;
}
</style>
