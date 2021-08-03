import { IncomingMessage } from "http"

export type ProviderType = "oauth" | "email" | "credentials"

export interface DefaultSession extends Record<string, unknown> {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  expires?: string
}

/**
 * Returned by `useSession`, `getSession`, returned by the `session` callback
 * and also the shape received as a prop on the `Provider` React Context
 *
 * [`useSession`](https://next-auth.js.org/getting-started/client#usesession) |
 * [`getSession`](https://next-auth.js.org/getting-started/client#getsession) |
 * [`Provider`](https://next-auth.js.org/getting-started/client#provider) |
 * [`session` callback](https://next-auth.js.org/configuration/callbacks#jwt-callback)
 */
export interface Session extends Record<string, unknown>, DefaultSession {}

export interface CtxOrReq {
  req?: IncomingMessage
  ctx?: { req: IncomingMessage }
}

/***************
 * Session types
 **************/

export type GetSessionOptions = CtxOrReq & {
  event?: "storage" | "timer" | "hidden" | string
  triggerEvent?: boolean
}

/**
 * Vue composable that gives you access
 * to the logged in user's session data.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#usesession)
 */
export function useSession(): [Session | null, boolean]

/**
 * Can be called client or server side to return a session asynchronously.
 * It calls `/api/auth/session` and returns a promise with a session object,
 * or null if no session exists.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#getsession)
 */
export function getSession(options?: GetSessionOptions): Promise<Session | null>

/**
 * Alias for `getSession`
 * @docs https://next-auth.js.org/getting-started/client#getsession
 */
export const session: typeof getSession

/*******************
 * CSRF Token types
 ******************/

/**
 * Returns the current Cross Site Request Forgery Token (CSRF Token)
 * required to make POST requests (e.g. for signing in and signing out).
 * You likely only need to use this if you are not using the built-in
 * `signIn()` and `signOut()` methods.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#getcsrftoken)
 */
export function getCsrfToken(ctxOrReq?: CtxOrReq): Promise<string | null>

/**
 * Alias for `getCsrfToken`
 * @docs https://next-auth.js.org/getting-started/client#getcsrftoken
 */
export const csrfToken: typeof getCsrfToken

/******************
 * Providers types
 *****************/

export interface ClientSafeProvider {
  id: string
  name: string
  type: ProviderType
  signinUrl: string
  callbackUrl: string
}

/**
 * It calls `/api/auth/providers` and returns
 * a list of the currently configured authentication providers.
 * It can be useful if you are creating a dynamic custom sign in page.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#getproviders)
 */
export function getProviders(): Promise<Record<
  string,
  ClientSafeProvider
> | null>

/**
 * Alias for `getProviders`
 * @docs https://next-auth.js.org/getting-started/client#getproviders
 */
export const providers: typeof getProviders

/****************
 * Sign in types
 ***************/

export type RedirectableProvider = "email" | "credentials"

export type SignInProvider = RedirectableProvider | string | undefined

export interface SignInOptions extends Record<string, unknown> {
  /**
   * Defaults to the current URL.
   * @docs https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
   */
  callbackUrl?: string
  /** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option */
  redirect?: boolean
}

export interface SignInResponse {
  error: string | undefined
  status: number
  ok: boolean
  url: string | null
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export type SignInAuthorisationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signin)
 */
export function signIn<P extends SignInProvider = undefined>(
  provider?: P,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorisationParams
): Promise<
  P extends RedirectableProvider ? SignInResponse | undefined : undefined
>

/**
 * Alias for `signIn`
 * @docs https://next-auth.js.org/getting-started/client#signin
 */
export const signin: typeof signIn

/****************
 * Sign out types
 ****************/

/** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
export interface SignOutResponse {
  url: string
}

export interface SignOutParams<R extends boolean = true> {
  /** @docs https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1 */
  callbackUrl?: string
  /** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
  redirect?: R
}

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signout)
 */
export function signOut<R extends boolean = true>(
  params?: SignOutParams<R>
): Promise<R extends true ? undefined : SignOutResponse>

/**
 * @docs https://next-auth.js.org/getting-started/client#signout
 * Alias for `signOut`
 */
export const signout: typeof signOut
/************************
 * SessionProvider types
 ***********************/

/** @docs: https://next-auth.js.org/getting-started/client#options */
export interface SessionProviderOptions {
  baseUrl?: string
  basePath?: string
  clientMaxAge?: number
  keepAlive?: number
}

/** @docs: https://next-auth.js.org/getting-started/client#options */
export function setOptions(options: SessionProviderOptions): void

/**
 * Alias for `setOptions`
 * @docs: https://next-auth.js.org/getting-started/client#options
 */
export const options: typeof setOptions

/********************
 * Nuxt plugin typings
 ********************/

export interface NextAuthPlugin {
  getCsrfToken: typeof getCsrfToken;
  getProviders: typeof getProviders;
  getSession: typeof getSession;
  setOptions: typeof setOptions;
  signIn: typeof signIn;
  signOut: typeof signOut;
}

declare module 'vue/types/vue' {
  // this.$nextAuth inside Vue components
  interface Vue {
    $nextAuth: NextAuthPlugin
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$nextAuth inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $nextAuth: NextAuthPlugin
  }
  // nuxtContext.$nextAuth
  interface Context {
    $nextAuth: NextAuthPlugin
  }
}

declare module 'vuex/types/index' {
  // this.$nextAuth inside Vuex stores
  interface Store<S> {
    $nextAuth: NextAuthPlugin
  }
}