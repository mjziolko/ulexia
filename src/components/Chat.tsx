import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import React from 'react';
import { Platform, Text } from 'react-native';
import { Bubble, BubbleProps, GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';

const URL = 'https://lxya-mjz-lxya.vercel.app';

type AudioContent = { audioContent: string };
type TextMessage = { id: number, text: string, createdAt: Date };
type User = { id: number, name: string, email: string, special: boolean };

function Chat() {
  const [user, setUser] = React.useState<User | null>(null);
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { bottom } = useSafeAreaInsets();

  React.useEffect(() => {
    SoundPlayer.addEventListener('FinishedLoading', () => {});
    SoundPlayer.addEventListener('FinishedLoadingURL', () => {});
    SoundPlayer.addEventListener('FinishedPlaying', () => {});

    void (async () => {
      const textResponse = await fetch(`${URL}/api/text`);
      const textList: TextMessage[] = await textResponse.json() as TextMessage[];
      const iMessageList: IMessage[] = textList.map((text) => ({ _id: text.id, user: { _id: 1 }, ...text }));
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
        body: JSON.stringify({ text, voice: 'en-US-Wavenet-F' }),
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

  const renderBubble = (bubble: Readonly<BubbleProps<IMessage>>) => {
    const borderRadius = 10;
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
          right: { marginLeft: 15, borderRadius },
        }}
        containerStyle={{
          left: { flex: 1, alignItems: 'flex-start' },
          right: { flex: 1, alignItems: 'flex-start' },
        }}
      />
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <GiftedChat
      bottomOffset={bottom}
      messages={messages}
      onLongPress={onPress}
      onSend={(msgs) => onSend(msgs)}
      renderBubble={renderBubble}
      user={{ _id: 1 }}
    />
  );
}

export default Chat;
