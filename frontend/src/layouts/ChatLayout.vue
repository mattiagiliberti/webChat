<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="deep-purple-darken-1">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <!-- Nome della persona che ho cliccato -->
      <template v-if="getActiveChat">
        <v-avatar>
          <v-img :src="serverUrl + getActiveChat.otherParticipant.image"></v-img>
        </v-avatar>

        <div class="d-flex flex-column ml-3">
          <v-app-bar-title @click="openProfile(getActiveChat.otherParticipant)">
            <h3>{{ getActiveChat.otherParticipant.username }}</h3>
          </v-app-bar-title>

          <div v-if="getActiveChat.otherParticipant.isOnline">Online</div>

          <div v-else class="scrolling-container">
            <div class="scrolling-text">
              Ultimo accesso: {{ date.format(getActiveChat.otherParticipant.lastSeen, "fullDateTime24h") }}
            </div>
          </div>
        </div>
      </template>


      <v-spacer></v-spacer>
      <v-btn icon @click="goToProfile">
        <v-icon>mdi-account-edit</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'left' : undefined"
      persistent
      :width="300"
    >
      <!-- Barra di ricerca -->
      <v-autocomplete
        v-model="searchQuery"
        :items="searchResults"
        menu-icon=""
        @update:search="searchUsers"
        placeholder="Cerca utente"
        prepend-inner-icon="mdi-magnify"
        rounded
        variant="solo"
        item-title="username"
        item-value="_id"
        return-object
        hide-details
        single-line
        no-data-text="Nessun utente trovato"
        class="pa-2"
      >
        <template v-slot:item="{ item, props }">
          <v-list-item
            v-bind="props"
            :prepend-avatar="serverUrl + item.raw.image"
            :title="item.raw.username"
            :append-icon="
              item.raw.isOnline
                ? 'mdi-checkbox-blank-circle'
                : 'mdi-checkbox-blank-circle-outline'
            "
            @click="openProfile(item.raw)"
            :color="item.raw.isOnline ? 'green' : 'red'"
          ></v-list-item>
        </template>
      </v-autocomplete>

      <!-- Lista di persone con chat attiva -->
      <ChatList @close-drawer="drawer = false" />

      
      <v-container class="mt-auto d-flex justify-center pa-4">
        <v-btn color="deep-purple-darken-1" @click="logout" block>
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-container>
    </v-navigation-drawer>

    <!-- <v-app-bar title="Application bar"></v-app-bar> -->

    <v-main class="align-center justify-center">
      <router-view v-bind="routeProps"></router-view>
    </v-main>
  </v-layout>
</template>

<script>
import api from "@/services/api";
import { useRouter } from "vue-router";
import ChatList from "@/components/ChatList.vue";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { useDate } from "vuetify/lib/framework.mjs";

export default {
  data() {
    return {
      drawer: false,
      group: null,
      items: [],
      searchResults: [],
      searchQuery: null,
      searchUser: null,
    };
  },
  components: {
    ChatList,
  },
  setup() {
    const router = useRouter();
    const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;
    const authStore = useAuthStore();
    const chatStore = useChatStore();

    const date = useDate();
    const logout = () => {
      authStore.logout();
      router.push("/");
    };

    const goToProfile = () => {
      chatStore.activeChat = null;
      router.push("/profile");
    };

    return { logout, goToProfile, serverUrl, chatStore, date };
  },
  computed: {
    getActiveChat(){
      return this.chatStore.activeChat
    },
    routeProps() {
      return this.$route.name === "UserView" ? { searchUser: this.searchUser } : {};
    }
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
    openProfile(user) {
      this.searchUser = user;
      if (user._id) {
        this.$router.push(`/user/${user._id}`);
        this.chatStore.activeChat = null
      } else {
        this.$router.push(`/user/${user.userId}`);
      }
    },
    searchUsers(val) {
      this.searchQuery = val;
      if (this.searchQuery.length > 3) {
        api.searchUserbyUsername(this.searchQuery).then((response) => {
          this.searchResults = response.data;
          console.log(this.searchResults);
        });
      } else {
        this.searchResults = [];
      }
    },

  },
  watch: {
  },
};
</script>


<style scoped>
.scrolling-container {
  width: 220px;
  overflow: hidden;
  position: relative;
  height: 20px;
}

.scrolling-text {
  position: absolute;
  white-space: nowrap;
  animation: scrollText 6s linear infinite;
}

@keyframes scrollText {
  0% {
    transform: translateX(100%); 
  }
  100% {
    transform: translateX(-100%);
  }
}


</style>