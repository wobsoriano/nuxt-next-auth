# Nuxt NextAuth

Authentication for Nuxt using [NextAuth](https://next-auth.js.org/).

- [Usage](#usage)
  - [Requirements](#requirements)
  - [Get Setup](#get-setup)
  - [Use in your application](#use-in-your-application)

## Usage

### Requirements

- [Nuxt SSR](https://nuxtjs.org/docs/2.x/concepts/server-side-rendering)
- [Vuex store](https://nuxtjs.org/guide/vuex-store)
- [Composition API](https://composition-api.nuxtjs.org/) - automatically installed

### Get Setup

1. Install the dependency:

```bash
yarn add nuxt-next-auth
```

2. Add to your `nuxt.config.js` and configure `next-auth` [options](https://next-auth.js.org/configuration/options):

```js
import Providers from 'next-auth/providers';

export default {
  modules: [
    '@nuxtjs/composition-api/module',
    'nuxt-next-auth/module'
  ],

  nextAuth: {
    // Configure one or more authentication providers here.
    // https://next-auth.js.org/configuration/providers
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      })
    ],
    
    // A database is optional, but required to persist accounts in a database.
    // https://next-auth.js.org/configuration/databases
    database: process.env.DATABASE_URL,
  }
}
```

3. Use in your application

- All methods from the [NextAuth.js client library](https://next-auth.js.org/getting-started/client) are available via global `$nextAuth` plugin:

Options API

```js
export default {
  mounted () {
    this.$nextAuth.getSession()
    this.$nextAuth.getCsrfToken()
    this.$nextAuth.getProviders()
    this.$nextAuth.signIn()
    this.$nextAuth.signOut()
  }
}
```

direct import from `nuxt-next-auth`

```js
import { getSession, getCsrfToken } from 'nuxt-next-auth'
```

Composition API

```js
import { useSession } from 'nuxt-next-auth'

export default defineComponent({
  setup() {
    const [session, loading] = useSession()

    return {
      session,
      loading
    }
  }
})
```