# Nuxt NextAuth

Authentication for Nuxt using NextAuth.

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

2. Add to your `nuxt.config.js` and configure:

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