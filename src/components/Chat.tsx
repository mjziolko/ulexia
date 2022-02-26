import React from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import SoundPlayer from 'react-native-sound-player';

import AccessoryBar from './AccessoryBar';

const URL = 'https://lxya-mjz-lxya.vercel.app';

type AudioContent = { audioContent: string };

function Chat() {
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'type something...',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'lexia',
          avatar: 'https://placeimg.com/140/140/nature',
        },
      },
    ]);
  }, []);

  // female voices: en-US-Wavenet-G, en-US-Wavenet-H, en-US-Wavenet-C, en-US-Wavenet-E, en-US-Wavenet-F
  const onSend = async (msgs: IMessage[]) => {
    setMessages((previousMessages: IMessage[]) => GiftedChat.append(previousMessages, msgs));
    const message = msgs[0].text;
    const options = {
      body: JSON.stringify({ text: message, mp3: true, voice: 'en-US-Wavenet-F' }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await fetch(`${URL}/api/text`, options);
    const { audioContent } = await response.json() as AudioContent;
    SoundPlayer.playData(audioContent);
  };

  const onPress = (_context: object, message: IMessage) => {
    console.log(message.text);
  };

  return (
    <GiftedChat
      messages={messages}
      onLongPress={onPress}
      onSend={(msgs) => onSend(msgs)}
      renderAccessory={() => <AccessoryBar />}
      user={{ _id: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  chatBox: {
    position: 'absolute',
    width: '100%',
    height: 100,
    bottom: 25,
  },
});

export default Chat;
