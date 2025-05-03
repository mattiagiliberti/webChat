<template>
  <div>
    <template v-if="activeChat">
      <v-list class="list-messages">
        <template v-for="(msgs, date) in groupedMessages" :key="date">
          <v-divider></v-divider>
          <v-list-item class="date-label">
            <v-chip color="grey-lighten-1">{{ date }}</v-chip>
          </v-list-item>

          <v-list-item v-for="message in msgs" :key="message._id" class="rounded-lg" ref="messageItems" :class="{
            'message-sent':
              message.senderId !== activeChat.otherParticipant.userId,
            'message-received':
              message.senderId === activeChat.otherParticipant.userId,
          }">
            <div>
              <p :class="{
                sent: message.senderId !== activeChat.otherParticipant.userId,
              }">
                {{ message.message }}
              </p>
              <small class="message-timestamp">
                {{ dateMessage.format(message.timestamp, 'fullTime24h') }}
              </small>
            </div>
          </v-list-item>
        </template>

        <div v-if="isTyping" class="typing-indicator">
          Sta scrivendo<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
        </div>
      </v-list>
      <v-row style="margin: 0.5rem 0 0 0.1rem; height: 10vh;" class="d-flex flex-row align-center pl-2">
        <v-container class="message-input">
          <v-textarea v-model="message" append-icon="mdi-send" clear-icon="mdi-close-circle" placeholder="Messaggio..."
            type="text" variant="solo" rows="1" max-rows="2" auto-grow class="overflow-y-auto rounded-lg"
            @click:append="sendMessage" @keydown.enter.prevent v-on:keyup.enter="sendMessage"
            @input="handleTyping"></v-textarea>
        </v-container>
      </v-row>
    </template>
    <div v-else class="message-home" font="Arial">
      <div class="bg"></div>
      <h1>Let's chat!</h1>
      <div class="flip"></div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";
import { useDate } from "vuetify/lib/framework.mjs";
import { useChatStore } from "@/stores/chatStore";
import { useSocketStore } from "@/stores/socketStore";
export default {
  name: "ChatsView",
  data() {
    return {
      messages: [],
      message: "",
      activeChat: null,
      isTyping: false,
    };
  },
  setup() {
    const dateMessage = useDate()
    const chatStore = useChatStore();
    const socketStore = useSocketStore();
    return { dateMessage, chatStore, socketStore }
  },
  computed: {
    groupedMessages() {
      const groups = {};
      this.chatStore.messagesChat.forEach(msg => {
        const dateKey = new Date(msg.timestamp).toLocaleDateString();
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(msg);
      });
      return groups;
    },
  },
  mounted() {
    // Recupera le chat salvate in localStorage
    const userString = localStorage.getItem("chats");
    if (userString) {
      const chats = JSON.parse(userString);
    }
    if (this.chatStore.activeChat) {
      this.loadMessages()
    }

    this.socketStore.socket.on('typing', (userTyping) => {
      if (userTyping.senderId !== this.activeChat.otherParticipant.userId) return;

      this.isTyping = true;
    });

    this.socketStore.socket.on('stop_typing', (userTyping) => {
      if (userTyping.senderId !== this.activeChat.otherParticipant.userId) return;
      this.isTyping = false;
    });
  },
  watch: {
    async "chatStore.activeChat"() {
      this.loadMessages();
    },
    "chatStore.messagesChat"(newMessages, oldMessages) {
      if (newMessages.length !== oldMessages.length) {
        this.scrollToBottom();
      }
    },
    isTyping(newVal) {
    if (newVal) {
      this.scrollToBottom();
    }
  }
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        const items = this.$refs.messageItems;
        if (items && items.length) {
          items[items.length - 1].$el.scrollIntoView({ behavior: "instant", inline: "nearest" });
        }
      });
    },

    async loadMessages() {
      this.chatStore.messagesChat = [];
      this.activeChat = this.chatStore.activeChat;
      const chatId = this.activeChat._id;
      console.log("Caricamento messaggi per la chat:", this.activeChat);
      this.messages = [];
      try {
        const response = await api.getAllMessagesByChat(chatId);
        this.messages = response.data;
        this.chatStore.messagesChat = this.messages;
        this.scrollToBottom();
      } catch (error) {
        console.error("Errore nel caricamento dei messaggi:", error);
      }
    },
    handleTyping() {
      this.socketStore.emitTyping(this.activeChat.otherParticipant.userId);
    },

    sendMessage() {
      if (this.message.trim() === "") return;

      const senderId = localStorage.getItem("userId");
      const receiverId = this.activeChat.otherParticipant.userId;
      const chatId = this.activeChat._id;
      const message = this.message;
      const senderUser = localStorage.getItem("username");

      this.chatStore.sendMessage(receiverId, chatId, message, senderUser);

      this.message = "";
      setTimeout(() => {
        this.scrollToBottom();
      }, 150);
      setTimeout(() => {
        this.chatStore.fetchChats(senderId);
      }, 200);
    }
  },
};
</script>

