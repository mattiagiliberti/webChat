<template>
  <v-container class="profile-edit">
    <v-row>
      <v-col cols="12">
        <h1>Modifica Profilo</h1>
        <v-form @submit.prevent="updateUser">
          <v-text-field
            v-model="user.username"
            label="Username"
            required
          ></v-text-field>

          <v-text-field
            :disabled="true"
            v-model="user.email"
            label="Email"
            required
          ></v-text-field>

          <v-textarea
            v-model="user.bio"
            label="Biografia"
          ></v-textarea>

          <v-text-field
            v-model="user.image"
            label="Immagine (URL)"
          ></v-text-field>

          <v-btn type="submit" color="primary">Salva Modifiche</v-btn>
        </v-form>
      </v-col>

      <v-col cols="12">
        <h2>Cambia Password</h2>
        <v-form @submit.prevent="updatePassword">
          <v-text-field
            v-model="passwordData.oldPassword"
            label="Vecchia Password"
            type="password"
            required
          ></v-text-field>

          <v-text-field
            v-model="passwordData.newPassword"
            label="Nuova Password"
            type="password"
            required
          ></v-text-field>

          <v-btn type="submit" color="primary">Aggiorna Password</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from "@/services/api";
export default {
  name: "ProfileView",
  data() {
    return {
      user: {
        username: "",
        email: "",
        bio: "",
        image: "",
      },
      passwordData: {
        oldPassword: "",
        newPassword: "",
      },
    };
  },  
  async mounted() {
    const userId = localStorage.getItem("userId");
    console.log(userId);

    await api.getUserProfile(userId)
    .then((response) => {
      console.log("Dati utente ricevuti:", response.data);
      this.user = response.data;
    })

  },
  methods:{
    async updateUser(){
      const userId = localStorage.getItem("userId");
      await api.updateUserProfile(userId, this.user);
      alert("Profilo aggiornato con successo!");
    },
    async updatePassword(){
      const userId = localStorage.getItem("userId");
      await api.updatePasswordProfile(userId, this.passwordData);
      alert("Password aggiornata con successo!");
    }
  }
};
</script>

<style scoped>
.profile-edit {
  max-width: 500px;
  margin: auto;
}
form {
  display: flex;
  flex-direction: column;
}
input, textarea, button {
  margin: 10px 0;
  padding: 8px;
}
</style>