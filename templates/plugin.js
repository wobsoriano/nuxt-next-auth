import {
    getCsrfToken,
    getProviders,
    getSession,
    setOptions,
    signIn,
    signOut
} from '~auth/runtime'

export default (ctx, inject) => {
    const $nextAuth = {
        getCsrfToken,
        getProviders,
        getSession,
        setOptions,
        signIn,
        signOut
    }
    inject('nextAuth', $nextAuth);
    ctx.$nextAuth = $nextAuth;
}