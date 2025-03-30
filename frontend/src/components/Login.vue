<template>
  <v-container class="align-center" style="height: 100vh">
    <v-card class="pa-8" elevation="10">
      <h1 class="text-center mb-4">Login</h1>
      <v-form ref="form">
        <v-text-field
          label="Username*"
          v-model="username"
          :rules="nameRules"
          prepend-inner-icon="mdi-account"
          required
          color="deep-purple-accent-4"
        ></v-text-field>
        <v-text-field
          label="Password*"
          outlined
          prepend-inner-icon="mdi-lock"
          v-model="password"
          type="password"
          required
          :rules="passwordRules"
          color="deep-purple-accent-4"
        ></v-text-field>
        <v-btn @click="submit" color="deep-purple-darken-1">Login</v-btn>
        <v-btn @click="register">Registrati</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
export default {
  name: "Login",

  data() {
    return {
      username: "",
      password: "",
      nameRules: [
        (v) =>
          (v && v.length <= 10 && v.length >= 3) ||
          "Username deve essere compreso tra 3 e 10 caratteri",
      ],
      passwordRules: [
        (v) => v.length >= 3 || "Password deve essere avere almeno 8 caratteri",
      ],
    };
  },
  setup() {
    const form = ref(null);
    const router = useRouter();
    return { form, router };
  },
  methods: {
    async submit() {
      const { valid } = await this.form.validate();
      // Chiamata API per il login
      if (valid) {
        try {
          const authStore = useAuthStore();
          const response = await authStore.login({
            username: this.username,
            password: this.password,
          });
          if (!response.success) {
            console.log(response.message);
            
          }else{
            this.router.push("/chats")
          }
        } catch (error) {
          console.error("Errore di login:", error.message);
        }
      }
    },
    async register() {
      const router = this.$router;
      router.push("/register");
    },
  },
};
</script>
