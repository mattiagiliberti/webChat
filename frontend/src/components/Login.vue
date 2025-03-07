<template>
  <v-container>
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
  </v-container>
</template>

<script>
import { ref } from "vue";
export default {
  name: "Login",
  
  data() {
    return {
      username: "",
      password: "",
      nameRules: [
        (v) => (v && v.length <= 10) || "Name must be 10 characters or less",
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
        console.log("Login");
      }
    },
    async register() {
      const router = this.$router;
      router.push("/register");
    },
  },
};
</script>
