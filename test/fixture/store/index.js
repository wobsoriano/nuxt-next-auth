export const actions = {
  nuxtServerInit({ dispatch }, { req }) {
    dispatch('auth/getSession', { req });
  }
};
