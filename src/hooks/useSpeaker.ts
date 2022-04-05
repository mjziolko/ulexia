import React from 'react';
import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';
import { Platform } from 'react-native';

import UserContext from '../contexts/UserContext';
import { post } from '../api';

type AudioContent = { audioContent: string };

const useSpeaker = () => {
  const { user, settings } = React.useContext(UserContext);

  React.useEffect(() => {
    SoundPlayer.addEventListener('FinishedLoading', () => {});
    SoundPlayer.addEventListener('FinishedLoadingURL', () => {});
    SoundPlayer.addEventListener('FinishedPlaying', () => {});
  });

  const speak = async (text: string, voice = settings?.voice) => {
    if (user?.special) {
      try {
        const { audioContent } = await post<AudioContent>('tts', { text, voice });
        const url = `data:audio/mp3;base64,${audioContent}`;
        if (Platform.OS === 'ios') {
          SoundPlayer.setSpeaker(true);
        }
        SoundPlayer.playUrl(url);
      } catch (e) {
        Tts.speak(text);
      }
    } else {
      Tts.speak(text);
    }
  };

  return speak;
};

export default useSpeaker;
