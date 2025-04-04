<template>
  <v-container class="" style="height: 100vh">
    <v-card class="pa-8" elevation="10">
      <h1 class="text-center mb-4" style="font-family: 'Lucida Console', Monaco, monospace;">Registrazione</h1>
      <v-form ref="form">
        <v-text-field
          label="Username"
          v-model="username"
          :rules="nameRules"
          prepend-inner-icon="mdi-account"
          required
          clearable
          color="deep-purple-lighten-2"
        ></v-text-field>
        <v-text-field
          label="Email"
          v-model="email"
          prepend-inner-icon="mdi-email"
          type="email"
          :rules="emailRules"
          required
          clearable
          color="deep-purple-lighten-2"
        ></v-text-field>
        <v-text-field
          label="Password"
          v-model="password"
          type="password"
          :rules="passwordRules"
          prepend-inner-icon="mdi-lock"
          required
          clearable
          color="deep-purple-lighten-2"
        ></v-text-field>

        <v-btn @click="register" color="deep-purple-darken-1">Registrati</v-btn>
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
        <v-btn @click="goToLogin">Login</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
import api from "@/services/api.js";
export default {
  name: "Register",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      pattern : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      nameRules: [
        (v) =>
          (v && v.length <= 10 && v.length >= 3) ||
          "Username deve essere compreso tra 3 e 10 caratteri",
      ],
      passwordRules: [
        (v) =>
          (v.length >= 8) ||
          "Password deve essere avere almeno 8 caratteri",
      ],
      emailRules: [
        (v) =>
          (this.pattern.test(v)) ||
          "Email non valida",
      ],
      snackbar: false,
      text: "",
    };
  },
  methods: {
    async register() {
      const router = this.$router;
      const response = await api
        .register({
          username: this.username,
          password: this.password,
          email: this.email,
        })
        .then((response) => {
          if (response.status === 201) {
            this.text(response.data.message);
            this.snackbar = true;
            this.$router.push("/");
          } else {
            this.text(response.data.message);
            this.snackbar = true;
          }
        })
        .catch((error) => {
          console.log(error);
          this.text = error.response.data.message;
          this.snackbar = true;
        });
    },
    goToLogin() {
      this.$router.push("/"); // Torna alla pagina di login
    },
  },
};
</script>
