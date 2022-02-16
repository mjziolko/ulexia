import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

function Chat() {
  return (
    <View style={{ ...styles.chatBox }}>
      <Text>Hi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chatBox: {
    position: 'absolute',
    width: '100%',
    height: 100,
    bottom: 25,
  },
});

export default Chat;
