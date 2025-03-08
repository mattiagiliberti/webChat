<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="pa-8" elevation="10" width="500px">
      <h1 class="text-center mb-4">Registrazione</h1>
    <v-form ref="form">
      <v-text-field
        label="Username"
        v-model="username"
        :rules="nameRules"
        required
      ></v-text-field>
      <v-text-field
        label="Email"
        v-model="email"
        type="email"
        required
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="password"
        type="password"
        required
      ></v-text-field>
      <v-btn @click="register">Register</v-btn>
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
      nameRules: [
        (v) => (v && v.length <= 10 && v.length >= 3) || "Name must be 10 characters or less",
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
