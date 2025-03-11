<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="primary">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <!-- nome della persona che ho cliccato -->
      <v-toolbar-title v-if="activeChat">{{
        activeChat.participants[0].username
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
      <!-- lista di persone con chat attiva -->
      <v-list :items="items">
        <v-list-item
          v-for="item in items"
          :key="item.value"
          @click="openChat(item)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
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

    api.getChatById(userid).then((response) => {
      console.log(response.data);
      this.items = response.data;
    });
  },
  methods: {
    openChat(item) {
      console.log(item);
      this.group = false;
      this.activeChat = item;
    }
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
