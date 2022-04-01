import React from 'react';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';
import { post } from '../../api';

import UserContext from '../../contexts/UserContext';
import useSpeaker from '../../hooks/useSpeaker';
import Accent from '../../types/Accent';
import Gender from '../../types/Gender';

const femUSVoices = [
  { label: 'Catherine', value: 'en-US-Wavenet-C' },
  { label: 'Erica', value: 'en-US-Wavenet-E' },
  { label: 'Francine', value: 'en-US-Wavenet-F' },
  { label: 'Greta', value: 'en-US-Wavenet-G' },
  { label: 'Hannah', value: 'en-US-Wavenet-H' },
];
const mascUSVoices = [
  { label: 'Aaron', value: 'en-US-Wavenet-A' },
  { label: 'Brian', value: 'en-US-Wavenet-B' },
  { label: 'Danny', value: 'en-US-Wavenet-D' },
];
const femGBVoices = [
  { label: 'Anna', value: 'en-GB-Wavenet-A' },
  { label: 'Cassandra', value: 'en-GB-Wavenet-C' },
  { label: 'Felicia', value: 'en-GB-Wavenet-F' },
];
const mascGBVoices = [
  { label: 'Boris', value: 'en-GB-Wavenet-B' },
  { label: 'Duncan', value: 'en-GB-Wavenet-D' },
  { label: 'Idris', value: 'en-GB-Wavenet-I' },
];

const voiceSort = (v1: { label: string, value: string }, v2: { label: string, value: string }) => {
  if (v1.label < v2.label) { return -1; }
  if (v1.label > v2.label) { return 1; }
  return 0;
};

const combinedVoices = femGBVoices.concat(femUSVoices).concat(mascGBVoices).concat(mascUSVoices).sort(voiceSort);

type PremiumVoiceProps = { gender: Gender | null, accent: Accent | null };

function PremiumVoice(props: PremiumVoiceProps) {
  const { gender, accent } = props;
  const { settings, setSettings } = React.useContext(UserContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<ValueType | null>(settings?.voice as string);
  const [voices, setVoices] = React.useState<ItemType[]>(combinedVoices);
  const speak = useSpeaker();

  React.useEffect(() => {
    if (gender === 'female' && accent === 'gb') {
      setVoices(femGBVoices);
    } else if (gender === 'female' && accent === 'us') {
      setVoices(femUSVoices);
    } else if (gender === 'male' && accent === 'gb') {
      setVoices(mascGBVoices);
    } else if (gender === 'male' && accent === 'us') {
      setVoices(mascUSVoices);
    }
  }, [gender, accent]);

  const onSelect = (voice: ItemType) => {
    void speak(`Hello, my name is ${voice.label as string}!`, voice.value as string);
    void post('settings', { voice: voice.value });
    setSettings({ voice: voice.value as string });
  };

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={voices}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setVoices}
      onSelectItem={onSelect}
      zIndex={open ? 1 : 0}
      placeholder="Select a voice"
    />
  );
}

export default PremiumVoice;
