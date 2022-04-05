import React, { RefObject } from 'react';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Tts from 'react-native-tts';
import Canvas from 'react-native-canvas';
import pointInPolygon from 'point-in-polygon';

import { Camera } from 'expo-camera';
import { Dimensions, GestureResponderEvent, Image, NativeTouchEvent, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { manipulateAsync } from 'expo-image-manipulator';
import { URL } from '../api';
import MessageContext, { addImageMessage } from '../contexts/MessageContext';

// todo: refactor to separate components:
//       * camera logic
//       * layout/css
//       * speaking
//       * drawing
//       * etc

type Vertex = {
  x: number;
  y: number;
};

type Word = {
  vertices: Vertex[];
  paragraph: string;
};

type ImageWrapperProps = {
  image: string,
  onPress: (event: GestureResponderEvent) => void,
  canvas: RefObject<Canvas>
};

function ImageApp() {
  const { messages, setMessages } = React.useContext(MessageContext);
  const [permission, setPermission] = React.useState<boolean>(false);
  const [img, setImg] = React.useState<string>('');
  const [words, setWords] = React.useState<Word[]>([]);
  const camera = React.useRef<Camera>(null);
  const canvas = React.useRef<Canvas>(null);

  React.useEffect(() => {
    void Tts.setDefaultLanguage('en-US');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    void Tts.setIgnoreSilentSwitch('ignore' as any);
    Tts.addEventListener('tts-start', () => {});
    Tts.addEventListener('tts-finish', () => {});
    Tts.addEventListener('tts-progress', () => {});
    Tts.addEventListener('tts-cancel', () => {});
    void (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  // todo: refactor / try using inline drawing after ocr instead of useEffect
  React.useEffect(() => {
    if (canvas.current && words && img) {
      const { height, width, scale } = Dimensions.get('screen');
      canvas.current.height = height;
      canvas.current.width = width;
      const ctx = canvas.current.getContext('2d');
      ctx.strokeStyle = 'white';
      words.forEach((wordLoc) => {
        const box = wordLoc.vertices;
        ctx.moveTo(box[0].x / scale, box[0].y / scale);
        box.slice(1).forEach(({ x, y }) => {
          ctx.lineTo(x / scale, y / scale);
        });
        ctx.lineTo(box[0].x / scale, box[0].y / scale);
        ctx.stroke();
      });
    }
  }, [canvas, img, words]);

  const takePicture = () => {
    void camera.current?.takePictureAsync({
      base64: true,
      quality: 0.2,
      onPictureSaved: ({ uri }) => {
      // todo: calculate image size and adjust scale instead of resizing image (costly)
        const { height, width, scale } = Dimensions.get('screen');
        // const { uri: resizedUri, base64: resizedBase64 } = manipulateAsync(
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

  const canvasPress = ({ nativeEvent }: { nativeEvent: NativeTouchEvent }) => {
    const { scale } = Dimensions.get('window');
    const { locationX, locationY } = nativeEvent;
    words.some((word) => {
      const polygon = word.vertices.map((vertex) => [vertex.x / scale, vertex.y / scale]);
      const inside = pointInPolygon([locationX, locationY], polygon);
      if (inside) {
        Tts.speak(word.paragraph);
      }
      return inside;
    });
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
      <ImageWrapper
        image={img}
        onPress={canvasPress}
        canvas={canvas}
      />
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

function ImageWrapper({ image, onPress, canvas }: ImageWrapperProps) {
  if (image) {
    return (
      <>
        <Pressable onPress={onPress} style={{ zIndex: 20 }}>
          <Canvas ref={canvas} />
        </Pressable>
        <Image source={{ uri: image }} style={{ ...styles.camera, zIndex: 10 }} />
      </>
    );
  }

  return <View />;
}

export default ImageApp;
