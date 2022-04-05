import React from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import { IMessage } from 'react-native-gifted-chat';

import Login from './Login';
import Chat from './Chat';
import Loading from './Loading';
import Settings from './settings/Settings';
import useLoginFlow from '../hooks/useLoginFlow';
import UserContext from '../contexts/UserContext';
import User from '../types/User';
import SettingsType from '../types/Settings';
import { get } from '../api';
import ImageApp from './ImageApp';
import MessageContext from '../contexts/MessageContext';

function Main() {
  const [user, setUser] = React.useState<User | null>(null);
  const [settings, setSettings] = React.useState<SettingsType | null>(null);
  const [messages, setMessages] = React.useState<Array<IMessage>>([]);
  const [sceneIndex, setSceneIndex] = React.useState<number>(1);
  const loggedIn = useLoginFlow();

  const renderScene = SceneMap({
    chat: Chat,
    image: ImageApp,
    settings: Settings,
  });
  const routes = [
    { key: 'image', title: 'Image' },
    { key: 'chat', title: 'Chat' },
    { key: 'settings', title: 'Settings' },
  ];

  const userContextVals = React.useMemo(() => (
    { user, settings, setSettings }
  ), [user, settings, setSettings]);

  const messageContextVals = React.useMemo(() => (
    { messages, setMessages }
  ), [messages, setMessages]);

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
      <MessageContext.Provider value={messageContextVals}>
        <TabView
          navigationState={{ index: sceneIndex, routes }}
          renderScene={renderScene}
          onIndexChange={setSceneIndex}
          renderTabBar={(props) => undefined}
        />
      </MessageContext.Provider>
    </UserContext.Provider>
  );
}

export default Main;
