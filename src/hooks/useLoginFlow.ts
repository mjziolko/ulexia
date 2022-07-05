/* eslint-disable no-console */
import React from 'react';
import { get, post } from '../api';

const useLoginFlow = () => {
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      const startTime = new Date();

      if (await validateCookies()) {
        setLoggedIn(true);
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
    const res = await get<{ expires?: Date }>('auth/session');
    return res.expires;
  };

  const login = async () => {
    console.log('Logging in');
    const startTime = new Date();
    try {
      const { csrfToken } = await get<{ csrfToken: string }>('auth/csrf');
      await post('auth/callback/credentials', {
        email: 'mj@ziolko.dev',
        password: 'test',
        csrfToken,
      }, false);
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
