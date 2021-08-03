# Nuxt NextAuth

Authentication module for Nuxt using [NextAuth](https://next-auth.js.org/).

- [Usage](#usage)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Use in your application](#use-in-your-application)
  - [Configuration](#configuration)
  - [Using with TypeScript](#using-with-typescript)
  - [Example Code](#example-code)
- [Develop](#develop)
  - [Credits](#credits)
  - [License](#license)

## Usage

### Requirements

- [Nuxt SSR](https://nuxtjs.org/docs/2.x/concepts/server-side-rendering)
- [Vuex store](https://nuxtjs.org/guide/vuex-store)
- [Composition API](https://composition-api.nuxtjs.org/) - automatically installed

### Setup

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

- All methods from the [NextAuth.js client library](https://next-auth.js.org/getting-started/client) can be imported in the `nuxt-next-auth` module 
or accessed via global `$nextAuth` plugin:

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

// Composition API
import { useSession } from 'nuxt-next-auth' // can import other methods too

const [session, loading] = useSession()
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
// nuxt-next-auth uses auth as module name
export default {
  mounted () {
    const { session } = this.$store.state.auth
  }
}
```

- Create a middleware for auth routes:

```js
// middleware/auth.js
export default ({ store, redirect }) => {
  if (!store.state.auth.session) {
    return redirect('/')
  }
}

// any-secure-page.vue
export default {
  middleware: ['auth']
}
```

### Configuration

- [Options](https://next-auth.js.org/configuration/options)
- [Providers](https://next-auth.js.org/configuration/providers)
- [Databases](https://next-auth.js.org/configuration/databases)
- [Pages](https://next-auth.js.org/configuration/pages)
- [Callbacks](https://next-auth.js.org/configuration/callbacks)
- [Events](https://next-auth.js.org/configuration/events)

### Using with TypeScript

Add `nuxt-next-auth` to the `compilerOptions.types` section of your project's `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "types": [
      "nuxt-next-auth",
    ]
  },
}
```

### Example code

```html
<template>
    <div>
        <div v-if="session">
            Signed in as {{ session.user.email }} <br />
            <button @click="signOut">Sign out</button>
        </div>
        <div v-else>
            Not signed in <br/>
            <button @click="signIn">Sign in</button>
        </div>
    </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { signIn, signOut, useSession } from 'nuxt-next-auth'

export default defineComponent({
    setup() {
        const [session, loading] = useSession()

        return {
            session,
            loading,
            signIn,
            signOut
        }
    }
})
</script>
```

## Develop

```bash
git clone https://github.com/wobsoriano/nuxt-next-auth.git
cd nuxt-next-auth
yarn
yarn test
```

### Running locally

To run the fixture Nuxt app (`/test/fixture`) locally, make sure to:
```bash
cp test/fixture/.env.example test/fixture/.env
```
and populate with your real values. Then, run:
```
yarn dev
```
To boot the app locally.

### Credits

- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Auth Module](https://github.com/nuxt-community/auth-module) - Zero-boilerplate authentication support for Nuxt.js
- [nuxt-oauth](https://github.com/SohoHouse/nuxt-oauth) - Simple OAuth2 integration for your Nuxt app

### License

[MIT License](http://opensource.org/licenses/MIT).