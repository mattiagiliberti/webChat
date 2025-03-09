<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="pa-8" elevation="10" width="500px">
    <v-form ref="form">
      <v-text-field
        label="Username"
        v-model="username"
        :rules="nameRules"
        required
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="password"
        type="password"
        required
      ></v-text-field>
      <v-btn @click="submit">Login</v-btn>
      <v-btn @click="register">Register</v-btn>
    </v-form>
  </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
import api from "@/services/api.js";
export default {
  name: "Login",
  
  data() {
    return {
      username: "",
      password: "",
      nameRules: [
        (v) => (v && v.length <= 10 && v.length >= 3) || "Name must be 10 characters or less",
      ],
    };
  },
  setup() {
    const form = ref(null);
    return { form };
  },
  methods: {
    async submit() {
      const { valid } = await this.form.validate();
      // Chiamata API per il login
      if (valid) {
        const response = await api.login({username: this.username, password: this.password})
          .then((response) => {
            if (response.status === 200) {   
              console.log(response.data);
                         
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("userId", response.data.userId);
              this.$router.push("/chats");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async register() {
      const router = this.$router;
      router.push("/register");
    },
  },
};
</script>
