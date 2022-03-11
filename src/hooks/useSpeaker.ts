import React from 'react';
import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';
import { Platform } from 'react-native';

import UserContext from '../contexts/UserContext';

const URL = 'https://lxya-mjz-lxya.vercel.app';

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
      const options = {
        body: JSON.stringify({ text, voice }),
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

  return speak;
};

export default useSpeaker;
