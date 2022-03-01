import React from 'react';
import CookieManager from '@react-native-cookies/cookies';
import { Text } from 'react-native';
import jwtDecode from 'jwt-decode';

import Login from './Login';
import Chat from './Chat';
// import ImageApp from './ImageApp';

const URL = 'https://lxya-mjz-lxya.vercel.app';
// const URL = "https://e2e1-205-178-103-32.ngrok.io"

const cookieNames = {
  token: '__Secure-next-auth.session-token',
  csrf: '__Host-next-auth.csrf-token',
  callback: '__Secure-next-auth.callback-url',
};

function Main() {
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      await login();
      if (await validateCookies()) {
        setLoggedIn(true);
        void refreshToken();
      } else {
        setLoggedIn(false);
      }
    })().catch(() => {
      setLoggedIn(false);
    });
  }, []);

  const validateCookies = async () => {
    const rawCookies = await CookieManager.get(URL);
    const tokenCookie = rawCookies[cookieNames.token];

    if (!tokenCookie.expires) {
      const { exp }: { exp: number } = jwtDecode(tokenCookie.value);
      tokenCookie.expires = new Date(exp * 1000).toISOString();
    }

    const expiry = new Date(tokenCookie.expires);
    const now = new Date();

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
    await fetch(`${URL}/api/auth/session`, {
      method: 'GET',
      credentials: 'include',
    });
  };

  const login = async () => {
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
  };

  if (loggedIn === null) {
    return <Text>Loading...</Text>;
  } if (loggedIn === false) {
    return <Login />;
  }

  return <Chat />;
}

export default Main;
