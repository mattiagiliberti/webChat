<template>
  <v-container class="mt-5">
    <v-row>
      <v-col xl="12" md="10" sm="12" cols="12" class="d-flex justify-center">
        <h1>Benvenuto</h1>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center align-self-center">
      <v-col xl="5" md="6" sm="12" cols="12" >
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
