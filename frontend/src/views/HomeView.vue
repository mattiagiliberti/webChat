<template>
  <v-container class="d-flex flex-column align-center mt-5">
    <v-row>
      <v-col xl="10" md="10" sm="12" cols="12" justify="center">
        <h1>Benvenuto</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xl="15" md="15" sm="10" cols="12">
        <Login />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Login from '@/components/Login.vue';
export default {
  components: {
    Login
  }
}
</script>
