
<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import { useSocketStore } from './stores/socketStore';
export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
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


