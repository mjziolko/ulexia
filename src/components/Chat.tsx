/* eslint-disable no-console */
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Loading from './Loading';
import { renderBubble, renderTime } from './Message';
import UserContext from '../contexts/UserContext';
import useSpeaker from '../hooks/useSpeaker';

const URL = 'https://lxya-mjz-lxya.vercel.app';

type TextMessage = { id: number, text: string, createdAt: Date };
type ChatProps = NativeStackScreenProps<Record<string, undefined>, 'chat'>;

function Chat(props: ChatProps) {
  const { user, settings } = React.useContext(UserContext);
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { bottom } = useSafeAreaInsets();
  const { navigation } = props;
  const theme = useTheme();
  const speak = useSpeaker();

  React.useEffect(() => {
    void (async () => {
      const startTime = new Date();

      try {
        const textResponse = await fetch(`${URL}/api/text`);
        const textList = await textResponse.json() as TextMessage[];
        const iMessageList = textList.map((text) => ({ _id: text.id, user: { _id: 1 }, ...text }));
        setMessages((previousMessages) => GiftedChat.append(previousMessages, iMessageList));
      } catch (e) {
        console.log('Data fetch error');
        console.error(e);
      }

      setLoading(false);

      const endTime = new Date();
      console.log('Data fetch time:');
      console.log(endTime.getTime() - startTime.getTime());
    })();

    return (() => {
      setMessages([]);
    });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: ({ tintColor }) => (
        <Icon name="settings" color={tintColor} size={30} onPress={() => navigation.navigate('settings')} />
      ),
    });
  }, [navigation]);

  const onSend = (msgs: IMessage[]) => {
    const { text } = msgs[0];
    void speak(text);
    void createText(text);
    setMessages((previousMessages: IMessage[]) => GiftedChat.append(previousMessages, msgs));
  };

  const onPress = (_context: object, message: IMessage) => {
    void impactAsync(ImpactFeedbackStyle.Heavy);
    void speak(message.text);
  };

  const createText = async (text: string) => {
    const options = {
      body: JSON.stringify({ text }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    };
    await fetch(`${URL}/api/text`, options);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <GiftedChat
      bottomOffset={bottom}
      messages={messages}
      onLongPress={onPress}
      onSend={(msgs) => onSend(msgs)}
      renderBubble={(bubble) => renderBubble(bubble, theme)}
      renderTime={(time) => renderTime(time, theme)}
      user={{ _id: 1 }}
    />
  );
}

export default Chat;
