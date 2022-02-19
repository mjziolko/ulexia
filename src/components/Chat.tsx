import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';
import SoundPlayer from 'react-native-sound-player';

import AccessoryBar from './AccessoryBar';

const URL = 'https://lxya-mjz-lxya.vercel.app';

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
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = async (msgs: IMessage[]) => {
    setMessages((previousMessages: IMessage[]) => GiftedChat.append(previousMessages, msgs));

    const res = await ReactNativeBlobUtil.config({
      // fileCache: true,
    }).fetch('POST', `${URL}/api/text`, {
      'Content-Type': 'application/json',
    }, JSON.stringify({ text: msgs[0].text, mp3: true }));
    console.log(res);
    console.log(res.path());
    // SoundPlayer.playSoundFile(res.path(), 'mp3');

    // console.log(msgs);
    // const response = await fetch(`${URL}/api/text`, options);
    // // console.log(await response.json());
    // const blob: Blob = await response.blob();
    // console.log(blob);
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
