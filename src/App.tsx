import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './components/Main';

function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Main />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default App;
