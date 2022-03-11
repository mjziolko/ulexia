import React from 'react';
import { View } from 'react-native';
import Accent from '../../types/Accent';
import Gender from '../../types/Gender';

import PremiumVoice from './PremiumVoice';
import VoiceAccent from './VoiceAccent';
import VoiceGender from './VoiceGender';

function Settings() {
  const [gender, setGender] = React.useState<Gender | null>(null);
  const [accent, setAccent] = React.useState<Accent | null>(null);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '50%' }}>
      <VoiceGender setGender={setGender} />
      <VoiceAccent setAccent={setAccent} />
      <PremiumVoice gender={gender} accent={accent} />
    </View>
  );
}

export default Settings;
