<template>
  <v-card class="mx-auto" style="height: 100%">
      <v-card-item>
          <template v-slot:prepend>
            <v-icon
              :icon="
                user.isOnline
                  ? 'mdi-web'
                  : 'mdi-web-off'
              "
              :color="user.isOnline ? 'green' : 'red'"
            ></v-icon>
          </template>
          <v-card-title>
            {{ user.username }}
          </v-card-title>
        </v-card-item>
      <v-img
        v-if="user.image"
        :src="serverUrl + user.image"
        class="align-end text-white mb-2"
        height="300"
        object-fit: contain
      >
      </v-img>

      <v-card-item>
        <template v-slot:subtitle>
          <v-icon icon="mdi-file-account"></v-icon>
          Biografia
          <v-card-text>{{ user.bio }}</v-card-text>
        </template>
      </v-card-item>

      <!-- <div v-if="user.userId == searchUser.otherParticipant.id"> -->
      <v-divider></v-divider>

      <v-card-item>
        <template v-slot:subtitle>
          <v-icon icon="mdi-calendar-clock"></v-icon>
          Data di creazione
          <v-card-text>{{ date.format(user.createdAt, "fullDate") }}</v-card-text>
        </template>
      </v-card-item>

      <v-divider></v-divider>

      <v-card-item>
        <template v-slot:subtitle>
          <v-icon icon="mdi-calendar-clock"></v-icon>
          Ultimo accesso
          <v-card-text>{{ date.format(user.lastSeen, "fullDateTime24h") }}</v-card-text>
        </template>
      </v-card-item>

      <v-card-actions class="align-end" v-if="!userInChat">
        <v-btn @click="chatWithUser" color="deep-purple-lighten-2" variant="outlined">Inizia la chat</v-btn>
      </v-card-actions>
    <!-- </div> -->
  </v-card>
</template>

<script>
import api from "@/services/api";
import { useDate } from "vuetify/lib/framework.mjs";
import { formatDate } from "@/utils/date";
import { useChatStore } from "@/stores/chatStore";
import { useUsersStore } from "@/stores/userStore";
export default {
  name: "UserView",
  data() {
    return {
      user: {},
      userInChat: false,
    };
  },
  setup() {
    const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;
    const date = useDate();
    return { serverUrl, date };
  },
  async mounted() {
    const userid = this.$route.params.id;
    const userStore = useUsersStore();

    await api.getUserProfile(userid).then((response) => {
      console.log(response.data);
      this.user = response.data;
    });
    this.userInChat = userStore.isInChat(this.user._id);

  },
  props: {
    searchUser: {
      type: Object,
      default: null,
    },
  },
  watch: {
    async searchUser() {
      const userId = this.searchUser._id;
      await api.getUserProfile(userId).then((response) => {
        console.log(response.data);
        this.user = response.data;
      });
    },
  },
  methods: {
    formatDate,
    
    async chatWithUser() {
      const userId = localStorage.getItem("userId");
      const chatStore = useChatStore();
      const response = await api.getUserProfile(userId);
      const loggedUser = response.data;
      
      const chatData = {
        participants:[{
          username: this.user.username,
          userId: this.user._id
        },
        {
          username: loggedUser.username,
          userId: userId
        }
      ],
    };
      const success = await chatStore.startNewChat(chatData, userId, this.user._id)      
      if (success.status) {
        this.$router.push("/chats");
      }else{
        alert(success.message)
      }
    },
  },
};
</script>
