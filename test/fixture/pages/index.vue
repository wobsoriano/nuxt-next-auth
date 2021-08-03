<template>
    <div>
        <p v-if="session">Signed in as {{ session.user.email }}</p>
        <div v-else>
            <div v-for="provider in Object.values(providers)" :key="provider.id">
                <button :data-test-id="provider.id" @click="$nextAuth.signIn(provider.id)">Sign in with {{ provider.name }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ $nextAuth }) {
        const providers = await $nextAuth.getProviders();
        return {
            providers
        }
    },
    computed: {
        session() {
            return this.$store.state.auth.session;
        }
    }
}
</script>
