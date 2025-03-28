<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="deep-purple-darken-1">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <!-- Nome della persona che ho cliccato -->
       <v-avatar>
        <v-img
          v-if="activeChat"
          :src="serverUrl + activeChat.otherParticipant.image"
        >
        </v-img>
      </v-avatar>

      <v-toolbar-title v-if="activeChat"@click="openProfile(activeChat.otherParticipant)">
        {{ activeChat.otherParticipant.username }}
      </v-toolbar-title>  

      <v-spacer></v-spacer>
      <v-btn icon @click="goToProfile">
        <v-icon>mdi-account-edit</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'left' : undefined"
      persistent
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
      >
      <template v-slot:item="{ item, props }">
        <v-list-item
            v-bind="props"
            :prepend-avatar="serverUrl+item.raw.image"
            :title="item.raw.username"
            :append-icon="item.raw.isOnline ? 'mdi-checkbox-blank-circle' : 'mdi-checkbox-blank-circle-outline'"
            @click="openProfile(item.raw)"
            :color="item.raw.isOnline ? 'green' : 'red'"
          ></v-list-item>
        </template>
      </v-autocomplete>


      <!-- Lista di persone con chat attiva -->
      <v-list :items="loadChats">
        <v-list-item
          v-for="item in loadChats"
          :key="item.value"
          @click="openChat(item)"
          :prepend-avatar="serverUrl+item.otherParticipant.image"
          style="margin: 1%;"
          >
          <v-list-item-title>
            {{ item.otherParticipant.username }}
            <span style="font-size: 12px; color: gray">
              {{ item.lastMessage.formattedTime }}
            </span>
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ item.lastMessage.senderUser }}: {{ item.lastMessage.text }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>


      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-navigation-drawer>

    <!-- <v-app-bar title="Application bar"></v-app-bar> -->

    <v-main class="align-center justify-center">
      <router-view :active-chat="activeChat" :search-user="searchUser"></router-view>
    </v-main>
  </v-layout>
</template>

<script>
import api from "@/services/api";
import { useRouter } from "vue-router";
import { formatDate } from "@/utils/date";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      drawer: false,
      group: null,
      activeChat: null,
      items: [],
      searchResults: [],
      searchQuery: null,
      searchUser: null,
    };
  },
  setup() {
    const router = useRouter();
    const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;
    const authStore = useAuthStore();
    const logout = () => {
      authStore.logout();
      router.push("/");
    };

    const goToProfile = () => {
      router.push("/profile"); 
    };

    return { logout, goToProfile, serverUrl };
  },
  computed: {
    formattedMessages() {
      return this.items.map((msg) => ({
        ...msg,
        lastMessage: {
          ...msg.lastMessage,
          formattedTime: formatDate(msg.lastMessage.timestamp),
        },
      }));
    },
    loadChats(){
      const chatStore = useChatStore();
      return chatStore.chats;
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
    openChat(item) {
      console.log(item);
      this.drawer = false;
      this.activeChat = item;

      if (this.$route.path !== "/chats") {
        this.$router.push("/chats");
      }
    },
    openProfile(user) {
      this.searchUser = user;
      if (user._id) {
        this.$router.push(`/user/${user._id}`);
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
