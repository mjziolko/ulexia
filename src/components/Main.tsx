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
import { get } from '../api';

const Stack = createNativeStackNavigator();

function Main() {
  const [user, setUser] = React.useState<User | null>(null);
  const [settings, setSettings] = React.useState<SettingsType | null>(null);
  const loggedIn = useLoginFlow();

  const userContextVals = React.useMemo(() => (
    { user, settings, setSettings }
  ), [user, settings, setSettings]);

  React.useEffect(() => {
    void (async () => {
      const loggedInUser = await get<User>('user');
      setUser(loggedInUser);
      const userSettings = await get<SettingsType>('settings');
      setSettings(userSettings);
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
