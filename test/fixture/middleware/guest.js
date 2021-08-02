export default ({ store, redirect }) => {
  if (store.state.auth.session) {
    return redirect('/profile');
  }
};
