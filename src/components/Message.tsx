import React from 'react';

import { Bubble, BubbleProps, IMessage, Time, TimeProps } from 'react-native-gifted-chat';
import { Theme } from '@react-navigation/native';

export const renderBubble = (bubble: Readonly<BubbleProps<IMessage>>, theme: Theme) => {
  const borderRadius = 10;
  const { colors } = theme;

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
    />
  );
};

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
