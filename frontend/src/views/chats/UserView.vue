<template>
    <v-card>
      <v-card-title> Informazioni utente </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            :disabled="true"
            v-model="user.image"
            label="Immagine (URL)"
          ></v-text-field>
          <v-text-field
            :disabled="true"
            v-model="user.username"
            label="Username"
          ></v-text-field>
          <v-text-field
            :disabled="true"
            v-model="user.bio"
            label="Biografia"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="chatWithUser" color="primary">Inizia la chat</v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
import api from "@/services/api";
import { useRouter } from "vue-router";
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
};
</script>
