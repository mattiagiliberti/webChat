<template>
  <v-container>
    <v-form ref="form">
      <v-text-field label="Username" v-model="username" required></v-text-field>
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
      this.$router.push("/login"); // Torna alla pagina di login
    },
  },
};
</script>
