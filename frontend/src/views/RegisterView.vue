<template>
  <v-container class="d-flex flex-column align-center mt-5">
    <v-row justify="center">
      <v-col xl="15" md="15" sm="10" cols="12">
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