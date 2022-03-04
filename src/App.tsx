import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Main from './components/Main';

LogBox.ignoreLogs(['new NativeEventEmitter']);

const theme = {
  dark: false,
  colors: {
    primary: '#ff8c80',
    background: '#fff',
    card: 'rgb(255, 255, 255)',
    text: '#000',
    border: '#ffa399',
    notification: 'rgb(255, 69, 58)',
  },
};

function App() {
  return (
    <NavigationContainer theme={theme}>
      <SafeAreaProvider>
        <Main />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default App;
