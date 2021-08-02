export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    await dispatch('auth/getSession', { req });
  }
};
