<template>
  <div>
    <h1>Chats View</h1>
    <div v-if="activeChat">
      <h2>Chat con: {{ activeChat.participants[0].username }}</h2>
    </div>
    <div v-else>
      <h2>Nessuna chat attiva</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatsView",
  mounted() {
    console.log("montato");
  },
  props: {
    activeChat: {
      type: Object,
      default: null
    }
  },
  watch: {
    activeChat() {
      // Chiamata API per ottenere la chat attiva
    }
  }
};
</script>

