<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="primary">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <!-- Nome della persona che ho cliccato -->
      <v-toolbar-title v-if="activeChat"
        >{{ activeChat.otherParticipant.username }}</v-toolbar-title>  

      <v-spacer></v-spacer>
      <v-btn icon @click="goToProfile">
        <v-icon>mdi-account-edit</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'left' : undefined"
      temporary
    >
    <!-- Barra di ricerca -->
      <v-autocomplete
        v-model="searchQuery"
        :items="searchResults"
        @update:search="searchUsers"
        placeholder="Cerca utente"
        item-title="username"
        item-value="_id"
        return-object
        variant="outlined"
        hide-details
        single-line
        no-data-text="Nessun utente trovato"
      >
      <template v-slot:item="{ item, props }">
        {{ serverUrl+item.value+'/'+item.raw.image }}
        <v-list-item
            v-bind="props"
            :prepend-avatar="serverUrl+item.value+'/'+item.raw.image"
            :title="item.raw.username"
            :append-icon="item.raw.isOnline ? 'mdi-checkbox-blank-circle' : 'mdi-checkbox-blank-circle-outline'"
            @click="openProfile(item.raw)"
            :color="item.raw.isOnline ? 'green' : 'red'"
          ></v-list-item>
        </template>
      </v-autocomplete>


      <!-- Lista di persone con chat attiva -->
      <v-list :items="formattedMessages">
        <v-list-item
          v-for="item in formattedMessages"
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
      <router-view :active-chat="activeChat"></router-view>
    </v-main>
  </v-layout>
</template>

<script>
import api from "@/services/api";
import { useRouter } from "vue-router";
import { formatDate } from "@/utils/date";

export default {
  data() {
    return {
      drawer: false,
      group: null,
      activeChat: null,
      items: [],
      searchResults: [],
      searchQuery: null,
    };
  },
  setup() {
    const router = useRouter();
    const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;

    const logout = () => {
      api.logout();
      router.push("/"); // Reindirizza alla pagina di login
    };

    const goToProfile = () => {
      router.push("/profile"); // Vai alla pagina di modifica profilo
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
  },
  mounted() {
    // Chiamata API per ottenere la lista di persone con chat attiva
    const userid = localStorage.getItem("userId");
    console.log(userid);
    
    api.getChatById(userid).then((response) => {
      console.log(response.data);
      this.items = response.data;
      console.log(this.items);
    });
  },
  methods: {
    openChat(item) {
      console.log(item);
      this.group = false;
      this.activeChat = item;

      if (this.$route.path !== "/chats") {
        this.$router.push("/chats");
      }
    },
    openProfile(user) {
      console.log("user");
      // Mostra profilo utente
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
    group() {
      this.drawer = false;
    },
  },
};
</script>
