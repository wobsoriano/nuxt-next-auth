# Nuxt NextAuth

Authentication for Nuxt using [NextAuth](https://next-auth.js.org/).

- [Usage](#usage)
  - [Requirements](#requirements)
  - [Get Setup](#get-setup)
  - [Use in your application](#use-in-your-application)
  - [Configuration](#configuration)

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

### Use in your application

- All methods from the [NextAuth.js client library](https://next-auth.js.org/getting-started/client) are available via global `$nextAuth` plugin:

```js
// Options API
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

```js
// Composition API
import { useSession } from 'nuxt-next-auth' // can import other methods too

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

- To persist the session in the Vuex store, add this to your actions in `store/index.js`:

```js
export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    await dispatch('auth/getSession', { req })
  }
}
```

```js
// any-component.vue
export default {
  mounted () {
    const { session } = this.$store.state.auth
  }
}
```

- Create a middleware for auth routes:

```js
export default ({ store, redirect }) => {
  if (!store.state.auth.session) {
    return redirect('/')
  }
}
```

### Configuration

- [Options](https://next-auth.js.org/configuration/options)
- [Providers](https://next-auth.js.org/configuration/providers)
- [Databases](https://next-auth.js.org/configuration/databases)
- [Pages](https://next-auth.js.org/configuration/pages)
- [Callbacks](https://next-auth.js.org/configuration/callbacks)
- [Events](https://next-auth.js.org/configuration/events)

### Credits

- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Auth Module](https://github.com/nuxt-community/auth-module) - Zero-boilerplate authentication support for Nuxt.js
- [nuxt-oauth](https://github.com/SohoHouse/nuxt-oauth) - Simple OAuth2 integration for your Nuxt app

### License

[MIT License](http://opensource.org/licenses/MIT).