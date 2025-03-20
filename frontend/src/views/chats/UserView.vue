<template>
  <v-card class="mx-auto" max-width="400" flat tile theme="light">
    <v-card-title class="text-center text-h4"> Informazioni utente </v-card-title>
    <v-card-text>
      <v-card-title>{{ user.username }}</v-card-title>
      <v-img
        v-if="user.image"
        :src="serverUrl + user.image"
        class="align-end text-white mb-2"
        contain
      ></v-img>

      <v-card-title>Biografia</v-card-title>
      <v-card-text>{{ user.bio }}</v-card-text>

      <v-card-title>Creazione dell'account</v-card-title>
      <v-card-text>{{ formatDate(user.createdAt) }}</v-card-text>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="chatWithUser" color="primary">Inizia la chat</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
import api from "@/services/api";
import { useRouter } from "vue-router";
import { formatDate } from "@/utils/date"; 
export default {
  name: "UserView",
  data() {
    return {
      user: {},
    };
  },
  setup() {
    const router = useRouter();
    const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;

    const chatWithUser = () => {
      router.push("/chats"); // Reindirizza alla pagina di chat
    };

    return { chatWithUser, serverUrl };
  },

  async mounted() {
    const userid = this.$route.params.id;

    await api.getUserProfile(userid).then((response) => {
      console.log(response.data);
      this.user = response.data;
    });
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
  },
};
</script>
