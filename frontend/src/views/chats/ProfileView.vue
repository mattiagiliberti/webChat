<template>
  <v-container class="profile-edit">
    <h1>Modifica Profilo</h1>
    <v-row>
      <v-col cols="12">
        <v-avatar size="100" class="profile-avatar">
          <v-img
          v-if="user.image"
          :src="serverUrl + user.image"
          class="profile-img-container"
          />
        </v-avatar>
        
        <v-file-input
          v-model="selectedFile"
          color="deep-purple-lighten-2"
          label="Scegli l'immagine"
          accept="image/*"
          prepend-icon="mdi-camera"
          variant="outlined"
          @change="onImageChange"
        ></v-file-input>

        <v-btn @click="uploadImage" color="deep-purple-darken-1">Carica Immagine</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2>Modifica Info</h2>
        <v-text-field
          v-model="user.username"
          color="deep-purple-lighten-2"
          label="Username"
          variant="outlined"
          required
        ></v-text-field>

        <v-text-field
          :disabled="true"
          v-model="user.email"
          color="deep-purple-lighten-2"
          label="Email"
          variant="outlined"
          required
        ></v-text-field>

        <v-textarea
          v-model="user.bio"
          color="deep-purple-lighten-2"
          label="Biografia"
          variant="outlined"
        ></v-textarea>

        <v-btn @click="updateUser" color="deep-purple-darken-1">Salva Modifiche</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2>Cambia Password</h2>
        <v-text-field
          v-model="passwordData.oldPassword"
          color="deep-purple-lighten-2"
          label="Vecchia Password"
          type="password"
          variant="outlined"
          required
        ></v-text-field>

        <v-text-field
          v-model="passwordData.newPassword"
          color="deep-purple-lighten-2"
          label="Nuova Password"
          type="password"
          variant="outlined"
          required
        ></v-text-field>

        <v-btn @click="updatePassword" color="deep-purple-darken-1">Aggiorna Password</v-btn>
        <v-snackbar
          v-model="snackbar"
          multi-line
        >
          {{ text }}

          <template v-slot:actions>
            <v-btn
              color="red"
              variant="text"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

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
        image: null,
      },
      passwordData: {
        oldPassword: "",
        newPassword: "",
      },
      selectedFile: null,
      snackbar: false,
      text: "",
    };
  },
  setup() {
    const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;
    return { serverUrl };
  },
  async mounted() {
    const userId = localStorage.getItem("userId");
    await api.getUserProfile(userId).then((response) => {
      console.log("Dati utente ricevuti:", response.data);
      this.user = response.data;
    });
  },
  methods: {
    async updateUser() {
      const userId = localStorage.getItem("userId");
      await api.updateUserProfile(userId, this.user).then((response) => {
        alert("Profilo aggiornato con successo!");
      });
    },
    async updatePassword() {
      const userId = localStorage.getItem("userId");
      try{
        await api.updatePasswordProfile(userId, this.passwordData);
        alert("Password aggiornata con successo!");
      } catch (error){
        this.text = "La vecchia password non è corretta. Riprova!";
        this.snackbar = true;
      }
      
    },
    onImageChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadImage() {
      const userId = localStorage.getItem("userId");
      if (!this.selectedFile) {
        alert("Seleziona un'immagine prima di caricare.");
        return;
      }

      this.user.image = this.selectedFile;

      try {
        api.updateUserProfile(userId, this.user).then((response) => {
          console.log("Immagine aggiornata con successo:", response);
        });
      } catch (error) {
        console.log("Errore nel caricamento dell'immagine", error);
      }
    },
  },
};
</script>

<style scoped>
.profile-avatar {
  margin-bottom: 15px; 
}

.profile-img-container {
  height: 100px;
  border-radius: 50%;
  width: 100px;
  border: 3px solid #6200ea;
}

.profile-edit {
  max-width: 500px;
  margin: auto;
}
form {
  display: flex;
  flex-direction: column;
}
input,
textarea,
button {
  margin: 10px 0;
  padding: 8px;
}
</style>
