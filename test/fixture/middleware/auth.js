export default ({ store, redirect }) => {
  console.log(store.state)
  if (!store.state.auth.session) {
    return redirect('/');
  }
};
