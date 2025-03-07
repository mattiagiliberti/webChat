<template>
  <v-container>
    <v-row>
      <v-col xl="6" md="6" sm="12" cols="12" justify="center">
        <h1>Benvenuto</h1>
      </v-col>
      <v-col justify="center">
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
