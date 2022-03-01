import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './components/Main';

function App() {
  return <SafeAreaProvider><Main /></SafeAreaProvider>;
}

export default App;
