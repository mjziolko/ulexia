import React from 'react';
import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Loading from './Loading';
import { renderBubble, renderTime } from './Message';

const URL = 'https://lxya-mjz-lxya.vercel.app';

type AudioContent = { audioContent: string };
type TextMessage = { id: number, text: string, createdAt: Date };
type User = { id: number, name: string, email: string, special: boolean };
type ChatProps = NativeStackScreenProps<Record<string, undefined>, 'chat'>;

function Chat(props: ChatProps) {
  const theme = useTheme();
  const [user, setUser] = React.useState<User | null>(null);
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { bottom } = useSafeAreaInsets();
  const { navigation } = props;

  React.useEffect(() => {
    SoundPlayer.addEventListener('FinishedLoading', () => {});
    SoundPlayer.addEventListener('FinishedLoadingURL', () => {});
    SoundPlayer.addEventListener('FinishedPlaying', () => {});

    void (async () => {
      const textResponse = await fetch(`${URL}/api/text`);
      const textList = await textResponse.json() as TextMessage[];
      const iMessageList = textList.map((text) => ({ _id: text.id, user: { _id: 1 }, ...text }));
      setMessages((previousMessages) => GiftedChat.append(previousMessages, iMessageList));

      const userResponse = await fetch(`${URL}/api/users`);
      const loggedInUser: User = await userResponse.json() as User;
      setUser(loggedInUser);

      setLoading(false);
    })();

    return (() => {
      setMessages([]);
    });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: ({ tintColor }) => (
        // eslint-disable-next-line react/prop-types
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

  const speak = async (text: string) => {
    if (user?.special) {
      const options = {
        body: JSON.stringify({ text, voice: 'en-GB-Wavenet-A' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      };

      try {
        const response = await fetch(`${URL}/api/tts`, options);
        const { audioContent } = await response.json() as AudioContent;
        const url = `data:audio/mp3;base64,${audioContent}`;
        if (Platform.OS === 'ios') {
          SoundPlayer.setSpeaker(true);
        }
        SoundPlayer.playUrl(url);
      } catch {
        Tts.speak(text);
      }
    } else {
      Tts.speak(text);
    }
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
