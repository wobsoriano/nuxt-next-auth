export default function ({ store, redirect }) {
    if (store.state.auth.session) {
      return redirect('/profile')
    }
}