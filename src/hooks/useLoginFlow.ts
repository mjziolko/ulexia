/* eslint-disable no-console */
import React from 'react';
import CookieManager from '@react-native-cookies/cookies';
import jwtDecode from 'jwt-decode';

const URL = 'https://lxya-mjz-lxya.vercel.app';

const cookieNames = {
  token: '__Secure-next-auth.session-token',
  csrf: '__Host-next-auth.csrf-token',
  callback: '__Secure-next-auth.callback-url',
};

const useLoginFlow = () => {
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      const startTime = new Date();

      if (await validateCookies()) {
        setLoggedIn(true);
        void refreshToken();
      } else {
        await login();
        if (await validateCookies()) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      }

      const endTime = new Date();
      console.log('Total login flow time:');
      console.log(endTime.getTime() - startTime.getTime());
    })().catch((e) => {
      console.error(e);
      setLoggedIn(false);
    });
  }, []);

  const validateCookies = async () => {
    const startTime = new Date();
    const rawCookies = await CookieManager.get(URL);
    const tokenCookie = rawCookies[cookieNames.token];

    if (!tokenCookie) {
      return false;
    }

    if (!tokenCookie.expires) {
      const { exp }: { exp: number } = jwtDecode(tokenCookie.value);
      tokenCookie.expires = new Date(exp * 1000).toISOString();
    }

    const expiry = new Date(tokenCookie.expires);
    const now = new Date();

    const endTime = new Date();
    console.log('Login status time:');
    console.log(endTime.getTime() - startTime.getTime());

    if (now >= expiry) {
      return false;
    }

    return true;
  };

  const refreshToken = async () => {
    await fetch(`${URL}/api/auth/csrf`, {
      method: 'GET',
      credentials: 'include',
    });
    const re = await fetch(`${URL}/api/auth/session`, {
      method: 'GET',
      credentials: 'include',
    });
    console.log(re);
  };

  const login = async () => {
    console.log('Logging in');
    const startTime = new Date();
    try {
      const res = await fetch(`${URL}/api/auth/csrf`, {
        method: 'GET',
        credentials: 'include',
      });
      const { csrfToken } = await res.json() as { csrfToken: string };
      const body = {
        email: 'mj@ziolko.dev',
        password: 'test',
        csrfToken,
      };
      await fetch(`${URL}/api/auth/callback/credentials`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      console.error(e);
    }
    const endTime = new Date();
    console.log('Login time:');
    console.log(endTime.getTime() - startTime.getTime());
  };

  return loggedIn;
};

export default useLoginFlow;
