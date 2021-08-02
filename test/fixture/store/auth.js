export const state = () => ({
  session: null
});

export const mutations = {
  setSession(state, payload) {
    state.session = payload;
  }
};
