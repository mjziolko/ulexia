/* eslint-disable no-console */
import React from 'react';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Canvas from 'react-native-canvas';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import { manipulateAsync } from 'expo-image-manipulator';

import { URL } from '../api';
import MessageContext, { addImageMessage } from '../contexts/MessageContext';
import Word from '../types/Word';
import SpeakingImage from './SpeakingImage';

function ImageApp() {
  const { setMessages } = React.useContext(MessageContext);
  const [permission, setPermission] = React.useState<boolean>(false);
  const [img, setImg] = React.useState<string>('');
  const [words, setWords] = React.useState<Word[]>([]);
  const camera = React.useRef<Camera>(null);
  const canvas = React.useRef<Canvas>(null);

  React.useEffect(() => {
    void (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  const takePicture = () => {
    void camera.current?.takePictureAsync({
      base64: true,
      quality: 0.2,
      onPictureSaved: ({ uri }) => {
      // todo: calculate image size and adjust scale instead of resizing image (costly)
        const { height, width, scale } = Dimensions.get('screen');
        manipulateAsync(
          uri,
          [{ resize: { height: height * scale, width: width * scale } }],
          { base64: true },
        ).then(({ uri: resizedUri, base64: resizedBase64 }) => {
          setImg(resizedUri);
          if (resizedBase64) void upload(resizedBase64, resizedUri);
        }).catch((e) => {
          console.error(e);
        });
      },
    });
    camera.current?.pausePreview();
  };

  const upload = async (imageData: string, imageUri: string) => {
    try {
      const response = await ReactNativeBlobUtil.fetch('POST', `${URL}/api/image`, {}, [
        { name: 'image', filename: 'image.jpg', type: 'image/jpeg', data: imageData },
      ]);
      const data = await response.json() as Word[];
      setWords(data);
      const text: string = data.map((word) => word.paragraph).join('\n');
      addImageMessage(text, imageUri, setMessages);
    } catch (e) {
      console.log(e);
    }
  };

  const clearPicture = () => {
    setImg('');
    setWords([]);
    camera.current?.resumePreview();
  };

  if (!permission) {
    return (
      <View>
        <Text>Enable camera permissions</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SpeakingImage image={img} words={words} />
      <Camera
        type={Camera.Constants.Type.back}
        ref={camera}
        style={{ ...styles.camera, zIndex: 1 }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={img ? clearPicture : takePicture} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 100,
  },
  buttonContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    left: '50%',
    bottom: 25,
    marginLeft: -50,
    zIndex: 100,
  },
  camera: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  container: {
    height: '100%',
  },
});

export default ImageApp;
