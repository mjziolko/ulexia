/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react';
import { Image, Pressable, Text, useWindowDimensions } from 'react-native';
import { Bubble, BubbleProps, IMessage, MessageImage, MessageImageProps, Time, TimeProps } from 'react-native-gifted-chat';
import { Theme } from '@react-navigation/native';
import { get } from '../api';
import SpeakingImage from './SpeakingImage';

type CustomBubbleProps = {
  bubble: Readonly<BubbleProps<IMessage>>;
  theme: Theme;
};

type ImageResponse = {
  image: string;
};

function CustomBubble({ bubble, theme }: CustomBubbleProps) {
  const borderRadius = 10;
  const { colors } = theme;
  const [message, setMessage] = React.useState<IMessage | undefined>(bubble.currentMessage);
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    setMessage((pMessage) => {
      if (pMessage) {
        const newMessage = { ...pMessage };
        if (newMessage?.text.length >= 75) {
          const text = newMessage.text.substring(0, 75);
          newMessage.text = `${text}...`;
          setMessage(newMessage);
        }
      }
      return pMessage;
    });
  }, [setMessage]);

  return (
    <Bubble
      {...bubble}
      containerToNextStyle={{
        left: { borderBottomLeftRadius: borderRadius },
        right: { borderBottomRightRadius: borderRadius },
      }}
      containerToPreviousStyle={{
        left: { borderTopLeftRadius: borderRadius },
        right: { borderTopRightRadius: borderRadius },
      }}
      wrapperStyle={{
        left: { marginRight: 15, borderRadius },
        right: {
          marginTop: 10,
          marginLeft: 7.5,
          borderRadius,
          width: width - 30,
          backgroundColor: 'white',
          borderBottomWidth: 2,
          borderBottomColor: theme.colors.primary,
          borderLeftWidth: 2,
          borderLeftColor: theme.colors.primary,
          borderRightWidth: 2,
          borderRightColor: theme.colors.primary,
          shadowColor: 'grey',
          shadowOpacity: 0.5,
        },
      }}
      containerStyle={{
        left: { flex: 1, alignItems: 'flex-start' },
        right: {
          marginLeft: 7.5,
          flex: 1,
          alignItems: 'flex-start',
        },
      }}
      textStyle={{
        left: { color: colors.text },
        right: { color: colors.text },
      }}
      renderTime={renderTime}
      renderMessageImage={RenderImage}
      currentMessage={message}
    />
  );
}

const renderTime = (time: Readonly<TimeProps<IMessage>>) => (
  <Time
    {...time}
    timeTextStyle={{ left: { color: 'black' }, right: { color: 'black' } }}
  />
);

function RenderImage(props: Readonly<MessageImageProps<IMessage>>) {
  const { currentMessage } = props;
  // const [zoom, setZoom] = React.useState<boolean>(false);

  // const onPress = () => {
  //   setZoom(true);
  // };

  // if (zoom) {
  //   // return (React.Fragment);
  //   return (
  //     <SpeakingImage image={currentMessage?.image || ''} />
  //   );
  // }

  return (
    <Pressable>
      <Image
        source={{ uri: currentMessage?.image }}
        style={{
          height: 300,
          width: '99%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 2,
          borderRadius: 10,
        }}
      />
    </Pressable>
  );
}

export default CustomBubble;
