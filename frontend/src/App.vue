
<template>
  <v-app style="min-height: 100vh; margin: 0; padding: 0"
  :class="{
    'background spacer layer':
      (!isAuthenticated)
  }">
  <RouterView />
  </v-app>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import { useSocketStore } from './stores/socketStore';
export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return localStorage.getItem('token');
    },
  },
  mounted(){
    const socketStore = useSocketStore();
    const userId = localStorage.getItem("userId");
    if (userId) {
      socketStore.initializeSocket(userId); 
    }
  }
};
</script>

<style scoped>
.background {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.spacer {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.layer {
  background-image: url("@/assets/waves.svg");
}
</style>