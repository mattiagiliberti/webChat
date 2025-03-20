<template>
  <v-container class="mt-5">
    <v-row class="d-flex flex-column align-center" justify="center">
      <v-col xl="5" md="6" sm="12" cols="12">
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