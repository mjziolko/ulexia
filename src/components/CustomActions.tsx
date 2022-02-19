import React from 'react';
import { ActionSheetIOS, Button, GestureResponderEvent, StyleSheet, TouchableOpacity, View } from 'react-native';

function CustomActions() {
  const onActionsPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    // ActionSheetIOS
    // const cancelButtonIndex = options.length - 1;
    // this.context.actionSheet().showActionSheetWithOptions(
    //   {
    //     options,
    //     cancelButtonIndex,
    //   },
    //   async buttonIndex => {
    //     const { onSend } = this.props
    //     switch (buttonIndex) {
    //       case 0:
    //         pickImageAsync(onSend)
    //         return
    //       case 1:
    //         takePictureAsync(onSend)
    //         return
    //       case 2:
    //         getLocationAsync(onSend)
    //       default:
    //     }
    //   },
    // );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionsPress}
    >
      {/* {renderIcon()} */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
