import { IMessage } from 'react-native-gifted-chat';
import Word from './Word';

export type Text = {
  id: number;
  text: string;
  wordLocations: Word[];
  createdAt: Date;
  image: string;
};

export type TextMessage = {
  text: Text;
  message: IMessage;
};
