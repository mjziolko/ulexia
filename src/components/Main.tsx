import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Login';
import Chat from './Chat';
import Loading from './Loading';
import Settings from './settings/Settings';
import useLoginFlow from '../hooks/useLoginFlow';
import UserContext from '../contexts/UserContext';
import User from '../types/User';
import SettingsType from '../types/Settings';

const URL = 'https://lxya-mjz-lxya.vercel.app';

const Stack = createNativeStackNavigator();

function Main() {
  const loggedIn = useLoginFlow();
  const [user, setUser] = React.useState<User | null>(null);
  const [settings, setSettings] = React.useState<SettingsType | null>(null);
  const userContextVals = React.useMemo(() => ({ user, settings, setSettings }), [user, settings, setSettings]);

  React.useEffect(() => {
    void (async () => {
      const userResponse = await fetch(`${URL}/api/users`);
      const loggedInUser: User = await userResponse.json() as User;
      setUser(loggedInUser);

      const settingsResponse = await fetch(`${URL}/api/settings`);
      const s: SettingsType = await settingsResponse.json() as SettingsType;
      setSettings(s);
    })();
  }, []);

  if (loggedIn === null) {
    return <Loading />;
  } if (loggedIn === false) {
    return <Login />;
  }

  return (
    <UserContext.Provider value={userContextVals}>
      <Stack.Navigator initialRouteName="chat">
        <Stack.Screen
          name="chat"
          component={Chat}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="settings"
          component={Settings}
          options={{
            title: 'Settings',
            headerBackVisible: Platform.OS !== 'android',
          }}
        />
      </Stack.Navigator>
    </UserContext.Provider>
  );
}

export default Main;
