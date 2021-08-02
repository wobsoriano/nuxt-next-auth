<template>
  <div>
    <pre>{{ JSON.stringify(session, null, 2) }}</pre>
    <button @click="$nextAuth.signOut">Sign out</button>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  computed: {
    session() {
      return this.$store.state.auth.session;
    }
  }
};
</script>
