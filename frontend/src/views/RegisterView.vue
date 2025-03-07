<template>
    <v-container>
      <v-row>
        <v-col xl="6" md="6" sm="12" cols="12" justify="center">
          <h1>Registrati</h1>
        </v-col>
        <v-col justify="center">
          <Register />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import Register from '@/components/Register.vue';
  export default {
    components: {
        Register
    }
  }
  </script>