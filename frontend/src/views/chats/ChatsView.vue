<template>
  <template v-if="activeChat">
    <v-list class="list-messages">
      <v-list-item
        v-for="message in messages"
        :key="message._id"
        class="rounded-lg"
        ref="messageItems"
        :class="{
          'message-sent':
            message.senderId !== activeChat.otherParticipant.userId,
          'message-received':
            message.senderId === activeChat.otherParticipant.userId,
        }"
      >
        <div>
          <p :class="{
              sent: message.senderId !== activeChat.otherParticipant.userId,
            }" >
            {{ message.message }}
          </p>
          <small>{{ formatDate(message.timestamp) }}</small>
        </div>
      </v-list-item>
    </v-list>
    <v-row style="margin: 0.5rem 0 0 0.1rem">
      <v-container class="message-input">
        <v-textarea
          v-model="message"
          :append-icon="message ? 'mdi-send' : 'mdi-microphone'"
          clear-icon="mdi-close-circle"
          label="Message"
          type="text"
          variant="solo"
          clearable
          rows="1"
          max-rows="2"
          auto-grow
          class="overflow-y-auto rounded-lg"
        ></v-textarea>
      </v-container>
    </v-row>
  </template>
  <div v-else>
    <h1>
      Benvenuto nell'app di messaggistica! Seleziona una chat per iniziare a
      chattare.
    </h1>
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
      this.messages = [];
      try {
        const response = await api.getAllMessagesByChat(this.activeChat._id);
        this.messages = response.data;
        this.scrollToBottom(); 
        console.log("Messaggi caricati:", this.messages);
      } catch (error) {
          console.error("Errore nel caricamento dei messaggi:", error);
      }
    }
  },
  methods:{
    formatDate,
    scrollToBottom() {
      this.$nextTick(() => {
        const items = this.$refs.messageItems;
        if (items && items.length) {
          items[items.length - 1].$el.scrollIntoView({ behavior: "instant", inline: "nearest" });
        }
      });
    },
  },
};
</script>

<style scoped>
.list-messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  height: 82vh;
  padding: 10px;
}

.message-sent {
  align-self: flex-end;
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
}

.message-received {
  align-self: flex-start;
  background-color: #e21818;
  padding: 10px;
  max-width: 60%;
  text-align: left;
}

.message-input {
  width: 100%;
  padding: 0;
}
</style>
