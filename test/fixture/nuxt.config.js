import Providers from 'next-auth/providers';
import NuxtNextAuth from '../../module';

export default {
  buildModules: ['@nuxtjs/composition-api/module'],
  modules: [NuxtNextAuth],
  vite: {
    ssr: true
  },
  nextAuth: {
    providers: [
      Providers.GitHub({
        clientId: process.env.NEXTAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NEXTAUTH_GITHUB_CLIENT_SECRET
      })
    ]
  }
};
