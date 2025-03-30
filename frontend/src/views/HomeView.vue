<template>
  <v-container>
    <v-row class="justify-center">
      <v-col xl="12" md="10" sm="12" cols="12" class="d-flex justify-center text-center">
        <h1>Benvenuti nell'app di messaggistica</h1>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col xl="5" md="6" sm="12" cols="12">
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

