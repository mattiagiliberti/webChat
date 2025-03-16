<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="primary">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer" 
      ></v-app-bar-nav-icon>

      <!-- nome della persona che ho cliccato -->
      <v-toolbar-title v-if="activeChat">{{
        activeChat.otherParticipant.username
      }}</v-toolbar-title>

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

    <!-- barra di ricerca -->
    <v-text-field
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
    ></v-text-field>

      <!-- lista di persone con chat attiva -->
      <v-list :items="items">
        <v-list-item
          v-for="item in items"
          :key="item.value"
          @click="openChat(item)"
        >
          <v-list-item-title>
            {{ item.otherParticipant.username }}
            <span style="font-size: 12px; color: gray;">
              {{ item.lastMessage.timestamp }}
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
export default {
  data() {
    return {
      drawer: false,
      group: null,
      activeChat: null,
      items: [],
    };
  },
  setup() {
    const router = useRouter();

    const logout = () => {
       api.logout();
       router.push("/"); // Reindirizza alla pagina di login
     };

     const goToProfile = () => {
       router.push("/profile"); // Vai alla pagina di modifica profilo
     };

    return { logout, goToProfile };
  },
  mounted() {
    // Chiamata API per ottenere la lista di persone con chat attiva
    const userid = localStorage.getItem("userId");
    console.log(userid);

    api.getChatById(userid)
    .then((response) => {
      console.log(response.data);
      this.items = response.data;
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
    }
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
