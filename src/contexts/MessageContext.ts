import React, { Dispatch, SetStateAction } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

type SetMessages = Dispatch<SetStateAction<IMessage[]>>;

type MessageContextType = {
  messages: IMessage[];
  setMessages: SetMessages;
};

export const addImageMessage = (
  text: string,
  image: string,
  setMessages: SetMessages,
) => {
  setMessages((prevMessages) => {
    // eslint-disable-next-line no-underscore-dangle
    const id: number = prevMessages[0] ? Number(prevMessages[0]._id) + 1 : 1;
    const message: IMessage = {
      _id: id,
      user: { _id: 1 },
      image,
      createdAt: new Date(),
      text,
    };
    return GiftedChat.append(prevMessages, [message]);
  });
};

export const updateMessageImage = (
  id: number,
  image: string,
  setMessages: SetMessages,
) => {
  setMessages((prevMessages) => {
    const updatedMessages = prevMessages.map((message) => {
      // eslint-disable-next-line no-underscore-dangle
      if (message._id === id) {
        const updatedMessage = { image, ...message };

        return updatedMessage;
      }

      return message;
    });

    return updatedMessages;
  });
};

const defaultMessageContext: MessageContextType = {
  messages: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMessages: (messages: SetStateAction<IMessage[]>) => {},
};

const MessageContext = React.createContext<MessageContextType>(defaultMessageContext);

export default MessageContext;
