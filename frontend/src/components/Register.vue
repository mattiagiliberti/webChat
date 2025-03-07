<template>
    <v-container>
        <v-form ref="form">
            <v-text-field
              label="Username"
              v-model="username"
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
        </v-form>    
    </v-container>
</template>

<script>
import { ref } from "vue";
export default {
  name: "Register",

  data() {
    return {
      username: "",
      email: "",
      password: ""
    }; 
  },
  methods: {
      async register() {
       console.log("Registrazione con:", this.email, this.password);
       // Chiamata API per registrazione
      },
      goToLogin() {
        this.$router.push("/login"); // Torna alla pagina di login
      },
  },
};
</script>
