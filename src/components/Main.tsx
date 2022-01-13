import React from 'react';
import CookieManager from '@react-native-cookies/cookies';
import Login from './Login';
import ImageApp from './ImageApp';
import { Text } from 'react-native';

const URL = "https://lxya-mjz-lxya.vercel.app"
// const URL = "https://e2e1-205-178-103-32.ngrok.io"

const cookieNames = {
  token: "__Secure-next-auth.session-token",
  csrf: "__Host-next-auth.csrf-token",
  callback: "__Secure-next-auth.callback-url"
};

const Main = () => {
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      await login();
      if (await validateCookies()) {
        refreshToken();
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    })();
  }, []);

  const validateCookies = async () => {
    const rawCookies = await CookieManager.get(URL);
    const tokenCookie = rawCookies[cookieNames.token];
    const csrfCookie = rawCookies[cookieNames.csrf];
    const callbackCookie = rawCookies[cookieNames.callback];

    if (!(tokenCookie?.expires && csrfCookie && callbackCookie)) {
      return false;
    }

    const expiry = new Date(tokenCookie.expires);
    const now = new Date();

    if (now >= expiry) {
      return false;
    }

    return true;
  }

  const refreshToken = async () => {
    await fetch(`${URL}/api/auth/csrf`, {
      method: "GET",
      credentials: "include"
    });
    fetch(`${URL}/api/auth/session`, {
      method: "GET",
      credentials: "include"
    });
  }

  const login = async () => {
    console.log("logging in");
    const res = await fetch(`${URL}/api/auth/csrf`, {
      method: "GET",
      credentials: "include"
    });
    const { csrfToken } = await res.json();
    const body = {
      email: "mj@ziolko.dev",
      password: "test",
      csrfToken: csrfToken
    };
    const res2 = await fetch(`${URL}/api/auth/callback/credentials`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  if (loggedIn === null) {
    return <Text>Loading...</Text>
  } else if (loggedIn === false) {
    return <Login />
  }

  return <ImageApp />
}

export default Main;