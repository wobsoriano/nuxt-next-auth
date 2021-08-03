<template>
  <div>
    <div v-if="session">
      Signed in as {{ session.user.email }} <br />
      <button @click="signOut">Sign out</button>
    </div>
    <div v-else>
      Not signed in <br />
      <button @click="signIn">Sign in</button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { signIn, signOut, useSession } from '../../../src/client';

export default defineComponent({
  setup() {
    const [session, loading] = useSession();

    return {
      session,
      loading,
      signIn,
      signOut
    };
  }
});
</script>
