import { setupTest, createPage } from '@nuxt/test-utils';
import fetchMock from 'jest-fetch-mock';

describe('nuxt-next-auth', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  setupTest({
    browser: true,
    browserOptions: {
      type: 'chromium',
      launch: {
        headless: false
      }
    },
    config: {
      server: {
        port: 3000
      }
    }
  });

  let loginCookies = [];
  const mockSession = {
    user: {
      name: 'Robert Soriano',
      email: 'sorianorobertc@gmail.com',
      image: 'https://avatars.githubusercontent.com/u/13049130?v=4'
    },
    expires: '2021-09-01T05:43:45.869Z'
  };
  const mockProviders = {
    github: {
      id: 'github',
      name: 'GitHub',
      type: 'oauth',
      signinUrl: 'http://localhost:3000/api/auth/signin/github',
      callbackUrl: 'http://localhost:3000/api/auth/callback/github'
    }
  };

  test('Initial state', async () => {
    fetchMock
      .once(JSON.stringify({})) // GET api/auth/session
      .once(JSON.stringify(mockProviders)); // GET api/auth/providers

    const page = await createPage('/');
    // @ts-ignore
    const state = await page.evaluate(() => window.__NUXT__.state);

    expect(state.auth).toEqual({
      session: null
    });

    await page.close();
  });

  test('Login', async () => {
    fetchMock
      .once(JSON.stringify({})) // GET api/auth/session
      .once(JSON.stringify(mockProviders)) // GET api/auth/providers
      .once(JSON.stringify(mockSession)) // GET api/auth/session
      .once(JSON.stringify(mockProviders)); // GET api/auth/providers

    const page = await createPage('/');

    // Login with GitHub
    await page.click('data-test-id=github');
    await page.waitForNavigation();

    // Github.com login page
    expect(page.url()).toContain('https://github.com/login');
    await page.type('#login_field', process.env.GITHUB_EMAIL);
    await page.type('#password', process.env.GITHUB_PASSWORD);
    await page.click('input[name=commit]');

    // GitHub callback
    await page.waitForNavigation();

    // Re-check session state
    // @ts-ignore
    const state = await page.evaluate(() => window.__NUXT__.state);
    expect(state.auth.session).toEqual(mockSession);

    const updatedHtml = await page.innerHTML('body');
    expect(updatedHtml).toContain(
      `<p>Signed in as ${process.env.GITHUB_EMAIL}</p>`
    );

    const context = await page.context();
    loginCookies = await context.cookies();

    await page.close();
  });

  test('Log out', async () => {
    fetchMock
      .once(JSON.stringify(mockSession)) // GET api/auth/session
      .once(JSON.stringify(mockProviders)); // GET api/auth/providers

    // Add cookies from login test
    const page = await createPage('/secure', {
      storageState: {
        cookies: loginCookies
      }
    });

    // Check session state
    // @ts-ignore
    const state = await page.evaluate(() => window.__NUXT__.state);
    expect(state.auth.session).toEqual(mockSession);

    // Log out
    const body = await page.innerHTML('body');
    expect(body).toContain('<button>Sign out</button>');
    await page.click('button');

    await page.waitForNavigation();
    await page.waitForFunction('!!window.$nuxt');

    // Check session using getSession
    const session = await page.evaluate(() =>
      // @ts-ignore
      window.$nuxt.$nextAuth.getSession()
    );
    expect(session).toBeNull();

    await page.close();
  });
});
