import {
    getCsrfToken,
    getProviders,
    getSession,
    setOptions,
    signIn,
    signOut
} from '~auth/runtime'

const moduleName = 'auth'

// Initialize auth store module
const initStore = async context => {
    if (!context.store) {
      context.error('nuxt-next-auth requires a Vuex store!')
      return
    }
  
    context.store.registerModule(
      moduleName,
      {
        namespaced: true,
        state: {
          session: null
        },
        mutations: {
          setSession (state, payload) {
            state.session = payload
          }
        },
        actions: {
            async getSession ({ commit }, { req }) {
                try {
                    const session = await getSession({ req });
                    commit('setSession', session);
                } catch (e) {
                    commit('setSession', null);
                }
            }
        }
      }
    )
}
  
export default async (ctx, inject) => {
    const $nextAuth = {
        getCsrfToken,
        getProviders,
        getSession,
        setOptions,
        signIn,
        signOut
    }
    await initStore(ctx);
    inject('nextAuth', $nextAuth);
    ctx.$nextAuth = $nextAuth;
}