/* eslint-disable no-console */
import React from 'react';
import { Bubble, BubbleProps, IMessage, Time, TimeProps } from 'react-native-gifted-chat';
import { Theme } from '@react-navigation/native';
import { get } from '../api';

type CustomBubbleProps = {
  bubble: Readonly<BubbleProps<IMessage>>;
  theme: Theme;
};

type ImageResponse = {
  image: string;
};

export function CustomBubble({ bubble, theme }: CustomBubbleProps) {
  const borderRadius = 10;
  const { colors } = theme;
  const [message, setMessage] = React.useState<IMessage | undefined>(bubble.currentMessage);

  React.useEffect(() => {
    setMessage((pMessage) => {
      if (pMessage?.image) {
        // eslint-disable-next-line no-underscore-dangle
        get<ImageResponse>(`image?id=${pMessage._id}`).then((res: ImageResponse) => {
          const { image } = res;
          const imageUri = `data:image/jpeg;base64,${image}`;
          const imageMessage = { ...pMessage };
          imageMessage.image = imageUri;
          setMessage(imageMessage);
        }).catch((e) => {
          console.error(e);
        });
      }
      return pMessage;
    });
  }, [setMessage]);

  return (
    <Bubble
      // eslint-disable-next-line react/jsx-props-no-spreading
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
        right: { marginLeft: 15, borderRadius, backgroundColor: colors.border },
      }}
      containerStyle={{
        left: { flex: 1, alignItems: 'flex-start' },
        right: { flex: 1, alignItems: 'flex-start' },
      }}
      textStyle={{
        left: { color: colors.text },
        right: { color: colors.text },
      }}
      currentMessage={message}
    />
  );
}

export const renderTime = (time: Readonly<TimeProps<IMessage>>, theme: Theme) => {
  const { colors } = theme;

  return (
    <Time
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...time}
      timeTextStyle={{
        left: { color: colors.text },
        right: { color: colors.text },
      }}
    />
  );
};
