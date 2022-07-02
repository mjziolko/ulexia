import React from 'react';
import { Dimensions, Image, NativeTouchEvent, Pressable } from 'react-native';
import pointInPolygon from 'point-in-polygon';
import Canvas from 'react-native-canvas';
import Word from '../types/Word';
import useSpeaker from '../hooks/useSpeaker';

type SpeakingImageProps = {
  image: string;
  words: Word[];
};

function SpeakingImage({ image, words }: SpeakingImageProps) {
  const canvas = React.useRef<Canvas>(null);
  const speak = useSpeaker();

  React.useEffect(() => {
    if (canvas.current && words && image) {
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
  }, [canvas, image, words]);

  const onPress = ({ nativeEvent }: { nativeEvent: NativeTouchEvent }) => {
    const { scale } = Dimensions.get('window');
    const { locationX, locationY } = nativeEvent;
    words.some((word) => {
      const polygon = word.vertices.map((vertex) => [vertex.x / scale, vertex.y / scale]);
      const inside = pointInPolygon([locationX, locationY], polygon);
      if (inside) {
        void speak(word.paragraph);
      }
      return inside;
    });
  };

  return (
    <>
      <Pressable onPress={onPress} style={{ zIndex: 20 }}>
        <Canvas ref={canvas} />
      </Pressable>
      <Image
        source={{ uri: image || undefined }}
        style={{
          flex: 1,
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
        }}
      />
    </>
  );
}

export default SpeakingImage;
