import React from 'react';
import { Button, GestureResponderEvent, StyleSheet, TouchableOpacity, View } from 'react-native';

function AccessoryBar() {
  return (
    <View style={styles.container}>
      <Button title="[+]"> </Button>
      <Button title="[o]"> </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
  },
});

export default AccessoryBar;
