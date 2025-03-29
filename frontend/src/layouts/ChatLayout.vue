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
          v-if="getActiveChat"
          :src="serverUrl + getActiveChat.otherParticipant.image"
        >
        </v-img>
      </v-avatar>

      <v-toolbar-title v-if="getActiveChat" @click="openProfile(getActiveChat.otherParticipant)">
        {{ getActiveChat.otherParticipant.username }}
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
      <ChatList @close-drawer="drawer = false"/>


      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
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
  components:{
    ChatList,
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

    const chatStore = useChatStore();
    return { logout, goToProfile, serverUrl, chatStore };
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
