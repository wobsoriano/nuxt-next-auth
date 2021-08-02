import { getSession } from '../../../src/client';

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    try {
      const session = await getSession({ req });
      commit('auth/setSession', session);
    } catch (e) {
      commit('auth/setSession', null);
    }
  }
};
