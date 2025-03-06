<template>

  <v-container>
    <v-form>
      <v-text-field
        label="Username"
        v-model="username"
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

</script>