<style scoped>
.date-label {
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
}

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
  background-color: #7E57C2;
  color: white;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
  animation: fadeIn 0.4s ease-out;
}

.message-received {
  align-self: flex-start;
  background-color: #424242;
  padding: 10px;
  max-width: 60%;
  text-align: left;
  animation: fadeIn 0.4s ease-out;
}

.message-input {
  width: 100%;
  padding: 0;
}

.typing-indicator {
  align-self: flex-start;
  background-color: #424242;
  color: white;
  padding: 10px 14px;
  border-radius: 20px;
  max-width: fit-content;
  font-style: italic;
  animation: fadeIn 0.4s ease-out;
  display: flex;
  align-items: center;
  gap: 2px;
}

.typing-indicator .dot {
  animation: blink 1.5s infinite;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

.message-home {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 300px;
  height: 100px;
  border-radius: 18px;
  background-color: #7E57C2;
  color: white;
  font-family: 'Lucida Console', Monaco, monospace;
}

.flip {
  position: absolute;
  bottom: -10px;
  left: 0px;
  width: 15px;
  height: 30px;
  background-color: #7E57C2;
  border-radius: 0px 0px 30px 0px;
}

.bg {
  width: 50px;
  height: 25px;
  position: absolute;
  left: -100px;
  border-radius: 30%;
  top: -90px;
  box-shadow:
    400px 100px 0 0 rgba(255, 255, 255, .15),
    50px 150px 0 0 rgba(255, 255, 255, .15),
    450px 180px 0 0 rgba(255, 255, 255, .15),
    10px 50px 0 0 rgba(255, 255, 255, .15),
    300px 10px 0 0 rgba(255, 255, 255, .15),
    200px 220px 0 0 rgba(255, 255, 255, .15);
  animation: bgAnim 3s infinite alternate;
}

@keyframes bgAnim {
  from {
    box-shadow:
      400px 100px 0 0 rgba(255, 255, 255, .15),
      50px 150px 0 0 rgba(255, 255, 255, .15),
      450px 180px 0 0 rgba(255, 255, 255, .15),
      10px 50px 0 0 rgba(255, 255, 255, .15),
      300px 10px 0 0 rgba(255, 255, 255, .15),
      200px 220px 0 0 rgba(255, 255, 255, .15);
  }

  to {
    box-shadow:
      450px 100px 0 0 rgba(255, 255, 255, .15),
      0px 150px 0 0 rgba(255, 255, 255, .15),
      500px 180px 0 0 rgba(255, 255, 255, .15),
      60px 50px 0 0 rgba(255, 255, 255, .15),
      250px 10px 0 0 rgba(255, 255, 255, .15),
      150px 220px 0 0 rgba(255, 255, 255, .15);
  }
}

@keyframes blink {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>

<style>
.v-input__append {
  padding: 0.6rem !important;
  margin: 0 !important;
}
</style>
