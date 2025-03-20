<template>
  <v-container class="" style="height: 100vh">
    <v-card class="pa-8" elevation="10">
      <h1 class="text-center mb-4">Registrazione</h1>
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
          prepend-inner-icon="mdi-mail"
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
        <v-btn @click="register" color="deep-purple-lighten-2">Register</v-btn>
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
            alert(response.data.message);
            this.$router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    goToLogin() {
      this.$router.push("/"); // Torna alla pagina di login
    },
  },
};
</script>
